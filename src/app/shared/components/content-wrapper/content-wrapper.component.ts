import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-content-wrapper',
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.scss'],
  imports: [ CommonModule ]
})
export class ContentWrapperComponent {
  @Input() public alignContent: 'left' | 'center' | 'right' = 'left';  
}
