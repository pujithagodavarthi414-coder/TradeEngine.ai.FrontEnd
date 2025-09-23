import { Component, Input, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { State } from "../store/reducers/index";
import * as commonModuleReducers from "../store/reducers/index";
import { Observable } from "rxjs";
import { CustomFieldHistoryModel } from '../models/custom-field-history.model';
import { LoadCustomFieldHistoryTriggered } from '../store/actions/custom-field-history.actions';

@Component({
    selector: "app-custom-field-history",
    templateUrl: "custom-field-history.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomFieldHistoryComponent implements OnInit {
    @Input("referenceId")
    set _referenceId(data: string) {
        this.referenceId = data;
        localStorage.setItem("userStoryId",this.referenceId);
        var customFieldHistoryModel = new CustomFieldHistoryModel();
        customFieldHistoryModel.referenceId = this.referenceId;
        this.store.dispatch(new LoadCustomFieldHistoryTriggered(customFieldHistoryModel))
    }
    customFieldHistoryModel$: Observable<CustomFieldHistoryModel[]>;
    anyOperationInProgress$: Observable<boolean>;
    referenceId: string;
    constructor(private store: Store<State>) {

    }

    ngOnInit() {
        this.customFieldHistoryModel$ = this.store.pipe(select(commonModuleReducers.getCustomFieldHistoryAll));
        this.anyOperationInProgress$ = this.store.pipe(select(commonModuleReducers.loadingSearchCustomFieldsHistory));
    }
}