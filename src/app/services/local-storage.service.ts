import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public get(key: string): string | null {
    return localStorage.getItem(key);
  }

  public set(key: string, value: any): void {
    if (value) {
      localStorage.setItem(key, value);
    }
  }

  public getWithExpiry(key: string): any {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }

  public setWithExpiry(key: string, value: any, ttl_ms: number): void {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl_ms,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  public remove(key: string) : void {
    localStorage.removeItem(key);
  } 
}
