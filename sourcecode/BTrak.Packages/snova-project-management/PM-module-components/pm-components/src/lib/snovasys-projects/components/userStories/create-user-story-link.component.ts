// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
// tslint:disable-next-line: ordered-imports
import { ActivatedRoute } from "@angular/router";
// tslint:disable-next-line: ordered-imports
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
import { Observable, Subject, empty } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { LinkUserStoryInputModel } from "../../models/link-userstory-input-model";
// tslint:disable-next-line: ordered-imports
import { UserStory } from "../../models/userStory";
// tslint:disable-next-line: ordered-imports
import { UserStoryLinkModel } from "../../models/userstory-link-types-model";
// tslint:disable-next-line: ordered-imports
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
// tslint:disable-next-line: ordered-imports
import { UpsertUserStoryLinkTriggered, UserStoryLinksActionTypes } from "../../store/actions/userstory-links.action";
import { SearchAutoCompleteTriggered, UserStoryActionTypes } from "../../store/actions/userStory.actions";
import { State } from "../../store/reducers/index";
import * as projectModuleReducers from "../../store/reducers/index";
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { LoadLinksCountByUserStoryIdTriggered } from '../../store/actions/comments.actions';

@Component({
    // tslint:disable-next-line:component-selector
    selector: "app-pm-component-create-user-story-link",
    templateUrl: "create-user-story-link.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateUserStoryLinkComponent implements OnInit {
    @Input("userStoryId")
    set _userStoryId(data: string) {
        this.userStoryId = data;
    }
    @Input("projectId")
    set _projectId(data: string) {
        this.projectId = data;
    }
    @Input("isSprintUserStories")
    set _isSprintUserStories(data: boolean) {
        this.isSprintUserStories = data;
    }
    @ViewChild("formDirective") formGroupDirective: FormGroupDirective;
    userStories$: Observable<UserStory[]>;
    userStories: UserStory[];
    userStoryLinkTypes$: Observable<UserStoryLinkModel[]>;
    addOperationInProgress$: Observable<boolean>;
    anyOperationInProgress$: Observable<boolean>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    userStoryLink: LinkUserStoryInputModel;
    userStoryId: string;
    isSprintUserStories: boolean;
    isUserStoryInputVisible: boolean;
    errorMessage: boolean;
    isButtonDisabled: boolean;
    createUserStoryLink: FormGroup;
    userStoryName: string;
    projectId: string;
    linkUserStoryId: string;

    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>,
                private route: ActivatedRoute,
                private actionUpdates$: Actions,
                private cdRef: ChangeDetectorRef) {
        this.clearForm();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryActionTypes.SearchAutoCompleteCompleted),
                tap(() => {
                    this.userStories$ = this.store.pipe(select(projectModuleReducers.getUserStoriesList));
                    this.userStories$.subscribe((x) => this.userStories = x);
                    this.cdRef.detectChanges();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryLinksActionTypes.UpsertUserStoryLinkCompleted),
                tap(() => {
                    this.userStoryName = "";
                    this.clearForm();
                    this.formGroupDirective.reset();
                    this.showUserstoryInput();
                    this.isButtonDisabled = false;
                     //Getting links Count
                    this.store.dispatch(new LoadLinksCountByUserStoryIdTriggered(this.userStoryId ,this.isSprintUserStories));

                })
            )
            .subscribe();
    }
    ngOnInit() {
        this.getSoftLabelConfigurations();
        this.userStoryLinkTypes$ = this.store.pipe(select(projectModuleReducers.getUserStoryLinkTypes));
        this.addOperationInProgress$ = this.store.pipe(select(projectModuleReducers.upsertUserStoryLinkLoading));
        this.anyOperationInProgress$ = this.store.pipe(select(projectModuleReducers.searchLoading));
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    clearForm() {
        this.userStories$ = empty()
        this.createUserStoryLink = new FormGroup({
            linkUserStoryId: new FormControl(""),
            userStoryName: new FormControl(""),
            linkUserStoryTypeId: new FormControl("", [Validators.required])
        });
    }

    showUserstoryInput() {
        this.clearForm();
        this.isButtonDisabled = false;
        this.isUserStoryInputVisible = !this.isUserStoryInputVisible;
    }

    CancelUserstoryInput() {
        this.clearForm();
        this.formGroupDirective.reset();
        this.isUserStoryInputVisible = !this.isUserStoryInputVisible;
    }

    CancelUserStory() {
        this.clearForm();
        this.formGroupDirective.reset();
    }

    searchUserStories(userStoryName) {
        const searchText = this.createUserStoryLink.value.userStoryName;
        this.isButtonDisabled = true;
        const searchCriteria = new UserStorySearchCriteriaInputModel();
        this.userStoryName = searchText;
        searchCriteria.searchText = searchText;
        searchCriteria.projectId = this.projectId;
        searchCriteria.isUserStoryArchived = false;
        searchCriteria.isUserStoryParked = false;
        searchCriteria.isForUserStoryoverview = true;
        searchCriteria.isArchived = false;
        searchCriteria.isParked = false;
        this.store.dispatch(new SearchAutoCompleteTriggered(searchCriteria));
    }

    onChangeUserStoryId(linkUserStoryId) {
        const userStoryDetails = this.userStories.find((userStory) => userStory.userStoryId === linkUserStoryId);
        if (userStoryDetails) {
            this.createUserStoryLink.controls["linkUserStoryId"].setValue(linkUserStoryId);
            this.isButtonDisabled = false;
            this.linkUserStoryId = linkUserStoryId;
        } else {
            this.createUserStoryLink.controls["linkUserStoryId"].setValue("");
            this.isButtonDisabled = true;
            this.linkUserStoryId = "";
        }

    }

    closeSearchUserStories() {
        this.userStoryName = "";
        this.createUserStoryLink.controls["userStoryName"].setValue("");
        this.formGroupDirective.reset();
        this.searchUserStories(this.userStoryName);
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    displayFn(userStoryId) {
        if (!userStoryId) {
            return "";
        } else {
            const userStoryDetails = this.userStories.find((userStory) => userStory.userStoryId === userStoryId);
            return userStoryDetails.userStoryName;
        }
    }

    saveUserStoryLink() {
        this.userStoryLink = this.createUserStoryLink.value;
        this.userStoryLink.linkUserStoryId = this.linkUserStoryId;
        this.userStoryLink.userStoryId = this.userStoryId;
        this.userStoryLink.isSprintUserStories = this.isSprintUserStories;
        this.store.dispatch(new UpsertUserStoryLinkTriggered(this.userStoryLink));
    }
}
