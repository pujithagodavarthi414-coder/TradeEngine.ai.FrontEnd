import { Component, ChangeDetectionStrategy, EventEmitter, Output, Input, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { Store, select } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { tap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ActivatedRoute } from '@angular/router';

import { State } from "../store/reducers/index";

import * as auditModuleReducer from "../store/reducers/index";
import { AuditConduct } from "../models/audit-conduct.model";
import { QuestionActionTypes } from "../store/actions/questions.actions";
import { AuditConductActionTypes, LoadAuditConductTriggered } from "../store/actions/conducts.actions";
import { AuditCategoryActionTypes } from "../store/actions/audit-categories.actions";
import { ConductQuestionModel } from "../models/conduct-question.model";
import { SoftLabelConfigurationModel } from '../dependencies/models/softLabels-model';
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";

@Component({
    selector: "audit-select-questions-schedule",
    templateUrl: "./audit-select-questions-schedule.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditSelectQuestionsForSchedule {
    @Output() closeConduct = new EventEmitter<string>();
    @Output() editedConductData = new EventEmitter<any>();

    @Input("selectedAudit")
    set _selectedAudit(data: any) {
        this.editConduct = false;
        this.auditName = data.auditName;
        this.auditId = data.auditId;
        if (data.schedulingDetails) {
            this.checkSpecificQuestionsSelected();
        }
        this.initializeConductAddEditForm();
        // this.addConductForm.get('auditConductName').disable();
    }

    @Input("selectedAuditIdForConduct")
    set _selectedAuditIdForConduct(data: any) {
        if (data) {
            this.editConduct = false;
            this.auditId = data;
        }
    }

    @Input("selectedAuditNameForConduct")
    set _selectedAuditNameForConduct(data: any) {
        if (data) {
            this.editConduct = false;
            this.auditName = data;
        }
    }

    public ngDestroyed$ = new Subject();

    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    anyOperationInProgress$: Observable<boolean>;

    addConductForm: FormGroup;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;

    conduct: AuditConduct;

    auditId: string;
    conductId: string;
    projectId: string;

    selectedQuestions = [];
    selectedCategories = [];
    categoryQuestionsCounts = [];
    editData: any;
    auditName: string = null;
    isLinear: boolean = false;
    disableConduct: boolean = false;
    editConduct: boolean = false;
    isCompleted: boolean = false;
    removeStorage: boolean = false;
    showSelectAllNone: boolean = false;
    specificQuestionsIncluded: boolean = false;
    expandAll: boolean = false;
    categorySelected: string;
    unselectQuestionsCount: number = 0;
    specificQuestionsSelected: number = 0;
    categoryData: any;
    selectedCategoryIdData: any;
    unselectCategoryId: any;
    categoryToCheck: any;
    selectAllNone: any;
    filteredQuestionsData: any;
    minDate = new Date();

    public initSettings = {
        plugins: "advlist,link,table,preview,charmap,lists,powerpaste",
        branding: false,
        auto_focus: true,
        link_assume_external_targets: true,
        max_chars: "800",
        powerpaste_allow_local_images: true,
        powerpaste_word_import: 'prompt',
        powerpaste_html_import: 'prompt',
        toolbar: 'undo redo | bold italic | bullist numlist outdent indent| charactercount | link image code'
    };

    constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute, private store: Store<State>, private actionUpdates$: Actions, private cdRef: ChangeDetectorRef) {
        this.route.params.subscribe(routeParams => {
            this.projectId = routeParams.id;
        });

        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getUpsertAuditConductLoading));

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.LoadAuditConductByIdCompleted),
                tap(() => {
                    localStorage.removeItem('selectedQuestions');
                    localStorage.removeItem('selectedCategories');
                    localStorage.removeItem('reportConductName');
                    this.cancelConduct();
                    // let conductData = {
                    //     auditConductName: this.addConductForm.value.auditConductName,
                    //     auditConductDescription: this.addConductForm.value.auditConductDescription
                    // }
                    // if (this.conduct.conductId != undefined)
                    //     this.updatedId.emit(this.conduct.conductId);
                    this.disableConduct = false;
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AuditConductActionTypes.AuditConductFailed),
                tap(() => {
                    this.disableConduct = false;
                    this.cdRef.detectChanges();
                })
            ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionsByCategoryIdForConductsTriggered),
            tap(() => {
                this.unselectCategoryId = null;
                this.categoryData = null;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionsByCategoryIdForConductsCompleted),
            tap(() => {
                this.unselectCategoryId = null;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(AuditCategoryActionTypes.LoadAuditCategoriesForConductsEditTriggered),
            tap(() => {
                this.categorySelected = null;
                this.showSelectAllNone = false;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(AuditCategoryActionTypes.LoadAuditCategoriesForConductsEditCompleted),
            tap(() => {
                this.selectAllNone = null;
                this.showSelectAllNone = true;
                this.cdRef.detectChanges();
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionsByCategoryIdForConductsTriggered),
            tap(() => {
                if (localStorage.getItem('selectedCategoryFilter') != null) {
                    let categoryData = JSON.parse(localStorage.getItem('selectedCategoryFilter'));
                    this.categorySelected = categoryData.auditCategoryId;
                    let selectedQuestionDetails = new ConductQuestionModel();
                    selectedQuestionDetails.auditCategoryId = categoryData.auditCategoryId;
                    let selectedCategories = [];
                    selectedCategories = JSON.parse(localStorage.getItem('selectedCategories'));
                    if (selectedCategories && selectedCategories.length > 0 && selectedCategories.indexOf(categoryData.auditCategoryId) != -1)
                        selectedQuestionDetails.categorySelected = true;
                    else
                        selectedQuestionDetails.categorySelected = false;
                    selectedQuestionDetails.categoryCheckBoxClicked = false;
                    selectedQuestionDetails.unselectCategory = false;
                    selectedQuestionDetails.selectCategory = false;
                    selectedQuestionDetails.unselectAllQuestions = false;
                    selectedQuestionDetails.categoriesAllNone = false;
                    this.selectedCategoryIdData = selectedQuestionDetails;
                    let category = {
                        auditCategoryId: categoryData.auditCategoryId,
                        auditCategoryName: categoryData.auditCategoryName
                    }
                    this.categoryData = category;
                    this.cdRef.detectChanges();
                }
            })
        ).subscribe();

        this.actionUpdates$.pipe(
            takeUntil(this.ngDestroyed$),
            ofType(QuestionActionTypes.LoadQuestionsByFilterForConductsCompleted),
            tap((result: any) => {
                if (result && result.searchQuestions && result.searchQuestions.length > 0) {
                    this.selectedQuestions = [];
                    this.selectedCategories = [];
                    let filteredQuestions = [];
                    filteredQuestions = result.searchQuestions;
                    filteredQuestions.forEach(x => {
                        this.selectedQuestions.push(x);
                        if (x.isChecked && this.selectedCategories.indexOf(x.auditCategoryId) == -1)
                            this.selectedCategories.push(x.auditCategoryId);
                    });
                    if (this.selectedCategories.length > 0)
                        localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
                    localStorage.setItem('selectedQuestions', JSON.stringify(this.selectedQuestions));
                    this.filteredQuestionsData = this.selectedQuestions;
                    this.categoryToCheck = null;
                    this.unselectCategoryId = null;
                    this.selectAllNone = null;
                    this.cdRef.markForCheck();
                }
                else if (result.searchQuestions.length == 0) {
                    this.selectAllNone = false;
                    this.selectedQuestions = [];
                    localStorage.removeItem('selectedQuestions');
                    this.selectedCategories = [];
                    localStorage.removeItem('selectedCategories');
                    this.filteredQuestionsData = [];
                    this.cdRef.markForCheck();
                }
            })
        ).subscribe();
    }

    ngOnInit() {
        this.getSoftLabelConfigurations();
        this.firstFormGroup = this._formBuilder.group({ firstCtrl: ["", Validators.required] });
        this.secondFormGroup = this._formBuilder.group({ secondCtrl: ["", Validators.required] });
    }

    initializeConductAddEditForm() {
        this.addConductForm = new FormGroup({
            auditConductName: new FormControl(this.auditName, Validators.compose([Validators.required, Validators.maxLength(150)])),
            auditConductDescription: new FormControl(null, Validators.compose([Validators.maxLength(807)])),
            viewAuditConductDescription: new FormControl(false, []),
            isIncludeAllQuestions: new FormControl(true, []),
            isCompleted: new FormControl(false, []),
        });
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    addNewConduct() {
        this.disableConduct = true;
        this.checkForDuplicateCategoryQuestions();
        this.conduct = new AuditConduct();
        this.conduct = this.addConductForm.getRawValue();
        this.conduct.auditId = this.auditId;
        this.conduct.selectedQuestions = this.selectedQuestions;
        this.conduct.selectedCategories = this.selectedCategories;
        if (this.editConduct) {
            let editedConduct = new AuditConduct();
            editedConduct.conductId = this.editData.conductId;
            editedConduct.auditId = this.editData.auditId;
            editedConduct.isIncludeAllQuestions = this.conduct.isIncludeAllQuestions;
            editedConduct.isCompleted = this.conduct.isCompleted;
            this.editedConductData.emit(editedConduct);
            this.conduct.conductId = this.editData.conductId;
            this.conduct.timeStamp = this.editData.timeStamp;
        }
        this.conduct.projectId = this.projectId;
        this.store.dispatch(new LoadAuditConductTriggered(this.conduct));
    }

    checkForDuplicateCategoryQuestions() {
        this.selectedCategories.forEach(x => {
            this.removeQuestionsByCategoryId(x);
        });
    }

    cancelConduct() {
        localStorage.removeItem('selectedQuestions');
        localStorage.removeItem('selectedCategories');
        this.selectedQuestions = [];
        this.selectedCategories = [];
        this.categoryQuestionsCounts = [];
        this.removeStorage = false;
        this.closeConduct.emit("");
    }

    getSelectedCategoryData(data) {
        this.categoryData = data;
        this.categorySelected = data.auditCategoryId;
        this.cdRef.detectChanges();
    }

    getSelectedCategoryId(value) {
        if (value && value.selectCategory) {
            this.selectedCategories.push(value.auditCategoryId);
            localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
            this.categoryToCheck = null;
            this.unselectCategoryId = null;
            this.selectAllNone = null;
            this.cdRef.detectChanges();
        }
        if (value && value.unselectAllQuestions) {
            this.removeQuestionsByCategoryId(value.auditCategoryId);
            this.selectedCategoryIdData = value;
            this.unselectCategoryId = null;
            this.categoryToCheck = null;
            this.selectAllNone = null;
            this.cdRef.detectChanges();
        }
        if (value && value.categoriesAllNone) {
            let index = this.selectedCategories.indexOf(value.auditCategoryId);
            if (index == -1) {
                this.selectedCategories.push(value.auditCategoryId);
                this.categoryToCheck = null;
            }
            else {
                this.selectedCategories.splice(index, 1);
                this.removeQuestionsByCategoryId(value.auditCategoryId);
            }
            localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
            this.unselectCategoryId = null;
            this.cdRef.detectChanges();
        }
        if (value && (value.unselectAllQuestions == undefined || value.unselectAllQuestions == false) && value.categoryCheckBoxClicked) {
            let index = this.selectedCategories.indexOf(value.auditCategoryId);
            if (index == -1) {
                this.selectedCategories.push(value.auditCategoryId);
                this.categoryToCheck = null;
            }
            else {
                this.selectedCategories.splice(index, 1);
                this.removeQuestionsByCategoryId(value.auditCategoryId);
            }
            localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
            this.selectedCategoryIdData = value;
            this.unselectCategoryId = null;
            this.selectAllNone = null;
            this.cdRef.detectChanges();
        }
        else {
            this.selectedCategoryIdData = value;
            this.selectAllNone = null;
            this.cdRef.detectChanges();
        }
        if (value && value.unselectCategory) {
            let index = this.selectedCategories.indexOf(value.auditCategoryId);
            this.selectedCategories.splice(index, 1);
            localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
            this.unselectCategoryId = null;
            this.selectAllNone = null;
            this.cdRef.detectChanges();
        }
    }

    removeQuestionsByCategoryId(auditCategoryId) {
        let i = -1;
        while ((i = this.selectedQuestions.findIndex(x => x.auditCategoryId == auditCategoryId)) != -1) {
            let index = this.selectedQuestions.findIndex(x => x.auditCategoryId == auditCategoryId);
            this.selectedQuestions.splice(index, 1);
        }
        localStorage.setItem('selectedQuestions', JSON.stringify(this.selectedQuestions));
    }

    selectingAll() {
        this.selectAllNone = true;
        this.cdRef.markForCheck();
    }

    selectingNone() {
        this.selectAllNone = false;
        this.selectedQuestions = [];
        localStorage.removeItem('selectedQuestions');
        this.selectedCategories = [];
        localStorage.removeItem('selectedCategories');
        this.cdRef.markForCheck();
    }

    getCategoriesData(data) {
        this.selectedCategories = [];
        for (let i = 0; i < data.length; i++) {
            this.selectedCategories.push(data[i].auditCategoryId);
            if (data[i].subAuditCategories && data[i].subAuditCategories.length > 0) {
                this.recursiveSelectCategories(data[i].subAuditCategories);
            }
        }
        localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
    }

    recursiveSelectCategories(subCategoriesList) {
        for (let i = 0; i < subCategoriesList.length; i++) {
            this.selectedCategories.push(subCategoriesList[i].auditCategoryId);
            if (subCategoriesList[i].subAuditCategories && subCategoriesList[i].subAuditCategories.length > 0) {
                this.recursiveSelectCategories(subCategoriesList[i].subAuditCategories);
            }
        }
    }

    getCategoryQuestionsData(data) {
        this.selectedQuestions = [];
        for (let i = 0; i < data.length; i++) {
            let selectedQuestionDetails = new ConductQuestionModel();
            selectedQuestionDetails.questionId = data[i].questionId;
            selectedQuestionDetails.auditCategoryId = data[i].auditCategoryId;
            this.selectedQuestions.push(selectedQuestionDetails);
        }
        localStorage.setItem('selectedQuestions', JSON.stringify(this.selectedQuestions));
    }

    getQuestionsSelected(value) {
        if (value != undefined && value && value.length > 0 && this.unselectQuestionsCount <= 1) {
            this.selectedQuestions = [];
            for (let i = 0; i < value.length; i++) {
                let selectedQuestionDetails = new ConductQuestionModel();
                selectedQuestionDetails.questionId = value[i].questionId;
                selectedQuestionDetails.auditCategoryId = value[i].auditCategoryId;
                this.selectedQuestions.push(selectedQuestionDetails);
            }
            localStorage.setItem('selectedQuestions', JSON.stringify(this.selectedQuestions));
        }
        if (this.removeStorage == true) {
            this.selectedQuestions = [];
            localStorage.removeItem('selectedQuestions');
            this.selectedCategories = [];
            localStorage.removeItem('selectedCategories');
        }
        this.disableConduct = false;

        this.checkSpecificQuestionsSelected();
    }

    getCategoriesSelected(value) {
        if (value != undefined && value && value.length > 0 && this.unselectQuestionsCount <= 1) {
            this.selectedCategories = [];
            for (let i = 0; i < value.length; i++) {
                this.selectedCategories.push(value[i]);
            }
            localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
        }
        if (this.removeStorage == true) {
            this.selectedQuestions = [];
            localStorage.removeItem('selectedQuestions');
            this.selectedCategories = [];
            localStorage.removeItem('selectedCategories');
        }
        this.disableConduct = false;
    }

    getListOfQuestions(value) {
        let index = this.selectedQuestions.findIndex(x => x.questionId == value.questionId);
        if (index == -1) {
            this.selectedQuestions.push(value);
        }
        else {
            this.selectedQuestions.splice(index, 1);
        }
        localStorage.setItem('selectedQuestions', JSON.stringify(this.selectedQuestions));
        this.unselectCategoryId = null;
        this.selectAllNone = null;
        this.cdRef.detectChanges();
    }

    getListOfQuestionsAllNone(value) {
        let index = this.selectedQuestions.findIndex(x => x.questionId == value.questionId);
        if (index == -1) {
            this.selectedQuestions.push(value);
        }
        else {
            this.selectedQuestions.splice(index, 1);
        }
        localStorage.setItem('selectedQuestions', JSON.stringify(this.selectedQuestions));
        this.unselectCategoryId = null;
        this.cdRef.detectChanges();
    }

    getUnselectedCategory(value) {
        this.unselectCategoryId = value;
        this.cdRef.detectChanges();
    }

    getCategoryTocheck(value) {
        this.categoryToCheck = value;
        this.cdRef.detectChanges();
    }

    selectAllQuestions() {
        this.specificQuestionsIncluded = false;
        this.isCompleted = false;
        this.removeStorage = false;
        this.disableConduct = false;
    }

    unSelectAllQuestions() {
        this.specificQuestionsIncluded = true;
        this.categoryData = null;
        this.selectedCategoryIdData = null;
        this.isCompleted = true;
        this.unselectQuestionsCount = this.unselectQuestionsCount + 1;
        if (this.editConduct && this.unselectQuestionsCount <= 1)
            this.removeStorage = true;
        else
            this.removeStorage = false;
        this.checkSpecificQuestionsSelected();
    }

    getCategoryQuestionsCount(value) {
        let index = this.categoryQuestionsCounts.findIndex(x => x.auditCategoryId == value.auditCategoryId);
        if (index == -1) {
            this.categoryQuestionsCounts.push(value);
        }
        else {
            this.categoryQuestionsCounts[index].questionsCount = value.questionsCount;
        }
    }

    checkSpecificQuestionsSelected() {
        if (this.editConduct && this.unselectQuestionsCount <= 1 && this.categoryQuestionsCounts.length == 0) {
            if (localStorage.getItem('selectedQuestions') != 'undefined' && localStorage.getItem('selectedQuestions') != null) {
                let question = JSON.parse(localStorage.getItem('selectedQuestions'));
                this.specificQuestionsSelected = question.length;
                this.cdRef.markForCheck();
            }
            else {
                this.specificQuestionsSelected = 0;
                this.cdRef.markForCheck();
            }
        }
        else if (this.unselectQuestionsCount > 0) {
            if (this.categoryQuestionsCounts.length > 0) {
                let count = 0;
                this.categoryQuestionsCounts.forEach(x => {
                    count = count + x.questionsCount;
                });
                this.specificQuestionsSelected = count;
                this.cdRef.markForCheck();
            }
            else {
                this.specificQuestionsSelected = 0;
                this.cdRef.markForCheck();
            }
        }
    }

    checkValidation(event) {

    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}