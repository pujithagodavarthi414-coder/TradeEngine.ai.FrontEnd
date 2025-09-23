import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { RoleService } from '../services/role.service';
import { RolesListModel } from '../models/roles-list.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-rm-component-role-permissions-dialogue',
    templateUrl: `role-dialog.component.html`
})

export class RoleDialogComponent extends CustomAppBaseComponent {

    featureId: string;
    rolesList: any[];
    loadingIndicator: boolean;

    constructor(private roleService: RoleService, private cdRef: ChangeDetectorRef, @Inject(MAT_DIALOG_DATA) private data: any, public dialogRef: MatDialogRef<RoleDialogComponent>) {
        super();
        this.featureId = data.featureId;
        this.getRolesList();
    }

    ngOnInit() {

    }

    getRolesList() {
        this.loadingIndicator = true;
        this.roleService.getRolesList(this.featureId).subscribe((responseData: any) => {
            if (responseData.success) {
                this.rolesList = responseData.data;
                this.loadingIndicator = false
            }
        });
    }

    onClose(): void {
        this.dialogRef.close();
    }

    removePermission(event) {
        this.loadingIndicator = true;
        let rolesListModel = new RolesListModel();
        rolesListModel.featureId = this.featureId;
        rolesListModel.roleId = event;
        this.roleService.updateRoleFeatures(rolesListModel).subscribe((responseData: any) => {
            if (responseData.success) {
                this.getRolesList();
            }
        });
    }
}