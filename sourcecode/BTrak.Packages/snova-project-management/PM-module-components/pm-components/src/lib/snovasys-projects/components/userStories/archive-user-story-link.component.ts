// tslint:disable-next-line: ordered-imports
import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ChangeDetectionStrategy, ViewChildren, QueryList } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { Store, select } from "@ngrx/store";
// tslint:disable-next-line: ordered-imports
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap } from "rxjs/operators";
// tslint:disable-next-line: ordered-imports
import { Subject, Observable } from "rxjs";
import { ArchiveUserStoryLinkTriggered, UserStoryLinksActionTypes } from "../../store/actions/userstory-links.action";
import { State } from "../../store/reducers/index";
import * as projectModuleReducers from "../../store/reducers/index";
import { ArchivedUserStoryLinkModel } from "../../models/archived-user-story-link-model";
import { UserStoryLinksModel } from "../../models/userstory-links.model";
import { LoadLinksCountByUserStoryIdTriggered } from '../../store/actions/comments.actions';

@Component({
    selector: "app-pm-component-archive-user-story-link",
    templateUrl: "archive-user-story-link.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ArchiveUserStorySummaryComponent implements OnInit {
    @Input("userStory")
    set _userStory(data: UserStoryLinksModel) {
        this.userStory = data;
    }
    @Input("userStoryId")
    set _userStoryId(data: string) {
        this.userStoryId = data;
    }

    @Input("isSprintUserStories")
    set _isSprintUserStories(data: boolean) {
        this.isSprintUserStories = data;
    }

    @Output() closePopup = new EventEmitter<string>();
    anyOperationInProgress$: Observable<boolean>;
    userStory: UserStoryLinksModel;
    userStoryId: string;
    isSprintUserStories: boolean;
    public ngDestroyed$ = new Subject();
    constructor(private store: Store<State>,
                private actionUpdates$: Actions) {
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryLinksActionTypes.ArchiveUserStoryLinkCompleted),
                tap(() => {
                    this.closePopup.emit("");
                    this.store.dispatch(new LoadLinksCountByUserStoryIdTriggered(this.userStoryId,this.isSprintUserStories));

                })
            )
            .subscribe();
    }

    ngOnInit() {
        this.anyOperationInProgress$ = this.store.pipe(select(projectModuleReducers.archiveUserStoryLinkLoading));
    }

    IsArchivedUserStoryLink() {
        const archivedUserStoryModel = new ArchivedUserStoryLinkModel();
        archivedUserStoryModel.isArchived = true;
        archivedUserStoryModel.userStoryId = this.userStory.userStoryId;
        archivedUserStoryModel.userStoryLinkId = this.userStory.linkUserStoryId;
        archivedUserStoryModel.timeStamp = this.userStory.timeStamp;
        this.store.dispatch(new ArchiveUserStoryLinkTriggered(archivedUserStoryModel));
    }

    closeDialog() {
        this.closePopup.emit("");
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

}
