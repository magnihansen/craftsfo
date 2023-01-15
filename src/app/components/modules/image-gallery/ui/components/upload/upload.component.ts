import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileExtensionIconPipe } from '../../pipes/extension-to-icon.pipe';
import { DisplayFile } from '../../models/display-file.model';
import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule, 
    FileExtensionIconPipe,
    LocalLocalizationModule,
    FileExtensionIconPipe,
    ModalComponent
  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @Input() public limit = 4;
  @Input() public maxSize = 10485760;
  @Input() public imageOnly = false;
  @Input() public viewOnly = false;
  @Input() public multiple = false;
  @Input() public showPreview = true;
  @Input() public fileSource: DisplayFile[] = [];

  @Output() public selectedImageChange = new EventEmitter<DisplayFile>();
  @Output() public fileSourceChange = new EventEmitter<any[]>();

  public isLoading = false;
  public currentFileTitle = '';
  public currentFileBase64 = '';
  public currentType = '';
  public set showPreviewModal(value: boolean) {
    if (this._showPreviewModal !== value) {
      this._showPreviewModal = value;
      if (this.lastFocusedImageElement && !this._showPreviewModal) {
        setTimeout(() => {
          this.lastFocusedImageElement?.focus();
        }, 0);
      }
    }
  }
  public get showPreviewModal() {
    return this._showPreviewModal;
  }
  
  private _showPreviewModal = false;
  private lastFocusedImageElement?: HTMLDivElement;

  constructor() { }

  ngOnInit(): void {
  }

  public removeUploadedFile(file: any): void {
    if (file.id && !this.isLoading) {
      this.fileSource.splice(this.fileSource.indexOf(file), 1);
    } 
  }

  public openPreview(title: string, b64: string | undefined, type: string, focusedImageElement: HTMLDivElement, isUploaded: boolean = false): void {
    this.lastFocusedImageElement = focusedImageElement;
    this.currentFileTitle = title;
    if (b64) {
      if (isUploaded) {
        this.currentFileBase64 = `data:${type};base64,${b64}`;
      } else {
        this.currentFileBase64 = b64?.toString();
      }
    }
    this.currentType = type;
    this.showPreviewModal = true;
  }

  public removeFile(index: number): void {
    if (!this.isLoading) {
      this.fileSource.splice(index, 1);
    }
  }

  public chooseAttachments(fileInput: any): void {
    debugger;
    let files: File[] = [...fileInput.files];
    if (files.length > this.limit || this.fileSource.length + files.length > this.limit) {
      let difference = this.limit;
      if (this.fileSource.length + files.length >= this.limit) {
        difference = this.limit - this.fileSource.length;
      }
      files.splice(difference);
      // toast error - file limit reached
    }

    files.forEach((file: File) => {
      if (file.size < this.maxSize) {
        let reader = new FileReader();
        let res!: string | ArrayBuffer | null;
        reader.readAsDataURL(file);
        reader.onload = () => {
          res = reader.result;
        };

        setTimeout(() => {
          let base64 = res?.toString();
          let attachment: DisplayFile = <DisplayFile>file;
          attachment.base64 = base64;
          this.fileSource = [...this.fileSource, attachment];
          this.fileSourceChange.emit(this.fileSource);
        }, 250);
      } else {
        // toast error - files to large
        return;
      }
    });
  }

  public download(file: DisplayFile): void {
    const arr = file.base64!.split(',');
    const base64: Uint8Array = this.base64ToArrayBuffer(arr[1]);
    const blob: Blob = new Blob([base64], { type: file.type });
    const downloadUrl: string = URL.createObjectURL(blob);

    if (blob.type !== 'application/octet-stream' && !blob.type.includes('.')) {
      window.open(downloadUrl);
    } else {
      let link: HTMLAnchorElement = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.name;
      link.click();
    }
  }

  private base64ToArrayBuffer(base64: any): Uint8Array {
    const binaryString: string = window.atob(base64);
    const binaryLen: number = binaryString.length;
    const bytes: Uint8Array = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii: number = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
}
