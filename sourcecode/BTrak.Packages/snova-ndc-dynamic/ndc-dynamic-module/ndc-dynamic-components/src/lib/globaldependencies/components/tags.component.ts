import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatChipInputEvent } from "@angular/material";
import { Actions, ofType } from "@ngrx/effects";
// import { State } from "app/store/reducers";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
// import { takeUntil, tap } from "rxjs/operators";
// import { CustomTagsModel } from "../ models/custom-tags-model";
// import { CustomTagModel } from "../../models/customTagsModel";
// import { GoalModel } from "../../models/GoalModel";
// import { UserStoryInputTagsModel } from "../../models/user-story-tags.model";
// import { UserStory } from "../../models/userStory";
// import { CustomTagService } from "../../services/customTag.service";
// import { TagsModel } from "../../models/tags.model";
// import { LoadTagsTriggred } from "app/shared/store/actions/tags.action";

@Component({
    selector: "app-pm-component-tags",
    templateUrl: "tags.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserStoryTagsComponent implements OnInit {

    @Input("referenceId")
    set _referenceId(data: string) {
        this.userStoryInputTags = [];
        this.referenceId = data;
        if (this.referenceId) {
            this.getTagsByReference();
        }
    }

    @Input("isFromCustomApp")
    set _isFromCustomApp(data: boolean) {
        this.isFromCustomApp = data;
    }
    @Input("isFromHtmlApp")
    set _isFromHtmlApp(data: boolean) {
        this.isFromHtmlApp = data;
    }
    @Input("tagsModel")
    set _tagsModel(data: CustomTagModel[]) {
        this.tagsModel = data;
        if(this.tagsModel && this.tagsModel.length > 0  && this.isFromCustomApp) {
            this.tags = this.tagsModel;
            this.getCustomTags.emit(this.tags);
            this.count = 1;
        }
    }
    @ViewChild('tagInput') tagInput: ElementRef;
    @ViewChild('matTagInput') widgetTagInput: ElementRef;
    @Output() closeTagsPopUp = new EventEmitter<string>();
    @Output() getCustomTags = new EventEmitter<CustomTagModel[]>();
    userStory$: Observable<UserStory>;
    goal$: Observable<GoalModel>;
    customTagsModel$: Observable<CustomTagsModel[]>;
    tagsModel: CustomTagModel[];
    tagsList$: Observable<TagsModel[]>;
    tagsList: TagsModel[];
    isFromHtmlApp: boolean;
    customTagsModel: CustomTagsModel[];
    anyOperationIsInProgress$: Observable<boolean>;
    goalTagsOperationIsInProgress$: Observable<boolean>;
    sprintTagsOperationInProgress$: Observable<boolean>;
    tagsOperationInProgress$: Observable<boolean>;
    tagsLoadingInProgress$: Observable<boolean>;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    userStoryInputTags: string[] = [];
    userStory: UserStory;
    isFromCustomApp: boolean;
    goal: GoalModel;
    userStoryId: string;
    parentUserStoryId: string;
    referenceId: string;
    validationMessage: string;
    timeStamp: any;
    goalId: string;
    isSprintUserStories: boolean;
    tags: CustomTagModel[] = [];
    tagIds: any[] = [];
    addOnBlur = true;
    removable = true;
    visible: boolean = true;
    selectable: boolean = true;
    tag: string;
    isApiCall: boolean;
    public ngDestroyed$ = new Subject();
    count = 0;

    constructor(
        private sharedStore: Store<SharedState.State>,
        private store: Store<State>,
        private cdRef: ChangeDetectorRef,
        private actionUpdates$: Actions,
        private customTagsService: CustomTagService,
        private toasterService: ToastrService,
        private projectsStore: Store<projectState.State>) {
        // this.store.dispatch(new SearchTagsTriggered(null));
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryActionTypes.GetUniqueUserStoryByIdCompleted),
                tap(() => {
                    this.userStory$ = this.store.pipe(select(commonModuleReducers.getUserStoryById));
                    this.userStory$.subscribe((x) => this.userStory = x);
                    this.timeStamp = this.userStory.timeStamp;
                    this.loadUserStoryTags();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(SprintWorkItemActionTypes.GetUniqueSprintWorkItemByIdCompleted),
                tap(() => {
                    this.userStory$ = this.store.pipe(select(projectModuleReducers.getUniqueSprintWorkItem));
                    this.userStory$.subscribe((x) => this.userStory = x);
                    this.timeStamp = this.userStory.timeStamp;
                    this.parentUserStoryId = this.userStory.parentUserStoryId;
                    this.loadUserStoryTags();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(GoalActionTypes.GetUniqueGoalByIdCompleted),
                tap(() => {
                    this.goal$ = this.projectsStore.pipe(select(projectModuleReducers.getUpdatedGoal));
                    this.goal$.subscribe((x) => this.goal = x);
                    this.timeStamp = this.goal.timeStamp;
                    this.loadUserStoryTags();
                })
            )
            .subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryActionTypes.UpsertUserStoryTagsCompleted),
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
                ofType(SprintWorkItemActionTypes.UpsertWorkItemTagsCompleted),
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
                ofType(GoalActionTypes.UpsertGoalTagsCompleted),
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
                ofType(GoalActionTypes.SearchTagsCompleted),
                tap(() => {
                    this.customTagsModel$ = this.projectsStore.pipe(select(projectModuleReducers.searchCustomApplicationTags));
                    this.customTagsModel$.subscribe((x) => this.customTagsModel = x);
                })
            )
            .subscribe();

    }
    ngOnInit() {
        this.anyOperationIsInProgress$ = this.store.pipe(select(commonModuleReducers.upsertTagsLoading))
        this.goalTagsOperationIsInProgress$ = this.projectsStore.pipe(select(projectModuleReducers.goalTagsLoading))
        this.tagsOperationInProgress$ = this.projectsStore.pipe(select(projectModuleReducers.searchCustomApplicationTagsLoading))
        this.sprintTagsOperationInProgress$ = this.store.pipe(select(projectModuleReducers.upsertTagsLoading));
        this.tagsList$ = this.sharedStore.pipe(select(sharedModuleReducers.getTagAll));
        this.tagsLoadingInProgress$ = this.sharedStore.pipe(select(sharedModuleReducers.loadingTags));
    }




    loadUserStoryTags() {
        let userStoryInputSelectedTags = [];
        if (this.userStory) {
            if (this.userStory.tag) {
                userStoryInputSelectedTags = this.userStory.tag.split(",");
            }
        } else if (this.goal) {
            if (this.goal.tag) {
                userStoryInputSelectedTags = this.goal.tag.split(",");
            }
        } else {
            if (this.tags) {
                this.tags.forEach((tagData: CustomTagModel) => {
                    userStoryInputSelectedTags.push(tagData.tag)
                });
            }
        }

        if (userStoryInputSelectedTags.length > 0) {
            userStoryInputSelectedTags.forEach((tags) => {
                this.userStoryInputTags.push(tags);
            });
            if (userStoryInputSelectedTags.length > 0) {
                this.count++;
            }
        } else {
            this.userStoryInputTags = [];
            this.count = 0;
        }
        this.cdRef.detectChanges();
    }

    getTagsByReference() {
        const tagsInputModel = new CustomTagModel();
        tagsInputModel.referenceId = this.referenceId;
        this.customTagsService.getCustomTags(tagsInputModel).subscribe((result: any) => {
            if (result.success === true) {
                this.tags = result.data;
                this.count = 1;
                this.getCustomTags.emit(this.tags);
                this.cdRef.detectChanges();
                //this.loadUserStoryTags()
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toasterService.error(this.validationMessage);
            }

        });
    }

    disabledButton(enteredText, tags) {
        if ((enteredText === "Enter" || enteredText === "Comma")) {
            this.count = 1;
        } else {
            this.store.dispatch(new SearchTagsTriggered(tags));
            if (tags && (enteredText !== "Enter" || enteredText !== "Comma")) {
                this.count = 0;
            } else {
                this.count = 1;
            }
        }
    }

    disabledWidgetButton(enteredText, tags) {
        if ((enteredText === "Enter" || enteredText === "Comma")) {
            this.count = 1;
        } else {
            var customTags = new CustomTagModel();
            customTags.searchText = tags
            this.store.dispatch(new LoadTagsTriggred(customTags));
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
        tagsModel.userStoryId = this.userStoryId;
        tagsModel.timeStamp = this.timeStamp;
        tagsModel.goalId = this.goalId;
        tagsModel.parentUserStoryId = this.parentUserStoryId;
        tagsModel.tags = this.userStoryInputTags.toString();
        if (this.userStoryId && !this.isSprintUserStories) {
            this.store.dispatch(new UpsertUserStoryTagsTriggered(tagsModel));
        } else if (this.userStoryId && this.isSprintUserStories) {
            this.store.dispatch(new UpsertWorkItemTagsTriggered(tagsModel));
        } else if (this.goalId) {
            this.store.dispatch(new UpsertGoalTagsTriggered(tagsModel));
        } else if (this.referenceId) {
            const customTagsModel = new CustomTagModel();
            customTagsModel.referenceId = this.referenceId;
            customTagsModel.tagsList = this.tags;
            this.customTagsService.upsertCustomTag(customTagsModel).subscribe((result: any) => {
                if (result.success === true) {
                    this.userStoryInputTags = [];
                    this.tags = [];
                    this.closeTagsPopUp.emit("saved");
                    this.count = 0;
                } else {
                    this.validationMessage = result.apiResponseMessages[0].message;
                    this.toasterService.error(this.validationMessage);
                }
            });
        }

    }

    addWidgetTags(event: MatChipInputEvent) {
        const inputTags = event.input;
        const userStoryTags = event.value.trim();
        if (userStoryTags) {
            var model = new CustomTagModel();
            model.tag = userStoryTags;
            this.tags.push(model);
            this.count++;
            this.getCustomTags.emit(this.tags);
        }
        if (inputTags) {
            inputTags.value = " ";
        }
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

    selectedWidgetTagValue(tagInput) {
        this.tagsList$.subscribe((x) => this.tagsList = x);
        let tagsList = this.tagsList;
        let tagName = tagsList.find(x => x.tagId == tagInput.option.value).tag;
        this.tagIds.push(tagInput.option.value);
        var model = new CustomTagModel();
        model.tag = tagName;
        model.tagId = tagInput.option.value;
        this.tags.push(model);
        this.widgetTagInput.nativeElement.value = '';
        this.count = 1;
        this.getCustomTags.emit(this.tags);
    }

    removeWidgetTags(tags) {
        const index = this.tags.indexOf(tags);
        if (index >= 0) {
            this.tags.splice(index, 1);
        }
        if (this.tags.length === 0) {
            this.count = 1;
        }
        this.getCustomTags.emit(this.tags);
    }

}

