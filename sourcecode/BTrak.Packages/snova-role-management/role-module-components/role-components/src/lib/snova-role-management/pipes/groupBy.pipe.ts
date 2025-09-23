import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({ name: 'mapToKeys' })

@Injectable({ providedIn: "root" })

export class MapToKeysPipe implements PipeTransform {
    transform(value, args: string[]): any {
        let keys = [];
        for (let key in value) {
            keys.push({ key: value[key].value.featureId, value: value[key].value.featureName });
        }
        return keys;
    }
}

