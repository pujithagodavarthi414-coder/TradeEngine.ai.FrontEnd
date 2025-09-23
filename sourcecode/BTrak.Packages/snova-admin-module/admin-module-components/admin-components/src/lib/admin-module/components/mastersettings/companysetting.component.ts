import { Component, OnInit, ViewChildren, ChangeDetectorRef, Input, ViewChild, Inject } from '@angular/core';
import { Validators, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { CompanysettingsModel, ModuleDetailsModel } from '../../models/hr-models/company-model';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { TimeSheetSubmissionModel } from '../../models/TimeSheetSubmissionModel';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { ConstantVariables } from '../../helpers/constant-variables';
import { FileResultModel } from '../../models/file-result-model';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { GetCompanySettingsCompleted, CompanyWorkItemStartFunctionalityRequired } from '../../store/actions/authentication.actions';
import { UploadProfileImageModel } from '../../models/upload-profile-image-model';
import { State } from '../../store/reducers';
import { HRManagementService } from '../../services/hr-management.service';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { ThemeService } from '../../services/theme.service';

import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import * as $_ from 'jquery';
import { WINDOW } from '../../helpers/window.helper';
import { TimeSheetIntervalModel } from '../../models/timesheet-interval.model';

const $ = $_;
/** @dynamic */
@Component({
    selector: 'app-fm-component-companysetting',
    templateUrl: `companysetting.component.html`,
    styles: [`
     .uploadloan-document { margin-top: 104px !important;}
    
    .warning-message{ color : #ff8c00 !important; }
    .error-message{ color : Red !important; }
    `
    ]
})

export class CompanysettingsComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("upsertCompanySettingsPopUp") upsertCompanySettingPopover;
    @ViewChildren("deleteCompanySettingsPopUp") deleteCompanySettingsPopover;
    @ViewChild('formDirective') formDirective: FormGroupDirective;
    @ViewChild("timeSheetFormDirective") timeSheetFormDirective: FormGroupDirective;
    @ViewChild('loandocuploader') loandocuploader;
    @ViewChild('logouploader') logouploader;
    @ViewChild('uploader') uploader;
    @ViewChild('stampdocuploader') stampDocUploader;

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    isFiltersVisible: boolean;
    mainLogo: string = ConstantVariables.DefaultMainLogo;
    paySlipLogo: string = ConstantVariables.DefaultPaySlipLogo;
    miniLogo: string = ConstantVariables.DefaultMiniLogo;
    stampDocument: string = ConstantVariables.DefaultStampDocument;
    isAnyOperationIsInprogress: boolean = false;
    roleFeaturesIsInProgress$: Observable<boolean>;
    isModulesOperationInprogress: boolean = false;
    companysettings: any;
    temp: any;
    validationMessage: string;
    isArchived: boolean = false;
    isThereAnError: boolean = false;
    companysettingName: string;
    selectedKeyIds = [];
    enabledModuleIds = []
    timeStamp: any;
    searchText: string;
    companysettingForm: FormGroup;
    companysettingModel: CompanysettingsModel;
    isCompanySettingArchived: boolean = false;
    description: string;
    key: string;
    isArchivedTypes: boolean = false;
    value: string;
    isMainLogouploadInprogrss = false;
    isPaySlipLogoloadInProgress: boolean = false;
    isModulesListLoadingInprogress = false;
    isMiniLogouploadInprogrss = false;
    company: any;
    companySettingsId: string;
    modulesList: any;
    isLoad = false;
    companymodulesList: any;
    selectedTheme: any;
    companyThemeDetails: any;
    fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/x-icon', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    fileResultModel: FileResultModel[];
    fileToUpload: File = null;
    public egretThemes;
    loadLogo = false;
    showExtensionError = false;
    showPayslipExtensionError = false;
    showMiniLogoExtensionError = false;
    timeSheetFrequencyList: any;
    timeSheetFrequency: any;
    selectedFrequecny: any;
    selectedIntervalFrequency: any;
    tempSelectedFrequency: any;
    tempSelectedIntervalFrequency: any;
    date = new Date();
    selectedDateValue: Date;
    tempSelectedDateValue: Date;
    timeSheetSubmissionNodel: TimeSheetSubmissionModel = new TimeSheetSubmissionModel();
    getTimeSheetModel: TimeSheetSubmissionModel;
    timeSheetFrequencyId: string;
    timeSheetIntervalId: string;
    timeSheetSubmissionForm: FormGroup
    timeSheetIntervalForm: FormGroup
    minDate: Date;
    loggedUserDetails: any;
    isRemoteSoftware: boolean = true;
    isLoanTermsDocumentUploadInprogress: boolean = false;
    isStampDocumentUploadInProgress: boolean;
    showLoanTermsDocumentExtensionError: boolean = false;
    showStampDocumentExtensionError: boolean;
    loanTermsDocument: string;
    localValue: any;
    isForRolesDropdown: boolean = false;
    isForLanguageDropdown: boolean = false;
    rolesDropDown: any[];
    checked: boolean;
    isChecked: boolean = true;
    isNotChecked: boolean = false;
    softLabels: any;
    documentsSettings: any;
    isFromSupportUser: boolean;
    isModulesLoaded: boolean = false;
    companyLanguages: any;
    fileSystemDropDown: boolean;
    companyFileSystems = [
        {
            name: "Local",
            code: "Local"
        },
        {
            name: "Azure",
            code: "Azure"
        }
    ];
    companyThemeId: string = null;
    intervalTimeStamp: any;

    ngOnInit() {
        this.clearForm();
        this.clearTimeSheetForm();
        this.clearTimeSheetIntervalForm();
        this.getTimeSheetInterval();
        super.ngOnInit();
        this.GetAllRoles();
        this.getAllCompanySettings();
        this.getAllTimesheetSubmissionFrequency();
        this.getTimeSheetSubmission();
        this.getLoggedInUser();
        this.getCompanyDocumentSettings();
        this.egretThemes = this.themeService.egretThemes;
    }

    constructor(private store: Store<State>, private cookieService: CookieService,
        private themeService: ThemeService,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService,
        private userService: HRManagementService, private masterService: MasterDataManagementService,
        private translateService: TranslateService, @Inject(WINDOW) private window: Window) { super(); this.getSoftLabels(); }

    getLoggedInUser() {
        this.userService.getLoggedInUser().subscribe((responseData: any) => {
            this.loggedUserDetails = responseData.data;
            this.isFromSupportUser = this.loggedUserDetails.roleName == "Support";
            this.getAllModulesList();
            this.getCompanyDetails(this.loggedUserDetails.companyId);
        });
    }

    getCompanyDetails(companyId: string) {
        let company = this.cookieService.check(LocalStorageProperties.CompanyDetails) ? JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails)) : null;
        if (company && company != undefined && company.industryId.toUpperCase() == '7499F5E3-0EF2-4044-B840-2411B68302F9')
            this.isRemoteSoftware = false;
    }

    GetAllRoles() {
        this.masterService.GetallRoles().subscribe((responseData: any) => {
            this.rolesDropDown = responseData.data;
        });
    }

    getAllCompanySettings() {
        this.isAnyOperationIsInprogress = true;
        var companysettingsModel = new CompanysettingsModel();
        companysettingsModel.isArchived = this.isArchivedTypes;
        companysettingsModel.isSystemApp = true;
        this.masterService.getAllCompanySettings(companysettingsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.company = response.data;
                localStorage.setItem("CompanySettings", JSON.stringify(this.company));
                this.temp = this.company;
                this.mainLogo = this.company.find(x => x.key.toLowerCase() == "mainlogo") != null ? this.company.find(x => x.key.toLowerCase() == "mainlogo").value : this.mainLogo;
                this.miniLogo = this.company.find(x => x.key.toLowerCase() == "minilogo") != null ? this.company.find(x => x.key.toLowerCase() == "minilogo").value : this.miniLogo;
                this.paySlipLogo = this.company.find(x => x.key.toLowerCase() == "paysliplogo") != null ? this.company.find(x => x.key.toLowerCase() == "paysliplogo").value : this.paySlipLogo;
                this.loanTermsDocument = this.company.find(x => x.key.toLowerCase() == "loantermsdocument") != null ? this.company.find(x => x.key.toLowerCase() == "loantermsdocument").value : this.loanTermsDocument;
                this.stampDocument = this.company.find(x => x.key.toLowerCase() == "stampDocument".toLowerCase()) != null ? this.company.find(x => x.key.toLowerCase() == "stampDocument".toLowerCase()).value : this.stampDocument
                if (this.loanTermsDocument == null) {
                    this.resetLogoToDefault('LoanTermsDocument');
                }
                if (this.stampDocument == null) {
                    this.resetLogoToDefault('stampDocument');
                }
                this.loadLogo = true;
                this.changeFavIcon();
                let indx = this.company.findIndex(x => x.key.toLowerCase() == "mainlogo");
                if (indx !== -1) { this.company.splice(indx, 1); }
                indx = this.company.findIndex(x => x.key.toLowerCase() == "minilogo");
                if (indx !== -1) { this.company.splice(indx, 1); }
                this.companyThemeDetails = this.company.find(x => x.key.toLowerCase() == "theme");
                indx = this.company.findIndex(x => x.key.toLowerCase() == "theme");
                if (indx > -1) { this.company.splice(indx, 1); }
                indx = this.company.findIndex(x => x.key.toLowerCase() == "loantermsdocument");
                if (indx !== -1) { this.company.splice(indx, 1); }
                indx = this.company.findIndex(x => x.key.toLowerCase() == "paysliplogo");
                if (indx !== -1) { this.company.splice(indx, 1); }
                indx = this.company.findIndex(x => x.key.toLowerCase() == "stampdocument");
                if (indx !== -1) { this.company.splice(indx, 1); }
                this.companyThemeDetails.companyThemeId = this.companyThemeDetails.value;
                this.themeService.changeTheme(this.companyThemeDetails);
                this.cookieService.set(LocalStorageProperties.CompanyMainLogo, this.mainLogo, null);
                this.cookieService.set(LocalStorageProperties.CompanyMiniLogo, this.miniLogo, null);
                this.clearForm();
                this.cdRef.detectChanges();
                this.store.dispatch(new GetCompanySettingsCompleted(this.company))
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    changeFavIcon() {
        if (document.getElementById('shortcut-fav-icon')) {
            document.getElementById('shortcut-fav-icon').setAttribute("href", this.miniLogo);
        }
        if (document.getElementById('main-logo-topbar')) {
            document.getElementById('main-logo-topbar').setAttribute("src", this.mainLogo);
        }
        if (document.getElementById('mini-logo-topbar')) {
            document.getElementById('mini-logo-topbar').setAttribute("src", this.miniLogo);
        }
    }

    onChange(genericFormKeyId: string, event) {
        if (event.checked) {
            this.selectedKeyIds.push(genericFormKeyId);
        } else {
            const index = this.selectedKeyIds.indexOf(genericFormKeyId)
            this.selectedKeyIds.splice(index, 1);
        }
    }
    onEnabledModuleChange(genericFormKeyId: string, event) {
        if (event.checked) {
            this.enabledModuleIds.push(genericFormKeyId);
        } else {
            const index = this.enabledModuleIds.indexOf(genericFormKeyId)
            this.enabledModuleIds.splice(index, 1);
        }
    }

    getAllModulesList() {
        this.isModulesListLoadingInprogress = true;
        var moduleDetailsModel = new ModuleDetailsModel();
        moduleDetailsModel.isArchived = this.isArchivedTypes;
        this.masterService.getAllModulesList(moduleDetailsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.modulesList = response.data;
                this.getAllCompanyModulesList();
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();

            }
        });
    }


    getAllTimesheetSubmissionFrequency() {
        this.isModulesListLoadingInprogress = true;
        this.masterService.GetTimeSheetSubmissionFrequency("").subscribe((response: any) => {
            if (response.success == true) {
                this.timeSheetFrequencyList = response.data;
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    getTimeSheetFrequency(TimeSheetFrequencyId) {
        this.timeSheetFrequency = TimeSheetFrequencyId;

    }

    getAllCompanyModulesList() {
        this.selectedKeyIds = [];
        this.enabledModuleIds = [];
        var moduleDetailsModel = new ModuleDetailsModel();
        moduleDetailsModel.isArchived = this.isArchivedTypes;
        this.masterService.getAllCompanyModulesList(moduleDetailsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.companymodulesList = response.data;
                for (let i = 0; i < this.modulesList.length; i++) {
                    for (let j = 0; j < this.companymodulesList.length; j++) {
                        if (this.modulesList[i].moduleId == this.companymodulesList[j].moduleId) {
                            this.modulesList[i].isActive = this.companymodulesList[j].isActive;
                            this.modulesList[i].isEnabled = this.companymodulesList[j].isEnabled;
                            if (this.companymodulesList[j].isActive == true)
                                this.selectedKeyIds.push(this.modulesList[i].moduleId);
                            if (this.modulesList[i].isEnabled == true)
                                this.enabledModuleIds.push(this.modulesList[i].moduleId);
                            break;
                        }
                    }
                }

                if (!this.isFromSupportUser) {
                    this.modulesList = Object.assign([], this.modulesList).filter(item => item.isEnabled == true);
                }
                this.isLoad = true;
                this.isModulesListLoadingInprogress = false;
                this.isModulesLoaded = true;
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
                this.isModulesLoaded = true;
            }
        });
    }

    uploadEventHandler(files: FileList, logoType: string) {
        logoType.toString().toLowerCase() == "mainlogo" ? this.isMainLogouploadInprogrss = true : logoType.toLowerCase() == 'stampDocument'.toLowerCase() ? this.isStampDocumentUploadInProgress = true :
            logoType == 'LoanTermsDocument' ? this.isLoanTermsDocumentUploadInprogress = true : logoType == 'paysliplogo' ? this.isPaySlipLogoloadInProgress = true : this.isMiniLogouploadInprogrss = true;
        const file = files.item(0);
        const moduleTypeId = 1;
        if (file != null && file != undefined) {
            if (this.fileTypes.includes(file.type)) {
                logoType.toString().toLowerCase() == "mainlogo" ? this.showExtensionError = false : logoType == 'LoanTermsDocument' ?
                    this.showLoanTermsDocumentExtensionError = false : logoType.toLowerCase() == 'StampDocument'.toLowerCase() ?
                        this.showStampDocumentExtensionError = false : logoType == 'paysliplogo' ? this.showPayslipExtensionError = false : this.showMiniLogoExtensionError = false;
                const formData = new FormData();
                formData.append("file", file);
                this.masterService.UploadFile(formData, moduleTypeId)
                    .subscribe((responseData: any) => {
                        const success = responseData.success;
                        if (success) {
                            this.fileResultModel = responseData.data;
                            this.uploadProfileImage(logoType);
                        } else {
                            this.toastr.warning("", responseData.apiResponseMessages[0].message);
                        }
                    });
            } else {
                if (logoType.toLowerCase() != 'LoanTermsDocument'.toLowerCase() && logoType.toLowerCase() != 'StampDocument'.toLowerCase()) {
                    this.isMainLogouploadInprogrss = false;
                    this.isMiniLogouploadInprogrss = false;
                    this.isPaySlipLogoloadInProgress = false;
                    this.isStampDocumentUploadInProgress = false;
                    logoType.toString().toLowerCase() == "mainlogo" ? this.showExtensionError = true : logoType.toString().toLowerCase() == "paysliplogo" ? this.showPayslipExtensionError = true : this.showMiniLogoExtensionError = true;
                }
                else {
                    if (logoType == 'LoanTermsDocument') {
                        this.isLoanTermsDocumentUploadInprogress = false;
                        this.showLoanTermsDocumentExtensionError = true;
                    }
                    else if (logoType.toLowerCase() == 'StampDocument'.toLowerCase()) {
                        this.isStampDocumentUploadInProgress = false;
                        this.showStampDocumentExtensionError = true;
                    }
                }
            }
        }
        else {
            if (logoType != 'LoanTermsDocument' && logoType != 'StampDocument') {
                this.isPaySlipLogoloadInProgress = false;
                this.isMainLogouploadInprogrss = false;
                this.isMiniLogouploadInprogrss = false;
                this.isStampDocumentUploadInProgress = false;
            }
            else {
                if (logoType == 'LoanTermsDocument') {
                    this.isLoanTermsDocumentUploadInprogress = false;
                }
                else if (logoType == 'StampDocument') {
                    this.isStampDocumentUploadInProgress = false;
                }
            }
        }
        this.loandocuploader.nativeElement.value = '';
        this.logouploader.nativeElement.value = '';
        this.uploader.nativeElement.value = '';
        this.stampDocUploader.nativeElement.value = '';
    }

    uploadProfileImage(logoType: string) {
        const uploadProfileImageModel: any = {};
        uploadProfileImageModel.logoType = logoType;
        if (this.fileResultModel) {
            uploadProfileImageModel.profileImage = this.fileResultModel[0].filePath;
        } else {
            uploadProfileImageModel.profileImage = null;
        }
        this.masterService.upsertCompanyLogo(uploadProfileImageModel).subscribe((response: any) => {
            if (response.success == true) {
                logoType == 'mainlogo' ? (this.mainLogo = response.data) : logoType == 'LoanTermsDocument' ? (this.loanTermsDocument = response.data) : logoType.toLowerCase() == 'StampDocument'.toLowerCase() ? (this.stampDocument = response.data) : logoType == "paysliplogo" ? (this.paySlipLogo = response.data) : (this.miniLogo = response.data);
                if (logoType.toLowerCase() == 'StampDocument'.toLowerCase()) {
                    this.stampDocument = response.data;
                }
                if (logoType != 'LoanTermsDocument' && logoType.toLowerCase() != 'StampDocument'.toLowerCase()) {
                    this.changeFavIcon();
                    this.cookieService.set(LocalStorageProperties.CompanyMainLogo, this.mainLogo, null);
                    this.cookieService.set(LocalStorageProperties.CompanyMiniLogo, this.miniLogo, null);
                    this.isPaySlipLogoloadInProgress = false;
                    this.isMainLogouploadInprogrss = false;
                    this.isMiniLogouploadInprogrss = false;
                } else if (logoType.toLowerCase() == 'StampDocument'.toLowerCase()) {
                    this.isStampDocumentUploadInProgress = false;
                    this.toastr.success("Stamp uploaded successfully");
                }
                else {
                    this.toastr.success("Uploaded successfully.");
                    this.isLoanTermsDocumentUploadInprogress = false;
                }

                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();

            }
        });
    }

    resetLogoToDefault(logoType: string) {
        const uploadProfileImageModel: any = {};
        uploadProfileImageModel.logoType = logoType;
        uploadProfileImageModel.profileImage = logoType == "mainlogo" ? ConstantVariables.DefaultMainLogo
            : logoType == "minilogo" ? ConstantVariables.DefaultMiniLogo : logoType == "StampDocument" ? ConstantVariables.DefaultStampDocument : logoType == "paysliplogo" ? ConstantVariables.DefaultPaySlipLogo : ConstantVariables.DefaultLoanDocTemplate;
        if (logoType.toLowerCase() == 'stampDocument'.toLowerCase()) {
            uploadProfileImageModel.profileImage = ConstantVariables.DefaultStampDocument;
        }
        logoType.toString().toLowerCase() == "mainlogo" ? this.showExtensionError = false
            : logoType.toString().toLowerCase() == "minilogo" ? this.showMiniLogoExtensionError = false : logoType.toString().toLowerCase() == "paysliplogo" ? this.showPayslipExtensionError = false : this.showLoanTermsDocumentExtensionError = false;
        this.masterService.upsertCompanyLogo(uploadProfileImageModel).subscribe((response: any) => {
            if (response.success == true) {
                logoType == 'mainlogo' ? (this.mainLogo = response.data) : logoType == 'LoanTermsDocument' ? (this.loanTermsDocument = response.data) : logoType.toLowerCase() == 'StampDocument'.toLowerCase() ? (this.stampDocument = response.data) : logoType == "paysliplogo" ? (this.paySlipLogo = response.data) : (this.miniLogo = response.data);

                if (logoType.toLowerCase() == 'stampDocument'.toLowerCase()) {
                    this.stampDocument = response.data;
                    this.cdRef.detectChanges();
                }
                this.changeFavIcon();
                this.isPaySlipLogoloadInProgress = false;
                this.isMainLogouploadInprogrss = false;
                this.isMiniLogouploadInprogrss = false;
                this.cdRef.detectChanges();
                this.fileResultModel = null;
                if (logoType == 'LoanTermsDocument') {
                    this.toastr.success("File reseted successfully.");
                } else if (logoType.toLowerCase() == 'StampDocument'.toLowerCase()) {
                    this.toastr.success('Stamp reseted successfully')
                }
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();

            }
        });
    }

    resetThemeToDefault() {
        this.changeTheme(this.companyThemeDetails);
    }

    changeTheme(theme) {
        this.themeService.changeTheme(theme);
        this.selectedTheme = theme;
    }

    ApplySelectedTheme() {
        this.companysettingForm.patchValue(this.companyThemeDetails);
        this.companysettingForm.get('value').setValue(this.selectedTheme.companyThemeId);
        this.companySettingsId = this.companyThemeDetails.companySettingsId;
        this.timeStamp = this.companyThemeDetails.timeStamp;
        this.upsertCompanysettings(null);
    }

    UpsertTimeSheetSubmission() {
        this.timeSheetSubmissionNodel.activeFrom = this.selectedDateValue
        this.timeSheetSubmissionNodel.timeSheetFrequencyId = this.timeSheetFrequency == null ? this.selectedFrequecny : this.timeSheetFrequency;
        this.masterService.upsertTimeSheetSubmission(this.timeSheetSubmissionNodel).subscribe((response: any) => {
            if (response.success == true) {
                this.timeSheetFrequencyId = response.data;
                this.cdRef.detectChanges();
                if (this.tempSelectedDateValue == null) {
                    this.toastr.success("", this.translateService.instant("VIEWTIMESHEET.TIMESHEETSUBMISSIONADDEDSUCCESSFULLY"));
                }
                else {
                    this.toastr.success("", this.translateService.instant("VIEWTIMESHEET.TIMESHEETSUBMISSIONEDITEDSUCCESSFULLY"));
                }
                this.getTimeSheetSubmission();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
                this.toastr.error(this.validationMessage);
            }
        });
    }

    UpsertTimeSheetInterval() {
        var timesheetIntervalModel = new TimeSheetIntervalModel();
        timesheetIntervalModel = this.timeSheetIntervalForm.value
        timesheetIntervalModel.timeSheetIntervalId = this.timeSheetIntervalId;
        timesheetIntervalModel.timeStamp = this.intervalTimeStamp;
        this.masterService.upsertTimeSheetInterval(timesheetIntervalModel).subscribe((response: any) => {
            if (response.success == true) {
                this.timeSheetIntervalId = response.data;
                this.cdRef.detectChanges();
                if (this.tempSelectedIntervalFrequency == null) {
                    this.toastr.success("", this.translateService.instant("VIEWTIMESHEET.TIMESHEETSUBMISSIONADDEDSUCCESSFULLY"));
                }
                else {
                    this.toastr.success("", this.translateService.instant("VIEWTIMESHEET.TIMESHEETSUBMISSIONEDITEDSUCCESSFULLY"));
                }
                this.getTimeSheetInterval();
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.cdRef.detectChanges();
                this.toastr.error(this.validationMessage);
            }
        });
    }

    resetTimeSheetSubmissionToDefault() {
        this.selectedDateValue = this.tempSelectedDateValue;
        this.selectedFrequecny = this.tempSelectedFrequency;
    }

    getDateChange(event: MatDatepickerInputEvent<Date>) {
        this.date = event.target.value;
    }

    getTimeSheetSubmission() {
        this.isModulesListLoadingInprogress = true;
        let model = new TimeSheetSubmissionModel();
        this.masterService.getTimeSheetSubmission(model).subscribe((response: any) => {
            if (response.success == true) {
                this.getTimeSheetModel = response.data;
                if (this.getTimeSheetModel) {
                    this.selectedDateValue = this.getTimeSheetModel[0].activeFrom;
                    this.tempSelectedDateValue = this.selectedDateValue;
                    this.selectedFrequecny = this.getTimeSheetModel[0].timeSheetFrequencyId;
                    this.tempSelectedFrequency = this.selectedFrequecny;
                    this.minDate = this.selectedDateValue;
                }
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
                this.toastr.error(this.validationMessage);
            }
        });
    }

    getTimeSheetInterval() {
        let model = new TimeSheetIntervalModel();
        this.masterService.getTimeSheetInterval(model).subscribe((response: any) => {
            if (response.success == true) {
                this.getTimeSheetModel = response.data;
                if (this.getTimeSheetModel) {
                    this.selectedIntervalFrequency = this.getTimeSheetModel[0].timeSheetFrequencyId;
                    this.timeSheetIntervalId = this.getTimeSheetModel[0].timeSheetIntervalId;
                    this.intervalTimeStamp = this.getTimeSheetModel[0].timeStamp;
                }
                this.cdRef.detectChanges();
            }
            else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.cdRef.detectChanges();
                this.toastr.error(this.validationMessage);
            }
        });
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    clearForm() {
        this.companySettingsId = null;
        this.companysettingName = null;
        this.key = null;
        this.value = null;
        this.isFiltersVisible = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.searchText = null;
        this.description = null;
        this.isAnyOperationIsInprogress = false;
        this.isModulesOperationInprogress = false;
        this.companysettingForm = new FormGroup({
            key: new FormControl({ value: '', disabled: true }),
            value: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(800)
                ])
            ),
            description: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.DescriptionLength)
                ])
            ),
            checkedValue: new FormControl(null,
                Validators.compose([
                ])
            ),
            selectedValue: new FormControl(null,
                Validators.compose([
                ])
            ),
            selectedLanguage: new FormControl(null,
                Validators.compose([
                ])
            ),
            selectedFileSystem: new FormControl(null,
                Validators.compose([
                ])
            ),
        })
    }
    clearTimeSheetForm() {
        this.timeSheetSubmissionForm = new FormGroup({
            timeSheetFrequencyId: new FormControl(this.selectedDateValue,
                Validators.compose([
                    Validators.required
                ])
            ),
            dateFrom: new FormControl(this.selectedFrequecny,
                Validators.compose([
                    Validators.required
                ])

            ),
        })
    }

    clearTimeSheetIntervalForm() {
        this.timeSheetIntervalForm = new FormGroup({
            timeSheetFrequencyId: new FormControl('',
                Validators.compose([
                ])
            ),
        })
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }

        const temp = this.temp.filter(companies => (companies.companysettingName == null ? null : companies.companysettingName.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (companies.key == null ? null : companies.key.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (companies.description == null ? null : companies.description.toString().toLowerCase().indexOf(this.searchText) > -1)
            || (companies.value == null ? null : companies.value.toString().toLowerCase().indexOf(this.searchText) > -1));

        this.company = temp;
    }

    editCompanySettingPopupOpen(row, upsertCompanySettingsPopUp) {
        this.companysettingForm.patchValue(row);
        this.localValue = row.value;
        this.isForRolesDropdown = false;
        this.isForLanguageDropdown = false;
        this.fileSystemDropDown = false;
        if (this.localValue == "0" || this.localValue == "1") {
            if (this.localValue == "1") {
                this.companysettingForm.get('checkedValue').patchValue(true);
                this.checked = true;
            } else {
                this.companysettingForm.get('checkedValue').patchValue(false);
                this.checked = false;
            }
            this.companysettingForm.controls["value"].clearValidators();
            this.companysettingForm.controls["selectedValue"].clearValidators();
            this.companysettingForm.controls["selectedLanguage"].clearValidators();
        } else if (row.key == "DefaultGoogleUserRole") {
            this.companysettingForm.controls["value"].clearValidators();
            this.companysettingForm.controls["checkedValue"].clearValidators();
            this.checked = true;
            this.isForRolesDropdown = true;
            this.isForLanguageDropdown = false;
            this.companysettingForm.controls["selectedValue"].setValidators([Validators.required,
            Validators.required
            ]);
            this.companysettingForm.get('selectedValue').patchValue(this.localValue);
        } else if (row.key == "DefaultLanguage") {
            this.companysettingForm.controls["value"].clearValidators();
            this.companysettingForm.controls["checkedValue"].clearValidators();
            this.checked = true;
            this.isForRolesDropdown = false;
            this.isForLanguageDropdown = true;
            this.companysettingForm.controls["selectedLanguage"].setValidators([Validators.required,
            Validators.required
            ]);
            this.companysettingForm.get('selectedLanguage').patchValue(this.localValue);
        } else if (row.key == "FileSystem") {
            this.companysettingForm.controls["value"].clearValidators();
            this.companysettingForm.controls["checkedValue"].clearValidators();
            this.checked = true;
            this.fileSystemDropDown = true;
            this.companysettingForm.controls["selectedFileSystem"].setValidators([Validators.required,
            Validators.required
            ]);
            this.companysettingForm.get('selectedFileSystem').patchValue(this.localValue);
        } else {
            this.companysettingForm.controls["value"].setValidators([Validators.required,
            Validators.required,
            Validators.maxLength(ConstantVariables.DescriptionLength)
            ]);
            this.checked = true;
            this.companysettingForm.controls["selectedValue"].clearValidators();
            this.companysettingForm.controls["selectedLanguage"].clearValidators();
            this.companysettingForm.controls["selectedFileSystem"].clearValidators();
        }
        this.companysettingForm.controls["value"].updateValueAndValidity();
        this.companySettingsId = row.companySettingsId;
        this.timeStamp = row.timeStamp;
        this.companysettings = 'COMPANYSETTINGS.EDITCOMPANYSETTINGS';
        upsertCompanySettingsPopUp.openPopover();
    }

    closeUpsertCompanySettingPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertCompanySettingPopover.forEach((p) => p.closePopover());
    }

    createCompanySettingsPopupOpen(upsertCompanySettingsPopUp) {
        this.clearForm();
        upsertCompanySettingsPopUp.openPopover();
        this.companysettings = 'COMPANYSETTINGS.ADDCOMPANYSETTINGS';
    }

    upsertCompanysettings(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        this.companysettingModel = this.companysettingForm.value;
        if (this.localValue == "0" || this.localValue == "1") {
            this.companysettingModel.value = this.companysettingForm.get("checkedValue").value == true ? '1' : '0';
        } else if (this.isForRolesDropdown) {
            this.companysettingModel.value = this.companysettingForm.get("selectedValue").value
        } else if (this.isForLanguageDropdown) {
            this.companysettingModel.value = this.companysettingForm.get("selectedLanguage").value
        } else if (this.fileSystemDropDown) {
            this.companysettingModel.value = this.companysettingForm.get("selectedFileSystem").value
        }
        this.companysettingModel.key = this.companysettingForm.get('key').value.toString().trim();
        if (this.companysettingModel.key == "Theme") {
            this.companyThemeId = this.companysettingModel.value;
        }
        this.companysettingModel.value = this.companysettingModel.value.toString().trim();
        this.companysettingModel.description = this.companysettingModel.description.toString().trim();
        this.companysettingModel.companySettingsId = this.companySettingsId;
        this.companysettingModel.timeStamp = this.timeStamp;
        this.companysettingModel.isVisible = true;

        this.masterService.upsertCompanysettings(this.companysettingModel).subscribe((response: any) => {
            if (response.success == true) {
                this.store.dispatch(new CompanyWorkItemStartFunctionalityRequired());
                this.upsertCompanySettingPopover.forEach((p) => p.closePopover());
                this.getTimeSheetSubmission();
                this.getCompanyDocumentSettings();
                this.clearForm();
                if (formDirective)
                    formDirective.resetForm();
                this.getAllCompanySettings();
                let companyTheme = this.cookieService.get(LocalStorageProperties.CompanyTheme);
                if (companyTheme && this.companyThemeId) {
                    let theme = JSON.parse(companyTheme);
                    theme.companyThemeId = this.companyThemeId.toUpperCase();
                    let themeJson = JSON.stringify(theme);
                    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
                    this.cookieService.set(LocalStorageProperties.CompanyTheme, themeJson, null, environment.cookiePath, this.window.location.hostname, false, "Strict");
                    this.companyThemeId = null;
                }

            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    deleteCompanySettingsPopUpOpen(row, deleteCompanySettingsPopUp) {
        this.companySettingsId = row.companySettingsId;
        this.key = row.key;
        this.description = row.description;
        this.value = row.value;
        this.timeStamp = row.timeStamp;
        this.isCompanySettingArchived = !this.isArchivedTypes;
        deleteCompanySettingsPopUp.openPopover();
    }

    deleteCompanysettings() {
        this.isAnyOperationIsInprogress = true;
        this.companysettingModel = new CompanysettingsModel();
        this.companysettingModel.companySettingsId = this.companySettingsId;
        this.companysettingModel.key = this.key;
        this.companysettingModel.value = this.value;
        this.companysettingModel.description = this.description;
        this.companysettingModel.timeStamp = this.timeStamp;
        this.companysettingModel.isArchived = !this.isArchivedTypes;
        this.companysettingModel.isVisible = true;
        this.masterService.upsertCompanysettings(this.companysettingModel).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteCompanySettingsPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getAllCompanySettings();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    upsertCompanyModule() {
        this.isModulesOperationInprogress = true;
        let moduleDetailsModel = new ModuleDetailsModel();
        moduleDetailsModel.moduleIds = this.selectedKeyIds;
        moduleDetailsModel.isActive = true;
        if (this.isFromSupportUser) {
            moduleDetailsModel.moduleIds = this.enabledModuleIds;
            moduleDetailsModel.isFromSupportUser = true;
            moduleDetailsModel.isEnabled = true;
        }
        this.masterService.upsertCompanyModule(moduleDetailsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.clearForm();
                this.getAllModulesList();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isModulesOperationInprogress = false;
            }
        });
    }

    closeDeleteCompanySettingDialog() {
        this.clearForm();
        this.deleteCompanySettingsPopover.forEach((p) => p.closePopover());
    }

    closeSearch() {
        this.filterByName(null);
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    }

    getCompanyDocumentSettings() {
        var companySettingsModel = new CompanysettingsModel();
        companySettingsModel.isArchived = false;
        this.masterService.getCompanyDocumentsSettings(companySettingsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.documentsSettings = response.data;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    fitContent(optionalParameters: any) {

        if (optionalParameters['gridsterView']) {

            if ($(optionalParameters['gridsterViewSelector'] + ' .gridster-noset  datatable-body').length > 0) {

                var appHeight = $(optionalParameters['gridsterViewSelector']).height();
                $(optionalParameters['gridsterViewSelector'] + ' .gridster-noset .activity-data').height(appHeight - 45);

                $(optionalParameters['gridsterViewSelector'] + ' .gridster-noset datatable-body').height(150);
                $(optionalParameters['gridsterViewSelector'] + ' .gridster-noset  datatable-body').addClass("widget-scroll");
            }

        } else if (optionalParameters['popupView']) {

            if ($(optionalParameters['popupViewSelector'] + ' .gridster-noset  datatable-body').length > 0) {

                $(optionalParameters['popupViewSelector'] + ' .gridster-noset datatable-body').height(150);
                $(optionalParameters['popupViewSelector'] + ' .gridster-noset  datatable-body').addClass("widget-scroll");
                $(optionalParameters['popupViewSelector'] + ' .gridster-noset').css({ "height": "calc(100vh - 120px)" });
            }

        } else if (optionalParameters['individualPageView']) {

            if ($(optionalParameters['individualPageSelector'] + ' .gridster-noset  datatable-body').length > 0) {

                $(optionalParameters['individualPageSelector'] + ' .gridster-noset  datatable-body').height(150);
                $(optionalParameters['individualPageSelector'] + ' .gridster-noset  datatable-body').addClass("widget-scroll");
                $(optionalParameters['individualPageSelector'] + ' .gridster-noset').css({ "height": "calc(100vh - 120px)" });
            }

        }

    }

} 