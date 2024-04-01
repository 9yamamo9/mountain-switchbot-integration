resource "aws_lambda_function" "this" {
  function_name    = "${var.service}-subscribe-event"
  role             = aws_iam_role.main.arn
  filename         = data.archive_file.this.output_path
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  timeout          = 29
  source_code_hash = data.archive_file.this.output_base64sha256
  environment {
    variables = {
      SWITCHBOT_DEVICE_TABLE_NAME = var.switchbot_device_table_name
      SWITCHBOT_DEVICE_QUEUE_URL  = var.switchbot_device_queue_url
      SLACK_WEBHOOK_BASE_URL      = var.slack_webhook_base_url
      SLACK_CHANNEL_RESOURCE      = var.slack_channel_resource
    }
  }
}

resource "aws_lambda_event_source_mapping" "this" {
  function_name    = aws_lambda_function.this.arn
  event_source_arn = var.switchbot_device_queue_arn
  enabled          = var.enabled
}