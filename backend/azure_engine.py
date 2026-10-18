#!/usr/bin/env python3
"""
Azure Solution Architecture Engine
Backend in Python for generating enterprise-grade Azure architectures,
Policy as a Code, RBAC/IAM matrices, Elasticity policies, ARM Templates,
Azure Bicep code, and architectural diagram graphs.
"""

import sys
import json
import uuid
from typing import Dict, Any, List

# Catalog of Azure Service Definitions with official metadata and iconography category
AZURE_CATALOG = {
    # DATOS
    "cosmos_db": {
        "id": "cosmos_db",
        "name": "Azure Cosmos DB",
        "category": "Datos",
        "type": "Microsoft.DocumentDB/databaseAccounts",
        "icon": "database",
        "description": "Base de datos NoSQL distribuida globalmente con latencia de un solo dígito.",
        "default_sku": {"dev": "Standard (Free Tier / Serverless)", "test": "Autoscale 4000 RU/s", "prod": "Multi-region Autoscale 10000 RU/s"},
    },
    "azure_sql": {
        "id": "azure_sql",
        "name": "Azure SQL Database",
        "category": "Datos",
        "type": "Microsoft.Sql/servers/databases",
        "icon": "sql",
        "description": "Motor de base de datos relacional inteligente y totalmente administrado en la nube.",
        "default_sku": {"dev": "General Purpose Serverless (1 vCore)", "test": "General Purpose (2 vCores)", "prod": "Business Critical (8 vCores, Zone Redundant)"},
    },
    "synapse": {
        "id": "synapse",
        "name": "Azure Synapse Analytics",
        "category": "Datos",
        "type": "Microsoft.Synapse/workspaces",
        "icon": "synapse",
        "description": "Servicio de análisis ilimitado que reúne macrodatos y almacenes de datos empresariales.",
        "default_sku": {"dev": "Serverless SQL Pool", "test": "Dedicated SQL Pool DW100c", "prod": "Dedicated SQL Pool DW1000c + Spark Pool"},
    },
    "fabric": {
        "id": "fabric",
        "name": "Microsoft Fabric",
        "category": "Datos",
        "type": "Microsoft.Fabric/capacities",
        "icon": "fabric",
        "description": "Plataforma de análisis todo en uno centrada en lago de datos unificado OneLake.",
        "default_sku": {"dev": "F2 (Trial/Dev)", "test": "F8 Capacity", "prod": "F64 Capacity (Zone Redundant)"},
    },
    "data_lake": {
        "id": "data_lake",
        "name": "Azure Data Lake Storage Gen2",
        "category": "Datos",
        "type": "Microsoft.Storage/storageAccounts",
        "icon": "storage",
        "description": "Almacenamiento masivo escalable con espacio de nombres jerárquico para Big Data.",
        "default_sku": {"dev": "Standard LRS (Hierarchical Namespace)", "test": "Standard ZRS", "prod": "Premium GZRS with Immutability"},
    },
    # ETLS
    "data_factory": {
        "id": "data_factory",
        "name": "Azure Data Factory (ADF)",
        "category": "ETLs",
        "type": "Microsoft.DataFactory/factories",
        "icon": "factory",
        "description": "Servicio de integración de datos sin servidor para orquestación de ETL / ELT.",
        "default_sku": {"dev": "V2 con Azure IR 4 vCores", "test": "V2 con Managed VNet IR", "prod": "V2 con Managed VNet IR + Self-Hosted IR HA"},
    },
    "databricks": {
        "id": "databricks",
        "name": "Azure Databricks",
        "category": "ETLs",
        "type": "Microsoft.Databricks/workspaces",
        "icon": "databricks",
        "description": "Plataforma de análisis basada en Apache Spark optimizada para Azure.",
        "default_sku": {"dev": "Standard (Single Node Cluster)", "test": "Premium (Autoscaling 2-8 workers)", "prod": "Premium (Autoscaling 4-32 workers, Unity Catalog)"},
    },
    "stream_analytics": {
        "id": "stream_analytics",
        "name": "Azure Stream Analytics",
        "category": "ETLs",
        "type": "Microsoft.StreamAnalytics/streamingjobs",
        "icon": "stream",
        "description": "Motor de procesamiento de flujos de eventos complejos en tiempo real.",
        "default_sku": {"dev": "1 Streaming Unit (SU)", "test": "3 Streaming Units", "prod": "6+ Streaming Units (Zone Redundant)"},
    },
    # COMPUTO
    "app_service": {
        "id": "app_service",
        "name": "Azure App Service",
        "category": "Cómputo",
        "type": "Microsoft.Web/sites",
        "icon": "appservice",
        "description": "Alojamiento de aplicaciones web y API REST administrado con escalabilidad automática.",
        "default_sku": {"dev": "B1 Basic", "test": "P1v3 Premium", "prod": "P2v3 Premium con 3+ Instancias en Zona"},
    },
    "functions": {
        "id": "functions",
        "name": "Azure Functions",
        "category": "Cómputo",
        "type": "Microsoft.Web/sites",
        "icon": "functions",
        "description": "Cómputo serverless basado en eventos y microservicios escalables.",
        "default_sku": {"dev": "Consumption Plan (Y1)", "test": "Flex Consumption / Premium EP1", "prod": "Premium EP2 (VNet Integration, Pre-warmed)"},
    },
    "virtual_machines": {
        "id": "virtual_machines",
        "name": "Azure Virtual Machines (VMSS)",
        "category": "Cómputo",
        "type": "Microsoft.Compute/virtualMachineScaleSets",
        "icon": "vm",
        "description": "Conjunto de escalado de máquinas virtuales con balanceo de carga.",
        "default_sku": {"dev": "Standard_B2s (1 Instancia)", "test": "Standard_D2s_v5 (2 Instancias)", "prod": "Standard_D4s_v5 (3-10 Instancias en 3 Zonas)"},
    },
    # DESARROLLO WEB
    "static_web_apps": {
        "id": "static_web_apps",
        "name": "Azure Static Web Apps",
        "category": "Desarrollo Web",
        "type": "Microsoft.Web/staticSites",
        "icon": "staticweb",
        "description": "Alojamiento de frontend moderno (React/Vue/Angular) con distribución global.",
        "default_sku": {"dev": "Free Tier", "test": "Standard Tier", "prod": "Standard Tier + Custom Domains + Enterprise SLA"},
    },
    "front_door": {
        "id": "front_door",
        "name": "Azure Front Door",
        "category": "Desarrollo Web",
        "type": "Microsoft.Cdn/profiles",
        "icon": "frontdoor",
        "description": "Red de distribución de contenido global (CDN) y balanceador de carga de capa 7 con WAF.",
        "default_sku": {"dev": "Standard Profile", "test": "Standard Profile con Custom Rules", "prod": "Premium Profile con WAF Managed Ruleset y Private Link"},
    },
    "api_management": {
        "id": "api_management",
        "name": "Azure API Management (APIM)",
        "category": "Desarrollo Web",
        "type": "Microsoft.ApiManagement/service",
        "icon": "apim",
        "description": "Puerta de enlace híbrida y multinube para publicación, control y análisis de APIs.",
        "default_sku": {"dev": "Developer Tier (No SLA)", "test": "Basic v2 Tier", "prod": "Standard v2 / Premium Tier (Multi-region)"},
    },
    # CONTENEDORES
    "container_apps": {
        "id": "container_apps",
        "name": "Azure Container Apps (ACA)",
        "category": "Contenedores",
        "type": "Microsoft.App/containerApps",
        "icon": "containerapps",
        "description": "Plataforma de microservicios en contenedores serverless basada en KEDA y Dapr.",
        "default_sku": {"dev": "Consumption (0.5 vCPU, 1GiB)", "test": "Consumption + Dedicated D4", "prod": "Dedicated D8 (Zone Redundant, 3-20 réplicas)"},
    },
    "container_registry": {
        "id": "container_registry",
        "name": "Azure Container Registry (ACR)",
        "category": "Contenedores",
        "type": "Microsoft.ContainerRegistry/registries",
        "icon": "acr",
        "description": "Registro privado de imágenes Docker y artefactos OCI integrado con Entra ID.",
        "default_sku": {"dev": "Basic Tier", "test": "Standard Tier", "prod": "Premium Tier (Geo-replication, Private Endpoint)"},
    },
    # KUBERNETES
    "aks": {
        "id": "aks",
        "name": "Azure Kubernetes Service (AKS)",
        "category": "Kubernetes",
        "type": "Microsoft.ContainerService/managedClusters",
        "icon": "aks",
        "description": "Clúster de Kubernetes administrado de nivel empresarial con soporte Istio y Cilium.",
        "default_sku": {"dev": "Free Cluster, 1 System Node (D2s_v5)", "test": "Standard SLA, 2 Nodes (D4s_v5)", "prod": "Standard SLA, 3 Multi-Zone System Nodes + Autoscaling User Pool (D8s_v5)"},
    },
    # AI
    "ai_foundry": {
        "id": "ai_foundry",
        "name": "Azure AI Foundry",
        "category": "AI",
        "type": "Microsoft.CognitiveServices/accounts",
        "icon": "aifoundry",
        "description": "Hub integral para diseño, evaluación y despliegue de modelos generativos y agentes AI.",
        "default_sku": {"dev": "Standard S0", "test": "Standard S0 (Isolated Hub)", "prod": "Enterprise Project (Private Endpoint + VNet Encrypted)"},
    },
    "ai_search": {
        "id": "ai_search",
        "name": "Azure AI Search",
        "category": "AI",
        "type": "Microsoft.Search/searchServices",
        "icon": "aisearch",
        "description": "Motor de búsqueda vectorial y semántica para recuperación aumentada RAG.",
        "default_sku": {"dev": "Basic (1 Search Unit)", "test": "Standard S1 (2 Replicas)", "prod": "Standard S2 (3 Replicas + 2 Partitions, High SLA)"},
    },
    "copilot_studio": {
        "id": "copilot_studio",
        "name": "Microsoft Copilot Studio",
        "category": "AI",
        "type": "Microsoft.PowerApps/copilot",
        "icon": "copilot",
        "description": "Entorno conversacional gráfico para diseñar agentes personalizados y orquestación.",
        "default_sku": {"dev": "Developer Capacity", "test": "Trial Tenant Capacity", "prod": "Production Tenant Messages Pack (Enterprise SLA)"},
    },
    "azure_openai": {
        "id": "azure_openai",
        "name": "Azure OpenAI Service",
        "category": "AI",
        "type": "Microsoft.CognitiveServices/accounts/deployments",
        "icon": "openai",
        "description": "Acceso empresarial privado a GPT-4o, embeddings y modelos multimodales.",
        "default_sku": {"dev": "Standard TPM 20K", "test": "Standard TPM 50K", "prod": "Provisioned Throughput Units (PTU) 100+"},
    },
    # SEGURIDAD Y GOBERNANZA BASE
    "key_vault": {
        "id": "key_vault",
        "name": "Azure Key Vault",
        "category": "Seguridad",
        "type": "Microsoft.KeyVault/vaults",
        "icon": "keyvault",
        "description": "Almacén centralizado de secretos, certificados y claves criptográficas con HSM.",
        "default_sku": {"dev": "Standard", "test": "Standard con Soft-Delete", "prod": "Premium (HSM Protected, Purge Protection)"},
    },
    "virtual_network": {
        "id": "virtual_network",
        "name": "Azure Virtual Network (VNet)",
        "category": "Redes",
        "type": "Microsoft.Network/virtualNetworks",
        "icon": "vnet",
        "description": "Red privada aislada en la nube con subredes dedicadas y endpoints privados.",
        "default_sku": {"dev": "VNet /24 (2 Subnets)", "test": "VNet /20 con Bastion", "prod": "Hub & Spoke VNet /16 con Azure Firewall y DDoS"},
    }
}


def build_policy_as_code(environment: str, services: List[str], compliance_tier: str) -> Dict[str, Any]:
    """
    Generates Azure Policy as a Code definitions, IAM RBAC rules,
    quotas, resource policies, and elasticity specs.
    """
    allowed_locations = ["eastus2", "centralus", "westeurope"] if environment == "prod" else ["eastus2", "centralus"]
    
    # 1. Azure Policy Definitions
    policies = [
        {
            "id": "pol-enforce-tls12",
            "name": "Enforce Minimum TLS 1.2 Version",
            "effect": "Deny",
            "category": "Security & Cryptography",
            "description": "Garantiza que todos los servicios App Service, Storage y API Management requieran TLS 1.2 o superior.",
            "rule": {
                "if": {
                    "field": "Microsoft.Web/sites/config/minTlsVersion",
                    "notEquals": "1.2"
                },
                "then": {"effect": "Deny"}
            }
        },
        {
            "id": "pol-deny-public-storage",
            "name": "Deny Public Blob Access on Storage Accounts",
            "effect": "Deny" if environment in ["test", "prod"] else "Audit",
            "category": "Data Protection",
            "description": "Bloquea cualquier acceso anónimo público a cuentas de Azure Storage y Data Lake.",
            "rule": {
                "if": {
                    "allOf": [
                        {"field": "type", "equals": "Microsoft.Storage/storageAccounts"},
                        {"field": "Microsoft.Storage/storageAccounts/allowBlobPublicAccess", "equals": "true"}
                    ]
                },
                "then": {"effect": "Deny" if environment in ["test", "prod"] else "Audit"}
            }
        },
        {
            "id": "pol-allowed-locations",
            "name": f"Allowed Azure Regions ({', '.join(allowed_locations)})",
            "effect": "Deny",
            "category": "Governance & Compliance",
            "description": "Restringe la creación de recursos únicamente a las regiones aprobadas por la organización.",
            "rule": {
                "if": {
                    "not": {"field": "location", "in": allowed_locations}
                },
                "then": {"effect": "Deny"}
            }
        },
        {
            "id": "pol-require-tags",
            "name": "Require Mandatory Resource Tags (Environment, CostCenter, Owner)",
            "effect": "Deny" if environment == "prod" else "Audit",
            "category": "Cost Management",
            "description": "Audita o bloquea recursos sin etiquetas mandatarias de gobierno de costos.",
            "rule": {
                "if": {
                    "anyOf": [
                        {"field": "tags['Environment']", "exists": "false"},
                        {"field": "tags['CostCenter']", "exists": "false"}
                    ]
                },
                "then": {"effect": "Deny" if environment == "prod" else "Audit"}
            }
        },
        {
            "id": "pol-managed-identity",
            "name": "Require Managed Identity for Compute & Workloads",
            "effect": "AuditIfNotExists",
            "category": "Identity & IAM",
            "description": "Exige el uso de identidades administradas (User-Assigned o System-Assigned) sin secretos en texto plano.",
            "rule": {
                "if": {
                    "field": "type", "in": ["Microsoft.Web/sites", "Microsoft.App/containerApps", "Microsoft.ContainerService/managedClusters"]
                },
                "then": {"effect": "AuditIfNotExists"}
            }
        }
    ]

    # 2. RBAC & IAM Matrix
    rbac_roles = [
        {
            "roleName": "Contributor (Ambiente Dev)",
            "principalType": "ServicePrincipal / Developer Group",
            "scope": f"/subscriptions/{{subId}}/resourceGroups/rg-sol-{environment}",
            "description": "Permisos de despliegue y modificación de recursos en el grupo de recursos.",
            "leastPrivilege": environment == "dev"
        },
        {
            "roleName": "Key Vault Secrets User",
            "principalType": "Managed Identity (App Service / Container App)",
            "scope": f"/subscriptions/{{subId}}/resourceGroups/rg-sol-{environment}/providers/Microsoft.KeyVault/vaults/kv-sol-{environment}",
            "description": "Acceso de lectura a secretos en tiempo de ejecución sin permisos administrativos.",
            "leastPrivilege": True
        },
        {
            "roleName": "Cognitive Services OpenAI User",
            "principalType": "Managed Identity / API Gateway",
            "scope": f"/subscriptions/{{subId}}/resourceGroups/rg-sol-{environment}/providers/Microsoft.CognitiveServices/accounts/ai-sol-{environment}",
            "description": "Inferencia de modelos de Azure OpenAI y AI Foundry mediante token Entra ID sin claves de API.",
            "leastPrivilege": True
        },
        {
            "roleName": "Azure Kubernetes Service Cluster User Role",
            "principalType": "DevOps Pipeline / SRE Group",
            "scope": f"/subscriptions/{{subId}}/resourceGroups/rg-sol-{environment}/providers/Microsoft.ContainerService/managedClusters/aks-sol-{environment}",
            "description": "Acceso a credenciales de cluster AKS con autorización de RBAC de Kubernetes.",
            "leastPrivilege": True
        },
        {
            "roleName": "Reader (Seguridad y Auditoría)",
            "principalType": "Security Audit Group",
            "scope": f"/subscriptions/{{subId}}",
            "description": "Solo lectura a nivel de suscripción para inventario y cumplimiento continuo.",
            "leastPrivilege": True
        }
    ]

    # 3. Environment Elasticity Policies
    elasticity_configs = {
        "dev": {
            "strategy": "Scale to Zero / Single Instance Burstable",
            "min_instances": 1,
            "max_instances": 2,
            "scale_trigger": "CPU > 85% durante 15 minutos",
            "auto_shutdown": "Activado (Lunes a Viernes 20:00 - 07:00 UTC)",
            "zone_redundant": False,
            "backup_policy": "Retención de 7 días, LRS",
            "sla": "99.0% (Sin SLA de producción)"
        },
        "test": {
            "strategy": "Dynamic Autoscaling Burst",
            "min_instances": 2,
            "max_instances": 5,
            "scale_trigger": "CPU > 75% o memoria > 80% durante 5 minutos",
            "auto_shutdown": "Desactivado (Ambiente continuo de pruebas automatizadas)",
            "zone_redundant": False,
            "backup_policy": "Retención de 14 días, ZRS",
            "sla": "99.5%"
        },
        "prod": {
            "strategy": "Multi-Zone High-Availability con Predictivo Autoscale",
            "min_instances": 3,
            "max_instances": 15,
            "scale_trigger": "CPU > 65% o solicitudes concurrentes > 2000/instancia",
            "auto_shutdown": "Terminantemente Prohibido (24/7/365)",
            "zone_redundant": True,
            "backup_policy": "Retención de 30 días, Geo-Redundante GRS con protección contra ransomware",
            "sla": "99.99% con zonas de disponibilidad y failover automático"
        }
    }

    # 4. Service Accounts & Managed Identities
    identities = [
        {
            "name": f"id-workload-{environment}-001",
            "type": "User-Assigned Managed Identity",
            "purpose": "Identidad centralizada federada para pods/contenedores y servicios backend.",
            "credentials": "Passwordless / OIDC token exchange con Microsoft Entra ID."
        },
        {
            "name": f"id-devops-cicd-{environment}",
            "type": "Workload Identity Federation (GitHub Actions / Azure DevOps)",
            "purpose": "Despliegue automatizado de infraestructura como código (IaC) sin almacenar secretos permanentes.",
            "credentials": "Token federado con expiración de 1 hora."
        }
    ]

    return {
        "environment": environment,
        "compliance_tier": compliance_tier,
        "allowed_locations": allowed_locations,
        "policies": policies,
        "rbac_roles": rbac_roles,
        "elasticity": elasticity_configs.get(environment, elasticity_configs["dev"]),
        "identities": identities,
        "limits": {
            "max_cores_per_sub": 100 if environment == "prod" else 20,
            "max_storage_tb": 50 if environment == "prod" else 5,
            "budget_alert_threshold": "80% y 100% de cuota mensual",
            "ddos_protection": "Virtual Network DDoS Protection Enabled" if environment == "prod" else "Basic Network Security"
        }
    }


def generate_diagram_nodes_and_edges(service_ids: List[str], environment: str) -> Dict[str, Any]:
    """
    Calculates 2D coordinates, tiers, grouping containers, and connection links
    with official Azure service icons for the visual canvas and image export.
    """
    nodes = []
    edges = []

    # Assign positions based on architecture tiers
    # Tier 1: Ingress / Frontend / Gateway (X: 100-250)
    # Tier 2: Compute / AI / Orchestration (X: 420-560)
    # Tier 3: Data / Storage / Lakehouse (X: 740-880)
    # Tier 4: Security / Governance (Y: bottom or top bar)

    ingress_ids = [s for s in service_ids if s in ["front_door", "api_management", "static_web_apps"]]
    compute_ai_ids = [s for s in service_ids if s in ["aks", "container_apps", "app_service", "functions", "virtual_machines", "ai_foundry", "ai_search", "copilot_studio", "azure_openai", "data_factory", "databricks"]]
    data_ids = [s for s in service_ids if s in ["cosmos_db", "azure_sql", "synapse", "fabric", "data_lake", "container_registry", "stream_analytics"]]
    infra_ids = [s for s in service_ids if s in ["virtual_network", "key_vault"]]

    # Ensure baseline infra if not present
    if "key_vault" not in service_ids:
        infra_ids.append("key_vault")
    if "virtual_network" not in service_ids:
        infra_ids.append("virtual_network")

    y_offset = 120
    # Add Ingress nodes
    for idx, sid in enumerate(ingress_ids):
        info = AZURE_CATALOG.get(sid, {})
        nodes.append({
            "id": sid,
            "name": info.get("name", sid),
            "category": info.get("category", "Frontend"),
            "sku": info.get("default_sku", {}).get(environment, "Standard"),
            "icon": info.get("icon", "appservice"),
            "x": 120,
            "y": y_offset + (idx * 160),
            "tier": "Ingress & Edge",
            "status": "Healthy"
        })

    # Add Compute & AI nodes
    y_offset = 100
    for idx, sid in enumerate(compute_ai_ids):
        info = AZURE_CATALOG.get(sid, {})
        nodes.append({
            "id": sid,
            "name": info.get("name", sid),
            "category": info.get("category", "Cómputo / AI"),
            "sku": info.get("default_sku", {}).get(environment, "Standard"),
            "icon": info.get("icon", "compute"),
            "x": 450,
            "y": y_offset + (idx * 150),
            "tier": "Core Logic & AI Engine",
            "status": "Healthy"
        })

    # Add Data & Storage nodes
    y_offset = 110
    for idx, sid in enumerate(data_ids):
        info = AZURE_CATALOG.get(sid, {})
        nodes.append({
            "id": sid,
            "name": info.get("name", sid),
            "category": info.get("category", "Datos & Lakehouse"),
            "sku": info.get("default_sku", {}).get(environment, "Standard"),
            "icon": info.get("icon", "database"),
            "x": 780,
            "y": y_offset + (idx * 150),
            "tier": "Data Persistence & Lake",
            "status": "Healthy"
        })

    # Add Infra nodes
    for idx, sid in enumerate(infra_ids):
        info = AZURE_CATALOG.get(sid, {})
        nodes.append({
            "id": sid,
            "name": info.get("name", sid),
            "category": info.get("category", "Seguridad & Redes"),
            "sku": info.get("default_sku", {}).get(environment, "Standard"),
            "icon": info.get("icon", "security"),
            "x": 450 + (idx * 330),
            "y": 620,
            "tier": "Infrastructure Foundation",
            "status": "Healthy"
        })

    # Generate meaningful interconnect edges
    all_node_ids = {n["id"] for n in nodes}

    # Connect Ingress to Compute
    for ing in ingress_ids:
        for comp in compute_ai_ids:
            if ing == "front_door" and comp in ["aks", "container_apps", "app_service"]:
                edges.append({"source": ing, "target": comp, "label": "HTTPS TLS 1.3 / WAF", "animated": True})
            elif ing == "api_management" and comp in ["functions", "container_apps", "aks"]:
                edges.append({"source": ing, "target": comp, "label": "OAuth 2.0 / JWT", "animated": True})
            elif ing == "static_web_apps" and comp in ["functions", "api_management"]:
                edges.append({"source": ing, "target": comp, "label": "Managed API Call", "animated": False})

    # Connect Compute to AI and Data
    for comp in compute_ai_ids:
        # AI interconnects
        if comp in ["copilot_studio", "ai_foundry"] and "ai_search" in all_node_ids:
            edges.append({"source": comp, "target": "ai_search", "label": "Vector Retrieval / RAG", "animated": True})
        if comp in ["copilot_studio", "ai_foundry", "aks", "container_apps"] and "azure_openai" in all_node_ids:
            edges.append({"source": comp, "target": "azure_openai", "label": "Managed Identity Prompting", "animated": True})
        
        # Data interconnects
        for dat in data_ids:
            if comp in ["aks", "container_apps", "app_service", "functions"] and dat in ["cosmos_db", "azure_sql"]:
                edges.append({"source": comp, "target": dat, "label": "Private Endpoint / VNet", "animated": False})
            elif comp in ["data_factory", "databricks"] and dat in ["data_lake", "synapse", "fabric"]:
                edges.append({"source": comp, "target": dat, "label": "Delta Parquet Pipeline", "animated": True})

    # Connect Compute to Key Vault
    if "key_vault" in all_node_ids:
        for comp in compute_ai_ids[:2]:
            edges.append({"source": comp, "target": "key_vault", "label": "RBAC Secret Fetch", "animated": False})

    # If few edges were formed, connect sequentially
    if len(edges) == 0 and len(nodes) > 1:
        for i in range(len(nodes) - 1):
            edges.append({"source": nodes[i]["id"], "target": nodes[i+1]["id"], "label": "Azure Service Bus / Link", "animated": False})

    return {
        "nodes": nodes,
        "edges": edges,
        "groupings": [
            {"id": "grp-edge", "label": "Public Edge & CDN", "x": 80, "y": 60, "width": 220, "height": 520},
            {"id": "grp-vnet", "label": f"Azure Virtual Network (vnet-sol-{environment})", "x": 370, "y": 50, "width": 680, "height": 660}
        ]
    }


def generate_bicep_code(title: str, environment: str, service_ids: List[str], location: str = "eastus2") -> str:
    """
    Generates modular, robust, production-compliant Azure Bicep code
    incorporating parameters, decorators, resources, and outputs.
    """
    bicep_lines = [
        "// ===========================================================================",
        f"// Azure Bicep Solution Template: {title}",
        f"// Target Environment: {environment.upper()}",
        f"// Generated by Azure Solution Architect AI",
        "// ===========================================================================",
        "",
        "@description('Target deployment environment (dev, test, prod)')",
        "@allowed(['dev', 'test', 'prod'])",
        f"param environment string = '{environment}'",
        "",
        "@description('Primary Azure region for resource provisioning')",
        f"param location string = '{location}'",
        "",
        "@description('Workload identifier prefix for uniform resource naming')",
        "@minLength(3)",
        "@maxLength(12)",
        "param workloadName string = 'solarch'",
        "",
        "@description('Mandatory tagging schema for Azure Policy compliance')",
        "param tags object = {",
        "  Environment: environment",
        "  CostCenter: 'CC-ENGINEERING'",
        "  ManagedBy: 'AzureBicep-IaC'",
        "  Workload: workloadName",
        "}",
        "",
        "// Variables for conditional tiering and naming",
        "var uniqueSuffix = substring(uniqueString(resourceGroup().id), 0, 6)",
        "var isProd = environment == 'prod'",
        "var isDev = environment == 'dev'",
        "",
        "// ---------------------------------------------------------------------------",
        "// FOUNDATION: Azure Key Vault (Secrets & HSM)",
        "// ---------------------------------------------------------------------------",
        "resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {",
        "  name: 'kv-${workloadName}-${environment}-${uniqueSuffix}'",
        "  location: location",
        "  tags: tags",
        "  properties: {",
        "    sku: {",
        "      family: 'A'",
        "      name: isProd ? 'premium' : 'standard'",
        "    }",
        "    tenantId: subscription().tenantId",
        "    enableRbacAuthorization: true",
        "    enableSoftDelete: true",
        "    softDeleteRetentionInDays: isProd ? 90 : 7",
        "    enablePurgeProtection: isProd ? true : null",
        "    networkAcls: {",
        "      bypass: 'AzureServices'",
        "      defaultAction: isProd ? 'Deny' : 'Allow'",
        "    }",
        "  }",
        "}",
        "",
        "// ---------------------------------------------------------------------------",
        "// NETWORKING: Virtual Network & Subnets",
        "// ---------------------------------------------------------------------------",
        "resource virtualNetwork 'Microsoft.Network/virtualNetworks@2023-09-01' = {",
        "  name: 'vnet-${workloadName}-${environment}'",
        "  location: location",
        "  tags: tags",
        "  properties: {",
        "    addressSpace: {",
        "      addressPrefixes: [",
        "        isProd ? '10.200.0.0/16' : '10.100.0.0/16'",
        "      ]",
        "    }",
        "    subnets: [",
        "      {",
        "        name: 'snet-workloads'",
        "        properties: {",
        "          addressPrefix: isProd ? '10.200.1.0/24' : '10.100.1.0/24'",
        "          privateEndpointNetworkPolicies: 'Disabled'",
        "        }",
        "      }",
        "      {",
        "        name: 'snet-data'",
        "        properties: {",
        "          addressPrefix: isProd ? '10.200.2.0/24' : '10.100.2.0/24'",
        "          privateEndpointNetworkPolicies: 'Disabled'",
        "        }",
        "      }",
        "    ]",
        "  }",
        "}",
    ]

    # Conditionally add requested stack components
    if "cosmos_db" in service_ids:
        bicep_lines.extend([
            "",
            "// ---------------------------------------------------------------------------",
            "// DATA: Azure Cosmos DB Account",
            "// ---------------------------------------------------------------------------",
            "resource cosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2023-11-15' = {",
            "  name: 'cosmos-${workloadName}-${environment}-${uniqueSuffix}'",
            "  location: location",
            "  tags: tags",
            "  kind: 'GlobalDocumentDB'",
            "  properties: {",
            "    databaseAccountOfferType: 'Standard'",
            "    consistencyPolicy: {",
            "      defaultConsistencyLevel: 'Session'",
            "    }",
            "    locations: [",
            "      {",
            "        locationName: location",
            "        failoverPriority: 0",
            "        isZoneRedundant: isProd",
            "      }",
            "    ]",
            "    enableAutomaticFailover: isProd",
            "    capabilities: isDev ? [{ name: 'EnableServerless' }] : []",
            "  }",
            "}"
        ])

    if "aks" in service_ids:
        bicep_lines.extend([
            "",
            "// ---------------------------------------------------------------------------",
            "// KUBERNETES: Azure Kubernetes Service (AKS)",
            "// ---------------------------------------------------------------------------",
            "resource aksCluster 'Microsoft.ContainerService/managedClusters@2023-10-01' = {",
            "  name: 'aks-${workloadName}-${environment}'",
            "  location: location",
            "  tags: tags",
            "  identity: {",
            "    type: 'SystemAssigned'",
            "  }",
            "  properties: {",
            "    dnsPrefix: 'aks-${workloadName}-${environment}'",
            "    agentPoolProfiles: [",
            "      {",
            "        name: 'systempool'",
            "        count: isProd ? 3 : 1",
            "        vmSize: isProd ? 'Standard_D4s_v5' : 'Standard_B2s'",
            "        osType: 'Linux'",
            "        mode: 'System'",
            "        enableAutoScaling: isProd",
            "        minCount: isProd ? 3 : 1",
            "        maxCount: isProd ? 10 : 2",
            "        availabilityZones: isProd ? ['1', '2', '3'] : []",
            "      }",
            "    ]",
            "    networkProfile: {",
            "      networkPlugin: 'azure'",
            "      loadBalancerSku: 'standard'",
            "    }",
            "  }",
            "}"
        ])

    if "container_apps" in service_ids:
        bicep_lines.extend([
            "",
            "// ---------------------------------------------------------------------------",
            "// CONTAINERS: Azure Container Apps Managed Environment",
            "// ---------------------------------------------------------------------------",
            "resource containerAppEnv 'Microsoft.App/managedEnvironments@2023-05-01' = {",
            "  name: 'cae-${workloadName}-${environment}'",
            "  location: location",
            "  tags: tags",
            "  properties: {",
            "    zoneRedundant: isProd",
            "  }",
            "}",
            "",
            "resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {",
            "  name: 'app-${workloadName}-${environment}'",
            "  location: location",
            "  tags: tags",
            "  properties: {",
            "    managedEnvironmentId: containerAppEnv.id",
            "    configuration: {",
            "      ingress: {",
            "        external: true",
            "        targetPort: 8080",
            "      }",
            "    }",
            "    template: {",
            "      containers: [",
            "        {",
            "          name: 'backend-service'",
            "          image: 'mcr.microsoft.com/azuredocs/aci-helloworld:latest'",
            "          resources: {",
            "            cpu: json('0.5')",
            "            memory: '1.0Gi'",
            "          }",
            "        }",
            "      ]",
            "      scale: {",
            "        minReplicas: isProd ? 2 : 0,",
            "        maxReplicas: isProd ? 10 : 2,",
            "      }",
            "    }",
            "  }",
            "}"
        ])

    if "ai_foundry" in service_ids or "azure_openai" in service_ids:
        bicep_lines.extend([
            "",
            "// ---------------------------------------------------------------------------",
            "// AI: Azure AI Foundry & OpenAI Account",
            "// ---------------------------------------------------------------------------",
            "resource aiAccount 'Microsoft.CognitiveServices/accounts@2023-05-01' = {",
            "  name: 'ai-${workloadName}-${environment}-${uniqueSuffix}'",
            "  location: location",
            "  tags: tags",
            "  kind: 'OpenAI'",
            "  sku: {",
            "    name: 'S0'",
            "  }",
            "  properties: {",
            "    customSubDomainName: 'ai-${workloadName}-${environment}-${uniqueSuffix}'",
            "    publicNetworkAccess: isProd ? 'Disabled' : 'Enabled'",
            "  }",
            "}",
            "",
            "resource gptDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {",
            "  parent: aiAccount",
            "  name: 'gpt-4o'",
            "  sku: {",
            "    name: 'Standard'",
            "    capacity: isProd ? 50 : 10",
            "  }",
            "  properties: {",
            "    model: {",
            "      format: 'OpenAI'",
            "      name: 'gpt-4o'",
            "      version: '2024-05-13'",
            "    }",
            "  }",
            "}"
        ])

    if "ai_search" in service_ids:
        bicep_lines.extend([
            "",
            "// ---------------------------------------------------------------------------",
            "// AI: Azure AI Search (Vector Retrieval for RAG)",
            "// ---------------------------------------------------------------------------",
            "resource searchService 'Microsoft.Search/searchServices@2023-11-01' = {",
            "  name: 'srch-${workloadName}-${environment}-${uniqueSuffix}'",
            "  location: location",
            "  tags: tags",
            "  sku: {",
            "    name: isProd ? 'standard' : 'basic'",
            "  }",
            "  properties: {",
            "    replicaCount: isProd ? 2 : 1",
            "    partitionCount: 1",
            "    semanticSearch: 'free'",
            "  }",
            "}"
        ])

    if "data_factory" in service_ids:
        bicep_lines.extend([
            "",
            "// ---------------------------------------------------------------------------",
            "// ETL: Azure Data Factory (ADF)",
            "// ---------------------------------------------------------------------------",
            "resource dataFactory 'Microsoft.DataFactory/factories@2018-06-01' = {",
            "  name: 'adf-${workloadName}-${environment}-${uniqueSuffix}'",
            "  location: location",
            "  tags: tags",
            "  identity: {",
            "    type: 'SystemAssigned'",
            "  }",
            "  properties: {",
            "    publicNetworkAccess: isProd ? 'Disabled' : 'Enabled'",
            "  }",
            "}"
        ])

    if "data_lake" in service_ids:
        bicep_lines.extend([
            "",
            "// ---------------------------------------------------------------------------",
            "// DATA: Azure Data Lake Storage Gen2",
            "// ---------------------------------------------------------------------------",
            "resource dataLake 'Microsoft.Storage/storageAccounts@2023-01-01' = {",
            "  name: 'dls${workloadName}${environment}${uniqueSuffix}'",
            "  location: location",
            "  tags: tags",
            "  sku: {",
            "    name: isProd ? 'Standard_GRS' : 'Standard_LRS'",
            "  }",
            "  kind: 'StorageV2'",
            "  properties: {",
            "    isHnsEnabled: true",
            "    minimumTlsVersion: 'TLS1_2'",
            "    allowBlobPublicAccess: false",
            "    supportsHttpsTrafficOnly: true",
            "  }",
            "}"
        ])

    # Outputs
    bicep_lines.extend([
        "",
        "// ---------------------------------------------------------------------------",
        "// OUTPUTS: Integration endpoints & Resource IDs",
        "// ---------------------------------------------------------------------------",
        "output keyVaultId string = keyVault.id",
        "output keyVaultUri string = keyVault.properties.vaultUri",
        "output virtualNetworkId string = virtualNetwork.id",
        "output environmentDeployed string = environment",
        "output locationDeployed string = location",
    ])

    return "\n".join(bicep_lines)


def generate_arm_template(title: str, environment: str, service_ids: List[str], version: str = "1.0.0") -> Dict[str, Any]:
    """
    Generates a valid Azure Resource Manager (ARM) template JSON
    with version metadata, parameters, variables, resources and outputs.
    """
    arm = {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": f"{version}.0",
        "metadata": {
            "title": f"ARM Solution Template - {title}",
            "description": f"Generado por Azure Solution Architect AI para ambiente {environment.upper()}",
            "author": "Azure Architecture AI Bot",
            "version": version,
            "createdDate": "2026-10-16",
            "policyCompliant": True
        },
        "parameters": {
            "environment": {
                "type": "string",
                "defaultValue": environment,
                "allowedValues": ["dev", "test", "prod"],
                "metadata": {"description": "Ambiente de ejecución para políticas de escalabilidad y costos."}
            },
            "location": {
                "type": "string",
                "defaultValue": "[resourceGroup().location]",
                "metadata": {"description": "Región de Azure autorizada por Policy."}
            },
            "workloadName": {
                "type": "string",
                "defaultValue": "solarch",
                "metadata": {"description": "Prefijo identificador de la solución."}
            }
        },
        "variables": {
            "keyVaultName": "[concat('kv-', parameters('workloadName'), '-', parameters('environment'), '-', substring(uniqueString(resourceGroup().id), 0, 5))]",
            "vnetName": "[concat('vnet-', parameters('workloadName'), '-', parameters('environment'))]",
            "isProd": "[equals(parameters('environment'), 'prod')]"
        },
        "resources": [
            {
                "type": "Microsoft.KeyVault/vaults",
                "apiVersion": "2023-07-01",
                "name": "[variables('keyVaultName')]",
                "location": "[parameters('location')]",
                "tags": {
                    "Environment": "[parameters('environment')]",
                    "CostCenter": "CC-AI-ARCH",
                    "ArmVersion": version
                },
                "properties": {
                    "sku": {
                        "family": "A",
                        "name": "[if(variables('isProd'), 'premium', 'standard')]"
                    },
                    "tenantId": "[subscription().tenantId]",
                    "enableRbacAuthorization": True,
                    "enableSoftDelete": True,
                    "softDeleteRetentionInDays": 90,
                    "networkAcls": {
                        "bypass": "AzureServices",
                        "defaultAction": "[if(variables('isProd'), 'Deny', 'Allow')]"
                    }
                }
            },
            {
                "type": "Microsoft.Network/virtualNetworks",
                "apiVersion": "2023-09-01",
                "name": "[variables('vnetName')]",
                "location": "[parameters('location')]",
                "tags": {
                    "Environment": "[parameters('environment')]",
                    "ManagedBy": "ARM-Template"
                },
                "properties": {
                    "addressSpace": {
                        "addressPrefixes": [
                            "[if(variables('isProd'), '10.200.0.0/16', '10.100.0.0/16')]"
                        ]
                    },
                    "subnets": [
                        {
                            "name": "snet-workloads",
                            "properties": {
                                "addressPrefix": "[if(variables('isProd'), '10.200.1.0/24', '10.100.1.0/24')]"
                            }
                        },
                        {
                            "name": "snet-data",
                            "properties": {
                                "addressPrefix": "[if(variables('isProd'), '10.200.2.0/24', '10.100.2.0/24')]"
                            }
                        }
                    ]
                }
            }
        ],
        "outputs": {
            "keyVaultResourceId": {
                "type": "string",
                "value": "[resourceId('Microsoft.KeyVault/vaults', variables('keyVaultName'))]"
            },
            "vnetResourceId": {
                "type": "string",
                "value": "[resourceId('Microsoft.Network/virtualNetworks', variables('vnetName'))]"
            },
            "deploymentVersion": {
                "type": "string",
                "value": version
            }
        }
    }

    # Add Cosmos DB if present
    if "cosmos_db" in service_ids:
        arm["resources"].append({
            "type": "Microsoft.DocumentDB/databaseAccounts",
            "apiVersion": "2023-11-15",
            "name": "[concat('cosmos-', parameters('workloadName'), '-', parameters('environment'), '-', substring(uniqueString(resourceGroup().id), 0, 5))]",
            "location": "[parameters('location')]",
            "kind": "GlobalDocumentDB",
            "properties": {
                "databaseAccountOfferType": "Standard",
                "consistencyPolicy": {"defaultConsistencyLevel": "Session"},
                "locations": [{"locationName": "[parameters('location')]", "failoverPriority": 0}]
            }
        })

    # Add AI Account if present
    if "ai_foundry" in service_ids or "azure_openai" in service_ids:
        arm["resources"].append({
            "type": "Microsoft.CognitiveServices/accounts",
            "apiVersion": "2023-05-01",
            "name": "[concat('ai-', parameters('workloadName'), '-', parameters('environment'), '-', substring(uniqueString(resourceGroup().id), 0, 5))]",
            "location": "[parameters('location')]",
            "kind": "OpenAI",
            "sku": {"name": "S0"},
            "properties": {
                "customSubDomainName": "[concat('ai-', parameters('workloadName'), '-', parameters('environment'))]",
                "publicNetworkAccess": "[if(variables('isProd'), 'Disabled', 'Enabled')]"
            }
        })

    return arm


def build_full_solution(request_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main entry point for synthesizing a complete Azure Architecture Solution.
    """
    title = request_data.get("title", "Solución Cloud Azure de Alta Disponibilidad")
    description = request_data.get("description", "Arquitectura escalable y segura.")
    environment = request_data.get("environment", "prod").lower()
    compliance_tier = request_data.get("compliance_tier", "Enterprise Standard (ISO 27001 / PCI-DSS)")
    location = request_data.get("location", "eastus2")
    service_ids = request_data.get("service_ids", ["aks", "cosmos_db", "ai_foundry", "ai_search", "key_vault"])
    arm_version = request_data.get("arm_version", "1.0.0")

    # Filter valid services
    valid_services = [s for s in service_ids if s in AZURE_CATALOG]
    if not valid_services:
        valid_services = ["aks", "cosmos_db", "ai_foundry", "key_vault", "virtual_network"]

    # 1. Policy as Code & Governance
    policy_pack = build_policy_as_code(environment, valid_services, compliance_tier)

    # 2. Diagram Graph Nodes & Edges
    diagram_graph = generate_diagram_nodes_and_edges(valid_services, environment)

    # 3. Azure Bicep Template
    bicep_code = generate_bicep_code(title, environment, valid_services, location)

    # 4. ARM Template JSON (Versioned)
    arm_template = generate_arm_template(title, environment, valid_services, version=arm_version)

    return {
        "status": "success",
        "metadata": {
            "title": title,
            "description": description,
            "environment": environment,
            "compliance_tier": compliance_tier,
            "location": location,
            "engine": "Python 3.10 Azure Architecture Engine v2.4",
            "arm_version": arm_version
        },
        "services_selected": [AZURE_CATALOG[sid] for sid in valid_services],
        "diagram": diagram_graph,
        "policy_as_code": policy_pack,
        "bicep": bicep_code,
        "arm_template": arm_template,
        "recommendations": [
            "Implementar Azure Defender for Cloud para postura de seguridad continua (CSPM).",
            "Activar Zone Redundancy en clúster AKS y Cosmos DB para SLA del 99.99% en Producción.",
            "Utilizar Azure AI Search con vectorización integrada para optimizar costos de ingestión RAG.",
            "Configurar Workload Identity en AKS para acceso sin credenciales a Key Vault y AI Foundry."
        ]
    }


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "--catalog":
        print(json.dumps(AZURE_CATALOG, indent=2))
        return

    # Read JSON payload from stdin
    try:
        raw_input = sys.stdin.read()
        if raw_input.strip():
            payload = json.loads(raw_input)
        else:
            # Default payload for testing
            payload = {
                "title": "Arquitectura RAG con AKS y Azure AI",
                "environment": "prod",
                "service_ids": ["aks", "cosmos_db", "ai_foundry", "ai_search", "key_vault", "front_door"]
            }
        result = build_full_solution(payload)
        print(json.dumps(result, indent=2))
    except Exception as e:
        err_res = {"status": "error", "message": str(e)}
        print(json.dumps(err_res), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
