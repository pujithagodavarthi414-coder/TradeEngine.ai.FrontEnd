import { Component, Inject, ViewChild, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import {  MatTabGroup, MatTab, MatTabHeader } from "@angular/material/tabs";
import '../../globaldependencies/helpers/fontawesome-icons'

@Component({
    selector: "app-add-expense-dialog",
    templateUrl: "add-expense-dialog.component.html",
    styles: [`
    .custom-expense-add-dialog {
        position: relative;
        float: right;
        margin-top: 8px;
        margin-right: -9px;
    }
    
    .custom-expense-add-dialog .custom-close {
        width: 30px;
        background-color: #eaeaea;
        height: 30px;
        border-radius: 20px;
        transform: translate(50%, -50%);
        cursor: pointer;
    }

    .top-right-close-icon
    {
        position: fixed;
        top: 15%;
    }
    `]
})

export class AddExpenseDialogComponent {
    @ViewChild('tabs') tabs: MatTabGroup;

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            if (!this.matData.data) {
                this.isNewExpense = true;
            } else {
                this.isNewExpense = false;
            }
            this.currentDialogId = data[0].formPhysicalId;;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }

    selectedTab = 0;
    isNewExpense: boolean = false;
    matData: any;
    currentDialogId: any;
    currentDialog: any;

    constructor(public dialogRef: MatDialogRef<AddExpenseDialogComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (!data.data) {
            this.isNewExpense = true;
        } else {
            this.isNewExpense = false;
        }
    }

    ngOnInit() {
        this.tabs._handleClick = this.interceptTabChange.bind(this);
    }

    interceptTabChange(tab: MatTab, tabHeader: MatTabHeader, index: number) {
        if (index == 0) {
            const result = confirm(`Unsaved changes will be lost.Are you sure to proceed?`);
            return result && MatTabGroup.prototype._handleClick.apply(this.tabs, arguments);
        }
        else {
            return true && MatTabGroup.prototype._handleClick.apply(this.tabs, arguments);
        }
    }

    ngAfterViewInit() {
        (document.querySelector(".mat-dialog-padding") as HTMLElement).parentElement.parentElement.style.padding = "0px";
    }

    selectedMatTab(event) {
        this.selectedTab = event.index;
    }

    closeDialog() {
        this.currentDialog.close();
        // this.dialogRef.close();
    }
}