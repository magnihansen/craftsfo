import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
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
    console.log();
    if (pageLink === undefined || pageLink === '' || pageLink === 'start') {
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

  public addPage(page: Page): Observable<Page> {
    return this.http.post<Page>(
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
      parentId: page.parentId,
      pageTypeId: page.pageTypeId,
      title: page.title,
      content: page.content,
      sort: page.sort,
      link: page.link,
      isRouterLink: page.isRouterLink,
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

  public getAdminPages(): Observable<Page[]> {
    return this.authenticationService.getClaimValue("IsAdmin")
    .pipe(
      map((res: object) => {
        const isAdmin: boolean = !!res;

        let pages: Page[] = [];
        pages = [...pages, this.createAdminPage('common.dashboard', 1, '/admin/dashboard', true)];
        pages = [...pages, this.createAdminPage('common.messages', 2, '/admin/contact', true)];
        if (isAdmin) {
          pages = [...pages, this.createAdminPage('common.users', 4, '/admin/users', true)];
        }
        pages = [...pages, this.createAdminPage('common.logout', 5, '/logout', true)];

        return pages;
      })
    );
  }

  private createAdminPage(title: string, sort: number, link: string, isRouterLink: boolean): Page {
    const page: Page = {
      id: 1,
      uid: '',
      parentId: null,
      pageTypeId: 0,
      title,
      content: '',
      sort,
      link,
      isRouterLink,
      active: true,
      createdDate: new Date(),
      createdBy: 'System',
      updatedDate: null,
      updatedBy: null
    };
    return page;
  }
}
