import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable, Subject } from "rxjs";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import {State} from "../../store/reducers/index";
import * as projectmoduleReducers from "../../store/reducers/index";
import { LinkUserStoryInputModel } from "../../models/link-userstory-input-model";
import { UserStoryLinksModel } from "../../models/userstory-links.model";
import { LoadUserstoryLinksTriggered, UserStoryLinksActionTypes, GetUserStoryLinksTypesTriggered } from "../../store/actions/userstory-links.action";
import { UserStoryLinkModel } from "../../models/userstory-link-types-model";


@Component({
    // tslint:disable-next-line:component-selector
    selector: "app-pm-component-userstory-links",
    templateUrl: "user-story-links.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserStoryLinksComponent implements OnInit {
    @Input("userStoryId")
    set _userStoryId(data: string) {
        this.userStoryId = data;
    }
    @Input('isAddPermission') isAddPermission: boolean;
    @Input('projectId') projectId: string;
    @Input('isArchivePermission') isArchivePermission : boolean;
    @Input("isSprintUserStories") 
    set _isSprintUserStories(data: boolean) {
        this.isSprintUserStories = data;
        var linkUserStoryModel = new LinkUserStoryInputModel();
        linkUserStoryModel.userStoryId = this.userStoryId;
        linkUserStoryModel.isSprintUserStories = this.isSprintUserStories;
        this.store.dispatch(new LoadUserstoryLinksTriggered(linkUserStoryModel));
    }

    userStories$: Observable<UserStoryLinksModel[]>;
    anyOperationInProgress$: Observable<boolean>;
    linkTypesOperationInProgress$:Observable<boolean>;
    userStoryId: string;
    isSprintUserStories : boolean;
    selectedUserStoryId : string;
    userStoryLinkTypes$: Observable<UserStoryLinkModel[]>;
    defaultProfileImage: string = "assets/images/faces/18.png";

    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>,
        private actionUpdates$: Actions,
        private router: Router) {
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryLinksActionTypes.LoadUserstoryLinksCompleted),
                tap(() => {
                    var linkTypesModel = new UserStoryLinkModel();
                    this.store.dispatch(new GetUserStoryLinksTypesTriggered(linkTypesModel));
                })
            )
            .subscribe();

    }
    ngOnInit() {
        this.userStoryLinkTypes$ = this.store.pipe(select(projectmoduleReducers.getUserStoryLinkTypes));
        this.anyOperationInProgress$ = this.store.pipe(select(projectmoduleReducers.getUserStoryLinksloading));
        this.linkTypesOperationInProgress$ = this.store.pipe(select(projectmoduleReducers.getUserStoryLinkTypesLoading));
        this.userStories$ = this.store.pipe(select(projectmoduleReducers.getUserStoryLinksAll));
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    highlightUserStorySelected(userStoryId){
      if(this.userStoryId == this.selectedUserStoryId){
          return true;
      }
      else{
          return false;
      }
    }

    selectedUserStory(userStoryId){
        this.selectedUserStoryId = userStoryId;
    }
}