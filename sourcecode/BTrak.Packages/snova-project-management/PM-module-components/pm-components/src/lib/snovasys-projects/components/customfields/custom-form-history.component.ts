import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef, ViewChildren } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { State } from "../../../store/reducers";
import * as commonModuleReducers from "../../store/reducers";
import { Observable } from "rxjs";
import { CustomFieldHistoryModel } from '../../models/custom-field-history.model';
import { LoadCustomFieldHistoryTriggered } from '../../store/actions/custom-field-history.actions';

@Component({
    // tslint:disable-next-line:component-selector
    selector: "app-custom-form-history",
    templateUrl: "custom-form-history.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomFormHistoryComponent implements OnInit {

    @Input("referenceTypeId")
    set _referenceTypeId(data: string) {
        this.referenceTypeId = data;
    }

    @Input("referenceId")
    set _referenceId(data: string) {
        this.referenceId = data;
        localStorage.setItem("userStoryId",this.referenceId);
        var customFieldHistoryModel = new CustomFieldHistoryModel();
        customFieldHistoryModel.referenceTypeId = this.referenceTypeId; 
        customFieldHistoryModel.referenceId = this.referenceId;
        this.store.dispatch(new LoadCustomFieldHistoryTriggered(customFieldHistoryModel))
    }


    customFieldHistoryModel$: Observable<CustomFieldHistoryModel[]>;
    anyOperationInProgress$: Observable<boolean>;
    referenceId: string;
    referenceTypeId: string;
    constructor(private store: Store<State>) {

    }
    ngOnInit() {
        this.customFieldHistoryModel$ = this.store.pipe(select(commonModuleReducers.getCustomFieldHistoryAll));
        this.anyOperationInProgress$ = this.store.pipe(select(commonModuleReducers.loadingSearchCustomFieldsHistory));
    }
}