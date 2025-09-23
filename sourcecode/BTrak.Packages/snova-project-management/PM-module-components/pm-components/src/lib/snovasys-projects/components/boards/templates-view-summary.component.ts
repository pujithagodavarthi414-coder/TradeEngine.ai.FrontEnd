import { ChangeDetectionStrategy, Component, Input, OnInit} from "@angular/core";
import { UserStory } from "../../models/userStory";
import { WorkflowStatus } from "../../models/workflowStatus";

@Component({
    selector: "app-pm-component-template-view-summary",
    templateUrl: "templates-view-summary.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TemplatesViewSummaryComponent implements OnInit {
    @Input("userStory")
    set _userStory(data: UserStory) {
        this.userStory = data;
    }
    @Input("isSelected")
    set _isSelected(data: boolean) {
        this.isSelected = data;
    }

    userStory: UserStory;
    workflow: WorkflowStatus;
    maxOrderId: number;
    isSelected: boolean;
    ngOnInit() {
    }

    constructor() {

    }
}
