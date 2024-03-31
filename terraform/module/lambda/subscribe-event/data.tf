data "archive_file" "this" {
  type        = "zip"
  source_dir  = "${path.cwd}/build/subscribe-event"
  output_path = "${path.module}/out/function.zip"
}