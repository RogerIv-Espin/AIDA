import React, { useState, useEffect } from 'react';
import { 
  ArchitectureSolution, 
  AzureService, 
  ChatMessage, 
  AzureEnvironment, 
  ArmVersionRecord 
} from './types';
import { ArchitectureCanvas } from './components/ArchitectureCanvas';
import { PolicyAsCodeView } from './components/PolicyAsCodeView';
import { IaCView } from './components/IaCView';
import { ChatAssistant } from './components/ChatAssistant';
import { StackSelector } from './components/StackSelector';
import { 
  Cloud, 
  Layers, 
  ShieldCheck, 
  FileCode, 
  Code2, 
  SlidersHorizontal,
  Sparkles,
  Download
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'canvas' | 'policy' | 'bicep' | 'arm'>('canvas');
  const [loading, setLoading] = useState<boolean>(true);
  const [catalog, setCatalog] = useState<Record<string, AzureService>>({});
  const [solution, setSolution] = useState<ArchitectureSolution | null>(null);
  const [versionHistory, setVersionHistory] = useState<ArmVersionRecord[]>([]);
  const [showStackSelector, setShowStackSelector] = useState<boolean>(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([
    'aks', 'cosmos_db', 'ai_foundry', 'ai_search', 'key_vault', 'virtual_network'
  ]);

  // Chat conversation state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: '¡Hola! Soy tu asistente de arquitectura de soluciones en Microsoft Azure.\n\nPuedo diseñar arquitecturas escalables para tus cargas de trabajo combinando Datos, ETLs, Cómputo, Web, Contenedores, Kubernetes y Azure AI (AI Foundry, AI Search, Copilot Studio, OpenAI).\n\nPara cada diseño generaré:\n• Diagrama visual interactivo con íconos oficiales exportable a PNG o JPG\n• Policy as a Code de Azure (límites, RBAC, identidades y elasticidad por ambiente)\n• Plantilla ARM descargable y versionable\n• Código Azure Bicep listo para desplegar\n\n¿Qué tipo de solución o carga de trabajo deseas diseñar hoy?',
      timestamp: 'Ahora',
      dialogOptions: {
        title: 'Seleccionar Stack de Solución Azure',
        prompt: '¿Por cuál categoría de solución te gustaría comenzar?',
        type: 'select',
        options: [
          { label: 'RAG & Agentes con Azure AI Foundry y AKS', value: 'rag_aks', description: 'AI Search + Copilot Studio + AKS + Cosmos DB' },
          { label: 'Plataforma Moderna de Datos & ETLs', value: 'data_etl', description: 'Databricks + Data Factory + Synapse + OneLake' },
          { label: 'Microservicios con Azure Container Apps', value: 'container_microservices', description: 'Serverless ACA + Cosmos DB + APIM' },
          { label: 'Aplicación Web Segura y Distribuida', value: 'secure_web', description: 'Front Door + Static Web Apps + App Service' }
        ]
      }
    }
  ]);

  // Load initial catalog and architecture from Python engine via backend API
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        // 1. Fetch catalog
        const catalogRes = await fetch('/api/catalog');
        if (catalogRes.ok) {
          const catalogData = await catalogRes.json();
          setCatalog(catalogData);
        }

        // 2. Fetch initial baseline architecture
        const archRes = await fetch('/api/generate-architecture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Arquitectura Enterprise RAG con AKS y Azure AI',
            description: 'Plataforma corporativa de IA generativa con Kubernetes y datos NoSQL.',
            environment: 'prod',
            compliance_tier: 'Enterprise Standard (ISO 27001 / PCI-DSS)',
            service_ids: selectedServiceIds,
            arm_version: '1.0.0'
          }),
        });

        if (archRes.ok) {
          const archData = await archRes.json();
          setSolution(archData);
        }

        // 3. Fetch version history
        const verRes = await fetch('/api/arm/versions');
        if (verRes.ok) {
          const verData = await verRes.json();
          if (verData.versions) setVersionHistory(verData.versions);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  // Send message to Chatbot Assistant API
  const handleSendMessage = async (userText: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages,
          currentArchitecture: solution
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          dialogOptions: data.dialogOptions,
          recommendedServices: data.architecture?.services_selected?.map((s: any) => s.id)
        };
        setMessages((prev) => [...prev, botMsg]);

        if (data.architecture) {
          setSolution(data.architecture);
          if (data.architecture.services_selected) {
            setSelectedServiceIds(data.architecture.services_selected.map((s: any) => s.id));
          }
        }
      } else {
        throw new Error('Chat API returned an error');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: 'He procesado tu solicitud y actualizado los parámetros del motor de arquitectura Azure. Puedes revisar los cambios en el diagrama, Policy as Code y el código Bicep.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Dialogue option selection handler
  const handleSelectOption = (optionValue: string, promptText: string) => {
    let serviceMapping: string[] = selectedServiceIds;
    let chosenEnv: AzureEnvironment = solution?.metadata?.environment || 'prod';

    if (optionValue === 'rag_aks') {
      serviceMapping = ['aks', 'ai_foundry', 'ai_search', 'copilot_studio', 'azure_openai', 'cosmos_db', 'key_vault', 'virtual_network'];
    } else if (optionValue === 'data_etl') {
      serviceMapping = ['data_factory', 'databricks', 'data_lake', 'synapse', 'fabric', 'key_vault', 'virtual_network'];
    } else if (optionValue === 'container_microservices') {
      serviceMapping = ['container_apps', 'container_registry', 'cosmos_db', 'api_management', 'key_vault', 'virtual_network'];
    } else if (optionValue === 'secure_web') {
      serviceMapping = ['front_door', 'static_web_apps', 'app_service', 'api_management', 'azure_sql', 'key_vault'];
    }

    setSelectedServiceIds(serviceMapping);
    handleSendMessage(`${promptText}. Por favor actualiza la solución, el diagrama de Azure, Policy as Code, Bicep y la plantilla ARM para este stack.`);
  };

  // Quick Template Selection handler
  const handleQuickTemplateSelect = async (title: string, services: string[], env: AzureEnvironment) => {
    setSelectedServiceIds(services);
    setLoading(true);
    try {
      const archRes = await fetch('/api/generate-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: `Solución rápida basada en plantilla ${title}`,
          environment: env,
          service_ids: services,
          arm_version: solution?.metadata?.arm_version || '1.0.0'
        })
      });

      if (archRes.ok) {
        const archData = await archRes.json();
        setSolution(archData);

        const noticeMsg: ChatMessage = {
          id: `bot-tpl-${Date.now()}`,
          sender: 'assistant',
          text: `He cargado la arquitectura "${title}" con los siguientes recursos autorizados de Azure:\n• ${archData.services_selected.map((s: any) => s.name).join('\n• ')}\n\nHe generado el diagrama con los íconos de Azure correspondientes, las directivas de Policy as a Code para ambiente ${env.toUpperCase()}, el archivo Bicep y la plantilla ARM.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, noticeMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Environment change handler (Dev, Test, Prod)
  const handleEnvironmentChange = async (newEnv: AzureEnvironment) => {
    if (!solution) return;
    setLoading(true);
    try {
      const archRes = await fetch('/api/generate-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: solution.metadata.title,
          description: solution.metadata.description,
          environment: newEnv,
          compliance_tier: solution.metadata.compliance_tier,
          service_ids: selectedServiceIds,
          arm_version: solution.metadata.arm_version
        })
      });
      if (archRes.ok) {
        const archData = await archRes.json();
        setSolution(archData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Stack toggle from StackSelector modal
  const handleToggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  // Apply changes from StackSelector modal
  const handleApplyChanges = async () => {
    setLoading(true);
    try {
      const archRes = await fetch('/api/generate-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: solution?.metadata?.title || 'Arquitectura Personalizada Azure',
          description: 'Arquitectura actualizada con selección de stacks manual.',
          environment: solution?.metadata?.environment || 'prod',
          compliance_tier: solution?.metadata?.compliance_tier,
          service_ids: selectedServiceIds,
          arm_version: solution?.metadata?.arm_version || '1.0.0'
        })
      });
      if (archRes.ok) {
        const archData = await archRes.json();
        setSolution(archData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ARM Version save handler
  const handleSaveNewVersion = async (version: string, changelog: string) => {
    if (!solution) return;
    try {
      const res = await fetch('/api/arm/version', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version,
          title: solution.metadata.title,
          changelog,
          template: solution.arm_template
        })
      });
      if (res.ok) {
        const data = await res.json();
        setVersionHistory(data.allVersions);
        setSolution((prev) => prev ? {
          ...prev,
          metadata: { ...prev.metadata, arm_version: version }
        } : null);
      }
    } catch (err) {
      console.error('Error saving ARM version:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* =========================================================================
          TOP BAR CONTRACT:
          Zone 1: Single text element wordmark
          Zone 2: 4 single-line clean navigation links (Whitespace-nowrap shrink-0)
          Zone 3: 1 primary action
         ========================================================================= */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900 border-b border-slate-800 shrink-0 z-20">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
            <Cloud className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            Azure Architect AI
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'canvas'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Diagrama Gráfico</span>
          </button>

          <button
            onClick={() => setActiveTab('policy')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'policy'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Policy as Code & IAM</span>
          </button>

          <button
            onClick={() => setActiveTab('bicep')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'bicep'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Azure BICEP</span>
          </button>

          <button
            onClick={() => setActiveTab('arm')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'arm'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Plantilla ARM</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowStackSelector(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            <span>Explorar Stacks ({selectedServiceIds.length})</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          WORKSPACE SPLIT VIEW:
          Left: Chatbot Virtual Assistant (TypeScript + Python Backend)
          Right: Architecture Canvas / Policy-as-Code / Bicep / ARM Template
         ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Chatbot Assistant (approx 400px) */}
        <div className="w-[420px] shrink-0 h-full flex flex-col border-r border-slate-800">
          <ChatAssistant
            messages={messages}
            loading={loading}
            onSendMessage={handleSendMessage}
            onSelectOption={handleSelectOption}
            onQuickTemplateSelect={handleQuickTemplateSelect}
          />
        </div>

        {/* Right Pane: Main Workspace Viewport */}
        <div className="flex-1 h-full overflow-hidden bg-slate-950 flex flex-col">
          {solution ? (
            <>
              {activeTab === 'canvas' && (
                <ArchitectureCanvas
                  solution={solution}
                  onSelectService={(sid) => {
                    handleSendMessage(`Explícame el rol técnico del recurso "${sid}" en esta solución y sus políticas de seguridad en Azure.`);
                  }}
                />
              )}

              {activeTab === 'policy' && (
                <PolicyAsCodeView
                  policyPack={solution.policy_as_code}
                  onEnvironmentChange={handleEnvironmentChange}
                />
              )}

              {activeTab === 'bicep' && (
                <IaCView
                  solution={solution}
                  versionHistory={versionHistory}
                  onSaveNewVersion={handleSaveNewVersion}
                />
              )}

              {activeTab === 'arm' && (
                <IaCView
                  solution={solution}
                  versionHistory={versionHistory}
                  onSaveNewVersion={handleSaveNewVersion}
                />
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span>Generando arquitectura con el motor Python...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stack Selector Modal */}
      {showStackSelector && (
        <StackSelector
          catalog={catalog}
          selectedServiceIds={selectedServiceIds}
          onToggleService={handleToggleService}
          onApplyChanges={handleApplyChanges}
          onClose={() => setShowStackSelector(false)}
        />
      )}
    </div>
  );
}
