targetScope = 'resourceGroup'

@description('Azure region for all resources in this deployment.')
param location string = resourceGroup().location

@description('App Service plan name.')
param appServicePlanName string

@description('Backend Web App name.')
param backendWebAppName string

@description('App Service plan SKU name. Use B1/S1/P1v3 based on budget and class requirements.')
@allowed([
  'B1'
  'S1'
  'P1v3'
])
param appServicePlanSkuName string = 'B1'

@description('App Service plan instance count.')
@minValue(1)
param appServicePlanSkuCapacity int = 1

@description('Set true only if you want this template to create a SQL Server + SQL Database.')
param createSqlResources bool = false

@description('SQL Server name. Use your existing server name when createSqlResources is false. Example: jake-1293.')
param sqlServerName string = ''

@description('SQL Database name. Use your existing database name when createSqlResources is false. Example: Gatorade.')
param sqlDatabaseName string = ''

@description('SQL admin login used only when createSqlResources is true.')
param sqlAdminLogin string = ''

@secure()
@description('SQL admin password used only when createSqlResources is true. Do not commit real values.')
param sqlAdminPassword string = ''

@description('SQL Database SKU name used only when createSqlResources is true.')
param sqlDatabaseSkuName string = 'Basic'

@description('Allowed frontend origins for backend CORS as a comma-separated app setting value.')
param corsAllowedOrigins array = []

@description('JWT issuer for backend app settings.')
param jwtIssuer string = 'BuckeyeMarketplace'

@description('JWT audience for backend app settings.')
param jwtAudience string = 'BuckeyeMarketplaceClient'

@secure()
@description('Optional JWT key placeholder. Prefer setting in App Service Configuration after deployment.')
param jwtKey string = ''

@secure()
@description('Optional DefaultConnection placeholder. Prefer setting in App Service Connection Strings/Configuration after deployment.')
param defaultConnectionString string = ''

var hasExistingSqlReferences = !createSqlResources && !empty(sqlServerName) && !empty(sqlDatabaseName)

var baseAppSettings = [
  {
    name: 'ASPNETCORE_ENVIRONMENT'
    value: 'Production'
  }
  {
    name: 'Jwt__Issuer'
    value: jwtIssuer
  }
  {
    name: 'Jwt__Audience'
    value: jwtAudience
  }
  {
    name: 'CORS__AllowedOrigins'
    value: join(corsAllowedOrigins, ',')
  }
]

var optionalJwtKeySetting = empty(jwtKey)
  ? []
  : [
      {
        name: 'Jwt__Key'
        value: jwtKey
      }
    ]

var optionalConnectionSetting = empty(defaultConnectionString)
  ? []
  : [
      {
        name: 'ConnectionStrings__DefaultConnection'
        value: defaultConnectionString
      }
    ]

var optionalExistingSqlReferenceSettings = hasExistingSqlReferences
  ? [
      {
        name: 'Sql__ExistingServerName'
        value: sqlServerName
      }
      {
        name: 'Sql__ExistingDatabaseName'
        value: sqlDatabaseName
      }
    ]
  : []

resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  kind: 'linux'
  sku: {
    name: appServicePlanSkuName
    tier: appServicePlanSkuName == 'B1' ? 'Basic' : appServicePlanSkuName == 'S1' ? 'Standard' : 'PremiumV3'
    capacity: appServicePlanSkuCapacity
  }
  properties: {
    reserved: true
  }
}

resource backendApp 'Microsoft.Web/sites@2023-12-01' = {
  name: backendWebAppName
  location: location
  kind: 'app,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'DOTNETCORE|8.0'
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      http20Enabled: true
      alwaysOn: appServicePlanSkuName != 'B1'
      appSettings: concat(
        baseAppSettings,
        optionalJwtKeySetting,
        optionalConnectionSetting,
        optionalExistingSqlReferenceSettings
      )
    }
  }
}

resource sqlServer 'Microsoft.Sql/servers@2023-08-01-preview' = if (createSqlResources) {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: sqlAdminLogin
    administratorLoginPassword: sqlAdminPassword
    version: '12.0'
    publicNetworkAccess: 'Enabled'
    minimalTlsVersion: '1.2'
  }
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2023-08-01-preview' = if (createSqlResources) {
  parent: sqlServer
  name: sqlDatabaseName
  location: location
  sku: {
    name: sqlDatabaseSkuName
    tier: sqlDatabaseSkuName == 'Basic' ? 'Basic' : 'Standard'
  }
  properties: {}
}

resource existingSqlServer 'Microsoft.Sql/servers@2023-08-01-preview' existing = if (hasExistingSqlReferences) {
  name: sqlServerName
}

resource existingSqlDatabase 'Microsoft.Sql/servers/databases@2023-08-01-preview' existing = if (hasExistingSqlReferences) {
  parent: existingSqlServer
  name: sqlDatabaseName
}

output backendWebAppName string = backendApp.name
output backendWebAppUrl string = 'https://${backendApp.properties.defaultHostName}'
output sqlServerReference string = createSqlResources ? sqlServer.name : (hasExistingSqlReferences ? existingSqlServer.name : '')
output sqlDatabaseReference string = createSqlResources ? sqlDatabase.name : (hasExistingSqlReferences ? existingSqlDatabase.name : '')
