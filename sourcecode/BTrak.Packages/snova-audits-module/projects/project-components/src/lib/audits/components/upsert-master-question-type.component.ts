import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { State } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, AbstractControl } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';

@Component({
    selector: 'app-fm-component-upsert-master-question-type',
    templateUrl: `upsert-master-question-type.component.html`
})

export class UpsertMasterQuestionTypeComponent extends CustomAppBaseComponent implements OnInit {
    isAnyOperationIsInprogress: boolean = false;
    auditsList: any;
    sortDirection: boolean;
    sortBy: string;
    fromDate: Date = new Date();
    toDate: Date = new Date();
    roleFeaturesIsInProgress$: Observable<boolean>;
    anyOperationInProgress$: Observable<boolean>;
    isEditQuestion = false;

    questionForm: FormGroup;
    questionOptions: FormArray;

    questionTypeForm: FormGroup;
    questionTypeOptions: FormArray;

    constructor(private cdRef: ChangeDetectorRef, private store: Store<State>,
        public dialog: MatDialog, private formBuilder: FormBuilder,private toastr:ToastrService,
        private translateService:TranslateService ) { super(); }

    ngOnInit() {
        super.ngOnInit();
        // this.roleFeaturesIsInProgress$ = this.store.pipe(select(sharedModuleReducers.getRoleFeaturesLoading));
        this.initializeQuestionForm();
        this.initializeQuestionTypeForm();
    }

    initializeQuestionForm() {
        this.questionForm = new FormGroup({
            questionId: new FormControl(null, []),
            auditCategoryId: new FormControl(null, []),
            questionTypeId: new FormControl(null, Validators.compose([Validators.required])),
            questionName: new FormControl(null, Validators.compose([Validators.maxLength(250), Validators.required])),
            questionHint: new FormControl(null, Validators.compose([Validators.maxLength(800)])),
            questionDescription: new FormControl(null, Validators.compose([Validators.maxLength(3007)])),
            viewQuestionDescription: new FormControl(false, []),
            questionResult: new FormControl(null, Validators.compose([])),
            questionTrueOrFalse: new FormControl(false, []),
            questionScore: new FormControl(null, []),
            timeStamp: new FormControl(null, []),
            isArchived: new FormControl(false, []),
            isOriginalQuestionTypeScore: new FormControl(false, []),
            isQuestionMandatory: new FormControl(false, []),
            questionTypeScore: new FormControl(null, Validators.compose([Validators.required, Validators.min(-99), Validators.max(99)])),
            questionOptionDate: new FormControl(null, Validators.compose([])),
            questionOptions: this.formBuilder.array([])
        });
    }

    initializeQuestionTypeForm() {
        this.questionTypeForm = new FormGroup({
            masterQuestionTypeId: new FormControl(null, []),
            masterQuestionTypeName: new FormControl(null, []),
            questionTypeId: new FormControl(null, []),
            questionTypeName: new FormControl(null, []),
            questionTypeOptions: this.formBuilder.array([]),
            isArchived: new FormControl(false, []),
            questionTypeScore: new FormControl(null, Validators.compose([Validators.required, Validators.min(-99), Validators.max(99)])),
            questionTypeDate: new FormControl(null, []),
            timeStamp: new FormControl(null, [])
        });
    }

    
    getQuestionTypeControls(): AbstractControl[] {
        return (this.questionTypeForm.get('questionTypeOptions') as FormArray).controls;
    }

    addQuestionTypeOption() {
        this.questionTypeOptions = this.questionTypeForm.get('questionTypeOptions') as FormArray;
        let length = this.questionTypeOptions.length;
        if (length < 10) {
            this.questionTypeOptions.insert(length, this.insertOption());
            if (length == 0) {
                this.questionTypeOptions.at(length).get('questionTypeOptionOrder').setValue(1);
            }
            else {
                let value = this.questionTypeOptions.at(length - 1).get('questionTypeOptionOrder').value;
                this.questionTypeOptions.at(length).get('questionTypeOptionOrder').setValue(value + 1);
            }
        }
        else {
            this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForOptionsExceed));
        }
    }

    insertOption() {
        return this.formBuilder.group({
            questionTypeId: new FormControl(null, []),
            questionTypeOptionId: new FormControl(null, []),
            questionTypeOptionResult: new FormControl(false, []),
            questionTypeOptionName: new FormControl(null, []),
            questionTypeOptionOrder: new FormControl(null, []),
            questionTypeOptionScore: new FormControl(null, []),
            canQuestionTypeOptionDeleted: new FormControl(false, [])
        });
    }

    removeOption(index, value) {
        if (value == true || value == 'true') {
            this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForQuestionTypeOption));
        }
        else {
            this.questionTypeOptions = this.questionTypeForm.get('questionTypeOptions') as FormArray;
            this.questionTypeOptions.removeAt(index);
        }
    }

    checkMaxOptions() {
        this.questionTypeOptions = this.questionTypeForm.get('questionTypeOptions') as FormArray;
        if (this.questionTypeOptions.length > 10)
            return true;
        else
            return false;
    }

    closeQuestionDialog() {
        // this.closeUpsertQuestion.emit('');
    }

    upsertQuestionType(){

    }

    checkButtonDisabled(){

    }

    onChangeQuestionTemplate(){

    }

    upsertQuestion(){
        
    }
}
