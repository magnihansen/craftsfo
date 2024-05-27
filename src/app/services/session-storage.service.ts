import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  public get(key: string): any {
    const itemStr: string | null = sessionStorage.getItem(key);
    return itemStr;
  }

  public set(key: string, value: any): void {
    sessionStorage.setItem(key, value);
  }

  public remove(key: string): void {
    sessionStorage.removeItem(key);
  }
}
