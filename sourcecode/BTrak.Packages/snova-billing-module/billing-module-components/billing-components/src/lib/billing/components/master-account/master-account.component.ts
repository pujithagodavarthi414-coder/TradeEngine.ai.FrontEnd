import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren } from "@angular/core"
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { MasterAccountModel } from "../../models/master-account.model";
import { SiteService } from "../../services/site.service";
import { AppBaseComponent } from "../componentbase";

@Component({
    selector: "app-manage-master-account",
    templateUrl: "master-account.component.html",
    changeDetection: ChangeDetectionStrategy.Default
})

export class MasterAccountComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("addMasterAccountPopUp") masterAccountPopUp;
    @ViewChildren("archiveMasterAccountPopUp") archiveMasterAccountPopUp
    isLoading: boolean;
    masterAccountModel: MasterAccountModel[] = [];
    masterAccountModelList: GridDataResult;
    archiveMasterAccountModel: MasterAccountModel;
    state: State = {
        skip: 0,
        take: 10
    };
    masterAccoumtId: string;
    timestamp: any;
    masterAccountForm: FormGroup;
    isAddIsInProgress: boolean;
    isArchiveInProgress: boolean;
    minDate: any;

    constructor(private siteService : SiteService, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        super();
      this.getMasterAccount();
      this.clearForm();
    }
    ngOnInit() {
     super.ngOnInit();
    }

    getMasterAccount() {
        this.isLoading = true;
        var masterAccountmodel = new MasterAccountModel();
        masterAccountmodel.isArchived = false;
        this.siteService.getMasterAccount(masterAccountmodel).subscribe((response: any) => {
            this.isLoading = false;
            if(response.success) {
                this.masterAccountModel = response.data;
                if (this.masterAccountModel.length > 0) {
                    this.masterAccountModelList = {
                        data: this.masterAccountModel.slice(this.state.skip, this.state.take + this.state.skip),
                        total: this.masterAccountModel.length
                    }
                } else {
                    this.masterAccountModelList = {
                        data: [],
                        total: 0
                    }
                }
                this.cdRef.detectChanges();
            } else {
                this.toastr.error('', response.apiResponseMessages[0].message);
            }
        })
    }

    clearForm() {
        this.masterAccoumtId = null;
        this.timestamp = null;
        this.masterAccountForm = new FormGroup({
            id: new FormControl("", []),
            account : new FormControl("", [
                Validators.required,
                Validators.maxLength(250)
            ]),
            classNo: new FormControl(null, [Validators.required,Validators.max(999999999)]),
            classNoF: new FormControl(null, [Validators.required,Validators.max(999999999)]),
            class: new FormControl("", [Validators.required,Validators.maxLength(250)]),
            classF: new FormControl("", [Validators.required,Validators.maxLength(250)]),
            group: new FormControl("", [Validators.required,Validators.maxLength(250)]),
            groupF: new FormControl("", [Validators.required,Validators.maxLength(250)]),
            subGroup: new FormControl("", [Validators.required,Validators.maxLength(250)]),
            subGroupF: new FormControl("", [Validators.required,Validators.maxLength(250)]),
            accountNo: new FormControl(null, [Validators.required,Validators.max(999999999)]),
            accountNoF: new FormControl(null, [Validators.required,Validators.max(999999999)]),
            compte: new FormControl("", [Validators.required,Validators.maxLength(250)])
        })
    }

    upsertMasterAccount(formDirective: FormGroupDirective) {
        this.isAddIsInProgress = true;
        var upsertMasterAccountmodel = new MasterAccountModel();
        upsertMasterAccountmodel = this.masterAccountForm.value;
        upsertMasterAccountmodel.id = this.masterAccoumtId;
        upsertMasterAccountmodel.timeStamp = this.timestamp;
        this.siteService.upsertMasterAccount(upsertMasterAccountmodel).subscribe((response: any)=> {
            this.isAddIsInProgress = false;
            if(response.success) {
                this.masterAccountPopUp.forEach((p) => { p.closePopover(); });
                this.clearForm();
                this.getMasterAccount();
                formDirective.resetForm();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    archiveMasterAccount() {
        this.isArchiveInProgress = true;
        var upsertMasterAccountmodel = new MasterAccountModel();
        upsertMasterAccountmodel = this.archiveMasterAccountModel;
        upsertMasterAccountmodel.isArchived = true;
        this.siteService.upsertMasterAccount(upsertMasterAccountmodel).subscribe((response: any)=> {
            this.isArchiveInProgress = false;
            if(response.success) {
                this.archiveMasterAccountPopUp.forEach((p) => { p.closePopover(); });
                this.getMasterAccount();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    editMasterAccountPopUp(dataItem, masterAccountPopUp) {
       this.masterAccoumtId = dataItem.id;
       this.timestamp = dataItem.timeStamp;
       this.masterAccountForm.patchValue(dataItem);
       masterAccountPopUp.openPopover();
    }

    openMasterAccountPopUp(masterAccountPopUp) {
      masterAccountPopUp.openPopover();
      this.clearForm();
    }

    deleteMasterAccountPopUp(dataItem, masterAccountPopUp) {
        this.archiveMasterAccountModel = dataItem;
        masterAccountPopUp.openPopover();
     }

     dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort) {
            this.masterAccountModel = orderBy(this.masterAccountModel, this.state.sort);
        }
        this.masterAccountModelList = {
            data: this.masterAccountModel.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.masterAccountModel.length
        }
    }

    closeDeletePopup() {
        this.archiveMasterAccountPopUp.forEach((p) => { p.closePopover(); });
    }
    closePopUp() {
        this.masterAccountPopUp.forEach((p) => { p.closePopover(); });
    }

    selectedDate(event) {
       this.minDate = new Date(event);
       this.cdRef.detectChanges();
    }
}