// tslint:disable-next-line: ordered-imports
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from "@angular/core";
// tslint:disable-next-line: ordered-imports
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
// tslint:disable-next-line: ordered-imports
import { Actions, ofType } from "@ngrx/effects";
// tslint:disable-next-line: ordered-imports
import { select, Store } from "@ngrx/store";
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";
import * as _ from "underscore";

// tslint:disable-next-line: ordered-imports
import { ProjectMember } from "../../models/ProjectMember";
import { LoadMemberProjectsTriggered, ProjectMembersActionTypes } from "../../store/actions/project-members.actions";
import * as projectReducer from "../../store/reducers/index";
import * as projectModuleReducer from "../../store/reducers/index";
import { State } from "../../store/reducers/index";
import { TemplateActionTypes, UpsertTemplatesTriggered } from "../../store/actions/templates.action";
import { TemplateModel } from "../../models/templates-model";
import { AppFeatureBaseComponent } from '../../../globaldependencies/components/featurecomponentbase';
import { SoftLabelConfigurationModel } from '../../../globaldependencies/models/softlabels-models';
@Component({
    selector: "app-pm-component-project-template",
    templateUrl: "create-template.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateCreateComponent extends AppFeatureBaseComponent implements OnInit {

    projectId
    @Input("projectId")
    set setProjectId(projectId: string) {
        this.projectId = projectId;
    }

    clearCreateForm;
    @Input("clearCreateForm")
    set setclearCreateForm(clearCreateForm: boolean) {
        this.clearCreateForm = clearCreateForm;
    }

    @Input("template")
    set settemplate(template: TemplateModel) {
        this.template = template;
        if (this.template) {
            this.editGoalForm();
        } else {
            this.clearGoalForm();
        }
    }

    @Output() closePopup = new EventEmitter<string>();
    @Output() submitClosePopup = new EventEmitter<string>();
    @ViewChild("formDirective") formGroupDirective: FormGroupDirective;
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    @ViewChildren(MatMenuTrigger) triggers: QueryList<MatMenuTrigger>;
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    projectMembers$: Observable<ProjectMember[]>;
    addOperationInProgress$: Observable<boolean>;
    validationMessages$: Observable<string[]>;
    projectMembers: ProjectMember[];
    templateModel: TemplateModel;
    template: TemplateModel;
    buttonTemplateText: string; // TODO: Move to constants
    buttonGoalIcon: string;
    titleGoalhead: string;
    templateForm: FormGroup;
    selectedMember: string;
    timeStamp: any;
    templateId: string;
    autoCompleteOff: any;
    public ngDestroyed$ = new Subject();
    minDate: Date = new Date();
    buttonTemplateIcon: string;
    isEditIcon: boolean;
    constructor(
        private store: Store<State>,
        private actionUpdates$: Actions,
        private translateService: TranslateService,
        private cdRef: ChangeDetectorRef
    ) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(TemplateActionTypes.UpsertTemplatesCompleted),
                tap(() => {
                    if(this.isEditIcon) {
                        this.closePopup.emit("new");
                    }
                   else {
                    this.closePopup.emit("");
                   }
                    this.formGroupDirective.resetForm();
                })

            )
            .subscribe();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(ProjectMembersActionTypes.LoadProjectMembersCompleted),
                tap(() => {
                    this.projectMembers$ = this.store.pipe(
                        select(projectReducer.getProjectMembersAll)
                    );
                    this.projectMembers$.subscribe((s) => (this.projectMembers = s));
                })
            )
            .subscribe();
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.addOperationInProgress$ = this.store.pipe(
            select(projectModuleReducer.upsertTemplatesLoading)
        );
    }


    clearGoalForm() {
        this.isEditIcon = false;
        this.buttonTemplateText = this.translateService.instant("ADD");
        this.buttonGoalIcon = "plus";
        this.titleGoalhead = this.translateService.instant('PROJECTS.ADDTEMPLATE');
        this.selectedMember = null;
        this.templateForm = new FormGroup({
            templateName: new FormControl(
                "",
                Validators.compose([Validators.required, Validators.maxLength(250)]) // TODO: need to come from constants.
            ),
        });
    }

    editGoalForm() {
        this.titleGoalhead = this.translateService.instant('GOALS.EDITTEMPLATE');
        this.timeStamp = this.template.timeStamp;
        this.templateId = this.template.templateId;
        this.buttonTemplateText = this.translateService.instant("TRANSITIONDEADLINE.UPDATE");
        this.buttonGoalIcon = "edit";
        this.isEditIcon = true;
        this.templateForm = new FormGroup({
            templateName: new FormControl(
                this.template.templateName,
                Validators.compose([Validators.required, Validators.maxLength(250)]) // TODO: need to come from constants.
            ),
        });
        this.cdRef.detectChanges();
    }

    closedialog() {
        this.formGroupDirective.resetForm();
        this.closePopup.emit("");
    }


    getAssigneeValue(selectedEvent) {
        const projectMembers = this.projectMembers;
        // tslint:disable-next-line: only-arrow-functions
        const filteredList = _.find(projectMembers, function (member) {
            return member.projectMember.id === selectedEvent;
        })
        if (filteredList) {
            this.selectedMember = filteredList.projectMember.name;
            this.cdRef.detectChanges();
        }
    }

    saveTemplate() {
        // TODO: Name is pascal case. Needs to be camel case.
        this.templateModel = this.templateForm.value;
        this.templateModel.projectId = this.projectId;
        this.templateModel.timeStamp = this.timeStamp;
        this.templateModel.templateId = this.templateId;
        this.store.dispatch(new UpsertTemplatesTriggered(this.templateModel));
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }
}
