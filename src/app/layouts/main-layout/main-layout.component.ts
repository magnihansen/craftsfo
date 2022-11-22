import { CommonModule, DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import cssVars, { CSSVarsPonyfillOptions } from 'css-vars-ponyfill';

import { FooterComponent } from 'src/app/components/footer/footer.component';
import { NavigationComponent } from 'src/app/components/navigation/navigation.component';
import { DomainSetting } from 'src/app/models/domain-setting.model';
import { SettingService } from 'src/app/services/setting.service';
import { SettingValuePipe } from 'src/app/shared/pipes/settingvalue.pipe';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  imports: [CommonModule, SettingValuePipe, NavigationComponent, FooterComponent, RouterModule]
})
export class MainLayoutComponent implements AfterViewInit {
  public environment = environment;
  public showToTopButton = false;
  public bg_image_url?: string = '';
  public settings: DomainSetting[] = [];
  public option_variables: { [key: string]: string; } = {};

  constructor(
    @Inject(DOCUMENT) private document: Document,
    readonly settingService: SettingService
  ) {
    this.showToTopButton = this.hasScrollBar(this.document.body);
  }

  public ngAfterViewInit(): void {
    this.settingService.getDomainSettings().subscribe({
      next: (_settings: DomainSetting[]) => {
        this.settings = _settings;
        this.bg_image_url = _settings.find(s => s.key === 'background-image')?.value;
        _settings.filter(s => s.key.startsWith('--')).forEach((s: DomainSetting) => {
          this.option_variables[s.key] = s.value;
        });

        const options: CSSVarsPonyfillOptions = {
          watch: true,
          preserveStatic: false,
          preserveVars: false,
          variables: this.option_variables
        };
        cssVars(options);
      }
    });
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
