resource "aws_api_gateway_rest_api" "this" {
  name = "${var.service}-switchbot-integration"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}