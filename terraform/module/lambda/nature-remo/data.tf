data "archive_file" "this" {
  type        = "zip"
  source_dir  = "${path.cwd}/apps/nature-remo/src/.build"
  output_path = "${path.module}/out/function.zip"
}