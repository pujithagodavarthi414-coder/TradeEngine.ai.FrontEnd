import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatChipInputEvent } from "@angular/material/chips";
import { ToastrService } from "ngx-toastr";
import { Observable, Subject } from "rxjs";
import { CustomTagModel } from '../../models/custom-tags.model';
import { CustomTagsModel } from '../../models/custom-tags-model';
import { TagsModel } from '../../models/tags.model';
import { CustomTagService } from '../../services/customTag.service'
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: "custom-app-component-tags",
    templateUrl: "tags.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomAppTagsComponent implements OnInit {

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

    @Input("isFromAllApps")
    set _isFromAllApps(data: boolean) {
        this.isFromAllApps = data;
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
    customTagsModel$: Observable<CustomTagsModel[]>;
    tagsModel: CustomTagModel[];
    tagsList$: Observable<TagsModel[]>;
    preTagsList: TagsModel[];
    tagsList: TagsModel[];
    isFromHtmlApp: boolean;
    customTagsModel: CustomTagsModel[];
    tagsLoadingInProgress: boolean;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    userStoryInputTags: string[] = [];
    isFromAllApps: boolean;
    isFromCustomApp: boolean;
    userStoryId: string;
    parentUserStoryId: string;
    referenceId: string;
    validationMessage: string;
    timeStamp: any;
    goalId: string;
    isSprintUserStories: boolean;
    tags: CustomTagModel[] = [];
    tagIds: string[] = [];
    addOnBlur = true;
    removable = true;
    visible: boolean = true;
    selectable: boolean = true;
    tag: string;
    isApiCall: boolean;
    public ngDestroyed$ = new Subject();
    count = 0;
    saveTagsinProgress: boolean;

    constructor(
        private cdRef: ChangeDetectorRef,
        private customTagsService: CustomTagService,
        private toasterService: ToastrService,
        private translateService: TranslateService
    ) {

    }
    ngOnInit() {
        //  this.loadCustomTags('');
    }

    translatetags(tags) 
    {
        if (tags == null)
        {
            return null;   
        }
        tags = tags.trim();
        var splitted = tags.split(",");
        let finalstring ='';
        for ( var i = 0 ; i < splitted.length ; i++)
        {
            if ( i != 0)
            {
                finalstring += ", ";
            }
            var name = this.translateService.instant("WIDGETTAGS." + splitted[i]);
            if (name.indexOf("WIDGETTAGS.") != -1) {
                finalstring += splitted[i];
            }
            else {
                finalstring += name;
            }
        }
        return finalstring;   
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
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toasterService.error(this.validationMessage);
            }

        });
    }


    disabledButton(enteredText, tags) {
        if ((enteredText === "Enter" || enteredText === "Comma")) {
            this.count = 1;
        } else if (enteredText != "ArrowDown" && enteredText != "ArrowUp" && enteredText != "ArrowLeft" && enteredText != "ArrowRight") {

            this.customTagsService.searchCustomTags(tags).subscribe((result: any) => {
                if (result.success) {
                    this.tagsList = result.data;
                    this.cdRef.detectChanges();
                }
            });
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
        } else if (enteredText != "ArrowDown" && enteredText != "ArrowUp" && enteredText != "ArrowLeft" && enteredText != "ArrowRight") {
            this.loadCustomTags(tags);
            if (tags && (enteredText !== "Enter" || enteredText !== "Comma")) {
                this.count = 0;
            } else {
                this.count = 1;
            }
        }

    }

    loadCustomTags(tags) {
        this.tagsLoadingInProgress = true;
        var customTags = new CustomTagModel();
        customTags.searchText = tags;
        this.customTagsService
            .getCustomTags(customTags).subscribe((result: any) => {
                if (result.success) {
                    this.preTagsList = result.data;
                    this.cdRef.detectChanges();
                }
                this.tagsLoadingInProgress = false;
            });
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
        if (this.referenceId) {
            this.saveTagsinProgress = true;
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
                this.saveTagsinProgress = false;
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

        let tagsList = this.preTagsList;
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

