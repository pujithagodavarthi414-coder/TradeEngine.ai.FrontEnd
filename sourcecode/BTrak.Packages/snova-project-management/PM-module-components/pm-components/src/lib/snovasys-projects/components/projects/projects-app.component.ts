import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, TemplateRef } from "@angular/core";

@Component({
    selector: "app-active-projects",
    templateUrl: "projects-app.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProjectsAppComponent implements OnInit {
    @Output() closePopUp = new EventEmitter<any>();
    constructor() {

    }
    ngOnInit() {

    }

    emitCloseEvent(event) {
      this.closePopUp.emit(true);
    }
}