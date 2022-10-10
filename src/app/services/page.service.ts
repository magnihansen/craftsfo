import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Page } from '../models/page.model';
import { User } from '../models/user';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private apiPath = '/V1/Page';
  private httpOptions = {
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
    return this.http.get<Page>(`${this.apiUrl}${this.apiPath}/GetPage?pageId=${pageId}`, this.httpOptions);
  }

  public getPages(): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.apiUrl}${this.apiPath}/GetPages`, this.httpOptions);
  }

  public getPageByLink(pageLink: string | undefined): Observable<Page> {
    let pageUrl: string;
    if (pageLink === undefined || pageLink === '') {
      pageUrl = `${this.apiUrl}${this.apiPath}/GetDefaultPage`;
    } else {
      pageUrl = `${this.apiUrl}${this.apiPath}/GetPageByLink/${pageLink}`;
    }
    return this.http.get<Page>(pageUrl, this.httpOptions);
  }

  public getPageByUid(pageUid: string | undefined): Observable<Page> {
    let pageUrl: string;
    if (pageUid === undefined || pageUid === '') {
      pageUrl = `${this.apiUrl}${this.apiPath}/GetDefaultPage`;
    } else {
      pageUrl = `${this.apiUrl}${this.apiPath}/GetPageByUid/${pageUid}`;
    }
    return this.http.get<Page>(pageUrl, this.httpOptions);
  }

  public addPage(page: Page): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.apiUrl}${this.apiPath}/AddPage`,
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
    return this.http.put<boolean>(`${this.apiUrl}${this.apiPath}/UpdatePage`, body, this.httpOptions);
  }

  public deletePage(pageId: number): Observable<boolean> {
    const deletePageUrl = `${this.apiUrl}${this.apiPath}/DeletePage`;
    return this.http.delete<boolean>(
      deletePageUrl,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        params: {
          pageId: pageId.toString()
        }
      }
    );
  }

  public getAdminPages(): Page[] {
    let pages: Page[] = [];

    const pageDashboard: Page = this.createAdminPage('Dashboard', '1', '/admin/dashboard');
    const pageContact: Page = this.createAdminPage('Contact', '2', '/admin/contact');
    const pageSlides: Page = this.createAdminPage('Slides', '3', '/admin/slides');
    const pageUsers: Page = this.createAdminPage('Users', '4', '/admin/users');
    const pageLogout: Page = this.createAdminPage('Logout', '5', '/logout');

    pages = [...pages, pageDashboard, pageContact, pageSlides, pageUsers, pageLogout];

    return pages;
  }

  private createAdminPage(titleStr: string, rankStr: string, linkStr: string): Page {
    const page: Page = {
      id: 1,
      uid: '',
      title: titleStr,
      parent: '',
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
