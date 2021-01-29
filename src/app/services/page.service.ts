import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { Page } from '../interfaces/page';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private dbPath = '/pages';
  page: AngularFireObject<Page> | null;
  pages: AngularFireList<Page> | null;

  constructor(public db: AngularFireDatabase) {
    this.page = null;
    this.pages = null;
  }

  getPage(uid: string): AngularFireObject<Page> {
    return this.db.object('/pages/' + uid);
  }

  createPage(page: Page): void {
    this.pages?.push(page).then(msg => this.handleSuccess(msg));
  }

  updatePage(key: string, page: Page): void {
    this.db.object<Page>('/pages/' + page.uid).update({
      uid: page.uid,
      // rank: page.rank,
      // parent: page.parent,
      title: page.title,
      link: page.link,
      content: page.content
    })
    .then(msg => this.handleSuccess(msg));
  }

  deletePage(key: string): void {
    this.pages?.remove(key).catch(error => this.handleError(error));
  }

  getPagesList(): AngularFireList<Page> {
    this.pages = this.db.list(this.dbPath);
    return this.pages;
  }

  deleteAll(): void {
    this.pages?.remove().catch(error => this.handleError(error));
  }

  private handleSuccess(msg: any): void {
    console.log(msg);
  }

  private handleError(error: any): void {
    console.log(error);
  }

}
