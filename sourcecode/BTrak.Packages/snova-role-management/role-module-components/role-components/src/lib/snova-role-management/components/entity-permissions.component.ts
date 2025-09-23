import { Component, ChangeDetectorRef, ViewChildren, ViewChild, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EntityTypeFeatureModel } from '../models/entity-type-feature-model';
import { EntityTypeRoleFeatureModel } from '../models/entity-type-role-feature-model';

import "../../globaldependencies/helpers/fontawesome-icons";

import { RoleService } from '../services/role.service';
import { EntityRoleModel } from '../models/entity-role-model';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { SoftLabelPipe } from '../pipes/softlabels.pipes';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { EntityRoleFetureModel } from '../models/entity-role-feature-model';
import { EntityRoleDialogComponent } from './entity-role-dialog.component';

@Component({
    selector: 'app-fm-component-entity-permissions',
    templateUrl: `entity-permissions.component.html`,
    styles: [
        `
        .project-roles-card-height {
            height: calc(100vh - 143px) !important;
            max-height: calc(100vh - 143px) !important;
        }
        `
    ]
})

export class EntityPermissionsComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    @ViewChildren("addEntityRoleSatPopover") addEntityRolePopover;
    @ViewChildren("deleteEntityRoleSatPopover") deleteEntityPopover;
    @ViewChildren("archiveEntityRoleSatPopover") archiveEntityRoleSatPopover;
    @ViewChild("formDirective") formDirective: FormGroupDirective;

    entityFeatures: EntityTypeFeatureModel[];
    initiallyEntityFeatures: EntityTypeFeatureModel[];
    entityRoleFeatures: EntityTypeRoleFeatureModel[];
    rolesList: any[];
    softLabels: SoftLabelConfigurationModel[];

    upsertEntityRoleForm: FormGroup;

    selectedRoleId: string;
    selectedRoleName: string;
    showSpinner: boolean;
    selectedAll: boolean;
    selectedEntityRoleId: string = "";
    selectedEntityRoleName: string = "";
    timeStamp: any;
    isArchiveEntityRole: boolean = false;
    showEntityFeatures: boolean = false;
    savingEntityRoleInProgress: boolean = false;
    validationMessage: string;
    entityRoleName: string;
    isArchive: boolean = false;
    deletingEntityRoleInProgress: boolean = false;
    updateToFirstObject: boolean = false;
    deleteSelectedEntityRoleId: string;
    deleteTimeStamp: any;
    roleFeaturesIsInProgress$: Observable<boolean>;
    entityRoleFeaturesList: EntityTypeFeatureModel[];
    initialSelectedRoleFeatureList: EntityTypeFeatureModel[];
    selectedRoleFeatureList: EntityTypeFeatureModel[];
    selectAll: boolean;
    Array = Array;
    selectedRoleData: any[] = [];

    constructor(private roleService: RoleService, private softLabelsPipe: SoftLabelPipe, public dialog: MatDialog,
        private toastr: ToastrService, private snackbar: MatSnackBar, private cdRef: ChangeDetectorRef, private translateService: TranslateService) {
        super();
        this.getEntityRolesList();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getSoftLabels();
        this.initializeAddEntityRoleForm();
    }

    getSoftLabels() {
        this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
        this.cdRef.markForCheck();
    }


    getEntityRolesList() {
        this.roleService.getEntityRole().subscribe((responseData: any) => {
            const success = responseData.success;
            this.showSpinner = false;
            if (success) {
                this.rolesList = responseData.data;
                if (this.selectedEntityRoleId) {
                    let entityRole = new EntityRoleModel();
                    entityRole.entityRoleId = this.selectedEntityRoleId;
                    entityRole.entityRoleName = this.selectedEntityRoleName;
                    entityRole.timeStamp = this.timeStamp;
                    this.selectedRole(entityRole);
                } else if (this.selectedRoleId) {
                    this.selectedRole(this.rolesList.find(x => x.entityRoleId == this.selectedRoleId))
                } else if (this.updateToFirstObject) {
                    this.updateToFirstObject = false;
                    this.selectedRole(this.rolesList[0]);
                } else
                    this.getAllPermittedEntityTypeFeatures();
            } else {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
                this.cdRef.detectChanges();
            }
        });
    }

    getAllPermittedEntityTypeFeatures() {
        let entityTypeFeatureModel = new EntityTypeFeatureModel();
        entityTypeFeatureModel.isArchived = false;
        this.roleService.getAllPermittedEntityTypeFeatures(entityTypeFeatureModel)
            .subscribe((responseData: any) => {
                this.initiallyEntityFeatures = responseData.data;
                this.entityRoleFeaturesList = this.groupFeaturesList(responseData.data)
                this.initiallyEntityFeatures.forEach(entityRoleFeature => {
                    entityRoleFeature.isActive = false;
                })
                if (this.rolesList.length > 0)
                    this.selectedRole(this.rolesList[0]);
            })
    }

    selectedRole(entityRole) {
        this.selectAll = false;
        this.showEntityFeatures = true;
        if (this.selectedRoleId == entityRole.entityRoleId) {
            this.selectedRoleName = entityRole.entityRoleName;
            return;
        }
        this.initializeEntityFeatures();
        this.selectedRoleId = entityRole.entityRoleId;
        this.selectedRoleName = entityRole.entityRoleName;
        // const entityTypeRoleFeatureData = new EntityTypeRoleFeatureModel();
        // entityTypeRoleFeatureData.entityRoleId = entityRole.entityRoleId;
        // this.roleService.getAllPermittedEntityTypeRoleFeatures(entityTypeRoleFeatureData)
        //     .subscribe((responseData: any) => {
        //         let entityRoleFeatures = responseData.data;
        //         if (entityRoleFeatures.length > 0) {
        //             this.entityFeatures.forEach(function (value) {
        //                 let isFeaturePresent = entityRoleFeatures.find(x => x.entityFeatureId == value.entityFeatureId);
        //                 if (isFeaturePresent)
        //                     value.isActive = true;
        //             });
        //             if (this.entityFeatures.filter(x => x.isActive == true).length == this.entityFeatures.length)
        //                 this.selectedAll = true;
        //         }
        //         this.entityRoleFeatures = entityRoleFeatures;
        //     })

        let entityRoleModel = new EntityRoleFetureModel();
        entityRoleModel.entityRoleId = entityRole.entityRoleId;
        this.roleService.getEntityRoleFeatures(entityRoleModel).subscribe((responseData: any) => {
            if (responseData.success) {
                this.selectedRoleData = responseData.data[0];
                let selectedData = responseData.data[0];
                this.checkRoleFeaturesById(selectedData);
            }
        });
        this.showEntityFeatures = true;
        this.cdRef.detectChanges();
        this.isArchive = false;
    }

    saveEntityRolePermission() {
        this.showSpinner = true;
        let entityRoleFeatureUpsertData = new EntityTypeRoleFeatureModel();
        entityRoleFeatureUpsertData.entityRoleId = this.selectedRoleId;
        entityRoleFeatureUpsertData.entityFeatureIds = [];
        // for (var i = 0; i < this.entityFeatures.length; i++) {
        //     if (this.entityFeatures[i].isActive) {
        //         entityRoleFeatureUpsertData.entityFeatureIds.push(this.entityFeatures[i].entityFeatureId)
        //     }
        // }

        for (var i = 0; i < this.selectedRoleFeatureList.length; i++) {
            for (var j = 0; j < this.selectedRoleFeatureList[i].children.length; j++) {
                if (this.selectedRoleFeatureList[i].children[j].isActive == true)
                    entityRoleFeatureUpsertData.entityFeatureIds.push(this.selectedRoleFeatureList[i].children[j].entityFeatureId)
            }
        }

        this.roleService.upsertEntityTypeRoleFeature(entityRoleFeatureUpsertData)
            .subscribe((responseData: any) => {
                const success = responseData.success;
                this.showSpinner = false;
                if (success) {
                    const message = this.softLabelsPipe.transform(this.translateService.instant('ROLES.PROJECTROLEFEATURESSAVEDSUCCESSFULLY'), this.softLabels);
                    this.snackbar.open(message, "", { duration: 3000 });
                    // this.store.dispatch(new EntityRolesByUserIdFetchTriggered("null", "null", false));
                    this.loadEntityRolesByUserId();
                } else {
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                    this.cdRef.detectChanges();
                }
            })
    }

    loadEntityRolesByUserId() {
        this.roleService.getAllPermittedEntityRoleFeaturesByUserId()
            .subscribe((roleFeatures: any) => {
                if (roleFeatures.success) {
                    localStorage.setItem(LocalStorageProperties.UserRoleFeatures, JSON.stringify(roleFeatures.data));
                } else {
                    this.validationMessage = roleFeatures.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                    this.cdRef.detectChanges();
                }
            })
    }

    initializeEntityFeatures() {
        this.entityFeatures = JSON.parse(JSON.stringify(this.initiallyEntityFeatures));
        this.selectedAll = false;
    }

    // checkAllCheckBoxes() {
    //     this.entityFeatures.forEach(entityRoleFeature => {
    //         entityRoleFeature.isActive = this.selectedAll;
    //     })
    // }

    onSelection(isActive) {
        if (isActive) {
            if (this.entityFeatures.filter(x => x.isActive == true).length == this.entityFeatures.length)
                this.selectedAll = true;
        }
        else {
            this.selectedAll = false;
        }
    }

    editEntityRole(editEntityRole, addEntityRoleSatPopover) {
        this.selectedEntityRoleId = editEntityRole.entityRoleId;
        this.timeStamp = editEntityRole.timeStamp;
        addEntityRoleSatPopover.openPopover();
        this.upsertEntityRoleForm.patchValue(editEntityRole);
    }

    addEntityRole(addEntityRoleSatPopover) {
        this.selectedEntityRoleId = "";
        this.timeStamp = null;
        addEntityRoleSatPopover.openPopover();
    }

    closeEntityRolePopover() {
        this.formDirective.resetForm();
        this.addEntityRolePopover.forEach((p) => p.closePopover());
        this.initializeAddEntityRoleForm();
    }

    upsertEntityRole() {
        var message = null;
        this.savingEntityRoleInProgress = true;
        let entityRoleModel = new EntityRoleModel();
        entityRoleModel.entityRoleName = this.upsertEntityRoleForm.value.entityRoleName;
        if (this.selectedEntityRoleId) {
            entityRoleModel.entityRoleId = this.selectedEntityRoleId;
            entityRoleModel.timeStamp = this.timeStamp;
            entityRoleModel.isArchived = false;
        }
        this.roleService.upsertEntityRole(entityRoleModel)
            .subscribe((responseData: any) => {
                let success = responseData.success;
                this.savingEntityRoleInProgress = false;
                if (success) {
                    message = this.softLabelsPipe.transform(this.translateService.instant('ROLES.PROJECTROLESAVEDSUCCESSFULLY'), this.softLabels);
                    this.snackbar.open(message, "", { duration: 3000 });
                    this.selectedEntityRoleId = responseData.data;
                    this.selectedEntityRoleName = entityRoleModel.entityRoleName;
                    this.timeStamp = entityRoleModel.timeStamp;
                    this.getEntityRolesList();
                    this.formDirective.resetForm();
                    this.closeEntityRolePopover();
                } else {
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                }
            });
    }

    initializeAddEntityRoleForm() {
        this.upsertEntityRoleForm = new FormGroup({
            entityRoleName: new FormControl('',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(250)
                ])
            )
        })
    }

    deleteEntityRoleOpen(role, deleteEntityRoleSatPopover) {
        this.deleteSelectedEntityRoleId = role.entityRoleId;
        this.deleteTimeStamp = role.timeStamp;
        this.isArchive = true
        deleteEntityRoleSatPopover.openPopover();
    }

    deleteEntityRole() {
        this.deletingEntityRoleInProgress = true;
        let deleteEntityRoleModel = new EntityRoleModel();
        deleteEntityRoleModel.entityRoleId = this.deleteSelectedEntityRoleId;
        deleteEntityRoleModel.timeStamp = this.deleteTimeStamp;
        deleteEntityRoleModel.isArchived = this.isArchive;
        this.roleService.deleteEntityRole(deleteEntityRoleModel)
            .subscribe((responseData: any) => {
                let success = responseData.success;
                this.deletingEntityRoleInProgress = false;
                if (success) {
                    const message = this.softLabelsPipe.transform(this.translateService.instant('ROLES.PROJECTROLEDELETEDSUCCESSFULLY'), this.softLabels);
                    this.snackbar.open(message, "", { duration: 3000 });
                    if (this.deleteSelectedEntityRoleId == this.selectedRoleId) {
                        this.selectedRoleId = null;
                        this.updateToFirstObject = true;
                    }
                    this.selectedEntityRoleId = null;
                    this.selectedEntityRoleName = '';
                    this.timeStamp = null;
                    this.getEntityRolesList();
                    this.closedeleteEntityRoleDialog();
                } else {
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                }
            });
    }

    closedeleteEntityRoleDialog() {
        this.deleteSelectedEntityRoleId = null;
        this.deleteTimeStamp = null;
        this.isArchive = false;
        this.deleteEntityPopover.forEach((p) => p.closePopover());
    }

    groupFeaturesList(featuresList: EntityTypeFeatureModel[]) {
        var features = featuresList.filter(x => x.parentFeatureId == null);
        var childrenFeatureList = featuresList.filter(x => x.parentFeatureId != null);
        features.forEach(feature => {
            feature.children = [];
            feature.isActive = false;
            var particularFeatureList = childrenFeatureList.filter(x => x.parentFeatureId == feature.entityFeatureId);
            if (particularFeatureList.length > 0) {
                particularFeatureList.forEach(particularFeature => {
                    particularFeature.isActive = false;
                    feature.children.push(particularFeature);
                })
            }
        });
        return features;
    }

    checkRoleFeaturesById(roleFeatures) {
        let rolesListJson = JSON.parse(roleFeatures.features);
        this.initialSelectedRoleFeatureList = JSON.parse(JSON.stringify(this.entityRoleFeaturesList));
        this.initialSelectedRoleFeatureList.forEach(function (value) {
            if (value.children.length > 0) {
                for (let i = 0; i < value.children.length; i++) {
                    let roleDesc = rolesListJson ? rolesListJson.find(x => x.EntityFeatureId.toLowerCase() == value.children[i].entityFeatureId.toLowerCase()) : null;
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
        this.showEntityFeatures = false;
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
            let parentList = this.selectedRoleFeatureList.find(x => x.entityFeatureId == feature.parentFeatureId)
            if (parentList.children.filter(x => x.isActive == true).length == parentList.children.length) {
                parentList.isActive = true;
            }
            if (this.selectedRoleFeatureList.filter(x => x.isActive == true).length == this.selectedRoleFeatureList.length)
                this.selectAll = true;
        }
        else {
            this.selectedRoleFeatureList.find(x => x.entityFeatureId == feature.parentFeatureId).isActive = false;
            this.selectAll = false;
        }
    }

    openRolesDialog(featureId, permissionName) {
        const dialog = this.dialog.open(EntityRoleDialogComponent, {
            maxHeight: '54%',
            width: '26%',
            hasBackdrop: true,
            direction: "ltr",
            data: {
                featureId: featureId, permissionName: permissionName
            },
            disableClose: true,
            panelClass: 'custom-modal-box'
        });
    }
    
    resetFeatures() {
        this.selectAll = false;
        this.checkRoleFeaturesById(this.selectedRoleData);
    }
}