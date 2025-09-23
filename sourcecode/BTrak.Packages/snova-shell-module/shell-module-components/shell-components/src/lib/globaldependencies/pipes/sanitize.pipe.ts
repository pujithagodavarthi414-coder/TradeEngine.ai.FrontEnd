import { Pipe, PipeTransform, Injectable } from "@angular/core";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'sanitizeHtml'
})

@Injectable({ providedIn: 'root' })

export class SanitizeHtmlPipe implements PipeTransform {

    constructor(private _sanitizer: DomSanitizer) {
    }

    transform(v: string): SafeHtml {
        return this._sanitizer.bypassSecurityTrustHtml(v);
    }
}