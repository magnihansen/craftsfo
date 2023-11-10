import { DomainSetting } from "src/app/models/domain-setting.model";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { SettingService } from "src/app/services/setting.service";

export function DomainSettingFactory(
    settingService: SettingService,
    localStorageService: LocalStorageService
  ): () => Promise<void> {
    return () =>
      new Promise((resolve) => {
        const domainSettings: any = localStorageService.getWithExpiry(settingService.domainSettingKey);
        if (domainSettings) {
          settingService.setCssVariables(domainSettings);
          // settingService.loadCSS(domainSettings);
          resolve();
        } else {
          settingService.getDomainSettings().subscribe({
            next: (_settings: DomainSetting[]) => {
              settingService.setCssVariables(_settings);
              // settingService.loadCSS(_settings);
              localStorageService.setWithExpiry(settingService.domainSettingKey, _settings, 3600000 * 8);
              resolve();
            },
            error: () => resolve()
          });
        }
      });
  }