import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import plupload from 'plupload';
import { GlobalVariables } from 'src/app/shared/global-variables';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    LocalLocalizationModule
  ],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @ViewChild('pluploader', { static: true }) element!: ElementRef;
  @ViewChild('pluploadcontainer', { static: true }) containerElement!: ElementRef;
  @ViewChild('createDropZone', { static: true }) containerDropZone!: ElementRef;

  @Input() public tableIsLoading = false;
  @Input() public domainId = -1;
  @Input() public imageGalleryId = -1;
  
  @Output() public percentageDone: EventEmitter<number> = new EventEmitter<number>();
  @Output() public uploading: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public fileUploaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  public uploader!: plupload.Uploader;
  public totalFileSize = 0;
  public fileSizeAdded = 0;
  public addedPercent = 0;
  public currFileId = '';

  private apiPath = '/V1/Cdn';

  constructor(
    @Inject('CDN_URL') private cdnUrl: string,
    readonly authenticationService: AuthenticationService
  ) {
    if (!localStorage.getItem(GlobalVariables.CDN_TOKEN)) {
      this.authenticationService.getCdnToken().subscribe({
        next: (token: string) => {
          localStorage.setItem(GlobalVariables.CDN_TOKEN, token);
        }
      });
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem(GlobalVariables.CDN_TOKEN)) {
      this.initializePlupload();
    } else {
      alert('CDN token not created!');
    }
  }

  private initializePlupload(): void {
    this.uploader = new plupload.Uploader({
      runtimes: 'html5',
      browse_button: this.element.nativeElement,
      container: this.containerElement.nativeElement,
      chunk_size: '10mb',
      url: `${this.cdnUrl}${this.apiPath}/InsertImage/${this.imageGalleryId}`,
      headers: { 
        Authorization: `Bearer ${localStorage.getItem(GlobalVariables.CDN_TOKEN)}`
      },
      filters: {
        max_file_size: '10mb',
        prevent_duplicates: true
      }
    });

    this.uploader.init();

    this.uploader.bind('FilesAdded', (up: any, f: any) => {
      this.uploading.emit(false);
      this.uploader.disableBrowse(true);
      this.beginUploading();
    });

    this.uploader.bind('Error', (up: any, f: any) => {
      alert(f);
    });

    this.uploader.bind('beforeUpload', (up: any, f: any) => {
      this.getFilesAdded(up);
    });

    this.uploader.bind('BeforeChunkUpload', (up: plupload.Uploader, file: any, post: any, info: any) => {
      post.total_filesize = file.size;
      this.currFileId = file.id;
      this.fileSizeAdded = this.fileSizeAdded + info.size;
      this.addedPercent = this.addedPercent + ((100 * this.fileSizeAdded) / this.totalFileSize)
    });

    this.uploader.bind('UploadComplete', (up: any, f: any) => {
      this.addedPercent = 100;
      this.percentageDone.emit(this.addedPercent);
      this.fileUploaded.emit(false);
      this.resetPlupload();
    });
  }

  private beginUploading(): void {
    if (this.uploader.files && this.uploader.files.length) {
      this.uploader.settings.multipart_params = this.getGroupParameters();
      this.uploader.start();
    } else {
      this.fileUploaded.emit(true);
    }
  }

  private getFilesAdded(uploader: plupload.Uploader): void {
    uploader.files.forEach((f: any) => {
      this.totalFileSize = this.totalFileSize + f.size
    });
  }

  private getGroupParameters(): object {
    return {
      domainId: this.domainId
    };
  }

  private removeImageFromPluploader(file: any): void {
    this.uploader.removeFile(file);
  }

  private resetPlupload(): void {
    if (this.uploader) {
      this.uploader.unbindAll();
      this.uploader.refresh();
      this.uploader.destroy();
      this.initializePlupload();
    }
  }
}
