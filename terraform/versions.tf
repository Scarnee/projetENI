terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 3.75.0" # ou la dernière stable
    }
  }
  required_version = ">= 1.5.0"
}
