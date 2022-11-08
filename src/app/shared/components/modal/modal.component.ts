import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, ContentChild, EventEmitter, HostListener, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges, TemplateRef, ViewChildren } from '@angular/core';
import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';

@Component({
  standalone: true,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [CommonModule, LocalLocalizationModule]
})
export class ModalComponent implements OnDestroy, OnChanges {
  @Input() modalContent!: TemplateRef<any>;
  @Input() widthClass: 'w400' | 'w600' | 'w800' | 'fit-content' = 'fit-content';
  @Input() renderModal = false;
  @Input() modalTitle = '';
  @Input() isRootModalWithoutNestedModal = false;
  @Input() isNestedModal = false;
  @Input() modalId = '';

  @Output() submitChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() closeChanged: EventEmitter<boolean> = new EventEmitter();

  @HostListener('scroll') onScroll(): void {
    document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
  }

  @HostListener('document:keydown.escape', ['$event']) 
  public onKeydownHandler(event: KeyboardEvent): void {
    if (this.isNestedModal || this.isRootModalWithoutNestedModal) {
      if (this.renderModal) {
        this.closeModal();
        this.isNestedModal = false;
      }
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.renderModal) {
      if (!changes.renderModal.firstChange && changes.renderModal.currentValue !== changes.renderModal.previousValue) {
        if (changes.renderModal.currentValue) {
          this.openModal();
        }
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

    this.closeChanged.emit(true);
  }

  public submitModal(): void {
    this.submitChanged.emit(true);
    this.closeModal();
  }

  public ngOnDestroy(): void {
    if (this.renderModal) {
      this.closeModal();
    }
  }
}
