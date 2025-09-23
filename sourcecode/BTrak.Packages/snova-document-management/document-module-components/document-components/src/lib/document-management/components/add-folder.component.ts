import { Component, Input, ViewChild, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { ofType, Actions } from "@ngrx/effects";
import { State } from "../store/reducers/index";
import * as commonModuleReducer from "../store/reducers/index";
import { FolderModel } from "../models/folder-model";
import { CreateFolderTriggered, FolderActionTypes } from "../store/actions/folder.actions";
import "../../globaldependencies/helpers/fontawesome-icons";
import { GoogleAnalyticsService } from '../services/google-analytics.service';
import { StoreManagementService } from '../services/store-management.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ConstantVariables } from '../constants/constant-variables';

@Component({
    selector: "app-document-component-add-folder",
    templateUrl: "./add-folder.component.html"
})

export class AddFolderComponent {
    @ViewChild("formDirective") formDirective: FormGroupDirective;
    @Input() selectedStoreId: string;
    @Input() selectedParentFolderId: string;
    @Input() folderReferenceId: string;
    @Input() folderReferenceTypeId: string;
    @Input("editFolderDetails")
    set editFolderDetails(data: FolderModel) {
        if (!data) {
            this.editFolderDetailsData = null;
            this.initializeFolderForm();
        } else {
            this.editFolderDetailsData = data;
            this.patchFolderForm(data);
        }
    }

    @Input("isFromDocumentsApp")
    set _isFromDocumentsApp(data: boolean) {
        this.isFromDocumentsApp = data;
    }

    @Output() closePopup = new EventEmitter<string>();

    uploadFolderForm: FormGroup;

    editFolderDetailsData: FolderModel;

    isUpsertFolderInProgress$: Observable<boolean>;
    isFromDocumentsApp: boolean = false;
    upsertFolderInprogress: boolean = false;

    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>, private actionUpdates$: Actions,
        private storeManagementService: StoreManagementService, private toastr: ToastrService,
        public googleAnalyticsService: GoogleAnalyticsService, private snackBar: MatSnackBar,
        private cdRef: ChangeDetectorRef, private translateService: TranslateService) {
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(FolderActionTypes.CreateFolderCompleted),
                tap(() => {
                    this.initializeFolderForm();
                    this.closeUpsertFolderPopup(true);
                })
            )
            .subscribe();
    }

    ngOnInit() {
        if (!this.uploadFolderForm) {
            this.initializeFolderForm();
        }
        this.isUpsertFolderInProgress$ = this.store.pipe(select(commonModuleReducer.createFolderLoading));
    }

    initializeFolderForm() {
        this.uploadFolderForm = new FormGroup({
            folderName: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            )
        })
    }

    patchFolderForm(folderModel: FolderModel) {
        this.uploadFolderForm = new FormGroup({
            folderName: new FormControl(folderModel.folderName,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            )
        })
        this.cdRef.detectChanges();
    }

    upsertFolder() {
        let upsertFolderModel = new FolderModel();
        upsertFolderModel = this.uploadFolderForm.value;
        if (this.editFolderDetailsData) {
            upsertFolderModel.folderId = this.editFolderDetailsData.folderId;
            upsertFolderModel.storeId = this.editFolderDetailsData.storeId;
            upsertFolderModel.timeStamp = this.editFolderDetailsData.timeStamp;
            this.googleAnalyticsService.eventEmitter("Document Management", "Updated Folder", upsertFolderModel.folderName, 1);
        } else if (this.selectedStoreId) {
            upsertFolderModel.storeId = this.selectedStoreId;
        }
        if (this.selectedParentFolderId) {
            upsertFolderModel.parentFolderId = this.selectedParentFolderId;
        }
        if (this.folderReferenceId) {
            upsertFolderModel.folderReferenceId = this.folderReferenceId;
        }
        if (this.folderReferenceTypeId) {
            upsertFolderModel.folderReferenceTypeId = this.folderReferenceTypeId;
        }
        if (this.editFolderDetailsData == null) {
            this.googleAnalyticsService.eventEmitter("Document Management", "Created Folder", upsertFolderModel.folderName, 1);
        }
        if (this.isFromDocumentsApp) {
            this.upsertFolderDetails(upsertFolderModel);
        } else {
            this.store.dispatch(new CreateFolderTriggered(upsertFolderModel));
        }
    }

    closeUpsertFolderPopup(isSuccess) {
        this.formDirective.resetForm();
        this.closePopup.emit(isSuccess);
        this.cdRef.detectChanges();
        this.editFolderDetails = null;
    }

    upsertFolderDetails(upsertFolderDetails) {
        this.upsertFolderInprogress = true;
        this.storeManagementService.upsertFolder(upsertFolderDetails).subscribe((result: any) => {
            if (result.success) {
                if (upsertFolderDetails.folderId == null) {
                    if (upsertFolderDetails.folderId === null || upsertFolderDetails.folderId === '' || upsertFolderDetails.folderId === undefined) {
                        this.snackBar.open(this.translateService.instant(ConstantVariables.FolderCreatedSuccessfully), "ok", {
                            duration: 3000
                        });
                    } else if (upsertFolderDetails.folderId !== undefined && upsertFolderDetails.isArchived === true
                    ) {
                        this.snackBar.open(this.translateService.instant(ConstantVariables.FolderDeletedSuccessfully), "ok", {
                            duration: 3000
                        });
                    } else {
                        this.snackBar.open(this.translateService.instant(ConstantVariables.FolderUpdatedSuccessfully), "ok", {
                            duration: 3000
                        });
                    }
                }
                this.initializeFolderForm();
                this.closeUpsertFolderPopup(true);
                this.upsertFolderInprogress = false;
            } else {
                this.upsertFolderInprogress = false;
                this.toastr.error("", result.apiResponseMessages[0].message);
            }
        });
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }
}
