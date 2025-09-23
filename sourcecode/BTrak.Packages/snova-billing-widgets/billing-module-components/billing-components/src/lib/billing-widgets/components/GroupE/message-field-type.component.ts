import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChildren, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import { Form } from "formiojs";
import { ToastrService } from "ngx-toastr";
import { GRDMOdel } from "../../models/GRD-Model";
import { SiteService } from "../../services/site.service";
import { AppBaseComponent } from "../componentbase";
import * as _ from "underscore";
import { MessageFieldType } from "../../models/message-field.model";
import { BillingDashboardService } from "../../services/billing-dashboard.service";

@Component({
    selector: "app-manage-message-type",
    templateUrl: "message-field-type.component.html",
    changeDetection: ChangeDetectionStrategy.Default
})

export class MessageFieldTypeComponent extends AppBaseComponent implements OnInit {
    messageFieldModel: MessageFieldType[] = [];
    messageTypeModel: GridDataResult;
    archiveMessageFieldModel: MessageFieldType;
    anyOperationInProgress: boolean;
    addOperationInProgress: boolean;
    archiveOperationInprogress: boolean;
    selectedgrid: string;
    selectedGrdNames: string;
    state: State = {
        skip: 0,
        take: 10
    };
    entryForm: FormGroup;
    timeStamp: any;
    messageId: string;
    gREMOdel: any[];
    @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChildren("addEntryFormPopUp") entryFormPopups;
    @ViewChildren("archiveEntryFormPopUp") archiveEntryFormPopups;

    constructor(private toastr: ToastrService,
        private siteService: SiteService,
        private billingService: BillingDashboardService,
        private cdRef: ChangeDetectorRef) {
        super();
        this.getMessageFields();
        this.getgRD();
        this.clearForm();

    }
    ngOnInit() {
        super.ngOnInit();
    }

    clearForm() {
        this.entryForm = new FormGroup({
            displayText: new FormControl("", [
                Validators.required,
                Validators.maxLength(250)
            ]),
            messageType: new FormControl("", [
                Validators.required,
                Validators.maxLength(250)
            ]),
            grdiD: new FormControl([], [Validators.required,
            Validators.maxLength(250)]),
            isDisplay: new FormControl("", [])
        })
    }

    closePopUp() {
        this.entryFormPopups.forEach((p) => { p.closePopover(); });
    }
    closeArchivePopUp() {
        this.archiveEntryFormPopups.forEach((p) => { p.closePopover(); });
    }

    getgRD() {
        var sitemodel = new GRDMOdel();
        sitemodel.isArchived = false;
        this.siteService.getGRD(sitemodel).subscribe((response: any) => {

            if (response.success) {
                this.gREMOdel = response.data;
                this.cdRef.detectChanges();
            } else {
                this.toastr.error('', response.apiResponseMessages[0].message);
            }
        })
    }


    editEntryFormPopUp(dataItem, entryFormPopUp) {
        this.messageId = dataItem.messageId;
        this.timeStamp = dataItem.timeStamp;
        let selectedGrdIds = [];
        this.selectedgrid = dataItem.selectedGrdIds;
        if(this.selectedgrid) {
            selectedGrdIds = this.selectedgrid.split(",");
            selectedGrdIds = selectedGrdIds.map(v => v.toLowerCase())
        }
        else {
            selectedGrdIds = []
        }
        this.entryForm = new FormGroup({
            displayText: new FormControl(dataItem.displayText, [
                Validators.required,
                Validators.maxLength(250)
            ]),
            messageType: new FormControl(dataItem.messageType, [
                Validators.required,
                Validators.maxLength(250)
            ]),
            grdiD: new FormControl(selectedGrdIds, [Validators.required]),
            isDisplay: new FormControl(dataItem.isDisplay, [])
        })
        if(selectedGrdIds.length == this.gREMOdel.length) {
            selectedGrdIds.push(0);
        }
        this.entryForm.get('grdiD').patchValue(selectedGrdIds);
        this.selectedGrdNames = dataItem.selectedGrdNames;

        entryFormPopUp.openPopover();
    }

    deleteEntryFormPopUp(dataItem, sitePopUp) {
        this.archiveMessageFieldModel = dataItem;
        sitePopUp.openPopover();
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort) {
            this.messageFieldModel = orderBy(this.messageFieldModel, this.state.sort);
        }
        this.messageTypeModel = {
            data: this.messageFieldModel.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.messageFieldModel.length
        }
    }

    upsertEntryFormField() {
        this.addOperationInProgress = true;
        var entryFormModel = new MessageFieldType();
        entryFormModel = this.entryForm.value;
        entryFormModel.messageId = this.messageId;
        entryFormModel.timeStamp = this.timeStamp;
        entryFormModel.selectedGrdIds = this.selectedgrid;
        this.billingService.upsertMessageFieldType(entryFormModel).subscribe((response: any) => {
            this.addOperationInProgress = false;
            if (response.success) {
                this.getMessageFields();
                this.closePopUp();
                this.clearForm();
            } else {
                this.toastr.error('', response.apiResponseMessages[0].message);
            }
        })
    }

    archiveEntryFormField() {
        this.archiveOperationInprogress = true;
        var entryFormmodel = new MessageFieldType();
        entryFormmodel = this.archiveMessageFieldModel;
        entryFormmodel.isArchived = true;
        this.billingService.upsertMessageFieldType(entryFormmodel).subscribe((response: any) => {
            this.archiveOperationInprogress = false;
            if (response.success) {
                this.getMessageFields();
                this.closeArchivePopUp();
            } else {
                this.toastr.error('', response.apiResponseMessages[0].message);
            }
        })

    }

    getMessageFields() {
        this.anyOperationInProgress = true;
        var entryFormModel = new MessageFieldType();
        entryFormModel.isArchived = false;
        this.billingService.getMessageFieldType(entryFormModel).subscribe((response: any) => {
            this.anyOperationInProgress = false;
            if (response.success) {
                this.messageFieldModel = response.data;
                if (this.messageFieldModel.length > 0) {
                    this.messageTypeModel = {
                        data: this.messageFieldModel.slice(this.state.skip, this.state.take + this.state.skip),
                        total: this.messageFieldModel.length
                    }
                } else {
                    this.messageTypeModel = {
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

    

    togglGrdSelected(value) {
        if (this.allSelected.selected) {
            this.allSelected.deselect();
            return false;
        }
        if (
            this.entryForm.controls.grdiD.value.length ===
            this.gREMOdel.length
        ) {
            this.allSelected.select();
        }
    }

    toggleAllGrdSelection() {
        if (this.allSelected.selected) {
            this.entryForm.controls.grdiD.patchValue([
                ...this.gREMOdel.map((item) => item.id),
                0
            ]);

        } else {
            this.entryForm.controls.grdiD.patchValue([]);
        }
        this.selectedgrid = this.entryForm.value.grdiD;

        this.selectGrd();
    }

    selectGrd() {
        const grdiD = this.entryForm.value.grdiD;
        const index = grdiD.indexOf(0);
        if (index > -1) {
            grdiD.splice(index, 1);
        }
        let grdModel = this.gREMOdel;

        let filteredList = _.filter(grdModel, function (model) {
            return grdiD.toString().includes(model.id)
        })
        if (filteredList.length > 0) {
            const selectedUsers = filteredList.map((x) => x.name);
            this.selectedGrdNames = selectedUsers.toString();
        }
        else {
         this.selectedGrdNames = "";
        }

        this.selectedgrid = grdiD.toString();
    }


    compareSelectedgrdFn(members: any, selectedOwners: any) {
        if (members === selectedOwners) {
            return true;
        } else {
            return false;
        }
    }
}
