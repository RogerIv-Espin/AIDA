export type AzureCategory = 
  | 'Datos'
  | 'ETLs'
  | 'Cómputo'
  | 'Desarrollo Web'
  | 'Contenedores'
  | 'Kubernetes'
  | 'AI'
  | 'Seguridad'
  | 'Redes';

export type AzureEnvironment = 'dev' | 'test' | 'prod';

export interface AzureService {
  id: string;
  name: string;
  category: AzureCategory;
  type: string;
  icon: string;
  description: string;
  default_sku: {
    dev: string;
    test: string;
    prod: string;
  };
}

export interface DiagramNode {
  id: string;
  name: string;
  category: string;
  sku: string;
  icon: string;
  x: number;
  y: number;
  tier: string;
  status: string;
}

export interface DiagramEdge {
  source: string;
  target: string;
  label: string;
  animated: boolean;
}

export interface DiagramGrouping {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AzurePolicyItem {
  id: string;
  name: string;
  effect: 'Deny' | 'Audit' | 'AuditIfNotExists';
  category: string;
  description: string;
  rule: any;
}

export interface RbacRoleItem {
  roleName: string;
  principalType: string;
  scope: string;
  description: string;
  leastPrivilege: boolean;
}

export interface ElasticityConfig {
  strategy: string;
  min_instances: number;
  max_instances: number;
  scale_trigger: string;
  auto_shutdown: string;
  zone_redundant: boolean;
  backup_policy: string;
  sla: string;
}

export interface ManagedIdentityItem {
  name: string;
  type: string;
  purpose: string;
  credentials: string;
}

export interface PolicyAsCodePack {
  environment: AzureEnvironment;
  compliance_tier: string;
  allowed_locations: string[];
  policies: AzurePolicyItem[];
  rbac_roles: RbacRoleItem[];
  elasticity: ElasticityConfig;
  identities: ManagedIdentityItem[];
  limits: {
    max_cores_per_sub: number;
    max_storage_tb: number;
    budget_alert_threshold: string;
    ddos_protection: string;
  };
}

export interface ArchitectureSolution {
  status: string;
  metadata: {
    title: string;
    description: string;
    environment: AzureEnvironment;
    compliance_tier: string;
    location: string;
    engine: string;
    arm_version: string;
  };
  services_selected: AzureService[];
  diagram: {
    nodes: DiagramNode[];
    edges: DiagramEdge[];
    groupings: DiagramGrouping[];
  };
  policy_as_code: PolicyAsCodePack;
  bicep: string;
  arm_template: any;
  recommendations: string[];
}

export interface DialogOption {
  title: string;
  prompt: string;
  type: 'select' | 'multiselect' | 'tier_choice';
  options: {
    label: string;
    value: string;
    description?: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  dialogOptions?: DialogOption | null;
  recommendedServices?: string[];
}

export interface ArmVersionRecord {
  version: string;
  timestamp: string;
  title: string;
  changelog: string;
  template: any;
}
