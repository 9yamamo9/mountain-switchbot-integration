resource "aws_sqs_queue" "switchbot_device" {
  name                    = "${var.service}-switchbot-device"
  sqs_managed_sse_enabled = true
  delay_seconds           = 900
}
