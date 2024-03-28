resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  triggers = {
    create_before_destroy = true
  }
  depends_on = [
    aws_api_gateway_integration.webhook
  ]
}