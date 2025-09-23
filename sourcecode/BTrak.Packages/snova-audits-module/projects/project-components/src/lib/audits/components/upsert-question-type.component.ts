import { Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef, Input, Output, EventEmitter } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, AbstractControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import { AuditService } from "../services/audits.service";
import { QuestionType, QuestionTypeOptions } from "../models/question-type.model";
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";


@Component({
    selector: "upsert-question-type",
    templateUrl: "upsert-question-type.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class UpsertQuestionTypeComponent {
    @Output() closeQuestionTypeDialog = new EventEmitter<any>();

    @Input("isQuestionTypeEdit")
    set _isQuestionTypeEdit(data: boolean) {
        if (data || data == false) {
            this.isQuestionTypeEdit = data;
        }
        else {
            this.isQuestionTypeEdit = false;
        }
    }

    @Input("questionTypeDetails")
    set _questionTypeDetails(data: any) {
        if (data) {
            this.questionTypeDetails = data;
            this.initializeQuestionTypeForm();
            if (this.isQuestionTypeEdit) {
                this.initializeQuestionTypeData();
            }
        }
        else {
            this.initializeQuestionTypeForm();
            this.addQuestionTypeOption();
        }
    }

    @Input("masterQuestionTypeId")
    set _masterQuestionTypeId(data: string) {
        if (data) {
            this.selectedMasterQuestionTypeId = data;
        }
    }

    @Input("isMasterQuestion")
    set _isMasterQuestion(data: boolean) {
        this.isMasterQuestion = data;
        if (this.isMasterQuestion) {
            this.questionTypeForm.get('questionTypeName').clearValidators();
            this.questionTypeForm.get('questionTypeName').updateValueAndValidity();
            this.questionTypeForm.get('masterQuestionTypeId').setValue(this.selectedMasterQuestionTypeId);
            ;
        }
    }

    questionTypeForm: FormGroup;
    questionTypeOptions: FormArray;

    questionTypeDetails: any;
    intimepicker: any;

    masterQuestionTypeList = [];

    validationMessage: string;
    selectedMasterQuestionTypeId: string;

    isQuestionTypeEdit: boolean = false;
    isMasterQuestion: boolean = false;
    anyOperationIsInprogress: boolean = false;
    isFormValid: boolean = false;
    dropdownQuestionTypeId = ConstantVariables.DropdownQuestionTypeId.toLowerCase();
    dateQuestionTypeId = ConstantVariables.DateQuestionTypeId.toLowerCase();
    numericQuestionTypeId = ConstantVariables.NumericQuestionTypeId.toLowerCase();
    textQuestionTypeId = ConstantVariables.TextQuestionTypeId.toLowerCase();
    timeQuestionTypeId = ConstantVariables.TimeQuestionTypeId.toLowerCase();
    booleanQuestionTypeId = ConstantVariables.BooleanQuestionTypeId.toLowerCase();

    public initSettings = {
        plugins: "powerpaste",
        branding: false,
        powerpaste_allow_local_images: true,
        powerpaste_word_import: 'prompt',
        powerpaste_html_import: 'prompt',
        toolbar: 'link image code'
    };
    softLabels: SoftLabelConfigurationModel[];
    constructor(private dialog: MatDialog, private auditService: AuditService, private formBuilder: FormBuilder, private toastr: ToastrService, private translateService: TranslateService, private cdRef: ChangeDetectorRef, private softLabelsPipe: SoftLabelPipe) {
        // this.initializeQuestionTypeForm();
        // this.loadMasterQuestionTypes();
        this.auditService.getMasterData().subscribe(data => {
            if (data) {
                this.masterQuestionTypeList = data;
            }
        });
        this.getSoftLabelConfigurations();
    }
  
    getSoftLabelConfigurations() {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    ngOnInit() {
        if (this.selectedMasterQuestionTypeId) {
            this.questionTypeForm.get('masterQuestionTypeId').setValue(this.selectedMasterQuestionTypeId);
            this.onChangMasterQuestionType(this.selectedMasterQuestionTypeId);
        }
    }

    initializeQuestionTypeData() {
        this.questionTypeForm.patchValue(this.questionTypeDetails);
        if (this.questionTypeDetails.questionTypeOptions && this.questionTypeDetails.questionTypeOptions.length > 0) {
            if (this.questionTypeDetails.masterQuestionTypeId == this.dropdownQuestionTypeId || this.questionTypeDetails.masterQuestionTypeId == this.booleanQuestionTypeId) {
                this.questionTypeOptions = this.questionTypeForm.get('questionTypeOptions') as FormArray;
                this.questionTypeDetails.questionTypeOptions.forEach(x => {
                    this.questionTypeOptions.push(this.formBuilder.group({
                        questionTypeId: x.questionTypeId,
                        questionTypeOptionId: x.questionTypeOptionId,
                        questionTypeOptionResult: x.questionTypeOptionResult,
                        questionTypeOptionName: x.questionTypeOptionName,
                        questionTypeOptionOrder: x.questionTypeOptionOrder,
                        questionTypeOptionScore: x.questionTypeOptionScore,
                        canQuestionTypeOptionDeleted: x.canQuestionTypeOptionDeleted
                    }));
                });
                this.questionTypeForm.controls["questionTypeScore"].clearValidators();
                this.questionTypeForm.get("questionTypeScore").updateValueAndValidity();
            } else if (this.questionTypeDetails.masterQuestionTypeId == this.dateQuestionTypeId ||
                this.questionTypeDetails.masterQuestionTypeId == this.numericQuestionTypeId ||
                this.questionTypeDetails.masterQuestionTypeId == this.timeQuestionTypeId ||
                this.questionTypeDetails.masterQuestionTypeId == this.textQuestionTypeId) {
                this.questionTypeForm.get('questionTypeScore').setValue(this.questionTypeDetails.questionTypeOptions[0].questionTypeOptionScore);
                this.questionTypeForm.controls["questionTypeScore"].setValidators([Validators.min(-99), Validators.max(99)]);
                this.questionTypeForm.get("questionTypeScore").updateValueAndValidity();
                this.questionTypeForm.get("questionTypeDate").disable();
            }
        }
        this.questionTypeForm.get('masterQuestionTypeId').disable();
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

    checkRemoveProbability() {
        this.questionTypeOptions = this.questionTypeForm.get('questionTypeOptions') as FormArray;
        if (this.questionTypeOptions.length > 1)
            return true;
        else
            return false;
    }

    upsertQuestionType() {
        this.anyOperationIsInprogress = true;
        let typeNameError = false;
        let typeNameLengthError = false;
        let optionNameError = false;
        let optionNameLengthError = false;
        let optionNameDuplicateError = false;
        // let optionResultError = false;
        let optionOrderError = false;
        let optionOrderEmptyError = false;
        let optionScoreError = false;
        let resultCount = 0;
        let questionTypeModel = new QuestionType();
        questionTypeModel = this.questionTypeForm.getRawValue();
        if (questionTypeModel.questionTypeName == null || questionTypeModel.questionTypeName == '') {
            typeNameError = true;
            this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForTypeName));
        }
        if (questionTypeModel.questionTypeName && questionTypeModel.questionTypeName.length > 150) {
            typeNameLengthError = true;
            this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForTypeNameExceed));
        }
        if (questionTypeModel.masterQuestionTypeId == this.dropdownQuestionTypeId || questionTypeModel.masterQuestionTypeId == this.booleanQuestionTypeId) {
            questionTypeModel.questionTypeOptions.forEach(x => {
                if (x.questionTypeOptionName == null || x.questionTypeOptionName == '') {
                    optionNameError = true;
                }
                if (x.questionTypeOptionName && x.questionTypeOptionName.length > 150) {
                    optionNameLengthError = true;
                }
                if (x.questionTypeOptionOrder == null || x.questionTypeOptionOrder == '') {
                    optionOrderEmptyError = true;
                }
                if (x.questionTypeOptionScore == null || x.questionTypeOptionScore == '') {
                    // optionScoreError = true;
                    x.questionTypeOptionScore = 0;
                }
                // if (x.questionTypeOptionResult == false) {
                //     resultCount = resultCount + 1;
                // }
            });
            // if (resultCount == questionTypeModel.questionTypeOptions.length) {
            //     optionResultError = true;
            //     this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForOptionResult));
            // }
            let order = [];
            let optionName = [];
            questionTypeModel.questionTypeOptions.forEach(x => {
                order.push(x.questionTypeOptionOrder);
                if (x.questionTypeOptionName != null && x.questionTypeOptionName != '')
                    optionName.push(x.questionTypeOptionName.trim());
            });
            if ((new Set(order)).size !== order.length) {
                optionOrderError = true;
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForOptionOrder));
            }
            if ((new Set(optionName)).size !== optionName.length) {
                optionNameDuplicateError = true;
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForOptionNameDuplicte));
            }
            if (optionNameError) {
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForOptionName));
            }
            if (optionNameLengthError) {
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForOptionNameExceed));
            }
            if (optionOrderEmptyError) {
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForOptionOrderEmpty));
            }
            // if (optionScoreError) {
            //     this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForOptionScore));
            // }
        }
        else if (questionTypeModel.masterQuestionTypeId == this.dateQuestionTypeId ||
            questionTypeModel.masterQuestionTypeId == this.numericQuestionTypeId ||
            questionTypeModel.masterQuestionTypeId == this.timeQuestionTypeId ||
            questionTypeModel.masterQuestionTypeId == this.textQuestionTypeId) {
            questionTypeModel.questionTypeOptions = [];
            let dateTypeOption = new QuestionTypeOptions();
            dateTypeOption.questionTypeOptionScore = this.questionTypeForm.get('questionTypeScore').value;
            if (dateTypeOption.questionTypeOptionScore == null || dateTypeOption.questionTypeOptionScore == '') {
                dateTypeOption.questionTypeOptionScore = 0;
            }
            if (this.isQuestionTypeEdit && this.questionTypeDetails.masterQuestionTypeId != questionTypeModel.masterQuestionTypeId) {
                dateTypeOption.questionTypeOptionId = null;
            }
            else if (this.isQuestionTypeEdit && this.questionTypeDetails.masterQuestionTypeId == questionTypeModel.masterQuestionTypeId) {
                dateTypeOption.questionTypeOptionId = this.questionTypeDetails.questionTypeOptions[0].questionTypeOptionId;
            }
            questionTypeModel.questionTypeOptions.push(dateTypeOption);
        }
        if (!typeNameError && !typeNameLengthError && !optionNameError && !optionNameLengthError && !optionNameDuplicateError && !optionOrderError && !optionOrderEmptyError && !optionScoreError) {
            this.auditService.upsertQuestionType(questionTypeModel).subscribe((result: any) => {
                if (result.success) {
                    this.anyOperationIsInprogress = false;
                    this.closeQuestionTypeDialog.emit(result);
                    this.cdRef.markForCheck();
                }
                else {
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toastr.error(this.validationMessage);
                    this.anyOperationIsInprogress = false;
                    this.cdRef.markForCheck();
                }
            });
        }
        else {
            this.anyOperationIsInprogress = false;
        }
    }

    closeDialog() {
        this.closeQuestionTypeDialog.emit(null);
    }

    initializeQuestionTypeForm() {
        this.questionTypeForm = new FormGroup({
            masterQuestionTypeId: new FormControl(null, []),
            masterQuestionTypeName: new FormControl(null, []),
            questionTypeId: new FormControl(null, []),
            questionTypeName: new FormControl(null, []),
            questionTypeOptions: this.formBuilder.array([]),
            isArchived: new FormControl(false, []),
            questionTypeScore: new FormControl(null, Validators.compose([Validators.min(-99), Validators.max(99)])),
            questionTypeDate: new FormControl(null, []),
            timeStamp: new FormControl(null, [])
        });
    }

    onChangMasterQuestionType(masterQuestionTypeId) {
        if (masterQuestionTypeId.toLowerCase() == this.dropdownQuestionTypeId.toLowerCase() || masterQuestionTypeId.toLowerCase() == this.booleanQuestionTypeId) {
            this.questionTypeForm.controls["questionTypeScore"].clearValidators();
            this.questionTypeForm.get("questionTypeScore").updateValueAndValidity();
        } else if (masterQuestionTypeId.toLowerCase() == this.dateQuestionTypeId ||
            masterQuestionTypeId.toLowerCase() == this.numericQuestionTypeId ||
            masterQuestionTypeId.toLowerCase() == this.timeQuestionTypeId ||
            masterQuestionTypeId.toLowerCase() == this.textQuestionTypeId) {
            this.questionTypeForm.controls["questionTypeScore"].setValidators([Validators.min(-99), Validators.max(99)]);
            this.questionTypeForm.get("questionTypeScore").updateValueAndValidity();
            this.questionTypeForm.get("questionTypeDate").disable();
        }
    }

    closeintime() {
        this.intimepicker = "";
    }
}