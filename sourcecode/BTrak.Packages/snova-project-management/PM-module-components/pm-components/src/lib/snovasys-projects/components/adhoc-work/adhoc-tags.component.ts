// tslint:disable-next-line: ordered-imports
import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { MatChipInputEvent } from "@angular/material/chips";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { Actions, ofType } from "@ngrx/effects";
import { takeUntil, tap, startWith, map } from "rxjs/operators";
// tslint:disable-next-line: ordered-imports
import { Observable, Subject } from "rxjs";
// tslint:disable-next-line: ordered-imports
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
// tslint:disable-next-line: ordered-imports
import * as dashboardModuleReducers from "../../store/reducers/index";

import { UserStoryInputTagsModel } from "../../models/user-story-tags.model";
// tslint:disable-next-line: ordered-imports
import { UserStory } from "../../models/userStory";
// tslint:disable-next-line: ordered-imports
import { CustomTagsModel } from "../../models/custom-tags-model";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { AdhocWorkActionTypes, SearchAdhocTagsTriggered, UpsertAdhocUserStoryTagsTriggered } from "../../store/actions/adhoc-work.action";

@Component({
    // tslint:disable-next-line:component-selector
    selector: "app-pm-component-adhoc-tags",
    templateUrl: "adhoc-tags.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdhocUserStoryTagsComponent implements OnInit {

    @Input("userStory")
    set _userStory(data: UserStory) {
        this.userStoryInputTags = [];
        this.userStory = data;
        this.loadUserStoryTags();
    }
    @Input("goalId") goalId;

    @ViewChild('tagInput') tagInput: ElementRef;
    @Output() closeTagsPopUp = new EventEmitter<string>();
    customTagsModel$: Observable<CustomTagsModel[]>;
    customTagsModel: CustomTagsModel[];
    anyOperationIsInProgress$: Observable<boolean>;
    tagsOperationInProgress$: Observable<boolean>;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    userStoryInputTags: string[] = [];
    userStory: UserStory;
    userStoryId: string;
    timeStamp: any;
    addOnBlur = true;
    removable = true;
    visible: boolean = true;
    selectable: boolean = true;
    tag: string;
    public ngDestroyed$ = new Subject();
    count = 0;

    constructor(
        private store: Store<State>,
        private cdRef: ChangeDetectorRef,
        private actionUpdates$: Actions) {
        //this.store.dispatch(new SearchTagsTriggered(null));
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AdhocWorkActionTypes.UpsertAdhocUserStoryTagsTriggered),
                tap(() => {
                    this.userStoryInputTags = [];
                    this.closeTagsPopUp.emit("close");
                    this.count = 0;

                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(AdhocWorkActionTypes.SearchAdhocTagsCompleted),
                tap(() => {
                    this.customTagsModel$ = this.store.pipe(select(dashboardModuleReducers.searchCustomTags));
                    this.customTagsModel$.subscribe((x) => this.customTagsModel = x);
                })
            )
            .subscribe();

    }
    ngOnInit() {
        this.anyOperationIsInProgress$ = this.store.pipe(select(dashboardModuleReducers.upsertTagsLoading))
        this.tagsOperationInProgress$ = this.store.pipe(select(dashboardModuleReducers.searchCustomTagsLoading))
    }


    loadUserStoryTags() {
        let userStoryInputSelectedTags = [];
        if (this.userStory) {
            if (this.userStory.tag) {
                userStoryInputSelectedTags = this.userStory.tag.split(",");
            }
        }
        if (userStoryInputSelectedTags.length > 0) {
            userStoryInputSelectedTags.forEach((tags) => {
                this.userStoryInputTags.push(tags);
            });

            if (userStoryInputSelectedTags.length > 1) {
                this.count++;
            }
        } else {
            this.userStoryInputTags = [];
            this.count = 0;
        }
        this.cdRef.detectChanges();
    }

    disabledButton(enteredText, tags) {
        if ((enteredText === "Enter" || enteredText === "Comma")) {
            this.count = 1;
        } else {
            this.store.dispatch(new SearchAdhocTagsTriggered(tags));
            if (tags && (enteredText !== "Enter" || enteredText !== "Comma")) {
                this.count = 0;
            } else {
                this.count = 1;
            }
        }
    }

    addUserStoryTags(event: MatChipInputEvent) {
        const inputTags = event.input;
        const userStoryTags = event.value.trim();
        if (userStoryTags) {
            this.userStoryInputTags.push(userStoryTags);
            this.count++;
        }
        if (inputTags) {
            inputTags.value = " ";
        }
    }


    saveUserStoryTags() {
        const tagsModel = new UserStoryInputTagsModel();
        tagsModel.userStoryId = this.userStory.userStoryId;
        tagsModel.timeStamp = this.userStory.timeStamp;
        tagsModel.goalId = this.userStory.goalId;
        tagsModel.tags = this.userStoryInputTags.toString();
        this.store.dispatch(new UpsertAdhocUserStoryTagsTriggered(tagsModel));
    }
    removeProjectTags(tag) {
        const index = this.userStoryInputTags.indexOf(tag);
        if (index >= 0) {
            this.userStoryInputTags.splice(index, 1);
        }
        if (this.userStoryInputTags.length === 0) {
            this.count = 1;
        }
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    closeDialog() {
        this.closeTagsPopUp.emit(" ");
    }

    selectedTagValue(event) {
        this.userStoryInputTags.push(event.option.value);
        this.tagInput.nativeElement.value = '';
        this.count = 1;
    }

}
