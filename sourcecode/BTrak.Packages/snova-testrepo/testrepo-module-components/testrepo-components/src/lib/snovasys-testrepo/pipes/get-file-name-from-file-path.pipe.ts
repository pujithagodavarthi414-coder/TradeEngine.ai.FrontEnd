import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({ name: 'fileNamePipe' })

@Injectable({ providedIn: 'root' })

export class FileNameFromFilePathPipe implements PipeTransform {
    transform(filePath: string): string {
        if (!filePath) {
            return null;
        }

        const fileName = filePath.split("/").pop();
        return fileName;
    }
}