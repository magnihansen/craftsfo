import { Renderer2 } from "@angular/core";
import { NonceService } from "src/app/services/nonce.service";

export function ServiceProviderFactory(
  nonceService: NonceService
) {
    return () => {
      nonceService.addNonceToDynamicallyAddedScripts();
    }
  }