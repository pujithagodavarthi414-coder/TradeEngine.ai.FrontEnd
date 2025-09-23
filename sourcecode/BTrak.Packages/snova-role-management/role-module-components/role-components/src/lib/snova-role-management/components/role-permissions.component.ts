import { Component, ChangeDetectorRef, ViewChild, Input, ViewChildren, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import "../../globaldependencies/helpers/fontawesome-icons";

import { RoleModel } from '../models/role-model';
import { FeatureSearchModel } from '../models/feature-model';
import { RoleFeatureModel } from '../models/role-feature-model';

import { RoleService } from '../services/role.service';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { SoftLabelPipe } from '../pipes/softlabels.pipes';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { RoleDialogComponent } from './role-dialog.component';

@Component({
    selector: 'app-rm-component-role-permissions',
    templateUrl: `role-permissions.component.html`
})

export class RolePermissionsComponent extends CustomAppBaseComponent {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    @ViewChild("roleForm") roleForm: FormGroupDirective;
    @ViewChildren("deleteRoleSatPopover") deleteRolePopover;

    rolesList: RoleModel[];
    selectedRoleData: RoleModel;
    roleFeaturesList: RoleFeatureModel[];
    selectedRoleFeatureList: RoleFeatureModel[];
    initialSelectedRoleFeatureList: RoleFeatureModel[];

    selectAll: boolean;
    newRole: boolean = false;
    upsertRoleInProgress: boolean;
    showMasonryGridLoading: boolean = false;
    selectedRoleId: string;
    selectedRoleName: string;
    timeStamp: any;
    validationMessage: string;
    isDeveloper: boolean = false;
    softLabels: SoftLabelConfigurationModel[];
    isArchived: boolean = false;
    deleteSelectedRoleId: string;
    deleteTimeStamp: any;
    Array = Array;
    deletingRoleInProgress: boolean = false;
    updateToFirstObject: boolean = false;
    num: number = 15;
    roleName = new FormControl('', [Validators.required, Validators.maxLength(800)]);
    isDeveloperRole = new FormControl(false, []);

    constructor(public router: Router, private softLabelsPipe: SoftLabelPipe,public dialog: MatDialog, private roleService: RoleService, private toastr: ToastrService, private snackbar: MatSnackBar, private cdRef: ChangeDetectorRef, private translateService: TranslateService) {
        super();
        this.getRolesList();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        this.initializeRole();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }

    getRolesList() {
        let roleModel = new RoleModel();
        roleModel.isArchived = false;
        this.roleService.getAllRoles(roleModel).subscribe((responseData: any) => {
            this.rolesList = responseData.data;
            if (!this.newRole)
                this.getAllFeatures();
            else if (this.updateToFirstObject) {
                this.updateToFirstObject = false;
                this.selectedRole(this.rolesList[0], 'edit');
            }
        });
    }

    getAllFeatures() {
        this.newRole = true;
        let featureModel = new FeatureSearchModel();
        featureModel.isArchived = false;
        this.roleService.getFeatures(featureModel).subscribe((responseData: any) => {
            let roleFeatures = responseData.data;
            if (roleFeatures.length > 0) {
                this.roleFeaturesList = this.groupFeaturesList(roleFeatures);
                if (this.rolesList.length > 0) {
                    this.selectedRole(this.rolesList[0], 'edit');
                }
            }
        })
    }

    groupFeaturesList(featuresList: RoleFeatureModel[]) {
        var features = featuresList.filter(x => x.parentFeatureId == null);
        var childrenFeatureList = featuresList.filter(x => x.parentFeatureId != null);
        features.forEach(feature => {
            feature.children = [];
            feature.isActive = false;
            var particularFeatureList = childrenFeatureList.filter(x => x.parentFeatureId == feature.featureId);
            if (particularFeatureList.length > 0) {
                particularFeatureList.forEach(particularFeature => {
                    particularFeature.isActive = false;
                    feature.children.push(particularFeature);
                })
            }
        });
        return features;
    }

    selectedRoleMasonryDestroy(role, text) {
        this.selectedRole(role, text)
    }

    goToAllRoles() {
        this.router.navigateByUrl('/rolemanagement/entityrolemanagement');
    }

    selectedRole(role, text) {
        this.selectAll = false;
        this.showMasonryGridLoading = true;
        this.selectedRoleFeatureList = [];
        this.initialSelectedRoleFeatureList = [];
        if (text === 'copy') {
            this.selectedRoleId = '';
            this.selectedRoleName = '';
            this.timeStamp = null;
            this.roleForm.resetForm();
        }
        else if (text === 'edit') {
            this.selectedRoleId = role.roleId;
            this.selectedRoleName = role.roleName;
            this.isDeveloper = role.isDeveloper;
            this.timeStamp = role.timeStamp;
        }
        this.roleService.getRoleById(role.roleId).subscribe((responseData: any) => {
            this.selectedRoleData = responseData.data;
            if (this.selectedRoleData.features) {
                this.checkRoleFeaturesById(this.selectedRoleData);
            }
        })
    }

    addRole() {
        this.roleName = new FormControl('', [Validators.required, Validators.maxLength(800)]);
        this.isDeveloperRole = new FormControl(false, []);
        this.selectAll = false;
        this.selectedRoleFeatureList = [];
        this.initialSelectedRoleFeatureList = [];
        this.selectedRoleId = '';
        this.selectedRoleName = '';
        this.timeStamp = null;
        this.isArchived = false;
        this.initialSelectedRoleFeatureList = JSON.parse(JSON.stringify(this.roleFeaturesList));
        this.selectedRoleFeatureList = JSON.parse(JSON.stringify(this.initialSelectedRoleFeatureList));
        this.showMasonryGridLoading = false;
    }

    checkRoleFeaturesById(roleFeatures) {
        let rolesListJson = JSON.parse(roleFeatures.features);
        this.initialSelectedRoleFeatureList = JSON.parse(JSON.stringify(this.roleFeaturesList));
        this.initialSelectedRoleFeatureList.forEach(function (value) {
            if (value.children.length > 0) {
                for (let i = 0; i < value.children.length; i++) {
                    let roleDesc = rolesListJson.find(x => x.Id == value.children[i].featureId);
                    if (roleDesc)
                        value.children[i].isActive = true;
                };
                if (value.children.filter(x => x.isActive == true).length == value.children.length) {
                    value.isActive = true;
                }
            }
        });
        if (this.initialSelectedRoleFeatureList.filter(x => x.isActive == true).length == this.initialSelectedRoleFeatureList.length)
            this.selectAll = true;
        this.selectedRoleFeatureList = JSON.parse(JSON.stringify(this.initialSelectedRoleFeatureList));
        this.showMasonryGridLoading = false;
    }

    initializeRole() {
        this.roleName = new FormControl('', [Validators.required, Validators.maxLength(800)]);
        this.isDeveloperRole = new FormControl(false, []);
    }

    checkRoleFormDisabled() {
        if (this.selectedRoleName && this.selectedRoleName.length <= 800)
            return false;
        else
            return true;
    }

    saveRole() {
        this.upsertRoleInProgress = true;
        let roleModel = new RoleModel();
        roleModel.featureIds = [];
        for (var i = 0; i < this.selectedRoleFeatureList.length; i++) {
            for (var j = 0; j < this.selectedRoleFeatureList[i].children.length; j++) {
                if (this.selectedRoleFeatureList[i].children[j].isActive == true)
                    roleModel.featureIds.push(this.selectedRoleFeatureList[i].children[j].featureId)
            }
        }
        roleModel.isArchived = false;
        roleModel.roleId = this.selectedRoleId;
        roleModel.roleName = this.selectedRoleName;
        roleModel.isDeveloper = this.isDeveloper;
        roleModel.timeStamp = this.selectedRoleData.timeStamp;
        this.roleService.saveRole(roleModel)
            .subscribe((responseData: any) => {
                const success = responseData.success;
                if (success) {
                    this.snackbar.open(this.translateService.instant('ROLES.ROLESAVEDSUCCESSFULLY.'), this.translateService.instant(ConstantVariables.success), { duration: 3000 });
                    if (!roleModel.roleId) {
                        this.newRole = true;
                        this.selectedRoleId = responseData.data;
                    }
                    this.roleService.getRoleById(responseData.data).subscribe((responseData: any) => {
                        this.selectedRoleData = responseData.data;
                        this.upsertRoleInProgress = false;
                        this.checkRoleFeaturesById(this.selectedRoleData);
                    })
                    this.getRolesList();
                } else {
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.warning("", this.validationMessage);
                    this.cdRef.detectChanges();
                    this.upsertRoleInProgress = false;
                }
            });
    }

    checkAllCheckBoxes() {
        for (var i = 0; i < this.selectedRoleFeatureList.length; i++) {
            var obj = this.selectedRoleFeatureList[i];
            if (obj.children) {
                if (this.selectAll) {
                    this.selectedRoleFeatureList[i].isActive = true;
                }
                if (!this.selectAll) {
                    this.selectedRoleFeatureList[i].isActive = false;
                }
                this.parentFeatureChecked(this.selectedRoleFeatureList[i], this.selectAll)
            }
        }
    }

    parentFeatureChecked(feature, isActive) {
        if (isActive) {
            for (var i = 0; i < feature.children.length; i++) {
                feature.children[i].isActive = true;
            }
            if (this.selectedRoleFeatureList.filter(x => x.isActive == true).length == this.selectedRoleFeatureList.length)
                this.selectAll = true;
        }
        else {
            for (var i = 0; i < feature.children.length; i++) {
                feature.children[i].isActive = false;
            }
            this.selectAll = false;
        }
    }

    getFeaturesId(feature, isActive) {
        if (isActive) {
            let parentList = this.selectedRoleFeatureList.find(x => x.featureId == feature.parentFeatureId)
            if (parentList.children.filter(x => x.isActive == true).length == parentList.children.length) {
                parentList.isActive = true;
            }
            if (this.selectedRoleFeatureList.filter(x => x.isActive == true).length == this.selectedRoleFeatureList.length)
                this.selectAll = true;
        }
        else {
            this.selectedRoleFeatureList.find(x => x.featureId == feature.parentFeatureId).isActive = false;
            this.selectAll = false;
        }
    }

    resetFeatures() {
        //this.selectedRoleFeatureList = JSON.parse(JSON.stringify(this.initialSelectedRoleFeatureList));
        this.selectAll = false;
        this.checkRoleFeaturesById(this.selectedRoleData);
    }

    deleteRoleOpen(role, deleteRoleSatPopover) {
        this.deleteSelectedRoleId = role.roleId;
        this.deleteTimeStamp = role.timeStamp;
        this.isArchived = true;
        deleteRoleSatPopover.openPopover();
    }

    deleteRole() {
        this.deletingRoleInProgress = true;
        let deleteRoleModel = new RoleModel();
        deleteRoleModel.roleId = this.deleteSelectedRoleId;
        deleteRoleModel.timeStamp = this.deleteTimeStamp;
        deleteRoleModel.isArchived = this.isArchived;
        this.roleService.deleteRole(deleteRoleModel)
            .subscribe((responseData: any) => {
                let success = responseData.success;
                this.deletingRoleInProgress = false;
                if (success) {
                    const message = this.softLabelsPipe.transform(this.translateService.instant('ROLES.PROJECTROLEDELETEDSUCCESSFULLY'), this.softLabels);
                    this.snackbar.open(message, "", { duration: 3000 });
                    if (this.deleteSelectedRoleId == this.selectedRoleId) {
                        this.updateToFirstObject = true;
                    }
                    this.getRolesList();
                    this.closedDeleteRoleDialog();
                } else {
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                }
            });
    }

    closedDeleteRoleDialog() {
        this.deleteSelectedRoleId = null;
        this.deleteTimeStamp = null;
        this.isArchived = false;
        this.deleteRolePopover.forEach((p) => p.closePopover());
    }

    openRolesDialog(featureId) {
        const dialog = this.dialog.open(RoleDialogComponent, {
            maxHeight: '54%',
            width: '26%',
            hasBackdrop: true,
            direction: "ltr",
            data: {
                featureId: featureId
            },
            disableClose: true,
            panelClass: 'custom-modal-box'
        });
    }
}