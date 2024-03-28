variable "service" {
  description = "My Service Name"
  type        = string
}

variable "deployment" {
  description = "Redeployment Flags"
  type        = string
}

variable "switch_bot_invoke_arn" {
  description = "The Lambda Function ARN For Switchbot Webhook"
  type        = string
}