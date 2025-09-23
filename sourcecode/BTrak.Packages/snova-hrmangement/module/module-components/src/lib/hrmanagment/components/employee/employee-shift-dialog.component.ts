import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { State } from "../../store/reducers/index";
import * as hrManagementModuleReducer from "../../store/reducers/index";

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { SoftLabelConfigurationModel } from '../../models/softlabels-model';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: 'app-hr-component-employee-shift-dialog',
    templateUrl: 'employee-shift-dialog.component.html'
})

export class EmployeeShiftDialogComponent {
    softLabels: SoftLabelConfigurationModel[];
    softLabels$: Observable<SoftLabelConfigurationModel[]>;

    constructor(private dialogRef: MatDialogRef<EmployeeShiftDialogComponent>, private store: Store<State>) {

    }

    ngOnInit() {
        this. getSoftLabelConfigurations();
    }

    getSoftLabelConfigurations() {
        if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
          this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }
      }

    ngAfterViewInit() {
        (document.querySelector('.mat-dialog-padding') as HTMLElement).parentElement.parentElement.style.padding = "0px";
    }

    onClose() {
        this.dialogRef.close(true);
    }

    onNoClick() {
        this.dialogRef.close(false);
    }

}