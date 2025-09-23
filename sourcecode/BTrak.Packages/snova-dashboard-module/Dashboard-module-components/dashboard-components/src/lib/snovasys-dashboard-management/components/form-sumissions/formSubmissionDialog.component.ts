import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { State } from "@progress/kendo-data-query";
import { CookieService } from "ngx-cookie-service";
import { ToastrService } from "ngx-toastr";
import { ComponentModel } from "@snovasys/snova-comments";
import { FormSubmissionModel } from "../../models/formsubmission.Model";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { GenericFormService } from '../../services/generic-form.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { FormHistoryModel } from '../../models/form-history.model';
import '../../../globaldependencies/helpers/fontawesome-icons';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
@Component({
    selector: "form-submission-dialog",
    templateUrl: "./formSubmissionDialog.component.html"
})

export class FormSubmissionDialogComponent extends CustomAppBaseComponent {

    selectedTab = 0;
    referenceId: string;
    isAnyOperationIsInprogress = false;
    formJson: any;
    users: any[] = [];
    assignedToUserId: string;
    validationMessage: string;
    assigneName: string;
    formData = { data: {} };
    historyDetails = { data: [], total: 0 };
    sortBy: string;
    searchText: string;
    sortDirection: boolean;
    pageable: boolean = false;
    state: State = {
        skip: 0,
        take: 10,
    };
    matData: any;
    currentDialogId: any;
    currentDialog: any;
    id: any;
    componentModel: ComponentModel = new ComponentModel();
    public basicForm = { components: [] };
    @Output() closeMatDialog = new EventEmitter<FormSubmissionModel>();
    userId: any;

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            if (this.matData) {
                this.currentDialogId = this.matData.dialogId;
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            }
            this.formData = this.matData.formData ? JSON.parse(this.matData.formData) : { data: {} };
            this.formJson = this.matData.formJson ? JSON.parse(this.matData.formJson) : Object.assign({}, this.basicForm);
            this.disableTexbox();
            this.referenceId = this.matData.referenceId;
            this.assignedToUserId = this.matData.assignedToUserId;
            this.users = this.matData.users;
            if (this.assignedToUserId) {
                this.assignedToSelected(this.assignedToUserId);
            }
            if (this.referenceId) {
                this.getResidentDetailsHistory();
            }
        }
    }

    constructor(
        public AppDialog: MatDialogRef<FormSubmissionDialogComponent>,
        public routes: Router, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private cookieService: CookieService,
        private toastr: ToastrService, private genericFormService: GenericFormService,
        private cdRef: ChangeDetectorRef) {
        super();
        if (data.dialogId) {
            this.currentDialogId = this.data.dialogId;
            this.id = setTimeout(() => {
                this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
            }, 1200)
        }
        this.formData = data.formData ? JSON.parse(data.formData) : { data: {} };
        this.formJson = data.formJson ? JSON.parse(data.formJson) : Object.assign({}, this.basicForm);
        this.disableTexbox();
        this.referenceId = data.referenceId;
        this.assignedToUserId = data.assignedToUserId;
        this.users = data.users;
        if (this.assignedToUserId) {
            this.assignedToSelected(this.assignedToUserId);
        }
        if (this.referenceId) {
            this.getResidentDetailsHistory();
        }
    }

    onNoClick(): void {
        if (this.currentDialog) {
            this.currentDialog.close();
            this.currentDialog.close(null);
        }
        else if (this.AppDialog) {
            this.AppDialog.close();
            this.closeMatDialog.emit(null);
        }
    }

    ngOnInit() {
        super.ngOnInit();
        this.componentModel.accessToken = this.cookieService.get(LocalStorageProperties.CurrentUser);
        this.componentModel.backendApi = environment.apiURL;
        this.componentModel.parentComponent = this;
        this.componentModel.callBackFunction = ((component: any, commentsCount: number) => {
            component.componentModel.commentsCount = commentsCount;
        });
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort[0]) {
            this.sortBy = this.state.sort[0].field;
            this.sortDirection = this.state.sort[0].dir == "asc" ? true : false;
        }
        this.getResidentDetailsHistory();
    }

    getResidentDetailsHistory() {
        if (this.referenceId) {
            this.isAnyOperationIsInprogress = true;
            const formHistoryModel = new FormHistoryModel();
            formHistoryModel.genericFormSubmittedId = this.referenceId;
            formHistoryModel.pageSize = this.state.take;
            formHistoryModel.pageNumber = (this.state.skip / this.state.take) + 1;
            formHistoryModel.sortBy = this.sortBy;
            formHistoryModel.sortDirectionAsc = this.sortDirection;
            this.genericFormService.getFormHistory(formHistoryModel).subscribe((response: any) => {
                if (response.data && response.data.length > 0) {
                    response.data.findIndex(x => x.fieldName == 'submit') != -1 ?
                        response.data.splice(response.data.findIndex(x => x.fieldName == 'submit'), 1) : response.data;
                    this.historyDetails = {
                        data: response.data,
                        total: response.data.length > 0 ? response.data[0].totalCount : 0,
                    }
                    if ((response.data.length > 0)) {
                        this.pageable = true;
                    }
                }
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            });
        }
    }

    profilePage(e) {
        this.routes.navigateByUrl('/dashboard/profile/' + e + '/overview');
    }

    onDataSubmit() {
        const formsubmission = new FormSubmissionModel();
        formsubmission.formData = JSON.stringify(this.formData);
        formsubmission.assignedToUserId = this.assignedToUserId;
        if (this.currentDialog) {
            this.currentDialog.close();
            this.currentDialog.close(formsubmission);
        }
        else if (this.AppDialog) {
            this.AppDialog.close();
            this.closeMatDialog.emit(formsubmission);
        }
    }

    selectedMatTab(event) {
        this.selectedTab = event.index;
    }

    assignedToSelected(userId) {
        this.assignedToUserId = userId;
        const index = this.users.findIndex((p) => p.id.toString().toLowerCase() == userId.toString().toLowerCase());
        this.assigneName = this.users[index].fullName;
    }
    disableTexbox() {
        var inputFormJson = this.formJson;
        this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId)

        for (var i = 0; i < inputFormJson.components.length; i++) {
            var data = {
                isEdit: null,
                isView: null
            }
            if ((inputFormJson.components[i].type == 'textfield' || inputFormJson.components[i].type == 'number' || inputFormJson.components[i].type == 'textarea') && inputFormJson.components[i].userEdit && inputFormJson.components[i].userView) {

                for (var j1 = 0; j1 < inputFormJson.components[i].userView.length; j1++) {
                    if (inputFormJson.components[i].userView[j1].toLowerCase() == this.userId.toLowerCase()) {
                        inputFormJson.components[i].disabled = true;
                        data.isEdit = true;
                    }
                }
                for (var j = 0; j < inputFormJson.components[i].userEdit.length; j++) {
                    if (inputFormJson.components[i].userEdit[j].toLowerCase() == this.userId.toLowerCase()) {
                        inputFormJson.components[i].disabled = false;
                        data.isView = true;
                    }
                }
                if ((inputFormJson.components[i].type == 'textfield' || inputFormJson.components[i].type == 'number' || inputFormJson.components[i].type == 'textarea') && (data.isEdit != true && data.isView != true)) {
                    inputFormJson.components[i].hidden = true;
                }
            }
            else if (inputFormJson.components[i].userEdit && (inputFormJson.components[i].type == 'textfield' || inputFormJson.components[i].type == 'number' || inputFormJson.components[i].type == 'textarea')) {
                for (var j = 0; j < inputFormJson.components[i].userEdit.length; j++) {
                    if (inputFormJson.components[i].userEdit[j].toLowerCase() == this.userId.toLowerCase()) {
                        inputFormJson.components[i].disabled = false;
                    } else if (inputFormJson.components[i].disabled == false) {
                        inputFormJson.components[i].hidden = true;
                    }
                }

            }
            else if (inputFormJson.components[i].userView && (inputFormJson.components[i].type == 'textfield' || inputFormJson.components[i].type == 'number' || inputFormJson.components[i].type == 'textarea')) {
                for (var j = 0; j < inputFormJson.components[i].userView.length; j++) {
                    if (inputFormJson.components[i].userView[j].toLowerCase() == this.userId.toLowerCase()) {
                        inputFormJson.components[i].disabled = true;
                    }
                    else if (inputFormJson.components[i].disabled == true) {
                        inputFormJson.components[i].hidden = false;
                    }
                }
            }
            else if ((inputFormJson.components[i].type == 'textfield' || inputFormJson.components[i].type == 'number' || inputFormJson.components[i].type == 'textarea') && !inputFormJson.components[i].userEdit && !inputFormJson.components[i].userView) {
                inputFormJson.components[i].hidden = true;
            }

        }
        this.formJson = { components: inputFormJson.components }
    }


}
