import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,LocalLocalizationModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() public pageNameKey: string = '';
  @Input() public addItemKey: string = '';

  @Output() public addClicked = new EventEmitter<void>(); 

  public add() {
    this.addClicked.emit();
  }

}
