resource "aws_iam_role" "main" {
  name = "${var.service}-subscribe-event"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["sts:AssumeRole"]
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
  managed_policy_arns = ["arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"]
}

resource "aws_iam_role_policy" "main" {
  role = aws_iam_role.main.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
        ]
        Resource = [
          var.switchbot_device_table_arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "sqs:DeleteMessage",
          "sqs:ReceiveMessage",
        ]
        Resource = [
          var.switchbot_device_queue_arn
        ]
      }
    ]
  })
}
