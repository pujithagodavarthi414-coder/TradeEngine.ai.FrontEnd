import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'highLightText'
})

@Injectable({ providedIn: 'root' })

export class HighLightTextPipe implements PipeTransform {
  transform(value: string, searchText: string): string {
    if ( searchText == null || searchText == "")
    {
      return value;
    }
    const regex = new RegExp(searchText, 'gi');
    return value.replace(regex, (match) => `<strong>${match.replace(/\*/g,'')}</strong>`);
  }
}
