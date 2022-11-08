import { Component, Input, OnInit } from '@angular/core';

import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { Page } from 'src/app/models/page.model';
import { ContentWrapperComponent } from 'src/app/shared/components/content-wrapper/content-wrapper.component';

@Component({
  standalone: true,
  selector: 'app-frontend',
  templateUrl: './frontend.component.html',
  styleUrls: ['./frontend.component.scss'],
  imports: [ LocalLocalizationModule, ContentWrapperComponent ]
})
export class FrontendComponent implements OnInit {
  @Input() public data: any;

  constructor() { }

  ngOnInit(): void {
    if (this.data) {
      console.log('Frontend : Data', this.data);
    }
  }
}
