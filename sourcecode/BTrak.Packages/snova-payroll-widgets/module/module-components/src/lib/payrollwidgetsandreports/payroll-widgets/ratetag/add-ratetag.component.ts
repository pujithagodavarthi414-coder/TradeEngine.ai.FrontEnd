import { Component, OnInit, ViewChildren, ChangeDetectorRef, ViewChild, ElementRef, Input, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { CookieService } from "ngx-cookie-service";
import { RateTagModel } from "../../models/ratetag-model";
import { PayRollService } from "../../services/PayRollService";
import { RateTagForModel } from "../../models/ratetag-for-model";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { CustomTagModel } from '../../models/customTagsModel';
import { ToastrService } from 'ngx-toastr';
import { RateTagRoleBranchConfigurationInputModel } from '../../models/ratetagrolebranchconfigurationinputmodel';
@Component({
    selector: "app-add-ratetag",
    templateUrl: `add-ratetag.component.html`,
    styles: [`
    .ratetagfor-margin{
        margin-top: -6px;
       }
    `]
})

export class AddRateTagComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChild('tagInput') tagInput: ElementRef;
    @ViewChild("upsertRateTagPopUp") upsertRateTagPopUp;

    @Input("editRateTagDetails")
    set editRateTagDetails(data: RateTagModel) {
        if (!data) {
            this.rateTagDetailsModel = null;
            this.rateTagId = null;
            this.rateInputTags = [];
            this.clearForm();
        } else {
            this.rateInputTags = [];
            this.rateTagDetailsModel = data;
            this.rateTagId = data.rateTagId;
            this.timeStamp = data.timeStamp;
            this.rateTagForm.patchValue(data);
            if (data.rateTagDetailsList) {
                data.rateTagDetailsList.forEach(item => {
                    this.rateInputTags.push(item)
                });
            }
            else {
                this.rateInputTags = [];
            }
            this.makeMinAndMaxTimeMandatoryCheck();
            this.setValidator(null);
        }
    }
    @Input("roleBranchOrEmployeeInputModel")
    set roleBranchOrEmployeeInputModel(data: RateTagRoleBranchConfigurationInputModel) {
      this.roleBranchOrEmployeeInput = data;
    }
    

    @Output() closePopup = new EventEmitter<string>();
    @Output() getAllRateTags = new EventEmitter<string>();


    isAnyOperationIsInprogress = false;
    isArchived = false;
    isFiltersVisible: boolean;
    isThereAnError: boolean;
    rateTags: any;
    rateTagForNamesList: any;
    validationMessage: string;
    searchText: string;
    rateTagModel: RateTagModel;
    rateTagForm: FormGroup;
    rateTagHeaderName: any;
    timeStamp: any;
    rateTagForId: RateTagForModel[];
    rateTagId: any;
    isIndividual: boolean;
    rateTagsFiltered: any;
    selectedTagItems = [];
    temp: any;
    ratetagforlist: RateTagForModel[];
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    tag: string;
    tags: RateTagForModel[] = [];
    count: number;
    rateTagsInput: any;
    tagIds: any;
    rateInputTags: RateTagForModel[] = [];
    removable: boolean = true;
    selectable: boolean = true;
    rateTagsList: RateTagForModel[];
    isMaxRequired: boolean;
    isMinRequired: boolean;
    rateTagDetailsModel: RateTagModel;
    roleBranchOrEmployeeInput: RateTagRoleBranchConfigurationInputModel;


    constructor(public payRollService: PayRollService, private cookieService: CookieService, private toastr: ToastrService,
        private translateService: TranslateService, private cdRef: ChangeDetectorRef) {
        super()
    }

    ngOnInit() {
        super.ngOnInit();
        this.clearForm();
        this.getAllRateTagForNames();
    }

    getAllRateTagForNames() {
        this.isAnyOperationIsInprogress = true;
        const rateTagForModel = new RateTagForModel();
        this.payRollService.getAllRateTagForNames(rateTagForModel).subscribe((response: any) => {
            if (response.success == true) {
                this.rateTagForNamesList = response.data;
                this.rateTagsList = this.rateTagForNamesList
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            } else {
                this.isThereAnError = true;
                this.validationMessage = this.translateService.instant(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    clearForm() {
        this.isThereAnError = false;
        this.validationMessage = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.timeStamp = null;
        this.rateTagId = null;
        this.rateTagForId = null;
        this.isIndividual = false;
        this.rateInputTags = [];
        this.rateTagForm = new FormGroup({
            rateTagName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            rateTagForId: new FormControl([],
                Validators.compose([
                    Validators.required
                ])
            ),
            isPermanent: new FormControl(null),
            ratePerHour: new FormControl(null,
                Validators.compose([
                    Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)
                ])
            ),
            ratePerHourMon: new FormControl(null),
            ratePerHourTue: new FormControl(null),
            ratePerHourWed: new FormControl(null),
            ratePerHourThu: new FormControl(null),
            ratePerHourFri: new FormControl(null),
            ratePerHourSat: new FormControl(null),
            ratePerHourSun: new FormControl(null),
            priority: new FormControl(null),
            maxTime: new FormControl(null,
            ),
            minTime: new FormControl(null,
            )
        });
    }

    closePopover(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        if (this.rateTagId) {
            this.rateTagForm.patchValue(this.rateTagDetailsModel);
        } else {
            this.clearForm();
        }
        this.closePopup.emit("");
    }

    upsertRateTag(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.rateTagModel = new RateTagModel();
        this.rateTagModel = this.mapProperties(this.rateTagModel, this.rateTagForm.value);

        if (this.rateInputTags != null) {
            this.rateInputTags.forEach(x => {
                console.log(x.rateTagForId);
                this.rateTagModel.rateTagForIds.push(x)
            });
        }

        this.rateTagModel.rateTagName = this.rateTagModel.rateTagName.trim();
        this.rateTagModel.rateTagId = this.rateTagId;
        this.rateTagModel.timeStamp = this.timeStamp;
        if (this.roleBranchOrEmployeeInput != null) {
            if (this.roleBranchOrEmployeeInput.employeeId) {
                this.rateTagModel.employeeId = this.roleBranchOrEmployeeInput.employeeId;
            }
            else {
                this.rateTagModel.roleId = this.roleBranchOrEmployeeInput.roleId;
                this.rateTagModel.branchId = this.roleBranchOrEmployeeInput.branchId;
            }
        }

        this.payRollService.upsertRateTag(this.rateTagModel).subscribe((response: any) => {
            if (response.success == true) {
                this.getRateTags();
                this.closePopover(formDirective);
            } else {
                this.isThereAnError = true;
                this.validationMessage = this.translateService.instant(response.apiResponseMessages[0].message);
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        });
    }

    getRateTags() {
        this.getAllRateTags.emit("");
    }

    mapProperties(targetObject, sourceObject) {
        return Object.assign(targetObject, sourceObject)
    }

    setValidator(inputVal) {
        if (!inputVal) {
            if (this.rateTagForm.get("ratePerHour").value) {
                this.isIndividual = false;
            }
        } else {
            if (this.rateTagForm.get("ratePerHour").value) {
                this.isIndividual = false;
            } else {
                this.isIndividual = true;
            }
        }
        if (this.rateTagForm.get("ratePerHourMon").value && this.rateTagForm.get("ratePerHourTue").value
            && this.rateTagForm.get("ratePerHourWed").value && this.rateTagForm.get("ratePerHourThu").value
            && this.rateTagForm.get("ratePerHourFri").value && this.rateTagForm.get("ratePerHourSat").value
            && this.rateTagForm.get("ratePerHourSun").value && !inputVal) {
            this.isIndividual = true;
        }
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }
        const tempValues = this.temp.filter(tax => tax.isArchived == this.isArchived);
        const temp = tempValues.filter((ratetag => (((ratetag.rateTagName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.rateTagForNames == null ? null : ratetag.rateTagForNames.toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHour == null ? null : ratetag.ratePerHour.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourMon == null ? null : ratetag.ratePerHourMon.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourTue == null ? null : ratetag.ratePerHourTue.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourWed == null ? null : ratetag.ratePerHourWed.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourThu == null ? null : ratetag.ratePerHourThu.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourFri == null ? null : ratetag.ratePerHourFri.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourSun == null ? null : ratetag.ratePerHourSun.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.ratePerHourSun == null ? null : ratetag.ratePerHourSun.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.minTime == null ? null : ratetag.minTime.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (ratetag.maxTime == null ? null : ratetag.maxTime.toString().toLowerCase().indexOf(this.searchText) > -1))
        )));
        this.rateTags = temp;
    }

    omitSpecialChar(event) {
        var k;
        k = event.charCode;  //         k = event.keyCode;  (Both can be used)
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57) || k == 46);
    }

    searchRateTagForTags(event) {
        if (event != null) {
            var text = event.target.value.toLowerCase();
            this.rateTagForNamesList = this.rateTagsList.filter(ratetag => ((ratetag.rateTagForName.toString().toLowerCase().indexOf(text) > -1)))
        }
        else {
            this.rateTagForNamesList = this.rateTagsList;
        }
    }

    selectedTagValue(event) {
        var alreadyExistedRateTag = null;
        if (this.rateInputTags.length > 0) {
            alreadyExistedRateTag = this.rateInputTags.find(x => x.rateTagForId == event.option.value.rateTagForId);
        }

        var earlyovertimeresults = [];
        earlyovertimeresults = this.rateInputTags.filter(ratetag => ratetag.rateTagForName.toString().toLowerCase().indexOf("remaining time") > -1);

        if (alreadyExistedRateTag) {
            this.toastr.error("This tag is already selected");
        }
        else if ((event.option.value.rateTagForName.toLowerCase() == "remaining time" || earlyovertimeresults.length > 0) && this.rateInputTags.length >= 1) {
            this.toastr.error("Remaining time tag should be single it doesn't contain any combinations");
        }
        else {
            this.rateInputTags.push(event.option.value);
            this.tagInput.nativeElement.value = '';
        }
        this.makeMinAndMaxTimeMandatoryCheck();

        this.searchRateTagForTags(null);
        this.tagInput.nativeElement.blur();
    }

    removeTags(tags) {
        const index = this.rateInputTags.indexOf(tags);
        if (index >= 0) {
            this.rateInputTags.splice(index, 1);
        }
        this.makeMinAndMaxTimeMandatoryCheck();
        this.tagInput.nativeElement.blur();
    }

    minCheck() {
        if (this.rateTagForm.value.minTime != null && this.rateTagForm.value.maxTime != "") {
            var val = this.rateTagForm.value.maxTime;
            this.rateTagForm.controls["minTime"].setValidators([Validators.max(val)]);
            this.rateTagForm.controls["minTime"].updateValueAndValidity();
        }
        this.makeMinAndMaxTimeMandatory(true);
    }

    makeMinAndMaxTimeMandatoryCheck() {
        if (this.rateInputTags.length > 0) {
            var earlyovertimeresults = [];
            earlyovertimeresults = this.rateInputTags.filter((ratetag => (((ratetag.rateTagForName.toString().toLowerCase().indexOf("early") > -1)
                || (ratetag.rateTagForName.toString().toLowerCase().indexOf("overtime") > -1)
            ))));

            if (earlyovertimeresults.length > 0) {
                this.makeMinAndMaxTimeMandatory(true);
            }
            else {
                this.makeMinAndMaxTimeMandatory(false);
            }
        }
    }

    makeMinAndMaxTimeMandatory(isRequired) {
        if (isRequired) {
            if (this.rateTagForm.controls["maxTime"].value == null && this.rateTagForm.controls["minTime"].value) {
                this.isMinRequired = true;
                this.isMaxRequired = false;
                this.rateTagForm.controls["minTime"].setValidators([Validators.required]);
                this.rateTagForm.controls["minTime"].updateValueAndValidity();
                this.rateTagForm.controls["maxTime"].clearValidators();
                this.rateTagForm.controls["maxTime"].updateValueAndValidity();
            }
            else if (this.rateTagForm.controls["minTime"].value == null && this.rateTagForm.controls["maxTime"].value) {
                this.isMaxRequired = true;
                this.isMinRequired = false;
                this.rateTagForm.controls["maxTime"].setValidators([Validators.required]);
                this.rateTagForm.controls["maxTime"].updateValueAndValidity();
                this.rateTagForm.controls["minTime"].clearValidators();
                this.rateTagForm.controls["minTime"].updateValueAndValidity();
            }
            else {
                this.isMinRequired = true;
                this.isMaxRequired = true;
                this.rateTagForm.controls["minTime"].setValidators([Validators.required]);
                this.rateTagForm.controls["minTime"].updateValueAndValidity();
                this.rateTagForm.controls["maxTime"].setValidators([Validators.required]);
                this.rateTagForm.controls["maxTime"].updateValueAndValidity();
            }
        }
        else {
            this.isMinRequired = false;
            this.isMaxRequired = false;
            this.rateTagForm.controls["minTime"].clearValidators();
            this.rateTagForm.controls["minTime"].updateValueAndValidity();
            this.rateTagForm.controls["maxTime"].clearValidators();
            this.rateTagForm.controls["maxTime"].updateValueAndValidity();
        }
    }
}
