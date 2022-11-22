import { Pipe, PipeTransform } from '@angular/core';
import { DomainSetting } from 'src/app/models/domain-setting.model';

@Pipe({
  name: 'settingvalue',
  standalone: true
})
export class SettingValuePipe implements PipeTransform {

  transform(settings: DomainSetting[], key: string): unknown {
    return settings.find(s => s.key === key)?.value;
  }

}
