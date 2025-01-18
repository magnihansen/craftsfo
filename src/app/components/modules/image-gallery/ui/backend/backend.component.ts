import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControlStatus, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { Page } from 'src/app/models/page.model';
import { ContentWrapperComponent } from 'src/app/shared/components/content-wrapper/content-wrapper.component';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { UploadAdapter } from 'src/app/shared/upload-adapter.class';
import { ImageGallery } from '../models/image-gallery.model';
import { ImageGalleryType } from '../models/image-gallery-type.model';
import { ImageGalleryService } from '../services/image-gallery.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { I18nPipe } from 'src/app/localization/i18n.pipe';
import { ImageGalleryTypeService } from '../services/image-gallery-type.service';
import { FormsService } from 'src/app/services/forms.service';

@Component({
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
        CKEditorModule
    ],
    providers: [
        I18nPipe,
        ImageGalleryService,
        ImageGalleryTypeService
    ]
})
export class BackendComponent implements OnInit {
  @Input() public data: any;

  public classicEditor = ClassicEditor;
  public imageGalleries: ImageGallery[] = [];
  public imageGalleryTypes: ImageGalleryType[] = [];
  public bShowCreateGalleryModal = false;
  public bShowCreateTypeModal = false;
  public isRootModalWithoutNestedModal = false;
  public formImageGalleryAdd: FormGroup = new FormGroup({});
  public formGalleryTypeAdd: FormGroup = new FormGroup({});

  private galleryTypeStatus = false;
  private galleryTypeData: Object = {};

  constructor(
    readonly imageGalleryService: ImageGalleryService,
    readonly imageGalleryTypeService: ImageGalleryTypeService,
    readonly fb: FormBuilder,
    private formsService: FormsService
  ) { 
    this.formImageGalleryAdd = this.formsService.formGroups.controls['imageGalleryAdd'] as FormGroup;
    this.formGalleryTypeAdd = this.formsService.formGroups.controls['galleryTypeAdd'] as FormGroup;
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

  public addImageGallery(data: any): void {
    console.log('addImageGallery', data);
  }

  public addImageType(isSubmitted: boolean): void {
    console.log('addImageType', this.galleryTypeData);
    if (isSubmitted && this.galleryTypeData) {
      const igt: ImageGalleryType = this.galleryTypeData as ImageGalleryType;
      this.imageGalleryTypeService.addImageGalleryType(igt).subscribe({
        next: (res: boolean) => {
          if (res) {
            this.imageGalleryTypes = [...this.imageGalleryTypes, igt];
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
      this.buildForms();
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

  public closeCreateTypeModal(event: boolean): void {
    if (event) {
      this.isRootModalWithoutNestedModal = true;
      this.bShowCreateTypeModal = false;
    }
  }
}
