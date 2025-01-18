import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    imports: [CommonModule, LocalLocalizationModule]
})
export class LoaderComponent { 
  @Input() public size: 'small' | 'medium' | 'large' = 'medium';
}
