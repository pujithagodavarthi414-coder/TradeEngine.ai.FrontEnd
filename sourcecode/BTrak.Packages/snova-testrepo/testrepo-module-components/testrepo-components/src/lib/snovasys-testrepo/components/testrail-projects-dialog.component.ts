import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'testrail-projects-dialog',
    templateUrl: './testrail-projects-dialog.component.html'
})

export class TestrailProjectsDialogComponent {
    constructor(public projectsDialog: MatDialogRef<TestrailProjectsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private route: ActivatedRoute) { }

    onNoClick(): void {
        this.projectsDialog.close();
    }
}