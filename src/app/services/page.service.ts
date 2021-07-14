import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Page } from '../interfaces/page';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    @Inject('HUB_URL') private apiUrl: string
  ) { }

  getPage(pageId: number): Observable<Page> {
    return this.http.get<Page>(`${this.apiUrl}/Page/GetPage/${pageId}`, this.httpOptions);
  }

  getPages(): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.apiUrl}/Page/GetPages`, this.httpOptions);
  }

  getPageByLink(pageLink: string | undefined): Observable<Page> {
    let pageUrl: string;
    if (pageLink === undefined || pageLink === '') {
      pageUrl = `${this.apiUrl}/Page/GetDefaultPage`;
    } else {
      pageUrl = `${this.apiUrl}/Page/GetPageByLink/${pageLink}`;
    }
    return this.http.get<Page>(pageUrl, this.httpOptions);
  }

  getPageByUid(pageUid: string | undefined): Observable<Page> {
    let pageUrl: string;
    if (pageUid === undefined || pageUid === '') {
      pageUrl = `${this.apiUrl}/Page/GetDefaultPage`;
    } else {
      pageUrl = `${this.apiUrl}/Page/GetPageByUid/${pageUid}`;
    }
    return this.http.get<Page>(pageUrl, this.httpOptions);
  }

  createPage(page: Page): void {
    // this.pages?.push(page).then(msg => this.handleSuccess(msg));
  }

  updatePage(key: string, page: Page): void {
    this.authenticationService.getUser().subscribe(user => {
      const body = {
        id: page.id,
        uid: page.uid,
        title: page.title,
        parent: page.parent,
        content: page.content,
        pageRank: page.pageRank,
        link: page.link,
        active: page.active,
        updatedDate: new Date(),
        updatedBy: user.id
      };
      this.http.put(`${this.apiUrl}/Page/UpdatePage`, body, this.httpOptions);
    });
  }

  deletePage(key: string): void {
    // this.pages?.remove(key).catch(error => this.handleError(error));
  }

  // getPagesList(orderByChild: string = 'rank'): Observable<Page[]> {
  //   return this.httpService.get<Page[]>(this.apiRoot + '/GetPages', this.httpOptions)
  //   .pipe(
  //     tap(data => data),
  //     catchError(this.handleError)
  //   );
  // }

  deleteAll(): void {
    // this.pages?.remove().catch(error => this.handleError(error));
  }

  getAdminPages(): Page[] {
    const pages: Page[] = [];

    const pageDashboard: Page = this.createAdminPage('Dashboard', '1', '/admin/dashboard');
    const pageContact: Page = this.createAdminPage('Contact', '2', '/admin/contact');
    const pageSlides: Page = this.createAdminPage('Slides', '3', '/admin/slides');
    const pageLogout: Page = this.createAdminPage('Logout', '4', '/logout');

    pages.push(pageDashboard);
    pages.push(pageContact);
    pages.push(pageSlides);
    pages.push(pageLogout);

    return pages;
  }

  private createAdminPage(titleStr: string, rankStr: string, linkStr: string): Page {
    const page: Page = {
      id: 1,
      uid: '',
      title: titleStr,
      parent: '',
      rank: rankStr,
      content: '',
      pageRank: rankStr,
      link: linkStr,
      active: true,
      createdDate: new Date(),
      createdBy: 'System',
      updatedDate: null,
      updatedBy: null,
      isRouterLink: false
    };
    return page;
  }
}
