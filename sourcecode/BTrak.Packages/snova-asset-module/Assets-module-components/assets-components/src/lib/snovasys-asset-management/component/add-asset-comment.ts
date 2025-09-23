import { Component, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormGroup, Validators, FormControl, FormGroupDirective } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { Assets } from "../models/asset";
import { AssetComments } from "../models/asset-comments";
import { ListOfAssetsService } from "../services/list-of-assets.service";
import { AddAssetCommentTriggered, AssetsCommentsAndHistoryActionTypes } from "../store/actions/assetsCommentsAndHistory.actions";
import { State } from "../store/reducers/index";
import { Actions, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";
import '../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "add-asset-comment",
    templateUrl: `add-asset-comment.html`
})

export class AddAssetComments {
    @ViewChild("formDirective") formDirective: FormGroupDirective;

    @Input("assetDetails")
    set assetDetails(data: Assets) {
        if (data) {
            this.assetDetailsData = data;
        } else {
            this.assetDetailsData = null;
        }
    }

    assetCommentsForm: FormGroup;

    assetDetailsData: Assets;

    upsertCommentsInProgress: boolean;
    validationMessage: string;

    @Output() closePopup = new EventEmitter<string>();
    constructor(private store: Store<State>, private listOfAssets: ListOfAssetsService, private snackbar: MatSnackBar,
        private toaster: ToastrService, private translateService: TranslateService, private actionUpdates$: Actions) {

        this.actionUpdates$
            .pipe(
                ofType(AssetsCommentsAndHistoryActionTypes.AddAssetCommentCompleted),
                tap(() => {
                    this.upsertCommentsInProgress = false;
                    this.clearAssetComments();
                    this.cancelComments();
                })
            )
            .subscribe();
    }

    ngOnInit() {
        this.clearAssetComments();
    }

    postComment() {
        const assetCommentsFormData = new AssetComments();
        assetCommentsFormData.receiverId = this.assetDetailsData.assetId;
        assetCommentsFormData.comment = this.assetCommentsForm.value.comment;
        this.upsertCommentsInProgress = true;
        this.store.dispatch(new AddAssetCommentTriggered(assetCommentsFormData));
    }

    clearAssetComments() {
        this.assetCommentsForm = new FormGroup({
            comment: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(800)
                ])
            )
        })
    }

    cancelComments() {
        this.formDirective.resetForm();
        this.closePopup.emit("");
    }
}
