import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, DialogOption, AzureEnvironment } from '../types';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  CheckCircle2, 
  ChevronDown, 
  Plus, 
  Layers,
  Cpu,
  Database,
  Globe,
  Boxes,
  Zap,
  RotateCcw
} from 'lucide-react';

interface ChatAssistantProps {
  messages: ChatMessage[];
  loading: boolean;
  onSendMessage: (msg: string) => void;
  onSelectOption: (optionValue: string, promptText: string) => void;
  onQuickTemplateSelect: (templateName: string, serviceIds: string[], env: AzureEnvironment) => void;
}

export function ChatAssistant({
  messages,
  loading,
  onSendMessage,
  onSelectOption,
  onQuickTemplateSelect,
}: ChatAssistantProps) {
  const [inputText, setInputText] = useState('');
  const [selectedDropdownValue, setSelectedDropdownValue] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const quickTemplates = [
    {
      title: "RAG con AKS y AI Foundry",
      desc: "Azure Kubernetes, AI Search, Copilot Studio, Azure OpenAI y Key Vault",
      services: ["aks", "ai_foundry", "ai_search", "copilot_studio", "azure_openai", "key_vault", "virtual_network"],
      env: "prod" as AzureEnvironment
    },
    {
      title: "ETL & Lakehouse de Datos",
      desc: "Azure Databricks, Data Factory, Data Lake Gen2 y Synapse Analytics",
      services: ["data_factory", "databricks", "data_lake", "synapse", "key_vault", "virtual_network"],
      env: "prod" as AzureEnvironment
    },
    {
      title: "Microservicios en Contenedores",
      desc: "Azure Container Apps, Container Registry y Azure Cosmos DB NoSQL",
      services: ["container_apps", "container_registry", "cosmos_db", "api_management", "key_vault"],
      env: "prod" as AzureEnvironment
    },
    {
      title: "Web App con Front Door y APIM",
      desc: "Static Web Apps, App Service, Front Door WAF y Azure SQL",
      services: ["front_door", "static_web_apps", "app_service", "api_management", "azure_sql", "key_vault"],
      env: "prod" as AzureEnvironment
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>Asistente de Arquitectura Azure</span>
              <span className="text-[10px] bg-blue-950 text-blue-400 px-1.5 py-0.2 rounded border border-blue-800">
                IA + Python Engine
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Diseño conversacional, diálogo de opciones y Policy as Code
            </p>
          </div>
        </div>
      </div>

      {/* Quick Architecture Templates Strip */}
      <div className="p-3 bg-slate-950/60 border-b border-slate-800 overflow-x-auto">
        <div className="text-[10px] font-mono text-slate-400 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span>Plantillas Rápidas por Stack de Solución</span>
        </div>
        <div className="flex gap-2">
          {quickTemplates.map((tpl, i) => (
            <button
              key={i}
              onClick={() => onQuickTemplateSelect(tpl.title, tpl.services, tpl.env)}
              className="text-left p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500 transition-all shrink-0 w-48 group"
            >
              <div className="text-[11px] font-semibold text-slate-200 group-hover:text-blue-400 truncate">
                {tpl.title}
              </div>
              <div className="text-[9.5px] text-slate-400 line-clamp-1 mt-0.5">
                {tpl.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-500">
              {msg.sender === 'assistant' ? (
                <>
                  <Bot className="w-3 h-3 text-blue-400" />
                  <span className="font-semibold text-blue-400">Arquitecto Virtual Azure</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3 text-slate-400" />
                  <span>Tú</span>
                </>
              )}
              <span>· {msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[92%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Interactive Deployment Dropdown / Options Dialogue */}
              {msg.dialogOptions && (
                <div className="mt-3.5 pt-3 border-t border-slate-700/80 space-y-2.5">
                  <div className="flex items-center gap-1.5 font-semibold text-blue-300 text-xs">
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>{msg.dialogOptions.prompt || msg.dialogOptions.title}</span>
                  </div>

                  {/* Dropdown Selector */}
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedDropdownValue}
                      onChange={(e) => setSelectedDropdownValue(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Selecciona una opción de despliegue...</option>
                      {msg.dialogOptions.options.map((opt, idx) => (
                        <option key={idx} value={opt.value}>
                          {opt.label} {opt.description ? `— (${opt.description})` : ''}
                        </option>
                      ))}
                    </select>

                    <button
                      disabled={!selectedDropdownValue}
                      onClick={() => {
                        const chosen = msg.dialogOptions?.options.find((o) => o.value === selectedDropdownValue);
                        onSelectOption(
                          selectedDropdownValue,
                          chosen ? `He seleccionado: ${chosen.label}` : selectedDropdownValue
                        );
                        setSelectedDropdownValue('');
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Confirmar
                    </button>
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.dialogOptions.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSelectOption(opt.value, `He elegido la opción: ${opt.label}`)}
                        className="text-[11px] px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors flex items-center gap-1"
                      >
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
            <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span>Consultando el motor de arquitectura y recalculando código Bicep / ARM...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-blue-500 transition-colors">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe tu solución en Azure (ej. 'Quiero un clúster AKS con Azure AI Foundry y Cosmos DB')..."
            className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg transition-colors"
            title="Enviar mensaje"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
