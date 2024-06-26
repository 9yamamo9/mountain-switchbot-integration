resource "aws_lambda_function" "this" {
  function_name    = "${var.service}-switchbot-webhook"
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
    }
  }
}

resource "aws_lambda_permission" "this" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.this.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.execution_arn}/*/POST/webhook"
}