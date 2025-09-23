import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, HostListener } from "@angular/core";
import { TemplateModel } from "../../models/templates-model";
import { UserStorySearchCriteriaInputModel } from "../../models/userStorySearchInput";
import { UserStory } from "../../models/userStory";


@Component({
    selector: "app-pm-component-template-browse-board",
    templateUrl: "templates-browse-board.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateBrowseBoardComponent implements OnInit {
    @Input('userStorySearchCriteria')
    set _userStorySearchCriteria(data: UserStorySearchCriteriaInputModel) {
        this.userStorySearchCriteria = data;
    }
    @Input('template')
    set _template(data: TemplateModel) {
        this.template = data;
    }
    @Output() selectUserStory = new EventEmitter<UserStory>();
    userStorySearchCriteria: UserStorySearchCriteriaInputModel;
    template: TemplateModel;

    constructor(){
        
    }
    ngOnInit() {

    }

    selectedUserStoryEvent(userStory) {
        this.selectUserStory.emit(userStory);
    }

}