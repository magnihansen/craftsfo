import { Component, Output, EventEmitter } from '@angular/core';
import { Page } from 'src/app/interfaces/page';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PageService } from 'src/app/services/page.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-addpage',
  templateUrl: './addpage.component.html',
  styleUrls: ['./addpage.component.scss']
})
export class AddpageComponent {
  @Output() closeChange: EventEmitter<boolean> = new EventEmitter();

  public showModal = false;

  constructor(
    private pageService: PageService,
    private authService: AuthenticationService
  ) { }

  public addPage(title: string, link: string, content: string, rank: string): void {
    if (this.authService.IsUserLoggedIn) {
      const user: User = this.authService.getUser();
      const pageRank: string = rank || '';
      const newPage: Page = {
        uid: uuid.v4(),
        pageRank,
        parent: '',
        title,
        link,
        content,
        active: true,
        createdBy: user.username
      } as unknown as Page;

      this.pageService.addPage(newPage).subscribe((result: boolean) => {
        if (result) {
          this.closeCreateSection();
        }
      });
    }
  }

  public closeCreateSection(): void {
    this.closeChange.emit(true);
  }
}
