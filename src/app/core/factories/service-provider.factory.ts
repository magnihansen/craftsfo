import { NonceService } from "src/app/services/nonce.service";

export function ServiceProviderFactory(
  nonceService: NonceService
) {
    return () => {
      nonceService.addNonceToDynamicallyAddedScripts();
    }
  }