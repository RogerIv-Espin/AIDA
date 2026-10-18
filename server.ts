import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { spawn } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper function to call Python backend engine
function callPythonEngine(payload: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [path.resolve(process.cwd(), 'backend/azure_engine.py')]);
    
    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python engine error:', stderrData);
        reject(new Error(`Python process exited with code ${code}: ${stderrData}`));
        return;
      }
      try {
        const parsed = JSON.parse(stdoutData);
        resolve(parsed);
      } catch (err) {
        reject(new Error(`Failed to parse Python engine output: ${stdoutData}`));
      }
    });

    pythonProcess.stdin.write(JSON.stringify(payload));
    pythonProcess.stdin.end();
  });
}

// In-memory architecture version history store for ARM Templates
interface ArmVersionEntry {
  version: string;
  timestamp: string;
  title: string;
  changelog: string;
  template: any;
}
const armVersionHistory: ArmVersionEntry[] = [];

// Gemini AI client initialization (Server-side only)
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ---------------------------------------------------------------------------
// API ROUTES
// ---------------------------------------------------------------------------

// 1. Get Azure Service Catalog
app.get('/api/catalog', async (_req: Request, res: Response) => {
  try {
    const pythonProcess = spawn('python3', [path.resolve(process.cwd(), 'backend/azure_engine.py'), '--catalog']);
    let stdoutData = '';
    pythonProcess.stdout.on('data', (data) => { stdoutData += data.toString(); });
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        res.json(JSON.parse(stdoutData));
      } else {
        res.status(500).json({ error: 'Failed to load catalog' });
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Synthesize complete Azure Architecture via Python backend
app.post('/api/generate-architecture', async (req: Request, res: Response) => {
  try {
    const payload = req.body || {};
    const result = await callPythonEngine(payload);
    
    // Auto-record initial version if history is empty
    if (result.arm_template && armVersionHistory.length === 0) {
      armVersionHistory.push({
        version: result.metadata.arm_version || '1.0.0',
        timestamp: new Date().toISOString(),
        title: result.metadata.title,
        changelog: 'Versión inicial de arquitectura generada.',
        template: result.arm_template
      });
    }

    res.json(result);
  } catch (error: any) {
    console.error('Error generating architecture:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Conversational Chatbot Assistant (TypeScript + Python Backend + Gemini AI)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, currentArchitecture } = req.body;

    let aiReply = '';
    let suggestedServices: string[] = currentArchitecture?.services_selected?.map((s: any) => s.id) || ['aks', 'cosmos_db', 'ai_foundry', 'key_vault'];
    let suggestedEnv = currentArchitecture?.metadata?.environment || 'prod';
    let suggestedTitle = currentArchitecture?.metadata?.title || 'Arquitectura de Solución Azure';
    let suggestedCompliance = currentArchitecture?.metadata?.compliance_tier || 'Enterprise Standard (ISO 27001 / PCI-DSS)';
    let dialogOptions: any = null;

    if (ai) {
      const systemInstruction = `
Eres un Arquitecto de Soluciones Cloud Senior certificado en Microsoft Azure (Azure Solutions Architect Expert).
Tu misión es guiar al usuario mediante una conversación descriptiva en español para diseñar arquitecturas de solución robustas, seguras y escalables con recursos autorizados de Azure.

Los stacks soportados son:
- Datos: cosmos_db, azure_sql, synapse, fabric, data_lake
- ETLs: data_factory, databricks, stream_analytics
- Cómputo: app_service, functions, virtual_machines
- Desarrollo Web: static_web_apps, front_door, api_management
- Contenedores: container_apps, container_registry
- Kubernetes: aks
- AI: ai_foundry, ai_search, copilot_studio, azure_openai
- Seguridad & Redes: key_vault, virtual_network

Debes responder en formato JSON estructurado con:
{
  "reply": "Tu explicación técnica descriptiva, fundamentada en el Well-Architected Framework de Azure (Fiabilidad, Seguridad, Optimización de Costos, Excelencia Operativa, Eficiencia del Rendimiento). Explica el flujo de datos, la interacción entre servicios y las políticas de seguridad.",
  "recommendedServices": ["service_id1", "service_id2", ...],
  "environment": "dev" | "test" | "prod",
  "architectureTitle": "Título conciso y profesional de la solución",
  "complianceTier": "PCI-DSS / HIPAA / Zero-Trust / ISO 27001",
  "dialogOptions": {
    "title": "Título para solicitar información o elegir opciones",
    "prompt": "Pregunta clara para el usuario",
    "type": "select" | "multiselect" | "tier_choice",
    "options": [
      {"label": "Texto de opción", "value": "valor", "description": "Detalle técnico"}
    ]
  }
}
Si la solicitud del usuario es amplia o requiere afinar detalles (por ejemplo tipo de base de datos, nivel de aislamiento de red, o estrategia de escalabilidad), genera 'dialogOptions' con listas de despliegue para que el usuario pueda elegir cómodamente.`;

      const prompt = `
Historial reciente: ${JSON.stringify((history || []).slice(-4))}
Estado actual de arquitectura: ${JSON.stringify({
  environment: suggestedEnv,
  services: suggestedServices,
  title: suggestedTitle
})}

Mensaje del usuario: "${message}"`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const jsonText = response.text || '{}';
        const parsed = JSON.parse(jsonText);
        aiReply = parsed.reply || 'He analizado tus requerimientos para estructurar la arquitectura en Azure.';
        if (Array.isArray(parsed.recommendedServices) && parsed.recommendedServices.length > 0) {
          suggestedServices = parsed.recommendedServices;
        }
        if (parsed.environment) suggestedEnv = parsed.environment;
        if (parsed.architectureTitle) suggestedTitle = parsed.architectureTitle;
        if (parsed.complianceTier) suggestedCompliance = parsed.complianceTier;
        if (parsed.dialogOptions) dialogOptions = parsed.dialogOptions;
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to rule-based architect assistant:', geminiError.message);
        aiReply = `Analizando tu solicitud: "${message}". Se ha sintetizado una arquitectura empresarial basada en los stacks de Azure seleccionados, aplicando Azure Well-Architected Framework con integración de Policy as Code y Bicep.`;
      }
    } else {
      aiReply = `Se ha procesado tu requerimiento: "${message}". La solución se ha actualizado con los componentes de Azure solicitados, generando el diagrama interactivo, las directivas de Policy as a Code, RBAC, la plantilla ARM y el código Azure Bicep.`;
    }

    // Call the Python backend engine to compute updated architecture, ARM, Bicep, diagram, Policy as Code
    const archResult = await callPythonEngine({
      title: suggestedTitle,
      description: message,
      environment: suggestedEnv,
      compliance_tier: suggestedCompliance,
      service_ids: suggestedServices,
      arm_version: currentArchitecture?.metadata?.arm_version || '1.0.0'
    });

    res.json({
      reply: aiReply,
      dialogOptions: dialogOptions,
      architecture: archResult
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Versioning and ARM Template History
app.get('/api/arm/versions', (_req: Request, res: Response) => {
  res.json({ versions: armVersionHistory });
});

app.post('/api/arm/version', (req: Request, res: Response) => {
  const { version, title, changelog, template } = req.body;
  const newEntry: ArmVersionEntry = {
    version: version || `1.${armVersionHistory.length}.0`,
    timestamp: new Date().toISOString(),
    title: title || 'Actualización de Arquitectura ARM',
    changelog: changelog || 'Ajustes en políticas y escalabilidad.',
    template: template
  };
  armVersionHistory.unshift(newEntry);
  res.json({ status: 'success', entry: newEntry, allVersions: armVersionHistory });
});

// ---------------------------------------------------------------------------
// VITE SETUP (Development vs Production)
// ---------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Azure Solution Architect Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
