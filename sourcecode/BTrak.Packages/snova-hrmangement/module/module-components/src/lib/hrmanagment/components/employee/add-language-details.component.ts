import { Component, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Actions, ofType } from "@ngrx/effects";
import { State } from "../../store/reducers/index";
import { Store, select } from "@ngrx/store";
import { tap, takeUntil } from "rxjs/operators";
import { Observable, Subject } from "rxjs";

import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';


import { EmployeeLanguageDetailsModel } from "../../models/employee-language-details-model";
import { LanguagesSearchModel } from '../../models/languages-search-model';
import { LanguageFluenciesSearchModel } from '../../models/language-fluencies-search-model';
import { CompetenciesSearchModel } from '../../models/competencies-search-model';
import { LanguagesModel } from '../../models/languages-model';
import { LanguageFluenciesModel } from '../../models/language-fluencies-model';
import { CompetenciesModel } from '../../models/competencies-model';

import * as hrManagementModuleReducer from "../../store/reducers/index";

import { LoadLanguagesTriggered } from "../../store/actions/languages.actions";
import { LoadCompetencyTriggered } from "../../store/actions/competency.actions";
import { LoadLanguageFluencyTriggered } from "../../store/actions/language-fluencies.actions";
import { CreateEmployeeLanguageDetailsTriggered, EmployeeLanguageDetailsActionTypes } from "../../store/actions/employee-language-details.actions";
import '../../../globaldependencies/helpers/fontawesome-icons';
import { MatOption } from '@angular/material/core';
import * as _ from 'underscore';

@Component({
    selector: "app-hr-component-add-language-details",
    templateUrl: "add-language-details.component.html"
})

export class AddLanguageDetailsComponent extends CustomAppBaseComponent {
    @ViewChild("formDirective") formDirective: FormGroupDirective;
    @ViewChild("allSelected") private allSelected: MatOption;

    @Input("selectedEmployeeId")
    set selectedEmployeeId(data: string) {
        this.employeeId = data;
    }
    @Input("editLanguageDetailsData")
    set editLanguageDetailsData(data: EmployeeLanguageDetailsModel) {
        this.initializeEmployeeLanguageDetailsForm();
        if (!data) {
            this.employeeLanguageDetails = null;
            this.employeeLanguageDetailsId = null;
        } else {
            this.employeeLanguageDetails = data;
            this.employeeLanguageDetails.fluencyIds = [];
            let fluencyName = [];
            this.employeeLanguageDetailsId = data.employeeLanguageId;
            if (this.employeeLanguageDetails.canSpeak && this.employeeLanguageDetails.canRead && this.employeeLanguageDetails.canWrite) {
                this.employeeLanguageDetails.fluencyIds.push(0);
            }
            if (this.employeeLanguageDetails.canSpeak) {
                this.employeeLanguageDetails.fluencyIds.push('canSpeak');
                fluencyName.push('Speaking');
            }
            if (this.employeeLanguageDetails.canRead) {
                this.employeeLanguageDetails.fluencyIds.push('canRead');
                fluencyName.push('Reading');
            }
            if (this.employeeLanguageDetails.canWrite) {
                this.employeeLanguageDetails.fluencyIds.push('canWrite');
                fluencyName.push('Writing');
            }
            this.selectedfluencies = fluencyName.toString();
            this.patchForm(this.employeeLanguageDetails);
        }
    }
    @Input("isPermission")
    set isPermission(data: boolean) {
        this.permission = data;
    }
    @Output() closePopup = new EventEmitter<string>();

    employeeLanguageDetailsForm: FormGroup;

    employeeLanguageDetails: EmployeeLanguageDetailsModel;

    permission: boolean = false;
    maxDate = new Date();
    employeeId: string = "";
    employeeLanguageDetailsId: string = "";

    languagesList$: Observable<LanguagesModel[]>;
    languageFluencyList$: Observable<LanguageFluenciesModel[]>;
    languageFluencyList: LanguageFluenciesModel[];
    competencyList$: Observable<CompetenciesModel[]>;
    upsertEmployeeLanguageDetailsInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();
    moduleTypeId = 1;

    selectedfluencies: string;

    languageFluency: any = [
        { languageFluencyId: 'canSpeak', languageFluencyName: 'Speaking' },
        { languageFluencyId: 'canWrite', languageFluencyName: 'Writing' },
        { languageFluencyId: 'canRead', languageFluencyName: 'Reading' }
    ];

    constructor(private actionUpdates$: Actions, private store: Store<State>) {
        super();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(EmployeeLanguageDetailsActionTypes.CreateEmployeeLanguageDetailsCompleted),
                tap(() => {
                    this.initializeEmployeeLanguageDetailsForm();
                    this.closePopover();
                })
            )
            .subscribe();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getAllLanguages();
        this.getAllLanguageFluencies();
        this.getAllCompetencies();
    }

    getAllLanguages() {
        const languageSearchResult = new LanguagesSearchModel();
        languageSearchResult.isArchived = false;
        this.store.dispatch(new LoadLanguagesTriggered(languageSearchResult));
        this.languagesList$ = this.store.pipe(select(hrManagementModuleReducer.getLanguagesAll));
    }

    getAllLanguageFluencies() {
        const languageFluencySearchResult = new LanguageFluenciesSearchModel();
        languageFluencySearchResult.isArchived = false;
        this.store.dispatch(new LoadLanguageFluencyTriggered(languageFluencySearchResult));
        this.languageFluencyList$ = this.store.pipe(select(hrManagementModuleReducer.getLanguageFluenciesAll));
    }

    getAllCompetencies() {
        const competencySearchResult = new CompetenciesSearchModel();
        competencySearchResult.isArchived = false;
        this.store.dispatch(new LoadCompetencyTriggered(competencySearchResult));
        this.competencyList$ = this.store.pipe(select(hrManagementModuleReducer.getCompetenciesAll));
    }

    initializeEmployeeLanguageDetailsForm() {
        this.employeeLanguageDetailsForm = new FormGroup({
            languageId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            fluencyIds: new FormControl([],
                Validators.compose([
                    Validators.required
                ])
            ),
            competencyId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            comments: new FormControl("",
                Validators.compose([
                    Validators.maxLength(800)
                ])
            )
        });
    }

    patchForm(languageDetails: EmployeeLanguageDetailsModel) {
        this.employeeLanguageDetailsForm = new FormGroup({
            languageId: new FormControl(languageDetails.languageId,
                Validators.compose([
                    Validators.required
                ])
            ),
            fluencyIds: new FormControl(languageDetails.fluencyIds,
                Validators.compose([
                    Validators.required
                ])
            ),
            competencyId: new FormControl(languageDetails.competencyId,
                Validators.compose([
                    Validators.required
                ])
            ),
            comments: new FormControl(languageDetails.comments,
                Validators.compose([
                    Validators.maxLength(800)
                ])
            )
        });
    }

    saveEmployeeLanguageDetails() {
        let fluencies;
        if (Array.isArray(this.employeeLanguageDetailsForm.value.fluencyIds))
            fluencies = this.employeeLanguageDetailsForm.value.fluencyIds
        else
            fluencies = this.employeeLanguageDetailsForm.value.fluencyIds.split(',');

        const index2 = fluencies.indexOf(0);
        if (index2 > -1) {
            fluencies.splice(index2, 1)
        }
        let employeeLanguageDetails = new EmployeeLanguageDetailsModel();
        employeeLanguageDetails = this.employeeLanguageDetailsForm.value;
        fluencies.forEach(element => {
            if (element == 'canSpeak') {
                employeeLanguageDetails.canSpeak = true;
            }
            if (element == 'canWrite') {
                employeeLanguageDetails.canWrite = true;
            }
            if (element == 'canRead') {
                employeeLanguageDetails.canRead = true;
            }
        });
        employeeLanguageDetails.employeeId = this.employeeId;
        employeeLanguageDetails.isArchived = false;
        if (this.employeeLanguageDetailsId) {
            employeeLanguageDetails.employeeLanguageId = this.employeeLanguageDetails.employeeLanguageId;
            employeeLanguageDetails.timeStamp = this.employeeLanguageDetails.timeStamp;
        }
        this.store.dispatch(new CreateEmployeeLanguageDetailsTriggered(employeeLanguageDetails));
        this.upsertEmployeeLanguageDetailsInProgress$ = this.store.pipe(select(hrManagementModuleReducer.createEmployeeLanguageDetailLoading));
    }

    closePopover() {
        this.formDirective.resetForm();
        if (this.employeeLanguageDetailsId) {
            this.employeeLanguageDetailsForm.patchValue(this.employeeLanguageDetails);
        } else {
            this.initializeEmployeeLanguageDetailsForm();
        }
        this.closePopup.emit("");
    }

    ngOnDestroy() {
        // destroy all the subscriptions at once
        this.ngDestroyed$.next();
    }

    compareSelectedFluencyFn(fluencies: any, selectedfluencies: any) {
        if (fluencies == selectedfluencies) {
            return true;
        } else {
            return false;
        }
    }

    toggleAllFluenciedSelected() {
        if (this.allSelected.selected) {
            this.employeeLanguageDetailsForm.controls['fluencyIds'].patchValue([
                0, ...this.languageFluency.map(item => item.languageFluencyId)
            ]);
        } else {
            this.employeeLanguageDetailsForm.controls['fluencyIds'].patchValue([]);
        }
        this.getSelectedRoles()
    }

    getSelectedRoles() {

        let fluencyValues;
        if (Array.isArray(this.employeeLanguageDetailsForm.value.fluencyIds))
            fluencyValues = this.employeeLanguageDetailsForm.value.fluencyIds;
        else
            fluencyValues = this.employeeLanguageDetailsForm.value.fluencyIds.split(',');

        const component = fluencyValues;
        const index = component.indexOf(0);
        if (index > -1) {
            component.splice(index, 1);
        }
        const fluencyList = this.languageFluency;
        const selectedFluencyList = _.filter(fluencyList, function (fluency) {
            return component.toString().includes(fluency.languageFluencyId);
        })
        const fluencyNames = selectedFluencyList.map((x) => x.languageFluencyName);
        this.selectedfluencies = fluencyNames.toString();
    }

    toggleFluencyPerOne(event) {
        if (this.allSelected.selected) {
            this.allSelected.deselect();
            return false;
        }
        if (
            this.employeeLanguageDetailsForm.controls['fluencyIds'].value.length ===
            this.languageFluency.length
        ) {
            this.allSelected.select();
        }
    }
}
