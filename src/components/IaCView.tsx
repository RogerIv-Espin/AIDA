import React, { useState } from 'react';
import { ArchitectureSolution, ArmVersionRecord } from '../types';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  History, 
  Plus, 
  Tag, 
  Layers, 
  ExternalLink,
  Code
} from 'lucide-react';

interface IaCViewProps {
  solution: ArchitectureSolution;
  versionHistory: ArmVersionRecord[];
  onSaveNewVersion: (version: string, changelog: string) => void;
  onSelectHistoricalVersion?: (entry: ArmVersionRecord) => void;
}

export function IaCView({ solution, versionHistory, onSaveNewVersion, onSelectHistoricalVersion }: IaCViewProps) {
  const [activeIaC, setActiveIaC] = useState<'bicep' | 'arm' | 'terraform'>('bicep');
  const [copied, setCopied] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [newVersionTag, setNewVersionTag] = useState('1.1.0');
  const [changelogNote, setChangelogNote] = useState('Ajuste de cuotas y políticas de alta disponibilidad.');

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate equivalent Terraform code for comprehensive IaC
  const terraformCode = `# ===========================================================================
# Azure Terraform Module: ${solution.metadata.title}
# Environment: ${solution.metadata.environment.toUpperCase()}
# ===========================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90.0"
    }
  }
}

provider "azurerm" {
  features {}
}

variable "environment" {
  type    = string
  default = "${solution.metadata.environment}"
}

variable "location" {
  type    = string
  default = "${solution.metadata.location}"
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-sol-\${var.environment}"
  location = var.location
  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "azurerm_key_vault" "kv" {
  name                        = "kv-sol-\${var.environment}-01"
  location                    = azurerm_resource_group.rg.location
  resource_group_name         = azurerm_resource_group.rg.name
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  sku_name                    = var.environment == "prod" ? "premium" : "standard"
  enable_rbac_authorization   = true
  soft_delete_retention_days  = 90
}

data "azurerm_client_config" "current" {}
`;

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveIaC('bicep')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeIaC === 'bicep'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Azure BICEP (.bicep)</span>
            </button>
            <button
              onClick={() => setActiveIaC('arm')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeIaC === 'arm'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>ARM Template (.json)</span>
            </button>
            <button
              onClick={() => setActiveIaC('terraform')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeIaC === 'terraform'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Terraform (.tf)</span>
            </button>
          </div>

          {activeIaC === 'arm' && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <span className="bg-slate-800 px-2 py-0.5 rounded text-blue-400 border border-slate-700">
                Versión: v{solution.metadata.arm_version || '1.0.0'}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {activeIaC === 'arm' && (
            <button
              onClick={() => setShowVersionModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              <span>Versionar ARM</span>
            </button>
          )}

          <button
            onClick={() => {
              const code = activeIaC === 'bicep' 
                ? solution.bicep 
                : activeIaC === 'arm' 
                ? JSON.stringify(solution.arm_template, null, 2) 
                : terraformCode;
              handleCopy(code);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>

          <button
            onClick={() => {
              if (activeIaC === 'bicep') {
                downloadFile('main.bicep', solution.bicep, 'text/plain');
              } else if (activeIaC === 'arm') {
                downloadFile(`azuredeploy-${solution.metadata.arm_version || '1.0.0'}.json`, JSON.stringify(solution.arm_template, null, 2), 'application/json');
              } else {
                downloadFile('main.tf', terraformCode, 'text/plain');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar {activeIaC === 'bicep' ? 'main.bicep' : activeIaC === 'arm' ? 'azuredeploy.json' : 'main.tf'}</span>
          </button>
        </div>
      </div>

      {/* Code Editor / Viewer Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Code View */}
        <div className="flex-1 overflow-auto bg-slate-950 p-6 font-mono text-xs leading-relaxed text-slate-200">
          <pre className="select-text">
            {activeIaC === 'bicep' && solution.bicep}
            {activeIaC === 'arm' && JSON.stringify(solution.arm_template, null, 2)}
            {activeIaC === 'terraform' && terraformCode}
          </pre>
        </div>

        {/* ARM Version History Sidebar (Visible in ARM mode) */}
        {activeIaC === 'arm' && (
          <div className="w-80 border-l border-slate-800 bg-slate-900/70 p-4 flex flex-col gap-4 overflow-y-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <History className="w-4 h-4 text-blue-400" />
              <span>Historial de Versiones ARM</span>
            </div>

            <div className="space-y-3">
              {versionHistory.length === 0 ? (
                <div className="text-xs text-slate-500 italic p-3 bg-slate-950 rounded-lg border border-slate-800">
                  Esta plantilla corresponde a la versión base v1.0.0. Usa el botón "Versionar ARM" para registrar cambios.
                </div>
              ) : (
                versionHistory.map((ver, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectHistoricalVersion && onSelectHistoricalVersion(ver)}
                    className="p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-blue-400 font-mono text-xs">
                        v{ver.version}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(ver.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans">{ver.changelog}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Versioning Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-400" />
              <span>Registrar Nueva Versión de Plantilla ARM</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Etiqueta de Versión (SemVer)</label>
                <input
                  type="text"
                  value={newVersionTag}
                  onChange={(e) => setNewVersionTag(e.target.value)}
                  placeholder="ej. 1.1.0 o 2.0.0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Notas del Cambio / Changelog</label>
                <textarea
                  value={changelogNote}
                  onChange={(e) => setChangelogNote(e.target.value)}
                  rows={3}
                  placeholder="Describe los cambios en recursos, políticas o escalabilidad..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowVersionModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onSaveNewVersion(newVersionTag, changelogNote);
                  setShowVersionModal(false);
                }}
                className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                Guardar Versión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
