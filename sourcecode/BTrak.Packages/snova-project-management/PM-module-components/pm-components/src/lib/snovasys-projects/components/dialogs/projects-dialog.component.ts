// tslint:disable-next-line: ordered-imports
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { EditProjectTriggered } from "../../store/actions/project.actions";
import { State } from "../../store/reducers/index";

@Component({
    selector: "projects-dialog",
    templateUrl: "./projects-dialog.component.html"
})
export class ProjectsDialogComponent {
    projectId: string;
    constructor(public projectDialog: MatDialogRef<ProjectsDialogComponent>,
                @Inject(MAT_DIALOG_DATA)
                public data: any,
                private store: Store<State>) {
    }

    onNoClick(): void {
        this.projectDialog.close();
        if (this.data.projectId) {
            this.store.dispatch(new EditProjectTriggered(this.data.projectId));
        }
    }
}
