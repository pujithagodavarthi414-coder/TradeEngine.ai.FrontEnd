import { Component, Inject } from "@angular/core";
import { Assets } from "../models/asset";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { Store, select } from "@ngrx/store";
import { State } from "../store/reducers/index";
import * as assetModuleReducer from '../store/reducers/index';
import '../../globaldependencies/helpers/fontawesome-icons';

export interface DialogData {
    assetId: string;
    assetsDetailsType: string;
}

@Component({
    selector: "app-am-component-assets-preview",
    templateUrl: `assets-preview.component.html`
})

export class AssetsPreviewComponent {
    selectedAssetData$: Observable<Assets>;

    constructor(private dialogRef: MatDialogRef<AssetsPreviewComponent>, @Inject(MAT_DIALOG_DATA) private data: DialogData, private store: Store<State>) {
        if (data.assetsDetailsType == "DamagedAssets")
            this.selectedAssetData$ = this.store.pipe(select(assetModuleReducer.getAssetDetailsByAssetIdFromRecentlyDamagedAssets, { assetId: data.assetId }));
        else if (data.assetsDetailsType == "AssetsAllocatedToMe")
            this.selectedAssetData$ = this.store.pipe(select(assetModuleReducer.getAssetDetailsByAssetIdFromAssetsAllocatedToMe, { assetId: data.assetId }));
        else if (data.assetsDetailsType == "RecentlyAssignedAssets")
            this.selectedAssetData$ = this.store.pipe(select(assetModuleReducer.getAssetDetailsByAssetIdFromRecentlyAssignedAssets, { assetId: data.assetId }));
        else if (data.assetsDetailsType == "PersonalAssets")
            this.selectedAssetData$ = this.store.pipe(select(assetModuleReducer.getAssetDetailsByAssetIdFromGetAssetsAll, { assetId: data.assetId }));
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        (document.querySelector('.mat-dialog-padding') as HTMLElement).parentElement.parentElement.style.padding = "0px";
    }

    onClose() {
        this.dialogRef.close();
    }
}