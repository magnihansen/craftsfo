import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Page } from '../interfaces/page';
import { User } from '../models/user';
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

  public getPage(pageId: number): Observable<Page> {
    return this.http.get<Page>(`${this.apiUrl}/V1/Page/GetPage/${pageId}`, this.httpOptions);
  }

  public getPages(): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.apiUrl}/V1/Page/GetPages`, this.httpOptions);
  }

  public getPageByLink(pageLink: string | undefined): Observable<Page> {
    let pageUrl: string;
    if (pageLink === undefined || pageLink === '') {
      pageUrl = `${this.apiUrl}/V1/Page/GetDefaultPage`;
    } else {
      pageUrl = `${this.apiUrl}/V1/Page/GetPageByLink/${pageLink}`;
    }
    return this.http.get<Page>(pageUrl, this.httpOptions);
  }

  public getPageByUid(pageUid: string | undefined): Observable<Page> {
    let pageUrl: string;
    if (pageUid === undefined || pageUid === '') {
      pageUrl = `${this.apiUrl}/V1/Page/GetDefaultPage`;
    } else {
      pageUrl = `${this.apiUrl}/V1/Page/GetPageByUid/${pageUid}`;
    }
    return this.http.get<Page>(pageUrl, this.httpOptions);
  }

  public addPage(page: Page): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.apiUrl}/V1/Page/AddPage`,
      page,
      this.httpOptions
    );
  }

  public updatePage(page: Page): Observable<boolean> {
    const user: User = this.authenticationService.getUser();

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
      updatedBy: user.username
    };
    return this.http.put<boolean>(`${this.apiUrl}/V1/Page/UpdatePage`, body, this.httpOptions);
  }

  public deletePage(pageId: number): Observable<boolean> {
    return this.http.delete<boolean>(
      `${this.apiUrl}/Page/DeletePage/${pageId}`,
      this.httpOptions
    );
  }

  // getPagesList(orderByChild: string = 'rank'): Observable<Page[]> {
  //   return this.httpService.get<Page[]>(this.apiRoot + '/GetPages', this.httpOptions)
  //   .pipe(
  //     tap(data => data),
  //     catchError(this.handleError)
  //   );
  // }

  public getAdminPages(): Page[] {
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
