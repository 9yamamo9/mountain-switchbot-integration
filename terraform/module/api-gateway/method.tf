resource "aws_api_gateway_method" "webhook" {
  authorization = "NONE"
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.webhook.id
  http_method   = "POST"
}

resource "aws_api_gateway_method" "post_remote_controls_turn_off" {
  authorization = "NONE"
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.remote_controls_turn_off.id
  http_method   = "POST"
}