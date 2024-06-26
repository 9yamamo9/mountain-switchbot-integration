variable "service" {
  description = "My Service Name"
  type        = string
}

variable "execution_arn" {
  description = "API Gateway Execution ARN"
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