module "api_gateway" {
  source                = "../../module/api-gateway/"
  service               = local.service
  deployment            = "20240328-2"
  switch_bot_invoke_arn = module.lambda_switchbot_webhook.invoke_arn
}

module "lambda_switchbot_webhook" {
  source                      = "../../module/lambda/webhook"
  service                     = local.service
  execution_arn               = module.api_gateway.execution_arn
  switchbot_device_table_arn  = module.dynamodb.switchbot_device_table.arn
  switchbot_device_table_name = module.dynamodb.switchbot_device_table.name
}

module "dynamodb" {
  source  = "../../module/dynamodb"
  service = local.service
}