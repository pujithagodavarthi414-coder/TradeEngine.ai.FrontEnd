import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { RoleService } from '../services/role.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EntityRolesListModel } from '../models/entity-roles-list.model';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';

@Component({
    selector: 'app-rm-component-entity-role-permissions-dialogue',
    templateUrl: `entity-role-dialog.component.html`
})

export class EntityRoleDialogComponent extends CustomAppBaseComponent {

    featureId: string;
    rolesList: any[] = [];
    loadingIndicator: boolean;
    softLabels: SoftLabelConfigurationModel[];
    permissionName: string;


    constructor(private roleService: RoleService, private cdRef: ChangeDetectorRef, @Inject(MAT_DIALOG_DATA) private data: any, public dialogRef: MatDialogRef<EntityRoleDialogComponent>) {
        super();
        this.featureId = data.featureId;
        this.permissionName = data.permissionName;
        this.getEntityRolesList();
    }

    ngOnInit() {
        this.getSoftLabels();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    getEntityRolesList() {
        this.loadingIndicator = true;
        this.roleService.getEntityRolesList(this.featureId).subscribe((responseData: any) => {
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
        let rolesListModel = new EntityRolesListModel();
        rolesListModel.entityFeatureId = this.featureId;
        rolesListModel.entityRoleId = event;
        this.roleService.updateEntityRoleFeatures(rolesListModel).subscribe((responseData: any) => {
            if (responseData.success) {
                this.getEntityRolesList();
            }
        });
    }
}