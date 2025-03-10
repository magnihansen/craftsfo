import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FooterComponent } from 'src/app/components/footer/footer.component';
import { NavigationComponent } from 'src/app/components/navigation/navigation.component';
import { DomainSetting } from 'src/app/models/domain-setting.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SettingService } from 'src/app/services/setting.service';
import { SettingValuePipe } from 'src/app/shared/pipes/settingvalue.pipe';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss'],
    imports: [CommonModule, NavigationComponent, FooterComponent, RouterModule]
})
export class MainLayoutComponent implements OnInit {
  public environment = environment;
  public showToTopButton = false;
  public bg_image_url?: string = '';
  public settings: DomainSetting[] = [];
  public option_variables: { [key: string]: string; } = {};

  constructor(
    @Inject(DOCUMENT) private document: Document,
    readonly settingService: SettingService,
    readonly authService: AuthenticationService,
    private localStorageService: LocalStorageService
  ) {
    this.showToTopButton = this.hasScrollBar(this.document.body);
  }
  ngOnInit(): void {
    const domainSettings: DomainSetting[] = this.localStorageService.getWithExpiry(this.settingService.domainSettingKey) || [];
    if (domainSettings) {
      this.setDomainSettingValues(domainSettings);
    } else {
      this.settingService.getDomainSettings().subscribe({
        next: (_domainSettings: DomainSetting[]) => {
          this.setDomainSettingValues(_domainSettings);
          this.settingService.setCssVariables(_domainSettings);
          this.localStorageService.setWithExpiry(this.settingService.domainSettingKey, _domainSettings, 3600000 * 8);
        }
      });
    }
  }

  private setDomainSettingValues(domainSettings: DomainSetting[]): void {
    this.settings = domainSettings;
    this.bg_image_url = domainSettings.find(s => s.key === 'background-image')?.value;
  }

  private hasScrollBar = (element: any) => {
    const {scrollTop} = element;
    if (scrollTop > 0) {
      return true;
    }
    element.scrollTop += 10;
    if (scrollTop === element.scrollTop) {
      return false;
    }
    // undoing the change
    element.scrollTop = scrollTop;
    return true;
  }
}

interface IKey {
  key: string;
}
