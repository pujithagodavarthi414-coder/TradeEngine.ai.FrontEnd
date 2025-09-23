import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { combineLatest, Observable, Subject } from "rxjs";
import { map, takeUntil, tap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { FeedBackService } from '../services/feedback.service';
import { FeedBackActionTypes, SubmitBugFeedbackTriggered, UpsertMissingFeatureTriggered } from '../store/actions/feedback.action';
import * as sharedModuleReducers from '../store/reducers/index';
import * as commonModuleReducers from '../store/reducers/index';
import { FileActionTypes } from '../store/actions/file.actions';
import { UserstoryTypeModel } from '../models/user-story-type-model';
import { UserStory } from '../models/userStory';
import { ConstantVariables } from '../helpers/constant-variables';
import { State } from '../store/reducers/index';


@Component({
    selector: "app-pm-component-bug-feedback",
    templateUrl: "./bug-feedback.component.html"
})
export class SubmitBugComponent implements OnInit {
    @Output() closeBugDialog = new EventEmitter<string>();
    @ViewChild("formDirective") formGroupDirective: FormGroupDirective;
    submitBugForm: FormGroup;
    @Input("isBugDialog")
    set _isBugDialog(data: boolean) {
        this.isBugDialog = data;
        if (this.isBugDialog) {
            this.submitBugForm = new FormGroup({
                userStoryName: new FormControl(
                    "",
                    Validators.compose([
                        Validators.required,
                        Validators.maxLength(ConstantVariables.UserStoryNameMaxLength)
                        // TODO: Shift this to constants
                    ])
                ),
                description: new FormControl(
                    "",
                    Validators.compose([
                        Validators.required
                    ])
                )
            })
            this.clearBugForm();
        }
    }

    @Input("isFeatureDialog")
    set _isFeatureDialog(data: boolean) {
        this.isFeatureDialog = data;
        if (this.isFeatureDialog) {
            this.submitBugForm = new FormGroup({
                userStoryName: new FormControl(
                    "",
                    Validators.compose([
                        Validators.required,
                        Validators.maxLength(ConstantVariables.UserStoryNameMaxLength)
                        // TODO: Shift this to constants
                    ])
                ),
                description: new FormControl(
                    "",
                    Validators.compose([
                        Validators.required
                    ])
                )
            })
            this.clearBugForm();
        }
    }

    @Input("isToShowUploadDropzone")
    set _isToShowUploadDropzone(data: boolean) {
        this.isToUploadDropzone = data;
    }

    anyOperationInProgress$: Observable<boolean>;
    fileUploadOperationInProgress$: Observable<any>;
    userStoryTypes: UserstoryTypeModel[];
    bugUserStoryTypeModel: UserstoryTypeModel;
    userStoryTypeModel: UserstoryTypeModel;
    userStory: UserStory;
    isBugDialog: boolean;
    isFeatureDialog: boolean;
    isToUploadFiles: boolean;
    isToUploadDropzone: boolean = true;
    moduleTypeId = 4;
    selectedStoreId: null;
    userStoryId: string;
    isButtonVisible = false;
    isFileUpload: boolean;
    referenceTypeId = ConstantVariables.UserStoryReferenceTypeId;
    fileTypes = "image/png,image/jpeg,image/gif,application/vnd.ms-excel,application/x-msdownload,application/vnd.android.package-archive,application/pdf,application/x-zip-compressed,text/plain,text/xml"
    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>, private actionUpdates$: Actions,
        private goalsService: FeedBackService, private toastr: ToastrService, private translateService: TranslateService) {
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(FeedBackActionTypes.SubmitBugFeedbackCompleted),
                tap(() => {
                    if (!this.isFileUpload) {
                        this.clearDetails(true);
                    } else {
                        let userStoryId;
                        this.store.pipe(select(sharedModuleReducers.getSubmitFeddbackId)).subscribe((result: string) => {
                            userStoryId = result;
                        });
                        this.userStoryId = userStoryId;
                        this.isToUploadFiles = true;
                    }
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(FeedBackActionTypes.UpsertMissingFeatureCompleted),
                tap(() => {
                    if (!this.isFileUpload) {
                        this.clearDetails(true);
                    } else {
                        let userStoryId;
                        this.store.pipe(select(sharedModuleReducers.getSubmitFeddbackId)).subscribe((result: string) => {
                            userStoryId = result;
                        });
                        this.userStoryId = userStoryId;
                        this.isToUploadFiles = true;
                    }
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(FileActionTypes.CreateFileCompleted),
                tap(() => {
                    if (this.isBugDialog) {
                        this.toastr.success("", this.translateService.instant("FEEDBACKS.BUGSUBMITTEDSUCESSFULLY"));
                    } else if (this.isFeatureDialog) {
                        this.toastr.success("", this.translateService.instant("FEEDBACKS.REQUESTEDMISSINGFEATURESUCCESSFULLY"));
                    }
                })
            )
            .subscribe();

    }

    ngOnInit() {
        this.anyOperationInProgress$ = this.store.pipe(select(sharedModuleReducers.submitBugfeedBacksLoading));
        this.searchUserStoryTypes();
        const upsertingFilesInProgress$ = this.store.pipe(select(commonModuleReducers.createFileLoading));
        const uploadingFilesInProgress$ = this.store.pipe(select(commonModuleReducers.getFileUploadLoading));

        this.fileUploadOperationInProgress$ = combineLatest(
            uploadingFilesInProgress$,
            upsertingFilesInProgress$
        ).pipe(map(
            ([
                uploadingFilesInProgress,
                upsertingFilesInProgress
            ]) =>
                uploadingFilesInProgress ||
                upsertingFilesInProgress
        ));
    }

    closeDialog(isSuccess) {
        this.clearDetails(isSuccess);
        this.isToUploadDropzone = false;
        this.moduleTypeId = 0;
    }

    clearBugForm() {
        this.moduleTypeId = 4;
        this.formGroupDirective.reset();
        this.isToUploadFiles = false;
        this.isFileUpload = false;
        this.userStoryId = null;
        this.submitBugForm = new FormGroup({
            userStoryName: new FormControl(
                "",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(ConstantVariables.UserStoryNameMaxLength)
                    // TODO: Shift this to constants
                ])
            ),
            description: new FormControl(
                "",
                Validators.compose([
                    Validators.required
                ])
            )
        })
    }

    clearDetails(isSuccess: boolean) {
        this.clearBugForm();
        this.formGroupDirective.reset();
        this.closeBugDialog.emit("test");
        if (this.isBugDialog && isSuccess) {
            this.toastr.success("", this.translateService.instant("FEEDBACKS.BUGSUBMITTEDSUCESSFULLY"));
        } else if (this.isFeatureDialog && isSuccess) {
            this.toastr.success("", this.translateService.instant("FEEDBACKS.REQUESTEDMISSINGFEATURESUCCESSFULLY"));
        }
    }

    isFileExists(event) {
        this.isFileUpload = event;
    }

    submitBugFeedback() {
        this.userStory = this.submitBugForm.value;
        this.userStory.isFileUplaod = this.isFileUpload;
        this.isToUploadFiles = false;
        if (this.isBugDialog) {
            this.userStory.userStoryTypeId = this.bugUserStoryTypeModel ? this.bugUserStoryTypeModel.userStoryTypeId : null;
            this.store.dispatch(new SubmitBugFeedbackTriggered(this.userStory));
        } else {
            this.userStory.userStoryTypeId = this.userStoryTypeModel ? this.userStoryTypeModel.userStoryTypeId : null;
            this.store.dispatch(new UpsertMissingFeatureTriggered(this.userStory));
        }
    }

    searchUserStoryTypes() {
        const userStoryType = new UserstoryTypeModel();
        userStoryType.isArchived = false;
        this.goalsService.getAllUserStoryTypes(userStoryType).subscribe((result: any) => {
            if (result.success) {
                this.userStoryTypes = result.data;
                this.bugUserStoryTypeModel = this.userStoryTypes.find((x) => x.isBug);
                this.userStoryTypeModel = this.userStoryTypes.find((x) => x.isUserStory);
            }
        })
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}
