import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PageService } from '../../../services/page.service';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Subscription } from 'rxjs/internal/Subscription';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { Page } from '../../../models/page.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { I18nService } from 'src/app/localization/i18n.service';
import { User } from 'src/app/models/user';
import { UploadAdapter } from 'src/app/shared/upload-adapter.class';
import { PageType } from 'src/app/models/page-type.model';
import { PageTypeService } from 'src/app/services/pagetype.service';
import { LocalLocalizationModule } from 'src/app/localization/local-localization.module';
import { ContentWrapperComponent } from 'src/app/shared/components/content-wrapper/content-wrapper.component';
import { ImageGalleryComponent } from '../../../components/modules/image-gallery/image-gallery.component';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { FormsService } from 'src/app/services/forms.service';

@Component({
  standalone: true,
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss'],
  imports: [
    RouterModule,
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    LocalLocalizationModule, 
    ModalComponent, 
    CKEditorModule, 
    ContentWrapperComponent, 
    ImageGalleryComponent]
})
export class EditPageComponent implements OnInit {
  @Input() public pageId?: number;
  @Input() public renderModal = false;

  @Output() private closeChange: EventEmitter<Page> = new EventEmitter();
  
  public classicEditor = ClassicEditor;
  public pages: Page[] = [];
  // public title = '';
  // public content = '';
  // public sort = 0;
  // public pageuid = '';
  public page: Page | null = null;
  public pageTypeId = 0;
  public pageTypes: PageType[] = [];

  public formPageEdit: FormGroup = new FormGroup({});
  public formPageEditState?: Subscription;

  public model = {
    editorData: '<p>Hello, world!</p>'
  };

  constructor(
    private authenticationService: AuthenticationService,
    private pageService: PageService,
    private router: Router,
    private i18nService: I18nService,
    private toastr: ToastrService,
    private pageTypeService: PageTypeService,
    private formsService: FormsService
  ) {
    this.formPageEdit = this.formsService.formGroups.controls['editpage'] as FormGroup;
    this.loadPageTypes();
  }

  ngOnInit(): void {
    this.loadPage(this.pageId || 0);
  }

  public onReady(eventData: any) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader: any) {
      console.log(btoa(loader.file));
      return new UploadAdapter(loader);
    };
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

  private loadPage(pageId: number): void {
    this.pageService.getPage(pageId).subscribe({
      next: (page: Page) => {
        this.page = page;
        
        this.formPageEdit.controls.id.setValue(page.id);
        this.formPageEdit.controls.title.setValue(page.title);
        this.formPageEdit.controls.sort.setValue(page.sort);
        this.formPageEdit.controls.link.setValue(page.link);
        this.formPageEdit.controls.content.setValue(page.content.replace('\n', '<br />'));
        this.formPageEdit.controls.pageTypeId.setValue(page.pageTypeId);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  public gotoDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  public editPage(form: any): void {
    if (this.authenticationService.IsUserLoggedIn) {
      if (this.page) {
        const user: User = this.authenticationService.getUser();

        this.page.content = this.formPageEdit.controls.content.value as string;
        this.page.title = this.formPageEdit.controls.title.value as string;
        this.page.link = this.formPageEdit.controls.link.value as string;
        this.page.sort = this.formPageEdit.controls.sort.value as number;
        this.page.updatedBy = user.username;
        this.page.pageTypeId = this.pageTypeId;

        this.pageService.updatePage(this.page).subscribe({
          next: (result: boolean) => {
            if (result) {
              this.toastr.success(
                this.i18nService.getTranslation('common.x-saved', { x: 'common.page' })
              );
            } else {
              this.toastr.warning(
                this.i18nService.getTranslation('warning.page-not-saved')
              );
            }
          },
          error: (err: any) => {
            this.toastr.error(
              err,
              this.i18nService.getTranslation('Error'),
            );
          }
        });
      } else {
        this.toastr.warning(
          this.i18nService.getTranslation('Page not valid')
        );
      }
    } else {
      this.toastr.warning(
        this.i18nService.getTranslation('User not authorized')
      );
    }
  }

  public closeModal(modalClosed: boolean): void {
    if (modalClosed) {
      this.formsService.formGroups.reset();
      this.closeChange.emit(undefined);
    }
  }
}
