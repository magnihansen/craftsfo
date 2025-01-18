import { Pipe, PipeTransform } from '@angular/core';
import { I18nService } from './i18n.service';

@Pipe({
    name: 'i18n',
    pure: false,
    standalone: false
})
export class I18nPipe implements PipeTransform {

  constructor(
    private i18nService: I18nService
  ) { }

  transform(phrase: string, placeholders?: object): any {
    return this.i18nService.getTranslation(phrase, placeholders);
  }

}
