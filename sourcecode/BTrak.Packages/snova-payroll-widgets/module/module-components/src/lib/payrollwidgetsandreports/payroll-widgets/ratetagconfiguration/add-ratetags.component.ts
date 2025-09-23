import { Component, EventEmitter, Inject, Output, ViewChild, ElementRef, ViewChildren, ChangeDetectorRef } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { Observable, Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { RateTagForModel } from "../../models/ratetag-for-model";
import { RateTagModel } from "../../models/ratetag-model";
import { PayRollService } from "../../services/PayRollService";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { CompanyRegistrationModel } from '../../models/company-registration-model';
import { CurrencyModel } from '../../models/currency-model';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { CompanyDetailsModel } from '../../models/company-details-model';
import { CookieService } from 'ngx-cookie-service';
import { RateTagConfigurationModel } from '../../models/RateTagConfigurationModel';
import { RateTagConfigurationInsertModel } from '../../models/ratetagconfigurationinputmodel';
import { HrBranchModel } from '../../models/branch-model';
import { RateTagRoleBranchConfigurationInputModel } from '../../models/ratetagrolebranchconfigurationinputmodel';
import { RateTagLibraryComponent } from '../ratetag/ratetag-library.component';


// tslint:disable-next-line: interface-name
export interface DialogData {
    roleBranchOrEmployeeInputModel: RateTagRoleBranchConfigurationInputModel;
    rateTagsList: RateTagForModel[];
    isPermission: boolean;
}

@Component({
    selector: "app-add-ratetags",
    templateUrl: "add-ratetags.component.html",
    styles: [`
    .ratetagfor-margin{
        margin-top: -5px;
       }
    `]
})

export class AddRateTagsComponent extends CustomAppBaseComponent {
    @Output() closePopup = new EventEmitter<string>();
    @ViewChild("rateTagFormDirective") rateTagFormDirective: FormGroupDirective;
    @ViewChild('tagInput') tagInput: ElementRef;

    rateTagConfigurationId: string;
    employeeRateTag: RateTagConfigurationModel;
    rateTagConfigurationForm: FormGroup;
    rateTagForNamesList: RateTagForModel[];
    isIndividual: boolean;
    rateTagInsertDetails: any = new RateTagConfigurationInsertModel();
    rows = [];
    isEditable = {};
    checked: number = 0;
    public ngDestroyed$ = new Subject();
    isAnyOperationIsInprogress: boolean;
    totalCount: number;
    rateTagData$: Observable<RateTagModel[]>;
    upsertRateTagConfigurationsInProgress: boolean;
    currencyList: any;
    company: CompanyDetailsModel;
    selectedCurrency: CurrencyModel;
    loggedUserDetails: any;
    rateTagsList: RateTagForModel[];
    rateInputTags: RateTagForModel[] = [];
    removable: boolean = true;
    selectable: boolean = true;
    rolesList: any[];
    branchList: HrBranchModel[];
    libraryRateTagList: RateTagConfigurationInsertModel[] = [];
    isDisabled: boolean;
    isScrollTrue: boolean = false;
    isRateTagDetailsLoading: boolean;
    isEdit: boolean = false;

    // tslint:disable-next-line: max-line-length
    constructor(public dialogRef: MatDialogRef<AddRateTagsComponent>, private cookieService: CookieService, public dialog: MatDialog,
        private toastr: ToastrService, private translateService: TranslateService, public dialogRef1: MatDialogRef<RateTagLibraryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData, public payRollService: PayRollService, private cdRef: ChangeDetectorRef) {
        super()
    }

    ngOnInit() {
        this.isRateTagDetailsLoading = true;
        this.rateTagForm();
        super.ngOnInit();
        this.getCurrencies();
        this.getAllRateTagForNames();
        
        if (this.data.roleBranchOrEmployeeInputModel) {
            this.rateTagInsertDetails.rateTagStartDate = this.data.roleBranchOrEmployeeInputModel.startDate;
            this.rateTagInsertDetails.rateTagEndDate = this.data.roleBranchOrEmployeeInputModel.endDate;
            this.isDisabled = this.data.roleBranchOrEmployeeInputModel.isDisabled;
        }
        if (this.data.rateTagsList != null) {
            this.isEdit = true;
            this.rateTagInsertDetails.rateTagDetails = this.data.rateTagsList;
            if (this.rateTagInsertDetails.rateTagDetails.length > 0) {
                this.rateTagInsertDetails.rateTagDetails = this.rateTagInsertDetails.rateTagDetails.filter(x => x.rateTagForNames.toLowerCase() != "remaining time");
                this.rateTagInsertDetails.rateTagDetails.filter(x => x.isSelected = true);
                this.isScrollTrue = true;
                this.isRateTagDetailsLoading = false;
                this.cdRef.detectChanges();
            }
            else {
                this.rateTagInsertDetails.rateTagDetails = [];
                this.isScrollTrue = true;
                this.isRateTagDetailsLoading = false;
            }
        }
        else {
            this.rateTagInsertDetails.rateTagDetails = [];
            this.isRateTagDetailsLoading = false;
        }
    }

    choseFromLibrary(): void {
        const dialogRef1 = this.dialog.open(RateTagLibraryComponent, {
            height: 'auto',
            width: 'calc(100vw)',
            disableClose: true,
            panelClass: 'ratetag-dialog',
            data: { roleBranchOrEmployeeInputModel: this.data.roleBranchOrEmployeeInputModel }
        });

        dialogRef1.afterClosed().subscribe((result) => {
            this.libraryRateTagList = result;
            if (result.length > 0) {
                this.libraryRateTagList.forEach(item => {
                    this.rateTagInsertDetails.rateTagDetails.push(item);
                });
            }
            this.rateTagInsertDetails.rateTagDetails = [...this.rateTagInsertDetails.rateTagDetails];
        });
    }


    ngAfterViewInit() {
        this.cdRef.detectChanges();
        this.isScrollTrue = true;
    }

    // Save row
    save(row, rowIndex) {
        this.isEditable[rowIndex] = !this.isEditable[rowIndex]
        row.isSelected = true;
        this.onCheckChange();

    }

    // Delete row
    delete(rowIndex) {
        this.isEditable[rowIndex] = !this.isEditable[rowIndex]
    }

    changePriority(value, rowIndex) {
        var count = this.rateTagInsertDetails.rateTagDetails.filter(x => x.priority == value && x.rowIndex != rowIndex)
        if (count > 0) {
            this.rateTagInsertDetails.rateTagDetails.filter(x => x.priority = null && x.rowIndex == rowIndex)
        }
        else {
            return;
        }
    }

    getCurrencies() {
        this.isAnyOperationIsInprogress = true;
        var companyModel = new CompanyRegistrationModel();
        companyModel.isArchived = false;
        this.payRollService.getCurrencies(companyModel).subscribe((response: any) => {
            if (response.success == true) {
                this.currencyList = response.data;
                this.getCompanyDetails();
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    getCompanyDetails() {
        this.company = this.cookieService.check(LocalStorageProperties.CompanyDetails) ? JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails)) : null;
        if (this.company && this.company.currencyId) {
            this.selectedCurrency = this.currencyList.find((x) => x.currencyId == this.company.currencyId);
            if (this.selectedCurrency) {
                this.rateTagInsertDetails.rateTagCurrencyId = this.selectedCurrency.currencyId;
            } else {
                this.selectedCurrency = new CurrencyModel();
                this.rateTagInsertDetails.rateTagCurrencyId = ConstantVariables.CurrencyId;
                this.selectedCurrency.currencyCode = ConstantVariables.CurrencyCode;
            }
        }
        else {
            this.selectedCurrency = new CurrencyModel();
            this.rateTagInsertDetails.rateTagCurrencyId = ConstantVariables.CurrencyId;
            this.selectedCurrency.currencyCode = ConstantVariables.CurrencyCode;
        }
    }

    getAllRateTags() {
        this.isAnyOperationIsInprogress = true;
        const rateTagModel = new RateTagModel();
        rateTagModel.isArchived = false;
        this.rateTagData$ = this.payRollService.getAllRateTags(rateTagModel) as Observable<RateTagModel[]>;
        this.rateTagData$.subscribe((response: any) => {
            if (response.success == true && response.data && response.data.length > 0) {
                this.rateTagInsertDetails.rateTagDetails = response.data;
                if (this.rateTagInsertDetails.rateTagDetails.length > 0) {
                    this.rateTagInsertDetails.rateTagDetails = this.rateTagInsertDetails.rateTagDetails.filter(x => x.rateTagForNames.toLowerCase() != "remaining time");
                }
                this.totalCount = response.data[0].totalCount
            }
            else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
            this.isAnyOperationIsInprogress = false;
        });
    }

    closePopover() {
        this.closePopup.emit("");
    }

    rateTagForm() {
        this.rateTagConfigurationForm = new FormGroup({
            rateTagName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.MaxLength)
                ])
            ),
            rateTagForId: new FormControl(null,
            ),
            rateTagCurrencyId: new FormControl(null),
            ratePerHour: new FormControl(null),
            ratePerHourMon: new FormControl(null),
            ratePerHourTue: new FormControl(null),
            ratePerHourWed: new FormControl(null),
            ratePerHourThu: new FormControl(null),
            ratePerHourFri: new FormControl(null),
            ratePerHourSat: new FormControl(null),
            ratePerHourSun: new FormControl(null),
            priority: new FormControl(null)
        });
    }

    getAllRateTagForNames() {
        this.isAnyOperationIsInprogress = true;
        const rateTagForModel = new RateTagForModel();
        this.payRollService.getAllRateTagForNames(rateTagForModel).subscribe((response: any) => {
            if (response.success == true) {
                this.rateTagForNamesList = response.data;
                this.rateTagsList = this.rateTagForNamesList
                this.isAnyOperationIsInprogress = false;
            } else {
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    saveRateTagConfigurations(isInsert: boolean) {
        if (isInsert) {
            if ((this.rateTagInsertDetails.rateTagDetails == null || this.rateTagInsertDetails.rateTagDetails.length == 0) && !this.isEdit) {
                this.toastr.error(this.translateService.instant("RATETAG.NORATETAGSMESSAGE"));
                this.upsertRateTagConfigurationsInProgress = false;
                return;
            }
            if (this.rateTagInsertDetails.rateTagDetails.length > 0 && (this.rateTagInsertDetails.rateTagDetails.filter((x) => x.isSelected).length == 0 && !this.isEdit)) {
                this.toastr.error(this.translateService.instant("RATETAG.SELECTRATETAGSMESSAGE"));
                this.upsertRateTagConfigurationsInProgress = false;
                return;
            }
            if (this.rateTagInsertDetails.rateTagDetails.filter((x) => x.priority == null && x.isSelected).length > 0) {
                this.toastr.error(this.translateService.instant("RATETAG.PRIORITYSELECTMESSAGE"));
                this.upsertRateTagConfigurationsInProgress = false;
                return;
            }

            this.rateTagInsertDetails.rateTagDetails = this.rateTagInsertDetails.rateTagDetails.filter((x) => x.isSelected);
            var prioritystatus;
            var ratetagstatus
            if (this.rateTagInsertDetails.rateTagDetails.filter((x) => x.priority == null && x.isSelected).length == 0) {
                prioritystatus = this.rateTagInsertDetails.rateTagDetails.some(item => {
                    let counter = 0;
                    for (const iterator of this.rateTagInsertDetails.rateTagDetails) {
                        if (iterator.priority === item.priority) {
                            counter += 1;
                        }
                    }
                    return counter > 1;
                });

                ratetagstatus = this.rateTagInsertDetails.rateTagDetails.some(item => {
                    let counter = 0;
                    for (const iterator of this.rateTagInsertDetails.rateTagDetails) {
                        if (iterator.rateTagId === item.rateTagId && item.isSelected == true) {
                            counter += 1;
                        }
                    }
                    return counter > 1;
                });
            }

            if (prioritystatus) {
                this.toastr.error(this.translateService.instant("RATETAG.PRIORITYSHOULDBEUNIQUE"));
                this.upsertRateTagConfigurationsInProgress = false;
                return;
            }
            if (ratetagstatus) {
                this.toastr.error(this.translateService.instant("RATETAG.ONEOFRATETAGALREADYEXISTS"));
                this.upsertRateTagConfigurationsInProgress = false;
                return;
            }
            if (this.rateTagInsertDetails.rateTagDetails.length > 0 && this.data.roleBranchOrEmployeeInputModel.priority != null) {
                this.rateTagInsertDetails.rateTagDetails.filter((x) => (
                    x.groupPriority = this.data.roleBranchOrEmployeeInputModel.priority
                    , x.roleId = this.data.roleBranchOrEmployeeInputModel.roleId
                    , x.branchId = this.data.roleBranchOrEmployeeInputModel.branchId));
                this.rateTagInsertDetails.rateTagDetails = [...this.rateTagInsertDetails.rateTagDetails];
                this.rateTagInsertDetails.groupPriority = this.data.roleBranchOrEmployeeInputModel.priority;
            }
            if (this.rateTagInsertDetails.rateTagDetails.filter((x) => x.isSelected).length > 0 || this.isEdit) {
                let ratetagInsertData = Object.assign({}, this.rateTagInsertDetails);
                ratetagInsertData.rateTagRoleBranchConfigurationId = this.data.roleBranchOrEmployeeInputModel.rateTagRoleBranchConfigurationId;
                ratetagInsertData.rateTagEmployeeId = this.data.roleBranchOrEmployeeInputModel.employeeId;
                ratetagInsertData.rateTagDetails = this.rateTagInsertDetails.rateTagDetails.filter((x) => x.isSelected);
                if (ratetagInsertData.rateTagEmployeeId && this.data.roleBranchOrEmployeeInputModel.isInHerited == true) {
                    this.rateTagInsertDetails.rateTagDetails.filter((x) => x.isOverRided = true);
                }

                if (ratetagInsertData.rateTagEmployeeId) {
                    this.payRollService.insertEmployeeRateTagDetails(ratetagInsertData).subscribe((response: any) => {
                        if (response.success == true) {
                            this.rateTagForNamesList = response.data;
                            this.isAnyOperationIsInprogress = false;
                            this.closePopover();
                            this.onNoClick();
                        } else {
                            this.toastr.error("", response.apiResponseMessages[0].message);
                            this.isAnyOperationIsInprogress = false;
                        }
                        this.upsertRateTagConfigurationsInProgress = false;
                    });
                }
                else {
                    if (ratetagInsertData.rateTagRoleBranchConfigurationId) {
                        this.payRollService.insertRateTagConfigurations(ratetagInsertData).subscribe((response: any) => {
                            if (response.success == true) {
                                this.rateTagForNamesList = response.data;
                                this.isAnyOperationIsInprogress = false;
                                this.closePopover();
                                this.onNoClick();
                            } else {
                                this.toastr.error("", response.apiResponseMessages[0].message);
                                this.isAnyOperationIsInprogress = false;
                            }
                            this.upsertRateTagConfigurationsInProgress = false;
                        });
                    }
                }
            } else {
                let validationMessage = this.translateService.instant("RATETAG.PLEASESELECTONERATETAG");
                this.toastr.error(validationMessage);
            }
        }
    }

    onNoClick(): void {
        if (this.rateTagFormDirective) {
            this.rateTagFormDirective.resetForm();
        }
        this.dialogRef.close();
    }

    onCheckChange() {
        if (this.rateTagInsertDetails && this.rateTagInsertDetails.rateTagDetails) {
            this.checked = this.rateTagInsertDetails.rateTagDetails.filter((x) => x.isSelected).length;
        } else {
            this.checked = 0;
        }
    }

    ngOnDestroy() {
        this.ngDestroyed$.next;
        this.ngDestroyed$.complete();
    }

    removeTags(tags) {
        const index = this.rateInputTags.indexOf(tags);
        if (index >= 0) {
            this.rateInputTags.splice(index, 1);
        }
    }

}
