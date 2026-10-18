import React, { useState } from 'react';
import { PolicyAsCodePack, AzureEnvironment } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  Users, 
  Cpu, 
  Sliders, 
  FileCode, 
  Copy, 
  Check, 
  Download,
  AlertTriangle,
  FolderTree,
  Activity
} from 'lucide-react';

interface PolicyAsCodeViewProps {
  policyPack: PolicyAsCodePack;
  onEnvironmentChange: (env: AzureEnvironment) => void;
}

export function PolicyAsCodeView({ policyPack, onEnvironmentChange }: PolicyAsCodeViewProps) {
  const [activeTab, setActiveTab] = useState<'policies' | 'rbac' | 'elasticity' | 'identities' | 'limits'>('policies');
  const [copied, setCopied] = useState(false);
  const [inspectPolicy, setInspectPolicy] = useState<any>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPolicyJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(policyPack.policies, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `azure-policy-as-code-${policyPack.environment}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Top Header & Environment Toggle Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-slate-900 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span>Azure Policy as a Code & Gobernanza</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gobernanza declarativa, límites de cuota, identidades administradas, IAM RBAC y elasticidad por ambiente.
          </p>
        </div>

        {/* Environment Selector Segmented Control */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => onEnvironmentChange('dev')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              policyPack.environment === 'dev'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Desarrollo (Dev)
          </button>
          <button
            onClick={() => onEnvironmentChange('test')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              policyPack.environment === 'test'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pruebas (Test / QA)
          </button>
          <button
            onClick={() => onEnvironmentChange('prod')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              policyPack.environment === 'prod'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Producción (Prod)
          </button>
        </div>
      </div>

      {/* Subnavigation Bar */}
      <div className="flex items-center justify-between px-6 bg-slate-900/60 border-b border-slate-800/80">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('policies')}
            className={`py-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'policies'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Directivas Policy as a Code ({policyPack.policies.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`py-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'rbac'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Matriz IAM & Roles RBAC ({policyPack.rbac_roles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('elasticity')}
            className={`py-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'elasticity'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Políticas de Elasticidad</span>
          </button>
          <button
            onClick={() => setActiveTab('identities')}
            className={`py-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'identities'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Cuentas de Servicio & Managed ID</span>
          </button>
          <button
            onClick={() => setActiveTab('limits')}
            className={`py-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'limits'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Límites & Cuotas de Suscripción</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPolicyJson}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar JSON</span>
          </button>
        </div>
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* TAB 1: POLICIES AS CODE */}
        {activeTab === 'policies' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Reglas aplicadas mediante Azure Policy Engine para ambiente: <strong className="text-slate-200">{policyPack.environment.toUpperCase()}</strong>
              </span>
              <span className="text-xs font-mono text-slate-500">
                Regiones Autorizadas: {policyPack.allowed_locations.join(', ')}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {policyPack.policies.map((pol) => (
                <div
                  key={pol.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200 text-sm">{pol.name}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                            pol.effect === 'Deny'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          Efecto: {pol.effect}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{pol.description}</p>
                    </div>

                    <button
                      onClick={() => setInspectPolicy(inspectPolicy?.id === pol.id ? null : pol)}
                      className="text-xs text-blue-400 hover:text-blue-300 underline font-mono shrink-0"
                    >
                      {inspectPolicy?.id === pol.id ? 'Ocultar JSON' : 'Ver Regla JSON'}
                    </button>
                  </div>

                  {inspectPolicy?.id === pol.id && (
                    <div className="mt-2 bg-slate-950 rounded-lg p-3 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
                      <pre>{JSON.stringify(pol.rule, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Azure CLI Policy Assignment helper */}
            <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-blue-400" />
                  <span>Comando de Asignación Azure CLI (Policy as a Code)</span>
                </span>
                <button
                  onClick={() => handleCopy(`az policy assignment create --name 'deny-public-storage' --scope '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-sol-${policyPack.environment}' --policy 'pol-deny-public-storage'`)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar CLI'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto">
{`az policy assignment create \\
  --name 'enforce-security-${policyPack.environment}' \\
  --scope '/subscriptions/sub-corp-sol/resourceGroups/rg-sol-${policyPack.environment}' \\
  --policy-set-definition 'polset-enterprise-compliance' \\
  --params '{"allowedLocations": {"value": ${JSON.stringify(policyPack.allowed_locations)}}}'`}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 2: IAM & RBAC MATRIX */}
        {activeTab === 'rbac' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              Asignación de roles con principio de mínimo privilegio (Least Privilege) y exclusión de contraseñas permanentes:
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-3 px-4">Rol de Azure</th>
                    <th className="py-3 px-4">Tipo de Principal</th>
                    <th className="py-3 px-4">Ámbito (Scope)</th>
                    <th className="py-3 px-4">Principio de Seguridad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {policyPack.rbac_roles.map((role, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-100 flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        <span>{role.roleName}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-blue-400">{role.principalType}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] truncate max-w-xs">{role.scope}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] text-emerald-400 font-medium">
                          ✓ Mínimo Privilegio (Zero-Trust)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ELASTICITY POLICIES */}
        {activeTab === 'elasticity' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span>Estrategia de Escalabilidad Automática</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Modo de Elasticidad</span>
                  <span className="font-semibold text-slate-200">{policyPack.elasticity.strategy}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Instancias Mínimas</span>
                  <span className="font-mono text-blue-400">{policyPack.elasticity.min_instances}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Instancias Máximas</span>
                  <span className="font-mono text-blue-400">{policyPack.elasticity.max_instances}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Disparador de Escala (Metric Trigger)</span>
                  <span className="text-slate-300">{policyPack.elasticity.scale_trigger}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">SLA Garantizado de Disponibilidad</span>
                  <span className="text-emerald-400 font-semibold">{policyPack.elasticity.sla}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Resiliencia & Optimización de Costos</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Redundancia de Zona (Availability Zones)</span>
                  <span className={policyPack.elasticity.zone_redundant ? "text-emerald-400 font-semibold" : "text-amber-400"}>
                    {policyPack.elasticity.zone_redundant ? "Activo (Zonas 1, 2, 3)" : "No Requerido en ambiente no-prod"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Política de Auto-Apagado</span>
                  <span className="text-slate-300">{policyPack.elasticity.auto_shutdown}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Política de Respaldo & Backup</span>
                  <span className="text-slate-300">{policyPack.elasticity.backup_policy}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SERVICE ACCOUNTS & MANAGED IDENTITIES */}
        {activeTab === 'identities' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              Gestión de identidades sin secretos (Passwordless Authentication con Microsoft Entra ID):
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {policyPack.identities.map((idItem, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-200">{idItem.name}</span>
                    <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                      {idItem.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{idItem.purpose}</p>
                  <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-emerald-400">
                    Credencial: {idItem.credentials}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: LIMITS & QUOTAS */}
        {activeTab === 'limits' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-blue-400" />
              <span>Límites de Suscripción & Asignación de Cuotas</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400">Máximo vCPU Cores</span>
                <div className="text-2xl font-bold font-mono text-slate-100 mt-1">
                  {policyPack.limits.max_cores_per_sub}
                </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400">Límite Storage Total</span>
                <div className="text-2xl font-bold font-mono text-slate-100 mt-1">
                  {policyPack.limits.max_storage_tb} TB
                </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400">Alertas de Presupuesto</span>
                <div className="text-sm font-semibold text-slate-200 mt-1">
                  {policyPack.limits.budget_alert_threshold}
                </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400">Protección de Red</span>
                <div className="text-xs font-semibold text-emerald-400 mt-1">
                  {policyPack.limits.ddos_protection}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
