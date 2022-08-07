import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnDestroy, OnChanges {
  @Input() widthClass: 'w400' | 'w600' | 'w800' | '' = '';
  @Input() renderModal = false;

  @Output() submitChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() closeChanged: EventEmitter<boolean> = new EventEmitter();

  @HostListener('scroll') onScroll(): void {
    document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
  }

  constructor() { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.renderModal) {
      if (changes.renderModal.currentValue) {
        this.openModal();
        console.log('changes', changes);
      } else {
        this.closeModal();
      }
    }
  }

  public openModal(): void {
    document.getElementById('dialog')?.classList.add('show');
    const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
    const body = document.body;
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}`;
  }

  public closeModal(): void {
    this.renderModal = false;

    const body = document.body;
    const scrollY = body.style.top;
    body.style.position = '';
    body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0', 0) * -1);
    document.getElementById('dialog')?.classList.remove('show');
  }

  public submitModal(): void {
    this.submitChanged.emit(true);
    this.closeModal();
  }

  public ngOnDestroy(): void {
    this.closeChanged.emit(this.renderModal);
    this.closeModal();
  }
}
