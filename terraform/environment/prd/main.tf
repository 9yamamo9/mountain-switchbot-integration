module "api_gateway" {
  source                 = "../../module/api-gateway/"
  service                = local.service
  deployment             = "20240328-2"
  switch_bot_invoke_arn  = module.lambda_switchbot_webhook.invoke_arn
  nature_remo_invoke_arn = module.lambda_nature_remo.invoke_arn
}

module "lambda_switchbot_webhook" {
  source                      = "../../module/lambda/webhook"
  service                     = local.service
  execution_arn               = module.api_gateway.execution_arn
  switchbot_device_table_arn  = module.dynamodb.switchbot_device_table.arn
  switchbot_device_table_name = module.dynamodb.switchbot_device_table.name
  switchbot_device_queue_arn  = module.sqs.switchbot_device_queue.arn
  switchbot_device_queue_url  = module.sqs.switchbot_device_queue.url
}

module "lambda_subscribe_event" {
  source                      = "../../module/lambda/subscribe-event"
  service                     = local.service
  enabled                     = true
  switchbot_device_queue_arn  = module.sqs.switchbot_device_queue.arn
  switchbot_device_queue_url  = module.sqs.switchbot_device_queue.url
  switchbot_device_table_arn  = module.dynamodb.switchbot_device_table.arn
  switchbot_device_table_name = module.dynamodb.switchbot_device_table.name
  slack_channel_resource      = var.slack_channel_resource
  slack_webhook_base_url      = var.slack_webhook_base_url
}

module "lambda_nature_remo" {
  source        = "../../module/lambda/nature-remo"
  service       = local.service
  execution_arn = module.api_gateway.execution_arn
}

module "dynamodb" {
  source  = "../../module/dynamodb"
  service = local.service
}

module "sqs" {
  source  = "../../module/sqs"
  service = local.service
}