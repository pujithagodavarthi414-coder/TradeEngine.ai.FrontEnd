import { Pipe, PipeTransform, Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";


@Pipe({ name: "deadLineDateFilter", pure: true })

export class DeadlineDateToDaysPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) { }
    transform(deadLineDate: Date,dateTimeConfiguration: boolean) {
        if (!deadLineDate) {
            return '';
        }
        var endDate = new Date();
        var deadlineDate = new Date(deadLineDate);
        var timeDiff = (deadlineDate.getTime() - endDate.getTime());
        var diffDays = (timeDiff / (1000 * 3600 * 24));
        if (diffDays < 1 && dateTimeConfiguration) {
            diffDays = (timeDiff / (1000 * 3600));
            if (diffDays > 0 && diffDays < 1) {
                return (Math.ceil(diffDays * 60)) + 'min'
            }
            else {
                if (diffDays < 0) {
                    diffDays = diffDays * -1;
                }
                if (diffDays < 24) {
                    var dateFormat = '';
                    var time =  (Math.ceil(diffDays * 60));
                    var hours = (time / 60);
                    var rhours = Math.floor(hours);
                    var minutes = (hours - rhours) * 60;
                    var rminutes = Math.round(minutes);
                    if(rhours > 0) {
                        dateFormat = rhours + 'h'
                    }
                    if(rminutes > 0) {
                        dateFormat += ' ' + rminutes + 'min'
                    }
                
                return dateFormat;
                }
                else {
                    diffDays = (timeDiff / (1000 * 3600 * 24));
                    diffDays = Math.ceil(diffDays);
                }
            }

        } else {
            diffDays = Math.ceil(diffDays);
        }

        var deadLineData = '';
        if (diffDays < 0) {
            diffDays = diffDays * -1;
        }
        if (diffDays < 7) {
            deadLineData += ' ' + diffDays + 'd';
            return deadLineData;
        }
        else {
            var noOfYears = Math.floor(diffDays / 365);
            diffDays = diffDays - noOfYears * 365;

            var noOfMonths = Math.floor(diffDays / 30);
            diffDays = diffDays - noOfMonths * 30;

            var noOfWeeks = Math.floor(diffDays / 7);
            diffDays = diffDays - noOfWeeks * 7;

            if (noOfYears > 0) {
                deadLineData += noOfYears + 'y';
            }
            if (noOfMonths > 0) {
                deadLineData += ' ' + noOfMonths + 'm';
            }
            if (noOfWeeks > 0) {
                deadLineData += ' ' + noOfWeeks + 'w';
            }
            if (diffDays > 0) {
                deadLineData += ' ' + diffDays + 'd';
            }
            return deadLineData;
        }

    }
}