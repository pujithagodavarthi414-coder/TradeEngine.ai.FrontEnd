import { Pipe, PipeTransform, Injectable } from "@angular/core";
@Injectable({providedIn:'root'})

@Pipe({ name: "filesize" })
export class FileSizePipe implements PipeTransform {
    transform(bytes: number): string {
        if (!bytes) { return "0 Bytes" };
        const k = 1024;
        // dm = decimals <= 0 ? 0 : decimals || 2,
        const dm = 2;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(dm) + " " + sizes[i];
    }
}
