import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'extensionToIcon',
    standalone: true
  })
  export class FileExtensionIconPipe implements PipeTransform {
  
    transform(fileExtenstion: string = ''): any {
      switch(fileExtenstion.toLocaleLowerCase()) {
        case 'pdf': return 'fa fa-file-pdf';
        case 'jpg': 
        case 'png': return 'fa fa-file-image';
        default: return 'fa fa-file';
      }
    }
  }