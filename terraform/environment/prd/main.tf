module "api_gateway" {
  source  = "../../module/api-gateway/"
  service = local.service
}