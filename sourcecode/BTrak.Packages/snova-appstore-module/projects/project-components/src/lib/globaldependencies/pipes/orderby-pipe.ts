import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({ name: 'orderBy' })

@Injectable({ providedIn: 'root' })

export class OrderByPipe implements PipeTransform {

    transform(tags: any[], type: string = null): any[] {
        if (tags && tags.length > 0) {
            if (!type) {
                tags = tags.sort((a, b) =>
                    a.tags.toLowerCase() > b.tags.toLowerCase() ? 1 : -1
                );
            } else if(type == 'Tags') {
                tags = tags.sort((a, b) =>
                    a.TagName.toLowerCase() > b.TagName.toLowerCase() ? 1 : -1
                );
            } else if(type == 'Workspaces'){
                tags = tags.sort((a, b) =>
                a.toLowerCase() > b.toLowerCase() ? 1 : -1
            );
            }
            return tags;

        }
    }
}