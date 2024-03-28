resource "aws_api_gateway_integration" "webhook" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.webhook.id
  http_method             = aws_api_gateway_method.webhook.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = "" // FIXME: when a lambda function is created
}