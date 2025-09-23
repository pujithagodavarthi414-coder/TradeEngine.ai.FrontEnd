import { Component, Input, OnInit, ViewChildren } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { orderBy, SortDescriptor } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { ErrorModel } from "../../models/ErrorModel";
import { ActivityService } from "../../services/activity.service";

@Component({
    selector: `list-error`,
    templateUrl: `./list-error.component.html`
})

export class ErrorListComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren("editErrorPopUp") editErrorPopover;
    @ViewChildren("deleteErrorPopover") deleteErrorPopover;
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    form: FormGroup;
    deleteErrorDetails: any;
    deleteOperationIsInprogress: boolean;
    upsertInProgress: boolean;
    isEdit: boolean;
    priorityData: ErrorModel;
    searchText: any;
    @Input("data")
    set _data(data: any) {
        this.matData = data[0];
        if (this.matData) {
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }
    isLoading: boolean;
    isArchived: any = false;
    temp: any;
    errorList: any;
    validationMessage: any;
    public sort: SortDescriptor[] = [{
        field: 'errorMessage',
        dir: 'asc'
    }];
    constructor(public dialog: MatDialog, private toastr: ToastrService, private activityService: ActivityService) {
        super();
    }
    ngOnInit(): void {
        this.clearForm();
        this.getErrorList();
    }
    getErrorList() {
        this.isLoading = true;
        let em = new ErrorModel();
        em.isArchive = this.isArchived;
        this.activityService.getError(em).subscribe((result: any) => {
            if (result.success) {
                this.errorList = result.data;
                this.temp = result.data;
            }
            else {
                this.errorList = [];
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            this.isLoading = false;
        })
    }
    onNoClick() {
        if (this.currentDialog) {
            this.currentDialog.close();
        }
    }
    clearForm() {
        this.form = new FormGroup({
            errorCode: new FormControl(null),
            errorMessage: new FormControl(null),
            description: new FormControl(null)
        })
    }
    changeArchiveError(value) {
        this.isArchived = value;
        this.getErrorList();
    }
    deleteErrorItem(data, deletePopover) {
        this.deleteErrorDetails = data;
        deletePopover.openPopover();
    }
    removeErrorAtIndex(value) {
        this.deleteOperationIsInprogress = true;
        let em = new ErrorModel();
        em = Object.assign({}, this.deleteErrorDetails);
        em.isArchive = value;
        this.activityService.upsertError(em).subscribe((result: any) => {
            if (result.success) {
                this.deleteErrorDetails = null;
                this.deleteOperationIsInprogress = false;
                this.getErrorList();
                this.closeDeleteErrorDialog();
            }
            else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
                this.deleteOperationIsInprogress = false;
            }
        });
    }

    closeDeleteErrorDialog() {
        this.deleteErrorDetails = null;
        this.deleteErrorPopover.forEach((p) => p.closePopover());
    }

    upsertError() {
        this.upsertInProgress = true;
        this.isLoading = true;
        let em = new ErrorModel();
        if (this.isEdit == true) {
            em = this.priorityData;
        }
        em.errorCode = this.form.controls["errorCode"].value;
        em.errorMessage = this.form.controls["errorMessage"].value;
        em.description = this.form.controls["description"].value;
        this.activityService.upsertError(em).subscribe((result: any) => {
            var id = result.data
            if (result.success == false) {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(this.validationMessage);
            }
            else {
                this.clearForm();
                this.getErrorList();
                this.closePopup();
            }
        })
        this.closePopup();
        this.upsertInProgress = false;
        this.isLoading = false;
        this.isEdit = false;
    }

    editError(data, errorPopup) {
        this.isEdit = true;
        this.priorityData = data;
        errorPopup.openPopover();
        this.form.patchValue(data);
    }
    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }
        const values = this.temp.filter((p => (p.errorMessage.toLowerCase().indexOf(this.searchText) > -1)
            || (p.errorCode.toLowerCase().indexOf(this.searchText) > -1)
            || (p.description ? p.description.toLowerCase().indexOf(this.searchText) > -1 : null)));
        this.errorList = values;
    }

    closeSearch() {
        this.searchText = "";
        const values = this.temp.filter((p => (p.errorMessage.toLowerCase().indexOf(this.searchText) > -1)
            || (p.errorCode.toLowerCase().indexOf(this.searchText) > -1)
            || (p.description ? p.description.toLowerCase().indexOf(this.searchText) > -1 : null)));
        this.errorList = values;
    }

    closePopup() {
        this.editErrorPopover.forEach((p) => p.closePopover());
    }

    openAddPopover(priorityPopup) {
        this.isEdit = false;
        priorityPopup.openPopover();
    }

    public sortChange(sort: SortDescriptor[]): void {
        this.sort = sort;
        this.errorList = orderBy(this.errorList, this.sort)
    }
}