import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatChipInputEvent } from "@angular/material/chips";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import { CustomTagsModel } from "../../models/custom-tags-model";
import { CustomTagModel } from "../../models/customTagsModel";
import { GoalModel } from "../../models/GoalModel";
import { UserStoryInputTagsModel } from "../../models/user-story-tags.model";
import { UserStory } from "../../models/userStory";
import { CustomTagService } from "../../services/customTag.service";
// tslint:disable-next-line: max-line-length
import { GetUniqueGoalByIdTriggered, GoalActionTypes, SearchTagsTriggered, UpsertGoalTagsTriggered } from "../../store/actions/goal.actions";
import { GetUniqueUserStoryByIdTriggered, UpsertUserStoryTagsTriggered, UserStoryActionTypes } from "../../store/actions/userStory.actions";
import * as projectModuleReducers from "../../store/reducers/index";
import * as projectState from "../../store/reducers/index";
import { GetUniqueSprintWorkItemByIdTriggered, SprintWorkItemActionTypes, UpsertWorkItemTagsTriggered } from "../../store/actions/sprint-userstories.action";
import { TagsModel } from "../../models/tags.model";
import { LoadTagsTriggred } from '../../store/actions/tags.action';
import { ProjectGoalsService } from '../../services/goals.service';

@Component({
    selector: "app-pm-component-tags",
    templateUrl: "tags.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserStoryTagsComponent implements OnInit {

    @Input("userStoryId")
    set _userStoryId(data: string) {
        this.userStoryInputTags = [];
        this.userStoryId = data;
        if (this.userStoryId) {
            this.loadTags();
        }
    }
    @Input("goalId")
    set _goalId(data: string) {
        this.userStoryInputTags = [];
        this.goalId = data;
        if (this.goalId) {
            this.projectsStore.dispatch(new GetUniqueGoalByIdTriggered(this.goalId));
        }
    }
    @Input("isReview")
    set _isReview(data: string) {
        this.isReview = data;
    }
    @Input("reviewDetails")
    set _reviewDetails(data: string) {
        this.reviewDetails = data;
        if (this.reviewDetails) {
            this.loadReviewTags();
        }
    }


    @Input("isSprintUserStories")
    set _isSprintUserStories(data: boolean) {
        this.isSprintUserStories = data;
    }
    @Input("isFromCustomApp")
    set _isFromCustomApp(data: boolean) {
        this.isFromCustomApp = data;
    }
    @Input("isFromHtmlApp")
    set _isFromHtmlApp(data: boolean) {
        this.isFromHtmlApp = data;
    }
    @Input("parentUserStoryId")
    set _parentUserStoryId(data: string) {
        this.parentUserStoryId = data;
    }

    @Input("isUniquePage")
    set _isUniquePage(data: boolean) {
        this.isUniquePage = data;
    }
    @Input("isAllGoalsPage")
    set _isAllGoalsPage(data: boolean) {
        this.isAllGoalsPage = data;
    }
    @Input("isFromUserStory")
    set _isFromUserStory(data: boolean) {
        this.isFromUserStory = data;
    }
    @ViewChild('tagInput') tagInput: ElementRef;
    @ViewChild('matTagInput') widgetTagInput: ElementRef;
    @Output() closeTagsPopUp = new EventEmitter<string>();
    @Output() emitUserStoryTags = new EventEmitter<string>();
    @Output() setUserStoryTags = new EventEmitter<any[]>();
    @Output() getCustomTags = new EventEmitter<CustomTagModel[]>();
    userStory$: Observable<UserStory>;
    goal$: Observable<GoalModel>;
    customTagsModel$: Observable<CustomTagsModel[]>;
    tagsModel: CustomTagModel[];
    tagsList$: Observable<TagsModel[]>;
    tagsList: TagsModel[];
    isUniquePage: boolean;
    isReview: any;
    reviewDetails : any;
    isFromUserStory: boolean;
    isAllGoalsPage: boolean;
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
    isLoading: boolean;
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
    userStoryFetching: boolean;
    constructor(
        private cdRef: ChangeDetectorRef,
        private actionUpdates$: Actions,
        private customTagsService: CustomTagService,
        private toasterService: ToastrService,
        private goalService: ProjectGoalsService,
        private projectsStore: Store<projectState.State>,
        private toastr: ToastrService) {
        // this.store.dispatch(new SearchTagsTriggered(null));
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(UserStoryActionTypes.GetUniqueUserStoryByIdCompleted),
                tap(() => {
                    this.userStory$ = this.projectsStore.pipe(select(projectModuleReducers.getUserStoryById));
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
                    this.userStory$ = this.projectsStore.pipe(select(projectModuleReducers.getUniqueSprintWorkItem));
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
        this.anyOperationIsInProgress$ = this.projectsStore.pipe(select(projectModuleReducers.upsertTagsLoading))
        this.goalTagsOperationIsInProgress$ = this.projectsStore.pipe(select(projectModuleReducers.goalTagsLoading))
        this.tagsOperationInProgress$ = this.projectsStore.pipe(select(projectModuleReducers.searchCustomApplicationTagsLoading))
        this.sprintTagsOperationInProgress$ = this.projectsStore.pipe(select(projectModuleReducers.upsertTagsLoading));
        this.tagsList$ = this.projectsStore.pipe(select(projectModuleReducers.getTagAll));
        this.tagsLoadingInProgress$ = this.projectsStore.pipe(select(projectModuleReducers.loadingTags));
    }


    loadTags() {
        this.userStoryFetching = true;
        this.goalService.GetUserStoryById(this.userStoryId).subscribe((x: any) => {
            if (x.success) {
                this.userStory = x.data;
                this.timeStamp = this.userStory.timeStamp;
                this.loadUserStoryTags();
            }
            this.userStoryFetching = false;
            this.cdRef.detectChanges();
            this.cdRef.markForCheck();
        })
    }
    loadReviewTags() {
        this.userStory = this.reviewDetails;
        this.loadUserStoryTags();
        this.userStoryFetching = false;
        this.cdRef.detectChanges();
        this.cdRef.markForCheck();
    }


    loadUserStoryTags() {
        this.userStoryFetching = false;
        let userStoryInputSelectedTags = [];
        this.userStoryInputTags = [];
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
        this.setUserStoryTags.emit(this.userStoryInputTags);
        this.cdRef.detectChanges();
    }


    disabledButton(enteredText, tags) {
        if (enteredText === "Space") {
            this.count = 0;
            this.cdRef.detectChanges();
        } else {
            if (((enteredText === "Enter" || enteredText === "Comma") && tags)) {
                this.count = 1;
            } else {
                this.projectsStore.dispatch(new SearchTagsTriggered(tags));
                if (tags && (enteredText !== "Enter" || enteredText !== "Comma")) {
                    this.count = 0;
                } else {
                    this.count = 1;
                }
            }
        }
    }

    addUserStoryTags(event: MatChipInputEvent) {
        if (event.value.trim()) {
            const inputTags = event.input;
            const userStoryTags = event.value.trim();
            if (userStoryTags) {
                this.userStoryInputTags.push(userStoryTags);
                this.setUserStoryTags.emit(this.userStoryInputTags);
                this.count++;
            } else {
                this.count = 0;
            }
            if (inputTags) {
                inputTags.value = " ";
            }
        } else {
            this.count = 0;
        }

    }

    saveUserStoryTags() {
        const tagsModel = new UserStoryInputTagsModel();
        tagsModel.userStoryId = this.userStoryId;
        tagsModel.timeStamp = this.timeStamp;
        tagsModel.goalId = this.goalId;
        tagsModel.parentUserStoryId = this.parentUserStoryId;
        tagsModel.tags = this.userStoryInputTags.toString();
        tagsModel.isUniquePage = this.isUniquePage;
        tagsModel.isAllGoalsPage = this.isAllGoalsPage;
        if (this.isUniquePage && this.isReview == null) {
            this.isLoading = true;
            this.goalService.upsertUserStoryTags(tagsModel).subscribe((model: any) => {
                if (model.success) {
                    this.userStoryInputTags = [];
                    this.closeTagsPopUp.emit("close");
                    this.count = 0;
                    this.emitUserStoryTags.emit('');
                } else {
                    this.toastr.error('', model.apiResponseMessages[0])
                }
                this.isLoading = false;
                this.cdRef.markForCheck();
            })

        } else if(this.isReview != null) {
            let inputData: any={};
            inputData.tags = this.userStoryInputTags.toString();
            inputData.userStoryId = this.reviewDetails.userStoryId;
            this.isLoading = true;
            this.goalService.upsertUploadFileTags(inputData).subscribe((model: any) => {
                if (model.success) {
                    this.emitUserStoryTags.emit(this.userStoryInputTags.toString());
                    this.userStoryInputTags = [];
                    this.count = 0;
                } else {
                    this.toastr.error('', model.apiResponseMessages[0])
                }
                this.isLoading = false;
                this.cdRef.markForCheck();
            })
        } else {
            if (this.userStoryId && !this.isSprintUserStories) {
                this.projectsStore.dispatch(new UpsertUserStoryTagsTriggered(tagsModel));
            } else if (this.userStoryId && this.isSprintUserStories) {
                this.projectsStore.dispatch(new UpsertWorkItemTagsTriggered(tagsModel));
            } else if (this.goalId) {
                this.projectsStore.dispatch(new UpsertGoalTagsTriggered(tagsModel));
            }
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
        this.setUserStoryTags.emit(this.userStoryInputTags);

    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    closeDialog() {
        this.closeTagsPopUp.emit(" ");
    }

    selectedTagValue(event) {
        this.userStoryInputTags.push(event.option.value);
        this.setUserStoryTags.emit(this.userStoryInputTags);
        this.tagInput.nativeElement.value = '';
        this.count = 1;
    }

}

