import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() widthClass = '';

  constructor() { }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }
}
