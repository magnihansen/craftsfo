import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, tap } from 'rxjs/operators';
import { Page } from '../interfaces/page';

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
    private httpService: HttpClient,
    @Inject('HUB_URL') private apiUrl: string
  ) { }

  getPage(pageId: number): Observable<Page> {
    return this.httpService.get<Page>(`${this.apiUrl}/Page/GetPage/${pageId}`, this.httpOptions)
    .pipe(
      tap(data => data),
      catchError(this.handleError)
    );
  }

  getPageByLink(pageLink: string): Observable<Page> {
    if (pageLink === undefined || pageLink === ''){
      return this.httpService.get<Page>(`${this.apiUrl}/Page/GetDefaultPage`, this.httpOptions)
      .pipe(
        tap(data => data),
        catchError(this.handleError)
      );
    } else {
      return this.httpService.get<Page>(`${this.apiUrl}/Page/GetPageByLink/${pageLink}`, this.httpOptions)
      .pipe(
        tap(data => data),
        catchError(this.handleError)
      );
    }
  }

  createPage(page: Page): void {
    // this.pages?.push(page).then(msg => this.handleSuccess(msg));
  }

  updatePage(key: string, page: Page): void {
    // this.af.object<Page>('/pages/' + page.uid).update({
    //   uid: page.uid,
    //   // rank: page.rank,
    //   // parent: page.parent,
    //   title: page.title,
    //   link: page.link,
    //   content: page.content
    // })
    // .then(msg => this.handleSuccess(msg));
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

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
        errorMessage = `An error occurred: ${err.error.message}`;
    } else {
        errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
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
