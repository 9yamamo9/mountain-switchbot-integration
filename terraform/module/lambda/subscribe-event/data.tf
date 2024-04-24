data "archive_file" "this" {
  type        = "zip"
  source_dir  = "${path.cwd}/artifacts/subscribe-event/src/.build"
  output_path = "${path.module}/out/function.zip"
}