import { Component, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { State } from "../../store/reducers/index";
import { Observable, Subject } from "rxjs";
import { Actions, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

import { SkillSearchModel } from "../../models/skill-search-model";
import { SkillDetailsModel } from "../../models/skill-details-model";
import { EmployeeSkillDetailsModel } from "../../models/employee-skill-details-model";

import * as hrManagementModuleReducer from "../../store/reducers/index";

import { LoadSkillTriggered } from "../../store/actions/skill.actions";
import { EmployeeSkillDetailsActionTypes, CreateEmployeeSkillDetailsTriggered } from "../../store/actions/employee-skill-details.actions";
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-hr-component-add-skill-details",
    templateUrl: "add-skill-details.component.html"
})

export class AddSkillDetailsComponent extends CustomAppBaseComponent {
    @ViewChild("formDirective") formDirective: FormGroupDirective;

    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        this.employeeId = data;
    }
    @Input("editSkillDetailsData")
    set editSkillDetailsData(data: EmployeeSkillDetailsModel) {
        this.initializeaddEmployeeSkillsForm();
        if (!data) {
            this.employeeSkillDetails = null;
            this.employeeSkillId = null;
        } else {
            this.employeeSkillDetails = data;
            this.employeeSkillId = data.employeeSkillId;
            this.addSkillsForm.patchValue(data);
        }
    }
    @Input("isPermission")
    set isPermission(data: boolean) {
        this.permission = data;
    }
    @Output() closePopup = new EventEmitter<string>();

    addSkillsForm: FormGroup;

    employeeSkillDetails: EmployeeSkillDetailsModel;

    permission: boolean = false;
    employeeId: string = "";
    employeeSkillId: string = "";

    upsertSkillsDetailsInProgress$: Observable<boolean>;
    skillsList$: Observable<SkillDetailsModel[]>;

    public ngDestroyed$ = new Subject();
    moduleTypeId = 1;

    // tslint:disable-next-line: max-line-length
    constructor(private actionUpdates$: Actions, private store: Store<State>, private translateService: TranslateService) {
        super();
        this.actionUpdates$
            .pipe(
                ofType(EmployeeSkillDetailsActionTypes.CreateEmployeeSkillDetailsCompleted),
                tap(() => {
                    this.initializeaddEmployeeSkillsForm();
                    this.closePopover();
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        // this.canAccess_feature_CanEditOtherEmployeeDetails$.subscribe(result => {
        //     this.canAccess_feature_CanEditOtherEmployeeDetails = result;
        // })
        // this.canAccess_feature_AddOrUpdateEmployeeSkills$.subscribe(result => {
        //     this.canAccess_feature_AddOrUpdateEmployeeSkills = result;
        // })
        // if ((this.canAccess_feature_AddOrUpdateEmployeeSkills && this.permission) || this.canAccess_feature_CanEditOtherEmployeeDetails) {
        // }
        this.getAllSkills();
    }

    getAllSkills() {
        const skillSearchResult = new SkillSearchModel();
        skillSearchResult.isArchived = false;
        this.store.dispatch(new LoadSkillTriggered(skillSearchResult));
        this.skillsList$ = this.store.pipe(select(hrManagementModuleReducer.getSkillAll));
    }

    initializeaddEmployeeSkillsForm() {
        this.addSkillsForm = new FormGroup({
            skillId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            yearsOfExperience: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.max(99)
                ])),
            comments: new FormControl("",
                Validators.compose([
                    Validators.maxLength(800)
                ])
            )
        });
    }

    saveEmployeeSkills() {
        let employeeSkillDetails = new EmployeeSkillDetailsModel();
        employeeSkillDetails = this.addSkillsForm.value;
        employeeSkillDetails.employeeId = this.employeeId;
        employeeSkillDetails.isArchived = false;
        employeeSkillDetails.dateFrom = new Date();
        if (this.employeeSkillId) {
            employeeSkillDetails.employeeSkillId = this.employeeSkillDetails.employeeSkillId;
            employeeSkillDetails.timeStamp = this.employeeSkillDetails.timeStamp;
        }
        this.store.dispatch(new CreateEmployeeSkillDetailsTriggered(employeeSkillDetails));
        this.upsertSkillsDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmployeeSkillDetailLoading))
    }

    closePopover() {
        this.formDirective.resetForm();
        if (this.employeeSkillId) {
            this.addSkillsForm.patchValue(this.employeeSkillDetails);
        } else {
            this.initializeaddEmployeeSkillsForm();
        }
        this.closePopup.emit("");
    }
}
