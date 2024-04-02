resource "aws_lambda_function" "this" {
  function_name    = "${var.service}-nature-remo"
  role             = aws_iam_role.main.arn
  filename         = data.archive_file.this.output_path
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  timeout          = 29
  source_code_hash = data.archive_file.this.output_base64sha256
}

resource "aws_lambda_permission" "this" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.this.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.execution_arn}/*/POST/remote_controls/turn_off"
}