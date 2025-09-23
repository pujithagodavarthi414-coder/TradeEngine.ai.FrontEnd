import { Component, ChangeDetectionStrategy, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { TestCaseHistoryModel } from '@snovasys/snova-testrepo';
import { LoadHistoryByUserStoryIdTriggered, TestRailProjectsActions } from "@snovasys/snova-testrepo"
import * as testRailModuleReducer from "@snovasys/snova-testrepo";
import { HistoryModel } from '../../models/history';

@Component({
    selector: "userstory-scenario-history",
    templateUrl: "userstory-scenario-history.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class UserStoryScenarioHistoryComponent extends AppFeatureBaseComponent implements OnInit {
    @ViewChild("bugTitle") bugTitleStatus: ElementRef;

    @Input("userStoryData")
    set _userStoryData(data: any) {
        if (data) {
            this.userStoryData = data;
            this.loadHistory();
        }
    }

    userStoryHistory$: Observable<TestCaseHistoryModel[]>;
    anyOperationInProgress$: Observable<boolean>;

    userStoryData: any;

    constructor(private testrailStore: Store<testRailModuleReducer.State>
        ) {
        super();

        this.anyOperationInProgress$ = this.testrailStore.pipe(select(testRailModuleReducer.getHistoryByUserStoryIdLoading));
    }

    ngOnInit() {
        super.ngOnInit();
    }

    loadHistory() {
         let userstoryHistory = new HistoryModel();
         userstoryHistory.userStoryId = this.userStoryData.userStoryId
         this.testrailStore.dispatch(new LoadHistoryByUserStoryIdTriggered(userstoryHistory));
         this.userStoryHistory$ = this.testrailStore.pipe(select(testRailModuleReducer.getHistoryByUserStoryId));
    }
}