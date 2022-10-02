import { DOCUMENT } from '@angular/common';
import { Component, ContentChild, EventEmitter, HostListener, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges, TemplateRef, ViewChildren } from '@angular/core';
import { Form } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnDestroy, OnChanges {
  @ViewChildren('input') private viewInput!: any;
  @ContentChild('input') private contentInput!: any;

  @Input() modalContent!: TemplateRef<any>;
  @Input() widthClass: 'w400' | 'w600' | 'w800' | 'fit-content' = 'fit-content';
  @Input() renderModal = false;
  @Input() modalTitle = '';

  @Output() submitChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() closeChanged: EventEmitter<boolean> = new EventEmitter();

  @HostListener('scroll') onScroll(): void {
    document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent): void {
    if (this.renderModal) {
      this.closeModal();
    }
  }

  constructor(
    @Inject(DOCUMENT) private modalDocument: Document
  ) {}

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

    // const inputs: HTMLCollectionOf<HTMLInputElement> = this.modalDocument.getElementsByTagName('input');
    // console.log('On modal', document);

    console.log(this.modalDocument);
    console.log('viewInput', this.viewInput);
    console.log('contentInput', this.contentInput);
    console.log('modalContent', this.modalContent);
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
    this.closeModal();
  }
}
