import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { TemplateModel } from "../../models/templates-model";

@Component({
    selector: "app-pm-component-template-board",
    templateUrl: "template-board.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateBoardComponent implements OnInit {
    @Input("template")
    set _template(data: TemplateModel) {
        this.template = data;
    }
    template: TemplateModel;
    constructor() {
    }
    ngOnInit() {
    }
}
