import { ChangeDetectorRef, Component, Inject, Input, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { GenericFormService } from "../services/generic-form.service";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../services/user.Service";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-generic-form-history',
    templateUrl: './generic-form-record-history.component.html'
})

export class GenericFormRecordHistoryComponent implements OnInit {
    @Input("data")
    set _data(dialogInput: any) {
        this.data = dialogInput[0];
        this.recordId = this.data.recordId;
        if (this.recordId) {
            this.getGenericFormHistoryRecords();
        }
        this.currentDialogId = this.data.formPhysicalId;
        this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
    }
    usersList: any[] = [];
    historyRecords: any[] = [];
    data: any;
    currentDialog: any;
    currentDialogId: any;
    recordId: string;
    isLoading: boolean;
    totalCount: number;
    pageSize: number = 20;
    pageNumber: number = 1;
    pageIndex: number;
    pageSizeOptions: number[] = [10,20, 25, 50, 100, 150, 200];

    constructor(private dialogRef: MatDialogRef<GenericFormRecordHistoryComponent>,
        public dialog: MatDialog, private genericFormService: GenericFormService,
        private toastr: ToastrService, private cdRef: ChangeDetectorRef,
        private userService: UserService, private datePipe: DatePipe
    ) {
        this.getAllUsers();
    }
    ngOnInit() {

    }

    getGenericFormHistoryRecords() {
        this.isLoading = true;
        this.genericFormService.getGenericFormHistory(this.recordId, this.pageNumber, this.pageSize).subscribe((response: any) => {
            this.isLoading = false;
            if (response.success) {
                this.historyRecords = response.data;
                if(this.historyRecords.length > 0) {
                    this.totalCount = this.historyRecords[0].totalCount;
                }
                this.cdRef.detectChanges();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    getAllUsers() {
        var userModel: any = {};
        userModel.isArchived = false;
        this.userService.GetUsersDropDown().subscribe((response: any) => {
            this.usersList = response.data;
        })
    }

    onClose() {
        this.currentDialog.close();
    }

    getFormattedValue(format, value) {
        return this.datePipe.transform(value, format);
    }

    setPageEvent(event) {
        if (event.pageSize != this.pageSize) {
            this.pageNumber = 1;
            this.pageIndex = 0;
        }
        else {
            this.pageNumber = event.pageIndex + 1;
            this.pageIndex = event.pageIndex;
        }
        this.pageSize = event.pageSize;
        this.getGenericFormHistoryRecords();
    }
}