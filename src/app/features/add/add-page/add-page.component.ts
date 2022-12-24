import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, AfterViewInit, OnDestroy, Input, OnInit } from '@angular/core';
import { FormControlStatus, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Subscription } from 'rxjs/internal/Subscription';
import * as uuid from 'uuid';

import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { PageType } from 'src/app/models/page-type.model';
import { Page } from 'src/app/models/page.model';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormsService } from 'src/app/services/forms.service';
import { PageService } from 'src/app/services/page.service';
import { PageTypeService } from 'src/app/services/pagetype.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { UploadAdapter } from 'src/app/shared/upload-adapter.class';
import { ImageGalleryComponent } from 'src/app/components/modules/image-gallery/image-gallery.component';

@Component({
  selector: 'app-add-page',
  standalone: true,
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, CKEditorModule, LocalLocalizationModule, ImageGalleryComponent],
  providers: [FormsService]
})
export class AddpageComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() public renderModal = false;
  @Input() public currentPageCount = 999;

  @Output() private closeChange: EventEmitter<Page> = new EventEmitter();

  public classicEditor = ClassicEditor;
  public formPageAdd: FormGroup = new FormGroup({});
  public formPageAddState?: Subscription;
  public pageTypes: PageType[] = [];
  public isImageGallery = false;

  constructor(
    private pageService: PageService,
    private authService: AuthenticationService,
    private formsService: FormsService,
    private pageTypeService: PageTypeService
  ) { 
    this.loadPageTypes();
  }

  public ngOnInit(): void {
    this.formPageAdd = this.formsService.formGroups.controls['addpage'] as FormGroup;
    this.formPageAdd.controls.sort.setValue((this.currentPageCount + 1));
  }

  public ngAfterViewInit(): void {
    this.formPageAddState = this.formPageAdd.statusChanges
      .subscribe({
        next: (state: FormControlStatus) => {
          this.formsService.isFormValid = (state === 'INVALID' ? false : true);
        }
      });
  }

  private loadPageTypes(): void {
    this.pageTypeService.getPageTypes().subscribe({
      next: (pageTypes: PageType[]) => {
        this.pageTypes = pageTypes;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  public onReady(eventData: any) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader: any) {
      console.log(btoa(loader.file));
      return new UploadAdapter(loader);
    };
  }

  public onPageTypeChange(pageType: any): void {
    if (pageType) {
      this.isImageGallery = +pageType.value === 47;
    }
  }

  public addPage(form: any): void {
    if (this.authService.IsUserLoggedIn) {
      const user: User = this.authService.getUser();

      const pageTypeId: number = this.formPageAdd.controls.pageTypeId.value as number;
      const sort: number = this.formPageAdd.controls.sort.value as number;
      const title: string = this.formPageAdd.controls.title.value as string;
      const link: string = this.formPageAdd.controls.link.value as string;
      const content: string = this.formPageAdd.controls.content.value as string;

      const newPage: Page = {
        uid: uuid.v4(),
        parentId: null,
        pageTypeId: pageTypeId,
        title,
        content,
        sort,
        link,
        isRouterLink: true,
        active: true,
        createdBy: user.username
      } as unknown as Page;

      this.pageService.addPage(newPage).subscribe({
        next: (insertedPage: Page) => {
          if (insertedPage) {
            this.formsService.formGroups.reset();
            this.closeChange.emit(insertedPage);
          }
        },
        error: (err: any) => {
          // do nothing yet 
        }
      });
    }
  }

  public closeModal(modalClosed: boolean): void {
    if (modalClosed) {
      this.formsService.formGroups.reset();
      this.closeChange.emit(undefined);
    }
  }

  public ngOnDestroy(): void {
    this.formPageAddState?.unsubscribe();
  }
}
