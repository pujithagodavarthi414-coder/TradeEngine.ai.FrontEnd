import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, ViewChildren } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'report-question-conduct',
    templateUrl: './report-question-conduct.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReportQuestionConductComponent {
    @ViewChildren('addActionPopover') addActionsPopover;
    @Output() closePreview = new EventEmitter<any>();

    @Input("question")
    set _question(data: any) {
        if (data) {
            this.questionDetails = data;
        }
    }

    public ngDestroyed$ = new Subject();

    questionDetails: any;

    constructor() { }
}