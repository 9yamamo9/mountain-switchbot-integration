resource "aws_dynamodb_table" "switchbot_device" {
  name         = "${var.service}-switchbot-device"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "Id"
  attribute {
    name = "Id"
    type = "S"
  }
}