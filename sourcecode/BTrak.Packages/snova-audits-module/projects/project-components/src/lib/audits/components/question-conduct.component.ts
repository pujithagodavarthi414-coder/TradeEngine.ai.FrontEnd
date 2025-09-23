import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input, ChangeDetectorRef, ViewChildren } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from "@angular/forms";
import * as _ from "underscore";
import { DatePipe } from '@angular/common';
import { QuestionModel } from '../models/question.model';

import * as auditModuleReducer from "../store/reducers/index";
import { QuestionActionTypes, LoadSingleQuestionByIdTriggered, LoadQuestionHistoryTriggered, LoadConductQuestionTriggered, LoadConductQuestionViewTriggered } from '../store/actions/questions.actions';
import { QuestionHistoryModel } from '../models/question-history.model';
import { ConductSubmitModel } from '../models/conduct-question.model';
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { AuditCategory } from '../models/audit-category.model';
import { LoadAuditCategoryListTriggered } from '../store/actions/audit-categories.actions';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { EntityTypeFeatureIds } from '../../globaldependencies/constants/entitytype-feature-ids';
import { AuditService } from '../services/audits.service';
import { ToastrService } from 'ngx-toastr';
import { AuditConduct } from '../models/audit-conduct.model';
import { LoadAuditConductListTriggered } from '../store/actions/conducts.actions';

@Component({
    selector: 'question-conduct',
    templateUrl: './question-conduct.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuestionConductComponent {
    @ViewChildren('addActionPopover') addActionsPopover;
    @ViewChildren("FileUploadPopup") FileUploadPopup;
    @Output() closePreview = new EventEmitter<any>();
    @Output() questionPreview = new EventEmitter<any>();
    @Input() fromDialog: boolean;

    @Input("question")
    set _question(data: any) {
        if (data) {
            this.questionDetails = data;
            this.questionTypeOptions = JSON.parse(this.questionDetails.questionsXml);
            this.questionFiles = (this.questionDetails && this.questionDetails.questionFilesXml) ? JSON.parse(this.questionDetails.questionFilesXml) : null;
            this.documents = (this.questionDetails && this.questionDetails.documents && this.questionDetails.documents.length > 0) ? this.questionDetails.documents : null;
            if (this.questionTypeOptions == null)
                this.questionTypeOptions = [];
            this.questionTypeOptions.forEach(x => {
                x.auditConductAnswerId = x.auditConductAnswerId.toLowerCase();
            });
            this.initializeConductForm();
            this.questionConductForm.patchValue(this.questionDetails);
            // this.questionConductForm.get('auditConductAnswerId').setValue(this.questionDetails.auditAnswerId);
            this.bindQuestionConductDetails();
        }
    }

    @Input("selectedConduct")
    set _selectedConduct(data: any) {
        if (data) {
            this.selectedConduct = data;
            if (this.selectedConduct.isArchived == null || this.selectedConduct.isArchived == false)
                this.isAuditArchived = false;
            else
                this.isAuditArchived = true;
            if (this.selectedConduct.isConductSubmitted == null || this.selectedConduct.isConductSubmitted == false)
                this.isConductSubmitted = false;
            else
                this.isConductSubmitted = true;
            if (this.selectedConduct.isConductEditable == null || this.selectedConduct.isConductEditable == true)
                this.isConductEditable = true;
            else
                this.isConductEditable = false;
            if (!this.isConductEditable || this.isAuditArchived || this.isConductSubmitted) {
                this.questionConductForm.disable();
            }
        }
    }

    documents: any;
    anyOperationInProgress$: Observable<boolean>;
    nextPreviousOperationInProgress: boolean = false;
    searchOperationInProgress$: Observable<boolean>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    questionHistory$: Observable<QuestionHistoryModel[]>;
    nextOperationInProgress$: Observable<boolean>;
    previousOperationInProgress$: Observable<boolean>;

    softLabels: SoftLabelConfigurationModel[];

    public ngDestroyed$ = new Subject();

    questionConductForm: FormGroup;

    questionTypeOptions = [];
    openedDocumentId: any;
    moduleTypeId: number = 14;
    referenceTypeId: string = ConstantVariables.ConductReferenceTypeId;
    selectedStoreId: string = null;
    isButtonVisible: boolean = true;
    questionFiles = [];
    questionDetails: any;
    selectedConduct: any;
    isConductEditable: boolean = true;
    isAuditArchived: boolean = false;
    isConductSubmitted: boolean = false;
    loadDetails: boolean = false;
    loadAction: boolean = false;
    disabledQuestion: boolean = false;
    isQuestionViewed: boolean = false;
    panelOpenState: boolean = false;
    questionData: any;
    hiddenvalue: boolean = false;
    intimepicker: any;
    isSubmit: boolean = false;
    canAddAction: boolean = false;

    dropdownQuestionTypeId = ConstantVariables.DropdownQuestionTypeId.toLowerCase();
    dateQuestionTypeId = ConstantVariables.DateQuestionTypeId.toLowerCase();
    numericQuestionTypeId = ConstantVariables.NumericQuestionTypeId.toLowerCase();
    textQuestionTypeId = ConstantVariables.TextQuestionTypeId.toLowerCase();
    booleanQuestionTypeId = ConstantVariables.BooleanQuestionTypeId.toLowerCase();
    timeQuestionTypeId = ConstantVariables.TimeQuestionTypeId.toLowerCase();

    public initSettings = {
        plugins: "paste",
        //powerpaste_allow_local_images: true,
        //powerpaste_word_import: 'prompt',
        //powerpaste_html_import: 'prompt',
        toolbar: 'link image code'
    };

    constructor(private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef, private _sanitizer: DomSanitizer, private datePipe: DatePipe, private auditService: AuditService,private toastr: ToastrService) {

        var roles = JSON.parse(localStorage.getItem(LocalStorageProperties.EntityRoleFeatures));
        this.canAddAction = _.find(roles, function (role: any) { return role.entityFeatureId.toLowerCase() == EntityTypeFeatureIds.EntityTypeFeature_CanAddAuditAction.toString().toLowerCase(); }) != null;
        this.cdRef.markForCheck();
        this.getSoftLabels();
        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getQuestionForConductLoading));
        this.searchOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getQuestionByIdForConductLoading));

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadConductQuestionByIdCompleted),
                tap(() => {
                    this.disabledQuestion = false;
                    if (this.isSubmit) {
                        this.closeQuestionDialog();
                    } else {
                        this.loadQuestionHistory(this.questionData);
                    }
                    this.cdRef.markForCheck();
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadConductQuestionViewCompleted),
                tap((result: any) => {
                    if (result && result.searchQuestions) {
                        let data = {
                            questionData: result.searchQuestions[0],
                            upsertQuestion: false,
                            previewQuestion: true
                        };
                        this.questionPreview.emit({...data, load: true});
                        // this.loadConductCategoryList(result.searchQuestions[0]);
                        this.cdRef.markForCheck();
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.QuestionFailed),
                tap(() => {
                    this.disabledQuestion = false;
                    this.cdRef.markForCheck();
                })
            ).subscribe();
    }

    ngOnInit() {
        //this.getSoftLabels();
    }

    getSoftLabels() {
        // this.softLabels$ = this.store.pipe(select(auditModuleReducer.getSoftLabelsAll));
        // this.softLabels$.subscribe((x) => this.softLabels = x);
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    submitConductQuestion(isSubmit) {
        this.isSubmit = isSubmit;
        this.disabledQuestion = true;
        let conductModel = new QuestionModel();
        conductModel = this.questionConductForm.value;
        conductModel.conductAnswerSubmittedId = this.questionDetails.conductAnswerSubmittedId;
        conductModel.conductId = this.questionDetails.conductId;
        conductModel.questionId = this.questionDetails.questionId;
        conductModel.auditConductQuestionId = this.questionDetails.auditConductQuestionId;
        conductModel.auditCategoryId = this.questionDetails.auditCategoryId;
        conductModel.questionOptionDate = null;
        if (this.questionDetails.masterQuestionTypeId.toLowerCase() == this.dateQuestionTypeId) {
            conductModel.questionOptionDate = this.questionConductForm.get('questionOptionDate').value;
            conductModel.auditConductAnswerId = this.questionTypeOptions[0].auditConductAnswerId;
        } else if (this.questionDetails.masterQuestionTypeId.toLowerCase() == this.numericQuestionTypeId) {
            conductModel.questionOptionNumeric = this.questionConductForm.get('questionOptionDate').value;
            conductModel.auditConductAnswerId = this.questionTypeOptions[0].auditConductAnswerId;
        } else if (this.questionDetails.masterQuestionTypeId.toLowerCase() == this.textQuestionTypeId) {
            conductModel.questionOptionText = this.questionConductForm.get('questionOptionDate').value;
            conductModel.auditConductAnswerId = this.questionTypeOptions[0].auditConductAnswerId;
        } else if (this.questionDetails.masterQuestionTypeId.toLowerCase() == this.timeQuestionTypeId) {
            conductModel.questionOptionTime = this.questionConductForm.get('questionOptionDate').value;
            conductModel.auditConductAnswerId = this.questionTypeOptions[0].auditConductAnswerId;
        }
        this.store.dispatch(new LoadConductQuestionTriggered(conductModel));
    }


    checkSubmit() {
        if (!this.isConductEditable || this.isAuditArchived || this.isConductSubmitted)
            return true;
        if (this.questionDetails.masterQuestionTypeId == this.dropdownQuestionTypeId || this.questionDetails.masterQuestionTypeId == this.booleanQuestionTypeId) {
            let value = this.questionConductForm.get('auditConductAnswerId').value;
            if (value)
                return false;
            else
                return true;
        } else if (this.questionDetails.masterQuestionTypeId == this.dateQuestionTypeId || this.questionDetails.masterQuestionTypeId == this.numericQuestionTypeId ||
            this.questionDetails.masterQuestionTypeId == this.textQuestionTypeId || this.questionDetails.masterQuestionTypeId == this.timeQuestionTypeId) {
            let value = this.questionConductForm.get('questionOptionDate').value;
            if (value)
                return false;
            else
                return true;
        }
    }

    openFileUploadPopover(FileUploadPopup, document) {
        this.questionData = {
            questionId: this.questionDetails.previousQuestion,
            conductId: this.selectedConduct.conductId
        };
        this.openedDocumentId = document.documentId;
        FileUploadPopup.openPopover();
    }

    closeFileUploadPopover() {
        this.openedDocumentId = null
        this.FileUploadPopup.forEach((p) => p.closePopover());
        let model = new QuestionModel();
        model.questionId = this.questionData.questionId;
        model.conductId = this.questionData.conductId;
        this.store.dispatch(new LoadConductQuestionViewTriggered(model));
        // let auditConductModel = new AuditConduct();
        // auditConductModel.conductId = this.questionData.conductId;
        // auditConductModel.projectId = this.selectedConduct.projectId;
        // auditConductModel.isArchived = this.isAuditArchived;
        // this.store.dispatch(new LoadAuditConductListTriggered(auditConductModel));
    }

    downloadFile(file) {
        if(file && !file.filePath) {
              this.toastr.warning("No document is uploaded to download.");
              return;
        }
        let extension = file.fileExtension;
        if (extension == ".pdf") {
            this.downloadPdf(file.filePath, file.name, extension);
        } else {
            const downloadLink = document.createElement("a");
            downloadLink.href = file.filePath;
            downloadLink.target = "_blank";
            downloadLink.download = file.name + "-" + this.datePipe.transform(new Date(), "yyyy-MM-dd") + file.fileExtension;
            downloadLink.click();
        }
    }

    downloadPdf(pdf, fileName, extension) {
        let fileType;
        fileType = extension == ".pdf" ? "data:application/pdf;base64," : (extension == ".xls" || extension == ".xlsx") ?
            "data:application/vnd.ms-excel," : null;
        this.auditService.downloadFile(pdf).subscribe((responseData: any) => {
            const linkSource = fileType + responseData;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = fileName + "-" + this.datePipe.transform(new Date(), "yyyy-MM-dd") + extension;
            downloadLink.click();
        })
    }

    checkButtonDisabled() {
        this.questionConductForm.updateValueAndValidity();
        this.cdRef.detectChanges();
    }

    initializeConductForm() {
        this.questionConductForm = new FormGroup({
            conductAnswerSubmittedId: new FormControl(null, []),
            auditConductAnswerId: new FormControl(null, Validators.compose([Validators.required])),
            questionId: new FormControl(null, []),
            conductId: new FormControl(null, []),
            questionTypeOptionId: new FormControl(null, []),
            answerComment: new FormControl(null, Validators.compose([Validators.maxLength(807)])),
            questionTypeOptionName: new FormControl(null, []),
            viewAnswerComment: new FormControl(false, []),
            timeStamp: new FormControl(null, []),
            questionOptionDate: new FormControl(null, Validators.compose([])),
        })
    }

    closeQuestionDialog() {
        this.closePreview.emit('');
    }

    bindQuestionConductDetails() {
        if (this.questionDetails.masterQuestionTypeId == this.dropdownQuestionTypeId || this.questionDetails.masterQuestionTypeId == this.booleanQuestionTypeId) {
            this.questionConductForm.get('auditConductAnswerId').setValue(this.questionDetails.auditAnswerId);
            this.questionConductForm.get('auditConductAnswerId').setValidators([Validators.required]);
            this.questionConductForm.get('auditConductAnswerId').updateValueAndValidity();
            this.questionConductForm.controls["questionOptionDate"].clearValidators();
            this.questionConductForm.get("questionOptionDate").updateValueAndValidity();
        } else if (this.questionDetails.masterQuestionTypeId == this.dateQuestionTypeId || this.questionDetails.masterQuestionTypeId == this.numericQuestionTypeId ||
            this.questionDetails.masterQuestionTypeId == this.textQuestionTypeId || this.questionDetails.masterQuestionTypeId == this.timeQuestionTypeId) {
            this.questionConductForm.get('questionOptionDate').setValidators([Validators.required]);
            this.questionConductForm.get('questionOptionDate').updateValueAndValidity();
            this.questionConductForm.get('auditConductAnswerId').clearValidators();
            this.questionConductForm.get("auditConductAnswerId").updateValueAndValidity();
            if (this.questionDetails.masterQuestionTypeId == this.dateQuestionTypeId)
                this.questionConductForm.get('questionOptionDate').setValue(this.questionDetails.questionResultDate);
            else if (this.questionDetails.masterQuestionTypeId == this.textQuestionTypeId)
                this.questionConductForm.get('questionOptionDate').setValue(this.questionDetails.questionResultText);
            else if (this.questionDetails.masterQuestionTypeId == this.numericQuestionTypeId)
                this.questionConductForm.get('questionOptionDate').setValue(this.questionDetails.questionResultNumeric);
            else if (this.questionDetails.masterQuestionTypeId == this.timeQuestionTypeId) {
                if (this.questionDetails.questionResultTime)
                    this.intimepicker = this.questionDetails.questionResultTime.toString().substring(0, 5);
                this.questionConductForm.get('questionOptionDate').setValue(this.questionDetails.questionResultTime);
            }
        }
    }

    checkAnswer(value) {
        if (value) {
            let index = this.questionTypeOptions.findIndex(x => x.auditConductAnswerId == value);
            if (index != -1) {
                if (this.questionTypeOptions[index].questionOptionResult == false)
                    return true;
                else
                    return false;
            }
        }
        else {
            return false;
        }
    }

    openAddActionPopover(addActionPopover) {
        this.loadAction = true;
        addActionPopover.openPopover();
    }

    closeActionPopover() {
        this.loadAction = false;
        this.addActionsPopover.forEach((p) => p.closePopover());
    }

    closeintime() {
        this.intimepicker = "";
    }

    nextQuestion() {
        this.nextOperationInProgress$ = of(true);
        this.questionData = {
            questionId: this.questionDetails.nextQuestion,
            conductId: this.selectedConduct.conductId
        };
        if (!this.checkSubmit() && this.questionConductForm.touched) {
            this.submitConductQuestion(false);
        } else {
            this.loadQuestionHistory(this.questionData);
        }
    }

    previousQuestion() {
        this.previousOperationInProgress$ = of(true);
        this.questionData = {
            questionId: this.questionDetails.previousQuestion,
            conductId: this.selectedConduct.conductId
        };

        if (!this.checkSubmit() && this.questionConductForm.touched) {
            this.submitConductQuestion(false);
        } else {
            this.loadQuestionHistory(this.questionData);
        }
    }

    loadQuestionHistory(data) {
        let model = new QuestionModel();
        model.questionId = data.questionId;
        model.conductId = data.conductId;
        model.isForViewHistory = true;
        this.store.dispatch(new LoadConductQuestionViewTriggered(model));
        this.nextOperationInProgress$ = of(false);
        this.previousOperationInProgress$ = of(false);
    }

    sanitizeUrl(imgUrl) {
        return this._sanitizer.bypassSecurityTrustUrl(imgUrl);
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
        this.ngDestroyed$.complete();
    }
    getDescriptionhiddenValue() {
        this.hiddenvalue = this.hiddenvalue == true ? false : true;
    }
}