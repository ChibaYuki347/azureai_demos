targetScope = 'subscription'

// The main bicep module to provision Azure resources.
// For a more complete walkthrough to understand how this file works with azd,
// see https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/make-azd-compatible?pivots=azd-create

@minLength(1)
@maxLength(64)
@description('Name of the the environment which is used to generate a short unique hash used in all resources.')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

// Optional parameters to override the default azd resource naming conventions.
// Add the following to main.parameters.json to provide values:
// "resourceGroupName": {
//      "value": "myGroupName"
// }
param resourceGroupName string = ''

var abbrs = loadJsonContent('./abbreviations.json')

// tags that should be applied to all resources.
var tags = {
  // Tag all resources with the environment name.
  'azd-env-name': environmentName
}

// Generate a unique token to be used in naming resources.
// Remove linter suppression after using.
#disable-next-line no-unused-vars
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))

// Name of the service defined in azure.yaml
// A tag named azd-service-name with this value should be applied to the service host resource, such as:
//   Microsoft.Web/sites for appservice, function
// Example usage:
//   tags: union(tags, { 'azd-service-name': apiServiceName })
#disable-next-line no-unused-vars
var appServiceName = 'app'

// openai parameters
param openAiServiceName string = ''
param openAiResourceGroupName string = ''
@description('Location for the OpenAI resource group')
@allowed(['canadaeast', 'eastus', 'eastus2', 'francecentral', 'switzerlandnorth', 'uksouth', 'japaneast', 'northcentralus','australiaeast'])
@metadata({
  azd: {
    type: 'location'
  }
})
param openAiResourceGroupLocation string

param openAiSkuName string = 'S0'

param chatGptDeploymentName string // Set in main.parameters.json
param chatGptDeploymentCapacity int = 30
param chatGptModelName string = 'gpt-35-turbo'
param chatGptModelVersion string = '0613'
param embeddingDeploymentName string // Set in main.parameters.json
param embeddingDeploymentCapacity int = 30
param embeddingModelName string = 'text-embedding-ada-002'


// USER ROLES
@description('Id of the service principal to assign application roles')
param PrincipalId string = ''

// Organize resources in a resource group
resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: !empty(resourceGroupName) ? resourceGroupName : '${abbrs.resourcesResourceGroups}${environmentName}'
  location: location
  tags: tags
}

resource openAiResourceGroup 'Microsoft.Resources/resourceGroups@2021-04-01' existing = if (!empty(openAiResourceGroupName)) {
  name: !empty(openAiResourceGroupName) ? openAiResourceGroupName : resourceGroupName
}

// Add resources to be provisioned below.
// A full example that leverages azd bicep modules can be seen in the todo-python-mongo template:
// https://github.com/Azure-Samples/todo-python-mongo/tree/main/infra

// App Service Plan
module appserviceplan './core/host/appserviceplan.bicep' = {
  name: 'appserviceplan'
  scope: rg
  params: {
    name: '${abbrs.webServerFarms}${resourceToken}'
    location: location
    sku: {
      name: 'B1'
      tier: 'Basic'
      size: 'B1'
      family: 'B'
      capacity: 1
    }
    tags: tags
  }
}

// App Services
module appservice './core/host/appservice.bicep' = {
  name: 'appservice'
  scope: rg
  params: {
    name: '${abbrs.webSitesAppService}${resourceToken}'
    location: location
    tags: union(tags, { 'azd-service-name': appServiceName })
    appServicePlanId: appserviceplan.outputs.id
    runtimeName: 'node'
    runtimeVersion: '18-lts'
    scmDoBuildDuringDeployment:true
    managedIdentity: true
    appSettings: {
      WEBSITES_CONTAINER_START_TIME_LIMIT: 1800
       // Shared by all OpenAI deployments
       AZURE_OPENAI_EMB_MODEL_NAME: embeddingModelName
       AZURE_OPENAI_CHATGPT_MODEL: chatGptModelName
       // Specific to Azure OpenAI
      AZURE_OPENAI_SERVICE: openai.outputs.name
      AZURE_OPENAI_CHATGPT_DEPLOYMENT: chatGptDeploymentName
      AZURE_OPENAI_EMB_DEPLOYMENT: embeddingDeploymentName
    }
  }
}


// OpenAI Service
module openai 'core/ai/cognitiveservices.bicep' = {
  name: 'openai'
  scope: rg
  params: {
    name: '${abbrs.cognitiveServicesAccounts}${resourceToken}-openai'
    location: openAiResourceGroupLocation
    tags: union(tags, { 'azd-service-name': 'openai' })
    sku: {
      name: openAiSkuName
    }
    deployments: [
      {
        name: chatGptDeploymentName
        model: {
          format: 'OpenAI'
          name: chatGptModelName
          version: chatGptModelVersion
        }
        sku: {
          name: 'Standard'
          capacity: chatGptDeploymentCapacity
        }
      }
      {
        name: embeddingDeploymentName
        model: {
          format: 'OpenAI'
          name: embeddingModelName
          version: '2'
        }
        capacity: embeddingDeploymentCapacity
      }
    ]
    kind: 'OpenAI'
  }
}

// AI Speech Service
module aispeech 'core/ai/cognitiveservices.bicep' = {
  name: 'aispeech'
  scope: rg
  params: {
    name: '${abbrs.cognitiveServicesAccounts}${resourceToken}-aispeech'
    location: location
    tags: tags
    sku: {
      name: 'S0'
    }
    kind: 'SpeechServices'
  }
}
// TODO: Add Authroization for OpenAI and AI Speech


// USER ROLES
// module openAiRoleUser 'core/security/role.bicep' = {
//   scope: openAiResourceGroup
//   name: 'openai-role-user'
//   params: {
//     principalId: PrincipalId
//     roleDefinitionId: '5e0bd9bd-7b93-4f28-af87-19fc36ad61bd'
//     principalType: 'User'
//   }
// }

// module aispeechRoleUser 'core/security/role.bicep' = {
//   scope: rg
//   name: 'aispeech-role-user'
//   params: {
//     principalId: PrincipalId
//     roleDefinitionId: 'a97b65f3-24c7-4388-baec-2e87135dc908'
//     principalType: 'User'
//   }
// }

// module openAiRoleUser 'core/security/role-assignment-resource-group.bicep' = {
//   name: 'openai-role-user'
//   scope: openAiResourceGroup
//   params: {
//     principalId: PrincipalId
//     roleName: 'Cognitive Services OpenAI User'
//     principalType: 'User'
//   }
// }

//SYSTEM IDENTITIES
// module openAiSystemIdentity 'core/security/role.bicep' = {
//   scope: openAiResourceGroup
//   name: 'openai-system-identity'
//   params: {
//     principalId: appservice.outputs.identityPrincipalId
//     roleDefinitionId: '5e0bd9bd-7b93-4f28-af87-19fc36ad61bd'
//     principalType: 'ServicePrincipal'
//   }
// }

// module aispeechSystemIdentity 'core/security/role.bicep' = {
//   scope: rg
//   name: 'aispeech-system-identity'
//   params: {
//     principalId: appservice.outputs.identityPrincipalId
//     roleDefinitionId: 'a97b65f3-24c7-4388-baec-2e87135dc908'
//     principalType: 'ServicePrincipal'
//   }
// }





// Add outputs from the deployment here, if needed.
//
// This allows the outputs to be referenced by other bicep deployments in the deployment pipeline,
// or by the local machine as a way to reference created resources in Azure for local development.
// Secrets should not be added here.
//
// Outputs are automatically saved in the local azd environment .env file.
// To see these outputs, run `azd env get-values`,  or `azd env get-values --output json` for json output.
output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId

