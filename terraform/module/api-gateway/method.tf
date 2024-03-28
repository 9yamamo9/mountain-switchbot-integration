resource "aws_api_gateway_method" "webhook" {
  authorization = "NONE"
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.webhook.id
  http_method   = "POST"
}