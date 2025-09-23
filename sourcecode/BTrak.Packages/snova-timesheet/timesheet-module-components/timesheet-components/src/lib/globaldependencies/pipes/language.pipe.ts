import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'language'
})

@Injectable({ providedIn: 'root' })

export class LanguagePipe implements PipeTransform {

    constructor(private translateService: TranslateService) { }

    transform(value: string): any {

        let localvalue = value.toString().toUpperCase();
        return this.translateService.instant(localvalue);
    }
}