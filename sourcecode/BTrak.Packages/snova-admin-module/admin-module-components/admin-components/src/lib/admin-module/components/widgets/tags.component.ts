import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatChipInputEvent } from "@angular/material/chips";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { CustomTagModel, CustomTagsModel } from "../../models/customTagsModel";
import { UserStory } from "../../models/userStory";
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { TagsModel } from '../../models/tags.model';
import { UserStoryInputTagsModel } from '../../models/user-story-tags.model';

@Component({
    selector: "app-component-tags",
    templateUrl: "tags.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsComponent implements OnInit {
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
        if (this.tagsModel && this.tagsModel.length > 0 && this.isFromCustomApp) {
            this.tags = this.tagsModel;
            this.getCustomTags.emit(this.tags);
            this.count = 1;
        }
    }
    @ViewChild('tagInput') tagInput: ElementRef;
    @ViewChild('matTagInput') widgetTagInput: ElementRef;
    @Output() closeTagsPopUp = new EventEmitter<string>();
    @Output() getCustomTags = new EventEmitter<CustomTagModel[]>();
    tagsModel: CustomTagModel[];
    tagsList$: Observable<TagsModel[]>;
    tagsList: TagsModel[];
    isFromHtmlApp: boolean;
    customTagsModel: CustomTagsModel[];
    anyOperationIsInProgress$: Observable<boolean>;
    tagsOperationInProgress: boolean;
    tagsLoadingInProgress: boolean;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    userStoryInputTags: string[] = [];
    userStory: UserStory;
    isFromCustomApp: boolean;
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
        private cdRef: ChangeDetectorRef,
        private toasterService: ToastrService,
        private masterDataService: MasterDataManagementService) {
    }

    ngOnInit() {
    }

    getTagsByReference() {
        const tagsInputModel = new CustomTagModel();
        tagsInputModel.referenceId = this.referenceId;
        this.masterDataService.getCustomTags(tagsInputModel).subscribe((result: any) => {
            if (result.success === true) {
                this.tags = result.data;
                this.count = 1;
                this.getCustomTags.emit(this.tags);
                this.cdRef.detectChanges();
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
            this.getCustomTagDetails(tags);
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
            this.getCustomTag(customTags);
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
        if (this.referenceId) {
            const customTagsModel = new CustomTagModel();
            customTagsModel.referenceId = this.referenceId;
            customTagsModel.tagsList = this.tags;
            this.masterDataService.upsertCustomTag(customTagsModel).subscribe((result: any) => {
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

    getCustomTagDetails(tags: any) {
        this.tagsOperationInProgress = true;
        this.masterDataService.searchCustomTags(tags).subscribe((response: any) => {
            if (response.success) {
                this.customTagsModel = response.data;
            }
            this.tagsOperationInProgress = false;
        })
    }

    getCustomTag(tags: any) {
        this.tagsLoadingInProgress = true;
        this.masterDataService.getCustomTags(tags).subscribe((response: any) => {
            if (response.success) {
                this.customTagsModel = response.data;
            }
            this.tagsLoadingInProgress = false;
        })
    }
}