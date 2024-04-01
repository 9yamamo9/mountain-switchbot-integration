variable "service" {
  description = "My Service Name"
  type        = string
}

variable "switchbot_device_table_arn" {
  description = "Switchbot Device Table ARN"
  type        = string
}

variable "switchbot_device_table_name" {
  description = "Switchbot Device Table Name"
  type        = string
}

variable "switchbot_device_queue_arn" {
  description = "Switchbot Device Queue ARN"
  type        = string
}

variable "switchbot_device_queue_url" {
  description = "Switchbot Device Queue URL"
  type        = string
}

variable "slack_webhook_base_url" {
  description = "Slack Webhook Base URL"
  type        = string
}

variable "slack_channel_resource" {
  description = "Slack Channel Resource"
  type        = string

}

variable "enabled" {
  description = "Event Source Mapping is Enable"
  type        = bool
}