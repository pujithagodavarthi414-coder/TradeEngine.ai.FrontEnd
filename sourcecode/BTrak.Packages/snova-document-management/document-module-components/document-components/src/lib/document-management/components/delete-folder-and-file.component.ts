import { Component, Output, EventEmitter, Input } from "@angular/core";
import { Subject } from "rxjs";
import { Store } from "@ngrx/store";
import { takeUntil, tap } from "rxjs/operators";
import { ofType, Actions } from "@ngrx/effects";
import { State } from "../store/reducers/index";
import { FolderModel } from "../models/folder-model";
import { FileInputModel } from "../models/file-input-model";
import { FolderActionTypes, CreateFolderTriggered } from "../store/actions/folder.actions";
import { DeleteFileInputModel } from "../models/delete-file-input-model";
import { DeleteFileTriggered, FileActionTypes } from "../store/actions/file.actions";
import { GoogleAnalyticsService } from '../services/google-analytics.service';
import "../../globaldependencies/helpers/fontawesome-icons";
import { StoreManagementService } from '../services/store-management.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConstantVariables } from '../constants/constant-variables';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: "app-document-component-delete-folder-and-file",
  templateUrl: "./delete-folder-and-file.component.html"
})

export class DeleteFolderAndFileComponent {
  @Input() isFolder: boolean;

  @Input('editFolderDetails')
  set editFolderDetails(data: FolderModel) {
    if (!data)
      this.editFolderDetailsData = null;
    else
      this.editFolderDetailsData = data;
  }

  @Input('fileDetailsData')
  set fileDetailsData(data: FileInputModel) {
    if (!data)
      this.editFileDetailsData = null;
    else
      this.editFileDetailsData = data;
  }

  @Input("isFromDocumentsApp")
  set _isFromDocumentsApp(data: boolean) {
    this.isFromDocumentsApp = data;
  }

  @Output() closeDeletionPopup = new EventEmitter<any>();

  editFolderDetailsData: FolderModel;
  editFileDetailsData: FileInputModel;
  isFromDocumentsApp: boolean = false;
  upsertFolderInprogress: boolean = false;

  public ngDestroyed$ = new Subject();

  constructor(private store: Store<State>, private actionUpdates$: Actions, private snackBar: MatSnackBar,
    public googleAnalyticsService: GoogleAnalyticsService, private translateService: TranslateService,
    private storeManagementService: StoreManagementService, private toastr: ToastrService) {
    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(FolderActionTypes.DeleteFolderCompleted),
        tap(() => {
          this.cancelDeletion(true);
        })
      )
      .subscribe();

    this.actionUpdates$
      .pipe(
        takeUntil(this.ngDestroyed$),
        ofType(FileActionTypes.DeleteFileCompleted),
        tap(() => {
          this.cancelDeletion(true);
        })
      )
      .subscribe();
  }

  ngOnInit() {

  }

  deleteFolder() {
    let upsertFolderModel = new FolderModel();
    if (this.editFolderDetailsData) {
      upsertFolderModel.folderId = this.editFolderDetailsData.folderId;
      upsertFolderModel.folderName = this.editFolderDetailsData.folderName;
      upsertFolderModel.parentFolderId = this.editFolderDetailsData.parentFolderId;
      upsertFolderModel.storeId = this.editFolderDetailsData.storeId;
      upsertFolderModel.timeStamp = this.editFolderDetailsData.timeStamp;
      upsertFolderModel.isArchived = true;
    }
    this.googleAnalyticsService.eventEmitter("Document Management", "Deleted Folder", upsertFolderModel.folderName, 1);
    if (this.isFromDocumentsApp) {
      this.upsertFolderDetails(upsertFolderModel);
    } else {
      this.store.dispatch(new CreateFolderTriggered(upsertFolderModel));
    }
  }

  deleteFile() {
    let deleteFileInputModel = new DeleteFileInputModel();
    if (this.editFileDetailsData) {
      deleteFileInputModel.fileId = this.editFileDetailsData.fileId;
      deleteFileInputModel.timeStamp = this.editFileDetailsData.timeStamp;
    }
    if (this.isFromDocumentsApp) {
      this.upsertFileDetails(deleteFileInputModel);
    } else {
      this.store.dispatch(new DeleteFileTriggered(deleteFileInputModel));
    }
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
        this.cancelDeletion(true);
        this.upsertFolderInprogress = false;
      } else {
        this.upsertFolderInprogress = false;
        this.toastr.error("", result.apiResponseMessages[0].message);
      }
    });
  }

  upsertFileDetails(upsertFileDetails) {
    this.storeManagementService.deleteFile(upsertFileDetails).subscribe((result: any) => {
      if (result.success) {
        this.snackBar.open(this.translateService.instant(ConstantVariables.FileDeletedSuccessfully), "ok", {
          duration: 3000
        });
        this.cancelDeletion(true);
      } else {
        this.toastr.error("", result.apiResponseMessages[0].message);
      }
    });
  }

  cancelDeletion(result: boolean) {
    this.editFolderDetailsData = null;
    this.editFileDetailsData = null;
    this.closeDeletionPopup.emit(result);
  }
}
