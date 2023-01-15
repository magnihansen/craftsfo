import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControlStatus, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { Page } from 'src/app/models/page.model';
import { ContentWrapperComponent } from 'src/app/shared/components/content-wrapper/content-wrapper.component';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { UploadAdapter } from 'src/app/shared/upload-adapter.class';
import { ImageGallery } from '../../models/image-gallery.model';
import { ImageGalleryType } from '../../models/image-gallery-type.model';
import { ImageGalleryService } from '../../services/image-gallery.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { I18nPipe } from 'src/app/localization/i18n.pipe';
import { ImageGalleryTypeService } from '../../services/image-gallery-type.service';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from 'src/app/localization/i18n.service';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DisableControlDirective } from 'src/app/shared/directives/disable-control.directive';
import { CdnService } from '../../services/cdn.service';
import { DisplayFile } from '../../models/display-file.model';
import { UploadComponent } from '../upload/upload.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
  standalone: true,
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.scss'],
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    ContentWrapperComponent, 
    LocalLocalizationModule,
    ModalComponent,
    CKEditorModule,
    UploadComponent,
    FileUploadComponent,
    DisableControlDirective
  ],
  providers: [
    I18nPipe,
    ImageGalleryService, 
    ImageGalleryTypeService,
    CdnService
  ]
})
export class BackendComponent implements OnInit {
  @Input() public data: any;
  @Input() public formGroup: FormGroup = new FormGroup({});

  @Output() public galleryCreated: EventEmitter<boolean> = new EventEmitter();

  public classicEditor = ClassicEditor;
  public imageGalleries: ImageGallery[] = [];
  public imageGalleryTypes: ImageGalleryType[] = [];
  public bShowCreateGalleryModal = false;
  public bShowCreateTypeModal = false;
  public isRootModalWithoutNestedModal = false;
  public formImageGalleryAdd: FormGroup = new FormGroup({});
  public formGalleryTypeAdd: FormGroup = new FormGroup({});
  public imageGalleryFiles: File[] = [];
  public isCollectionLoading = false;
  public collectionValue = -1;

  public fileLimit = 10;
  public maxFileSize = 10485760;
  public chosenFiles: DisplayFile[] = [];
  public isLoading = false;

  private galleryTypeStatus = false;
  private galleryTypeData: Object = {};

  constructor(
    readonly imageGalleryService: ImageGalleryService,
    readonly imageGalleryTypeService: ImageGalleryTypeService,
    readonly cdnService: CdnService,
    readonly fb: FormBuilder,
    readonly toastr: ToastrService,
    readonly i18nService: I18nService,
    readonly authService: AuthenticationService
  ) {
    this.buildForms();
  }

  ngOnInit(): void {
    if (this.data) {
      if ((this.data as Page).pageTypeId === 47) {
        this.imageGalleryService.getImageGalleries().subscribe({
          next: (ig: ImageGallery[]) => {
            this.imageGalleries = ig;
          }
        });
      }
    } else {
      console.log('Backend data NOT loaded!');
    }

    this.imageGalleryTypeService.getImageGalleryTypes().subscribe({
      next: (it: ImageGalleryType[]) => {
        this.imageGalleryTypes = it;
      }
    });
  }

  private buildForms(): void {
    this.formImageGalleryAdd = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', []],
      imageGalleryTypeId: [-1, [Validators.pattern(/^[0-9]+$/),Validators.required]],
      imageTemplateId: [1, [Validators.pattern(/^[0-9]+$/),Validators.required]],
    });
    
    this.formGalleryTypeAdd = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.formGalleryTypeAdd.valueChanges.subscribe((obj: any) => {
      if (this.galleryTypeStatus) {
        this.galleryTypeData = obj;
      }
    });

    this.formGalleryTypeAdd.statusChanges.subscribe((fcs: FormControlStatus) => {
      this.galleryTypeStatus = fcs === "VALID";
    });
  };

  public onReady(eventData: any) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader: any) {
      console.log(btoa(loader.file));
      return new UploadAdapter(loader);
    };
  }

  public addImageGallery(isSubmitted: boolean): void {
    if (isSubmitted) {
      if (this.authService.IsUserLoggedIn) {
        const user: User = this.authService.getUser();
        const _name: string = this.formImageGalleryAdd.controls.name.value as string;
        const _description: string = this.formImageGalleryAdd.controls.description.value as string;
        const _imageTypeId: number = this.formImageGalleryAdd.controls.imageGalleryTypeId.value as number;
  
        const ig: ImageGallery = {
          name: _name,
          description: _description,
          imageTemplateId: 1,
          imageGalleryTypeId: _imageTypeId,
          createdBy: user.username
        } as ImageGallery;
  
        this.imageGalleryService.insertImageGallery(ig).subscribe({
          next: (res: boolean) => {
            if (res) {
              this.toastr.success(
                this.i18nService.getTranslation('common.x-created', { x: this.i18nService.getTranslation('imagegallery') })
              );
              this.galleryCreated.emit(true);
              this.bShowCreateGalleryModal = false;
            } else {
              this.toastr.error(
                this.i18nService.getTranslation('error.creating-x', { x: this.i18nService.getTranslation('imagegallery') })
              );
            }
          },
          error: (err: any) => {
            alert(err);
          }
        });
      }
    } else {
      this.toastr.error(
        this.i18nService.getTranslation('error.user-unauthorized')
      );
    }
  }

  public insertImageType(isSubmitted: boolean): void {
    if (isSubmitted && this.galleryTypeData) {
      const igt: ImageGalleryType = this.galleryTypeData as ImageGalleryType;
      this.imageGalleryTypeService.insertImageGalleryType(igt).subscribe({
        next: (res: boolean) => {
          if (res) {
            this.imageGalleryTypes = [...this.imageGalleryTypes, igt];
            this.toastr.success(
              this.i18nService.getTranslation('common.x-created', { x: this.i18nService.getTranslation('imagegallery.imagegallerytype') })
            );
            this.bShowCreateTypeModal = false;
          } else {
            this.toastr.error(
              this.i18nService.getTranslation('error.creating-x', { x: this.i18nService.getTranslation('imagegallery.imagegallerytype') })
            );
          }
        },
        error: (err: any) => {
          alert(err);
        }
      });
      this.formGalleryTypeAdd.reset();
    } else {
      alert('Form not valid');
    }
  }

  public showCreateGalleryModal($event: MouseEvent): void {
    $event.stopPropagation();

    if (!this.bShowCreateGalleryModal) {
      this.bShowCreateGalleryModal = true;
    }
  }

  public closeCreateGalleryModal(): void {
    this.bShowCreateGalleryModal = false;
  }

  public showCreateTypeModal($event: MouseEvent): void {
    $event.stopPropagation();

    if (!this.bShowCreateTypeModal) {
      this.bShowCreateTypeModal = true;
      this.isRootModalWithoutNestedModal = false;
    }
  }

  public onImageGalleryChange(imageGallery: any): void {
    // fetch images for showcase from Image CDN
    this.isCollectionLoading = true;
    this.collectionValue = +imageGallery.value;
    
    if (this.collectionValue !== -1) {
      this.cdnService.getImageCollection(this.collectionValue).subscribe({
        next: (files: File[]) => {
          this.imageGalleryFiles = files;
          this.isCollectionLoading = false;
        },
        error: (err: any) => {
          console.log(err);
          this.isCollectionLoading = false;
        }
      });
    }
  }

  public closeCreateTypeModal(event: boolean): void {
    if (event) {
      this.isRootModalWithoutNestedModal = true;
      this.bShowCreateTypeModal = false;
    }
  }

  public startedUploadingFiles(): void {
    this.isLoading = true;
  }

  public finishedUploading(): void {
    this.isLoading = false;
  }
}
