import { Pipe, PipeTransform, Injectable } from "@angular/core";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
@Injectable({providedIn:'root'})

@Pipe({ name: "filesize" })
export class FileSizePipe implements PipeTransform {
    transform(bytes: number): string {
        var c;
        var name = LocalStorageProperties.CurrentCulture + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        var currentCulture = 'en';
        for(var j = 0; j <ca.length; j++) {
          c = ca[j];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            currentCulture = c.substring(name.length, c.length);
            break;
          }
        }
        if (!bytes) {
            if ( currentCulture == 'te' ) {
                return "0 బైట్లు";
            } else if ( currentCulture == 'ko') {
                return "0 바이트";
            } else if ( currentCulture == 'ar' ) {
                return "0 بايت";
            } else {
                return "0 Bytes";
            } 
        };
        const k = 1024;
        // dm = decimals <= 0 ? 0 : decimals || 2,
        const dm = 2;
        let selectedLangSizes = [];
        if ( currentCulture == 'te' ) {
            selectedLangSizes = ["బైట్లు", "కె.బి.", "ఎంబీ", "జిబి", "టిబి", "పిబి", "ఈబీ", "జెడ్ బి", "వై.బి."];
        } else if ( currentCulture == 'ko') {
            selectedLangSizes = ["바이트", "KB", "MB", "GB", "결핵", "PB", "EB", "ZB", "YB"];
        } else if ( currentCulture == 'ar' ) {
            selectedLangSizes = ["بايت", "كيلو بايت", "ميغا بايت", "غيغابايت", "السل", "PB", "إب", "ZB", "YB"];
        } else {
            selectedLangSizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        } 
        const sizes = selectedLangSizes,
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(dm) + " " + sizes[i];
    }
}
