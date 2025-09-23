// tslint:disable-next-line: ordered-imports
import { Component, ElementRef, OnInit, ViewChild, Input } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { GetFeedbacksTriggered, GetMoreFeedbacksLoaded, FeedBackActionTypes } from '../store/actions/feedback.action';
import * as sharedModuleReducers from '../store/reducers/index';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { FeedBackModel } from '../models/feedbackModel';
import { State } from '../store/reducers/index';

@Component({
    selector: "app-component-feedback",
    templateUrl: `feedbacks-list.component.html`
})

export class FeedbackListComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChild("scrollMe") private myScrollContainer: ElementRef;
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    feedbackList$: Observable<FeedBackModel[]>;
    anyOperationInProgress$: Observable<boolean>;
    canAccess_feature_ViewFeedback$: Observable<boolean>;
    // tslint:disable-next-line: ban-types
    isPermissionExists: Boolean;
    feedbackList: FeedBackModel[];
    totalCount: number;
    pageNumber = 1;
    pageSize = 50;
    searchText: string;
    sortBy: string;
    sortDirection: string;
    throttle = 0;
    scrollDistance = 0;
    public ngDestroyed$ = new Subject();
    constructor(private store: Store<State>, private actionUpdates$: Actions) {
        super();
        this.pageNumber = 1;
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(FeedBackActionTypes.GetFeedbacksCompleted),
                tap(() => {
                    this.feedbackList$ = this.store.pipe(select(sharedModuleReducers.getFeedbackAll));
                    this.feedbackList$.subscribe((x) => this.feedbackList = x);
                    if (this.feedbackList.length > 0) {
                        this.totalCount = this.feedbackList[0].totalCount;
                    }
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.anyOperationInProgress$ = this.store.pipe(select(sharedModuleReducers.getfeedBacksLoading));
        this.isPermissionExists = this.canAccess_feature_ViewFeedback;
        if (this.isPermissionExists) {
            this.getFeedbacks();
        }
    }

    getFeedbacks() {
        const feedbackModel = new FeedBackModel();
        feedbackModel.pageNumber = this.pageNumber;
        feedbackModel.pageSize = this.pageSize;
        feedbackModel.searchText = this.searchText;
        this.store.dispatch(new GetFeedbacksTriggered(feedbackModel));
    }

    onScrollDown() {
        const element = this.myScrollContainer.nativeElement;
        const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
        const feedbackListLength = this.feedbackList.length;
        if (atBottom && this.totalCount !== feedbackListLength) {
            const feedbackModel = new FeedBackModel();
            this.pageNumber = (this.pageNumber + 1);
            feedbackModel.pageNumber = this.pageNumber;
            feedbackModel.pageSize = this.pageSize;
            feedbackModel.searchText = this.searchText;
            this.store.dispatch(
                new GetMoreFeedbacksLoaded(feedbackModel)
            );
        }
    }

    closeSearch() {
        this.searchText = null;
        this.getFeedbacks();
    }

    search() {
        if (this.searchText.length > 0) {
            this.searchText = this.searchText.trim();
            if (this.searchText.length <= 0) {
                return;
            }
        }
        this.getFeedbacks();
    }
}
