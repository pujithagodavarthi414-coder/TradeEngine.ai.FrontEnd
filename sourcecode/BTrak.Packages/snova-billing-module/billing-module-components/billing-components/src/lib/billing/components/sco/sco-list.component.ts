import { ChangeDetectorRef, Component, Inject, ViewChild, ViewChildren } from "@angular/core";
import { ScoModel } from "../../models/sco-model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { State, process } from "@progress/kendo-data-query";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { LeadSubmissionDialogComponent } from "../lead-templates/lead-submission-dialog.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import * as _ from 'underscore';
import { MatOption } from "@angular/material/core";
import { ScoEmailModel } from "../../models/scoEmailModel";
export interface DialogData {
    rowData: any;
}
@Component({
    selector: "app-billing-component-sco-list",
    templateUrl: "sco-list.component.html"
})
export class ScoListComponent {
    @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChildren("mailSCOPopover") mailSCOPopover;
    scoList: any;
    temp: any;
    isAnyOperationIsInprogress: boolean = false;
    searchText: string;
    state: State = {
        skip: 0,
        take: 20,
    };
    isArchived: boolean = false;
    rowData: any;
    emailForm = new FormGroup({
        to: new FormControl("", [Validators.required]),
        cc: new FormControl("", []),
        bcc: new FormControl("",[]),

    });
    selectedTos: any;
    allTos: any[]=[];
    users: any;
    selectedToMails: any;
    scoId: string;
    selectedSCO: any;
    selectedToMobile: any;
    rowIndex: any;

    constructor(private BillingDashboardService: BillingDashboardService, private cdRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        public dialogRef: MatDialogRef<LeadSubmissionDialogComponent>) {
            this.rowData = this.data.rowData;
    }

    ngOnInit() {
        this.getAllSco();
        this.getAllWareHouseUsers();
    }

    getAllSco() {
        let scoList = new ScoModel();
        scoList.leadSubmissionId = this.rowData.leadFormId;
        scoList.isArchived = false;
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.getSco(scoList)
            .subscribe((responseData: any) => {
                this.temp = responseData.data;
                this.scoList = responseData.data;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((lead) =>
            (lead.fullName.toLowerCase().indexOf(this.searchText) > -1)));
        this.scoList =temp;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    closeSearch() {
        
    }

    getAllWareHouseUsers() {
        this.isAnyOperationIsInprogress = true;
        this.BillingDashboardService.getAllWareHouseUsers()
            .subscribe((responseData: any) => {
                this.users = responseData.data;
                this.allTos=this.users;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
    }
    opemMailPopup(data, mailPopover, rowIndex) {
        this.selectedSCO = data;
        this.selectedToMails =null;
        this.emailForm = new FormGroup({
            to: new FormControl(null, [Validators.required]),
            cc: new FormControl(null, []),
            bcc: new FormControl(null,[]),
    
        });
        mailPopover.openPopover();
        this.cdRef.markForCheck();
    }
    shareEmail(){
        let scoMail = new ScoEmailModel();
        this.BillingDashboardService.sendSCOAcceptanceMail(scoMail).subscribe((result: any) => {
            if (result.success) {
                this.closeSendEmailPopover();
            }});
    }

    closeSendEmailPopover() {
        this.mailSCOPopover.forEach((p) => p.closePopover());
    }


    compareSelectedToFn(users: any, selectedusers: any) {
        if (users == selectedusers) {
            return true;
        } else {
            return false;
        }
    }

    getSelectedTos() {

        let tosvalues;
        if (Array.isArray(this.emailForm.value.to))
        tosvalues = this.emailForm.value.to;
        else
        tosvalues = this.emailForm.value.to.split(',');

        const component = tosvalues;
        const index = component.indexOf(0);
        if (index > -1) {
            component.splice(index, 1);
        }
        const tosList = this.allTos;
        const selectedUsersList = _.filter(tosList, function (to) {
            return component.toString().includes(to.id);
        })
        const toNames = selectedUsersList.map((x) => x.fullName);
        this.selectedTos = toNames.toString();
        const toEmails = selectedUsersList.map((x) => x.userName);
        this.selectedToMails = toEmails.toString();
        const toMobile = selectedUsersList.map((x) => x.mobileNo);
        this.selectedToMobile = toMobile.toString();
    }

    toggleAllTosSelected() {
        if (this.allSelected.selected) {
            this.emailForm.controls['to'].patchValue([
                0, ...this.allTos.map(item => item.id)
            ]);
        } else {
            this.emailForm.controls['to'].patchValue([]);
        }
        this.getSelectedTos()
    }
    toggleToPerOne(event) {
        if (this.allSelected.selected) {
            this.allSelected.deselect();
            return false;
        }
        if (
            this.emailForm.controls['to'].value.length ===
            this.allTos.length
        ) {
            this.allSelected.select();
        }
    }
}