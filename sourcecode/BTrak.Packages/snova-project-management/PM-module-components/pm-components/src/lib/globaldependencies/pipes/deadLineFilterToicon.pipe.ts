import { Pipe, PipeTransform, Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";


@Pipe({ name: "deadLineDateToIconFilter", pure: true })
@Injectable({ providedIn: 'root' })

export class DeadlineDateToIconPipe implements PipeTransform {

    transform(deadLineDate: Date,dateTimeConfiguration: boolean) {
        if (!deadLineDate) {
            return '';
        }
        var endDate = new Date();
        var deadlineDate = new Date(deadLineDate);
        var timeDiff = (deadlineDate.getTime() - endDate.getTime());
        var diffDays = timeDiff / (1000 * 3600 * 24);
        if (diffDays < 1 && dateTimeConfiguration) {
            diffDays = (timeDiff / (1000 * 3600));
            if (diffDays > 0 && diffDays < 1) {
                return 'arrow-right'
            }
            else {
                if (diffDays < 0) {
                    diffDays = diffDays * -1;
                    return "arrow-left";
                }
                return 'arrow-right';
            }

        } else {
            diffDays = Math.ceil(diffDays);
        }
        if (diffDays >= 0) {
            return "arrow-right";
        }
        else {
            return "arrow-left";
        }
    }
}