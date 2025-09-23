import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'payroll-runemployees-dialog',
    templateUrl: 'payroll-runemployees.component.html',
    styles: [`
    .project-card {
        overflow: inherit !important;
        margin: 2px 5px;
        cursor: pointer;
    }
  `]
})
export class PayRollRunEmployeesDialog {
    payRollRunemployees: any = [];
    profileUrl: string;
    constructor(public dialogRef: MatDialogRef<PayRollRunEmployeesDialog>, private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.payRollRunemployees = data;
        console.log(this.payRollRunemployees);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    goToProfile(userId) {
        const angularRoute = this.router.url;
        const url = window.location.href;
        this.profileUrl = url.replace(angularRoute, '');
        this.profileUrl = this.profileUrl + '/dashboard/profile/' + userId + '/overview';
        window.open(this.profileUrl, "_blank");
    }
}