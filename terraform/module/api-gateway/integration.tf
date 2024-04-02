resource "aws_api_gateway_integration" "webhook" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.webhook.id
  http_method             = aws_api_gateway_method.webhook.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = var.switch_bot_invoke_arn
}

resource "aws_api_gateway_integration" "post_remote_controls_turn_off" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.remote_controls_turn_off.id
  http_method             = aws_api_gateway_method.post_remote_controls_turn_off.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = var.nature_remo_invoke_arn
}