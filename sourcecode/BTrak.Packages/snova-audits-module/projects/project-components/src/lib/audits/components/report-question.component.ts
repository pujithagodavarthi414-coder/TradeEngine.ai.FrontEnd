import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, ViewChild, ElementRef, ViewChildren } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
// import { Actions, ofType } from '@ngrx/effects';
// import { tap, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

import "../../globaldependencies/helpers/fontawesome-icons";

import * as auditModuleReducer from "../store/reducers/index";

import { TranslateService } from "@ngx-translate/core";
// import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { QuestionModel } from "../models/question.model";
import { LoadActionsByQuestionTriggered } from "../store/actions/questions.actions";
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";

@Component({
    selector: "report-question",
    templateUrl: "./report-question.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReportQuestionComponent {
    @ViewChildren('scenarioBugsPopover') scenarioBugPopover;
    @ViewChild("reportCaseTitle") reportCaseTitleStatus: ElementRef;
    @Output() questionStatusPreviewDetails = new EventEmitter<any>();

    @Input() caseSelected: boolean;

    @Input("caseDetails")
    set _caseDetails(data: any) {
        if (data)
            this.caseDetail = data;
    }

    scenarioBugs$: Observable<QuestionModel[]>;
    bugsInTestCaseProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    caseDetail: any;
    width: any;
    showTitleTooltip: boolean = false;
    loadActions: boolean = false;
    softLabels: SoftLabelConfigurationModel[];
    constructor(private store: Store<State>, private toastr: ToastrService, private translateService: TranslateService, private softLabelsPipe: SoftLabelPipe) {
        this.bugsInTestCaseProgress$ = this.store.pipe(select(auditModuleReducer.getActionsByQuestionIdLoading));
        this.getSoftLabelConfigurations();
    }
  
    getSoftLabelConfigurations() {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    previewTestcase() {
        this.questionStatusPreviewDetails.emit(this.caseDetail);
    }

    checkTitleTooltipStatus() {
        if (this.reportCaseTitleStatus.nativeElement.scrollWidth > this.reportCaseTitleStatus.nativeElement.clientWidth)
            this.showTitleTooltip = true;
        else
            this.showTitleTooltip = false;
    }

    loadBugs() {
        let testCaseSearch = new QuestionModel();
        // testCaseSearch.questionId = this.questionDetail.questionId;
        testCaseSearch.auditConductQuestionId = this.caseDetail.auditConductQuestionId;
        // testCaseSearch.conductId = this.selectedConduct.conductId;
        this.store.dispatch(new LoadActionsByQuestionTriggered(testCaseSearch));
        this.scenarioBugs$ = this.store.pipe(select(auditModuleReducer.getActionListByQuestionId));
    }

    openBugsPopover(bugPopover) {
        this.loadBugs();
        this.loadActions = true;
        bugPopover.openPopover();
    }

    setColorForBugPriorityTypes(color) {
        let styles = {
            "color": color
        };
        return styles;
    }

    closeBugPopover() {
        this.loadActions = false;
        this.scenarioBugPopover.forEach((p) => p.closePopover());
    }
}
