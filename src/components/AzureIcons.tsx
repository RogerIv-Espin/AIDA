import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export function AzureCosmosDbIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="32" cy="32" r="28" fill="#0078D4" fillOpacity="0.12" stroke="#0078D4" strokeWidth="2" />
      <ellipse cx="32" cy="32" rx="20" ry="10" stroke="#0078D4" strokeWidth="2.5" />
      <ellipse cx="32" cy="32" rx="10" ry="20" stroke="#50E6FF" strokeWidth="2" strokeDasharray="3 3" />
      <circle cx="32" cy="32" r="7" fill="#0078D4" />
      <circle cx="48" cy="26" r="3.5" fill="#50E6FF" />
      <circle cx="16" cy="38" r="3" fill="#00BCF2" />
    </svg>
  );
}

export function AzureSqlIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 18C12 11 20 8 32 8C44 8 52 11 52 18V46C52 53 44 56 32 56C20 56 12 53 12 46V18Z" fill="#0078D4" fillOpacity="0.15" stroke="#0078D4" strokeWidth="2.5" />
      <ellipse cx="32" cy="18" rx="20" ry="8" fill="#0078D4" fillOpacity="0.6" stroke="#50E6FF" strokeWidth="2" />
      <path d="M12 28C14 34 24 38 32 38C40 38 50 34 52 28" stroke="#50E6FF" strokeWidth="2" />
      <path d="M12 38C14 44 24 48 32 48C40 48 50 44 52 38" stroke="#50E6FF" strokeWidth="2" />
    </svg>
  );
}

export function AzureSynapseIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="32" cy="32" r="26" stroke="#0078D4" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="32" cy="14" r="6" fill="#0078D4" />
      <circle cx="48" cy="42" r="6" fill="#00B294" />
      <circle cx="16" cy="42" r="6" fill="#744DA9" />
      <line x1="32" y1="14" x2="48" y2="42" stroke="#50E6FF" strokeWidth="2" />
      <line x1="48" y1="42" x2="16" y2="42" stroke="#50E6FF" strokeWidth="2" />
      <line x1="16" y1="42" x2="32" y2="14" stroke="#50E6FF" strokeWidth="2" />
      <circle cx="32" cy="32" r="4" fill="#FFFFFF" />
    </svg>
  );
}

export function AzureFabricIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M32 10L52 22V42L32 54L12 42V22L32 10Z" fill="#115EA3" fillOpacity="0.2" stroke="#0078D4" strokeWidth="2.5" />
      <path d="M32 10L52 22L32 34L12 22L32 10Z" fill="#0078D4" fillOpacity="0.8" />
      <path d="M12 22L32 34V54L12 42V22Z" fill="#004E8C" />
      <path d="M32 34L52 22V42L32 54V34Z" fill="#2899F5" />
    </svg>
  );
}

export function AzureStorageIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="10" y="12" width="44" height="40" rx="4" fill="#0078D4" fillOpacity="0.15" stroke="#0078D4" strokeWidth="2.5" />
      <rect x="16" y="18" width="32" height="8" rx="2" fill="#0078D4" />
      <rect x="16" y="30" width="32" height="8" rx="2" fill="#2899F5" />
      <rect x="16" y="42" width="20" height="4" rx="2" fill="#50E6FF" />
      <circle cx="44" cy="44" r="2.5" fill="#50E6FF" />
    </svg>
  );
}

export function AzureDataFactoryIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 50V30L26 38V30L40 38V22L52 30V50H12Z" fill="#0078D4" fillOpacity="0.25" stroke="#0078D4" strokeWidth="2.5" />
      <circle cx="32" cy="20" r="7" stroke="#2899F5" strokeWidth="2" strokeDasharray="3 2" />
      <circle cx="32" cy="20" r="3" fill="#50E6FF" />
      <line x1="20" y1="50" x2="20" y2="44" stroke="#50E6FF" strokeWidth="2" />
      <line x1="32" y1="50" x2="32" y2="44" stroke="#50E6FF" strokeWidth="2" />
      <line x1="44" y1="50" x2="44" y2="44" stroke="#50E6FF" strokeWidth="2" />
    </svg>
  );
}

export function AzureDatabricksIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M32 10L52 21L32 32L12 21L32 10Z" fill="#FF3621" fillOpacity="0.8" stroke="#FF3621" strokeWidth="1.5" />
      <path d="M12 27L32 38L52 27" stroke="#FF5A36" strokeWidth="2" />
      <path d="M12 35L32 46L52 35" stroke="#FF7A50" strokeWidth="2" />
      <path d="M12 43L32 54L52 43" stroke="#FFAB89" strokeWidth="2" />
    </svg>
  );
}

export function AzureStreamAnalyticsIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="32" cy="32" r="26" fill="#0078D4" fillOpacity="0.1" stroke="#0078D4" strokeWidth="2" />
      <path d="M16 32C22 20 28 44 34 32C40 20 46 44 52 32" stroke="#50E6FF" strokeWidth="3" strokeLinecap="round" />
      <polygon points="34,16 28,32 36,32 30,48" fill="#FFB900" />
    </svg>
  );
}

export function AzureAppServiceIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="12" y="14" width="40" height="36" rx="4" fill="#0078D4" fillOpacity="0.2" stroke="#0078D4" strokeWidth="2.5" />
      <line x1="12" y1="24" x2="52" y2="24" stroke="#0078D4" strokeWidth="2" />
      <circle cx="18" cy="19" r="2" fill="#50E6FF" />
      <circle cx="24" cy="19" r="2" fill="#50E6FF" />
      <circle cx="30" cy="19" r="2" fill="#50E6FF" />
      <path d="M22 36L28 32L22 28" stroke="#50E6FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="32" y1="36" x2="42" y2="36" stroke="#2899F5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function AzureFunctionsIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <polygon points="36,8 18,34 32,34 26,56 46,28 32,28" fill="#F2C811" stroke="#D4A700" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 20C8 28 8 36 12 44" stroke="#0078D4" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M52 20C56 28 56 36 52 44" stroke="#0078D4" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function AzureVmIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M32 10L52 21V43L32 54L12 43V21L32 10Z" fill="#0078D4" fillOpacity="0.2" stroke="#0078D4" strokeWidth="2.5" />
      <line x1="32" y1="10" x2="32" y2="54" stroke="#0078D4" strokeWidth="2" />
      <line x1="12" y1="21" x2="32" y2="32" stroke="#0078D4" strokeWidth="2" />
      <line x1="52" y1="21" x2="32" y2="32" stroke="#0078D4" strokeWidth="2" />
      <rect x="25" y="27" width="14" height="10" rx="1" fill="#50E6FF" />
    </svg>
  );
}

export function AzureStaticWebAppsIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="10" y="14" width="44" height="36" rx="4" fill="#0078D4" fillOpacity="0.15" stroke="#0078D4" strokeWidth="2" />
      <line x1="10" y1="26" x2="54" y2="26" stroke="#0078D4" strokeWidth="2" />
      <rect x="16" y="32" width="14" height="12" rx="2" fill="#0078D4" />
      <rect x="34" y="32" width="14" height="5" rx="1" fill="#50E6FF" />
      <rect x="34" y="39" width="14" height="5" rx="1" fill="#2899F5" />
    </svg>
  );
}

export function AzureFrontDoorIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="32" cy="32" r="26" stroke="#0078D4" strokeWidth="2" fill="#0078D4" fillOpacity="0.1" />
      <ellipse cx="32" cy="32" rx="14" ry="26" stroke="#0078D4" strokeWidth="1.5" />
      <line x1="6" y1="32" x2="58" y2="32" stroke="#0078D4" strokeWidth="1.5" />
      <polygon points="32,18 42,32 32,46 22,32" fill="#00BCF2" stroke="#0078D4" strokeWidth="2" />
    </svg>
  );
}

export function AzureApimIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="12" y="18" width="40" height="28" rx="6" fill="#0078D4" fillOpacity="0.2" stroke="#0078D4" strokeWidth="2.5" />
      <circle cx="22" cy="32" r="4" fill="#0078D4" />
      <circle cx="32" cy="32" r="4" fill="#50E6FF" />
      <circle cx="42" cy="32" r="4" fill="#00BCF2" />
      <line x1="22" y1="12" x2="22" y2="18" stroke="#50E6FF" strokeWidth="2.5" />
      <line x1="42" y1="46" x2="42" y2="52" stroke="#50E6FF" strokeWidth="2.5" />
    </svg>
  );
}

export function AzureContainerAppsIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="12" y="16" width="40" height="32" rx="4" fill="#0078D4" fillOpacity="0.2" stroke="#0078D4" strokeWidth="2" />
      <rect x="16" y="22" width="9" height="9" fill="#0078D4" />
      <rect x="28" y="22" width="9" height="9" fill="#2899F5" />
      <rect x="40" y="22" width="9" height="9" fill="#50E6FF" />
      <rect x="22" y="34" width="9" height="9" fill="#00BCF2" />
      <rect x="34" y="34" width="9" height="9" fill="#0078D4" />
    </svg>
  );
}

export function AzureAcrIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M32 10L52 21V43L32 54L12 43V21L32 10Z" fill="#0078D4" fillOpacity="0.2" stroke="#0078D4" strokeWidth="2" />
      <line x1="20" y1="28" x2="44" y2="28" stroke="#50E6FF" strokeWidth="2" strokeDasharray="3 2" />
      <line x1="20" y1="36" x2="44" y2="36" stroke="#50E6FF" strokeWidth="2" strokeDasharray="3 2" />
      <circle cx="32" cy="32" r="3" fill="#FFFFFF" />
    </svg>
  );
}

export function AzureAksIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Kubernetes Helm Wheel */}
      <circle cx="32" cy="32" r="22" fill="#326CE5" fillOpacity="0.15" stroke="#326CE5" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="7" fill="#326CE5" />
      <line x1="32" y1="10" x2="32" y2="25" stroke="#326CE5" strokeWidth="3" />
      <line x1="32" y1="39" x2="32" y2="54" stroke="#326CE5" strokeWidth="3" />
      <line x1="12" y1="22" x2="26" y2="29" stroke="#326CE5" strokeWidth="3" />
      <line x1="38" y1="35" x2="52" y2="42" stroke="#326CE5" strokeWidth="3" />
      <line x1="12" y1="42" x2="26" y2="35" stroke="#326CE5" strokeWidth="3" />
      <line x1="38" y1="29" x2="52" y2="22" stroke="#326CE5" strokeWidth="3" />
      <circle cx="32" cy="32" r="3" fill="#FFFFFF" />
    </svg>
  );
}

export function AzureAiFoundryIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="32" cy="32" r="26" stroke="#8A42F4" strokeWidth="2.5" fill="#8A42F4" fillOpacity="0.1" />
      {/* Neural Mesh Hub */}
      <circle cx="32" cy="20" r="5" fill="#8A42F4" />
      <circle cx="20" cy="40" r="5" fill="#0078D4" />
      <circle cx="44" cy="40" r="5" fill="#00BCF2" />
      <circle cx="32" cy="32" r="4" fill="#FFFFFF" />
      <line x1="32" y1="20" x2="20" y2="40" stroke="#B482F7" strokeWidth="2" />
      <line x1="20" y1="40" x2="44" y2="40" stroke="#50E6FF" strokeWidth="2" />
      <line x1="44" y1="40" x2="32" y2="20" stroke="#B482F7" strokeWidth="2" />
      <polygon points="50,14 52,18 56,20 52,22 50,26 48,22 44,20 48,18" fill="#F2C811" />
    </svg>
  );
}

export function AzureAiSearchIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="28" cy="28" r="16" fill="#0078D4" fillOpacity="0.15" stroke="#0078D4" strokeWidth="2.5" />
      <line x1="40" y1="40" x2="52" y2="52" stroke="#0078D4" strokeWidth="4" strokeLinecap="round" />
      <circle cx="24" cy="24" r="3" fill="#50E6FF" />
      <circle cx="32" cy="28" r="2.5" fill="#2899F5" />
      <circle cx="26" cy="33" r="2" fill="#00BCF2" />
      <line x1="24" y1="24" x2="32" y2="28" stroke="#50E6FF" strokeWidth="1.5" />
      <line x1="24" y1="24" x2="26" y2="33" stroke="#50E6FF" strokeWidth="1.5" />
    </svg>
  );
}

export function AzureCopilotStudioIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="12" y="14" width="40" height="36" rx="8" fill="#744DA9" fillOpacity="0.15" stroke="#744DA9" strokeWidth="2" />
      {/* Copilot ribbon curl */}
      <path d="M22 36C22 26 30 20 40 22C44 23 46 26 44 30C42 34 36 34 34 38C32 42 26 44 22 36Z" fill="url(#copilotGrad)" />
      <circle cx="28" cy="26" r="3" fill="#FFFFFF" />
      <circle cx="38" cy="34" r="2" fill="#FFB900" />
      <defs>
        <linearGradient id="copilotGrad" x1="20" y1="20" x2="45" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0078D4" />
          <stop offset="0.5" stopColor="#744DA9" />
          <stop offset="1" stopColor="#FF8C00" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AzureOpenAiIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="32" cy="32" r="26" stroke="#00A67E" strokeWidth="2.5" fill="#00A67E" fillOpacity="0.1" />
      <path d="M32 16L44 24V38L32 46L20 38V24L32 16Z" stroke="#00A67E" strokeWidth="2" />
      <circle cx="32" cy="31" r="5" fill="#00A67E" />
      <circle cx="32" cy="16" r="3" fill="#50E6FF" />
      <circle cx="44" cy="24" r="3" fill="#50E6FF" />
      <circle cx="44" cy="38" r="3" fill="#50E6FF" />
      <circle cx="32" cy="46" r="3" fill="#50E6FF" />
      <circle cx="20" cy="38" r="3" fill="#50E6FF" />
      <circle cx="20" cy="24" r="3" fill="#50E6FF" />
    </svg>
  );
}

export function AzureKeyVaultIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="32" cy="32" r="26" fill="#0078D4" fillOpacity="0.1" stroke="#0078D4" strokeWidth="2" />
      <circle cx="26" cy="26" r="10" stroke="#FFB900" strokeWidth="3" />
      <rect x="33" y="24" width="18" height="4" fill="#FFB900" />
      <rect x="44" y="28" width="4" height="6" fill="#FFB900" />
      <rect x="49" y="28" width="2" height="4" fill="#FFB900" />
      <circle cx="26" cy="26" r="4" fill="#0078D4" />
    </svg>
  );
}

export function AzureVnetIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="10" y="10" width="44" height="44" rx="6" fill="#0078D4" fillOpacity="0.1" stroke="#0078D4" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="22" cy="22" r="5" fill="#0078D4" />
      <circle cx="42" cy="22" r="5" fill="#0078D4" />
      <circle cx="32" cy="42" r="5" fill="#50E6FF" />
      <line x1="22" y1="22" x2="42" y2="22" stroke="#50E6FF" strokeWidth="2" />
      <line x1="22" y1="22" x2="32" y2="42" stroke="#50E6FF" strokeWidth="2" />
      <line x1="42" y1="22" x2="32" y2="42" stroke="#50E6FF" strokeWidth="2" />
    </svg>
  );
}

export function AzurePolicyIcon({ className = '', size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M16 12H48V52H16V12Z" fill="#0078D4" fillOpacity="0.15" stroke="#0078D4" strokeWidth="2.5" rx="2" />
      <rect x="24" y="8" width="16" height="6" rx="2" fill="#0078D4" />
      <line x1="22" y1="24" x2="42" y2="24" stroke="#50E6FF" strokeWidth="2" />
      <line x1="22" y1="32" x2="42" y2="32" stroke="#50E6FF" strokeWidth="2" />
      <path d="M22 42L28 47L42 37" stroke="#107C41" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Dynamic Icon Dispatcher
export function RenderAzureIcon({ icon, size = 32, className = '' }: { icon: string; size?: number; className?: string }) {
  switch (icon) {
    case 'cosmos_db':
    case 'database':
      return <AzureCosmosDbIcon size={size} className={className} />;
    case 'azure_sql':
    case 'sql':
      return <AzureSqlIcon size={size} className={className} />;
    case 'synapse':
      return <AzureSynapseIcon size={size} className={className} />;
    case 'fabric':
      return <AzureFabricIcon size={size} className={className} />;
    case 'data_lake':
    case 'storage':
      return <AzureStorageIcon size={size} className={className} />;
    case 'data_factory':
    case 'factory':
      return <AzureDataFactoryIcon size={size} className={className} />;
    case 'databricks':
      return <AzureDatabricksIcon size={size} className={className} />;
    case 'stream_analytics':
    case 'stream':
      return <AzureStreamAnalyticsIcon size={size} className={className} />;
    case 'app_service':
    case 'appservice':
      return <AzureAppServiceIcon size={size} className={className} />;
    case 'functions':
      return <AzureFunctionsIcon size={size} className={className} />;
    case 'virtual_machines':
    case 'vm':
      return <AzureVmIcon size={size} className={className} />;
    case 'static_web_apps':
    case 'staticweb':
      return <AzureStaticWebAppsIcon size={size} className={className} />;
    case 'front_door':
    case 'frontdoor':
      return <AzureFrontDoorIcon size={size} className={className} />;
    case 'api_management':
    case 'apim':
      return <AzureApimIcon size={size} className={className} />;
    case 'container_apps':
    case 'containerapps':
      return <AzureContainerAppsIcon size={size} className={className} />;
    case 'container_registry':
    case 'acr':
      return <AzureAcrIcon size={size} className={className} />;
    case 'aks':
      return <AzureAksIcon size={size} className={className} />;
    case 'ai_foundry':
    case 'aifoundry':
      return <AzureAiFoundryIcon size={size} className={className} />;
    case 'ai_search':
    case 'aisearch':
      return <AzureAiSearchIcon size={size} className={className} />;
    case 'copilot_studio':
    case 'copilot':
      return <AzureCopilotStudioIcon size={size} className={className} />;
    case 'azure_openai':
    case 'openai':
      return <AzureOpenAiIcon size={size} className={className} />;
    case 'key_vault':
    case 'keyvault':
      return <AzureKeyVaultIcon size={size} className={className} />;
    case 'virtual_network':
    case 'vnet':
      return <AzureVnetIcon size={size} className={className} />;
    case 'policy':
      return <AzurePolicyIcon size={size} className={className} />;
    default:
      return <AzureAppServiceIcon size={size} className={className} />;
  }
}
