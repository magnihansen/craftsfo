import { ServiceProvider } from "src/app/services/provider.service";

export function ServiceProviderFactory(provider: ServiceProvider) {
    return () => provider.setNonce();
  }