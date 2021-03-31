import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Company } from '../interfaces/company';
import { Page } from '../interfaces/page';
import { PageService } from './page.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private appBehaviorCompany: Subject<Company> = new Subject();
  private companyObj: Company | null = null;

  private appBehaviorPages: Subject<Page[]> = new Subject();
  private pagesObj: Page[] = [];

  constructor(
    private pageService: PageService
  ) {
    this.loadCompany();
    this.loadPages();
  }

  public nextCompany(company: Company): void {
    return this.appBehaviorCompany.next(company);
  }

  public company(): Observable<Company> {
    return this.appBehaviorCompany.asObservable();
  }

  public nextPage(pages: Page[]): void {
    return this.appBehaviorPages.next(pages);
  }

  public pages(): Observable<Page[]> {
    return this.appBehaviorPages.asObservable();
  }

  /* Private methods */

  private loadCompany(): void {
    // fb.default.database().ref('/company').on('value', snapshot => {
    //   this.companyObj = snapshot.toJSON() as Company;
    //   if (this.companyObj) {
    //     this.nextCompany(this.companyObj);
    //   }
    // });
  }

  private loadPages(): void {
    // this.db.list('/pages', ref => ref.orderByChild('rank')).valueChanges().subscribe(snapshots => {
    //   this.pagesObj = snapshots as Page[];
    //   if (this.pagesObj) {
    //     this.nextPage(this.pagesObj);
    //   }
    // });
  }
}
