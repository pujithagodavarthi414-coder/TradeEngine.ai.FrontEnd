import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { ConstantVariables } from '../constants/constant-variables';
import { StoreModel } from '../models/store-model';

@Component({
    selector: "app-document-component-view-store",
    templateUrl: "view-store.component.html",
    styles: [`
    .document-tree-panel-color
    {
        background-color : #fff !important;
    }`]
})

export class ViewStoreComponent extends CustomAppBaseComponent {
    selectedStoreId: string;
    selectedParentFolderId: string;
    referenceTypeId = ConstantVariables.CustomReferenceTypeId;
    moduleTypeId: number = 5;
    canAccess_feature_ViewStores: Boolean;
    storeDetails: any;
    folderReferenceId: string;
    selectedStoreName: string;

    isGrid: boolean = false;
    public ngDestroyed$ = new Subject();

    constructor(private router: Router, private route: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.route.params.subscribe((routeParams) => {
            if (routeParams.storeId) {
                this.selectedStoreId = routeParams.storeId;
            }
            if (routeParams.folderId) {
                this.selectedParentFolderId = routeParams.folderId;
            }
        })
    }

    naviagteToStore() {
        this.router.navigate(['/documentmanagement/storemanagement']);
    }

    bindStoreDetails(storeData) {
        if (storeData) {
            this.storeDetails = storeData;
            this.storeDetails.forEach(element => {
                if (element.storeId == this.selectedStoreId) {
                    this.selectedStoreName = element.storeName;
                }
            });
        }
    }

    ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}
