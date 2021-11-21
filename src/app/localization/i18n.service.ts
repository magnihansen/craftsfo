import { Injectable } from '@angular/core';
import { KeyValuePair } from '../models/key-value-pair.model';
import { languages } from './languages.model';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  public data: {[keys: string]: string}[] = [];
  public currentLanguage = '';
  defaultLocale = 'da';

  constructor(
  ) {
  }

  private getKeyValuePairs(obj: object): KeyValuePair<string, any>[] {
    return Object.keys(obj).map(k => ({key: k, value: (obj as any)[k]}));
  }

  public addTranslations(obj: {[keys: string]: string}): void {
    this.data.unshift(obj);
  }

  setLanguage(language: string): void {
    this.currentLanguage = language;
    throw new Error(`Not implemented`);
  }

  getLanguages(): { key: string, alt: string, title: string }[] {
    return languages;
  }

  getTranslation(phrase: string, placeholders?: object): string {
    let translation = phrase;
    for (const langData of this.data) {
      if (langData[phrase]) {
        translation = langData[phrase];
        break;
      }
    }

    if (placeholders) {
      const values: KeyValuePair<string, any>[] = this.getKeyValuePairs(placeholders);
      values.forEach((obj: KeyValuePair<string, any>) => {
        if (placeholders.hasOwnProperty(obj.key)) {
          translation = translation.replace(`{${obj.key}}`, obj.value);
        }
      });
    }

    return translation;
  }

  getCommaSeparatedList(strings: string[], isOxfordComma = false): string {
    if (!strings || strings.length === 0) {
      return '';
    }
    if (strings.length === 1) {
      return strings[0];
    }

    // First string
    let returnString = strings[0];
    // All strings except first and last
    for (let i = 1; i < strings.length - 1; i++) {
      returnString += ', ';
      returnString += strings[i];
    }
    // Last string
    if (isOxfordComma && strings.length > 2) {
      returnString += ',';
    }
    returnString += ' ' + this.getTranslation('and') + ' ' + strings[strings.length - 1];
    return returnString;
  }
}
