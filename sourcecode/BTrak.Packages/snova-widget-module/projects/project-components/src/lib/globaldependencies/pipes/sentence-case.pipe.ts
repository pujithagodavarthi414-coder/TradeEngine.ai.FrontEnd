import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'sentenceCase'
})

@Injectable({
    providedIn: "root"
})

export class sentencePipe implements PipeTransform {

    transform(value: string): any {

        let text = value.replace(/[@]/g, '');
        var result = text.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);

    }
}