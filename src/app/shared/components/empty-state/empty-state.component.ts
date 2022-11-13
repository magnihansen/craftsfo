import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule,LocalLocalizationModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent implements OnInit {
  @Input() emptyStateKey: string = 'warning.no-results';
  constructor() { }

  ngOnInit(): void {
  }

}
