import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable, pipe, of } from 'rxjs';
import { Action, select, Store } from '@ngrx/store';
import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from '../../dependencies/constants/constant-variables';
import { switchMap, map, catchError } from 'rxjs/operators';

// import { SnackbarOpen } from '../../../../views/projects/store/actions/snackbar.actions';
import { ShowExceptionMessages } from '../../dependencies/project-store/actions/notification-validator.action';

import * as auditModuleReducer from "../reducers";

import { SoftLabelPipe } from '../../dependencies/pipes/softlabels.pipes';
import { SoftLabelConfigurationModel } from '../../dependencies/models/softLabels-model';

import { State } from '../../dependencies/main-store/reducers/index';
import { AuditCategory } from '../../models/audit-category.model';
import { AuditService } from '../../services/audits.service';

import { AuditCategoryActionTypes, LoadAuditCategoryTriggered, LoadAuditCategoryCompleted, AuditCategoryFailed, AuditCategoryException, LoadAuditCategoryByIdTriggered, LoadAuditCategoryByIdCompleted, RefreshAuditCategoryList, AuditCategoryEditCompletedWithInPlaceUpdate, LoadAuditCategoryListTriggered, LoadAuditCategoryListCompleted, LoadAuditCategoryDelete, LoadFirstAuditCategory, LoadCategoriesTriggered, LoadCategoriesCompleted, LoadAuditCategoriesForConductsTriggered, LoadAuditCategoriesForConductsCompleted, LoadAuditCategoriesForConductsEditTriggered, LoadAuditCategoriesForConductsEditCompleted, LoadAuditVersionCategoryListTriggered, LoadAuditVersionCategoryListCompleted, LoadVersionCategoriesTriggered, LoadVersionCategoriesCompleted } from '../actions/audit-categories.actions';
import { LoadAuditRelatedCountsTriggered, LoadAuditByIdTriggered } from '../actions/audits.actions';
import { AuditCompliance } from '../../models/audit-compliance.model';
import * as auditManagementReducers from "../reducers";

@Injectable()
export class AuditCategoryEffects {
    softLabels$: Observable<SoftLabelConfigurationModel[]>;
    softLabels: SoftLabelConfigurationModel[];
    auditCategoryList$: Observable<AuditCategory[]>;

    searchAuditCategory: AuditCategory;
    latestAuditData: AuditCategory[];
    auditCategoryList: AuditCategory[];

    exceptionMessage: any;
    auditCategoryId: string;
    deleteAuditCategoryId: string;
    auditId: string;
    deletedAuditCategoryId: string;
    newAuditCategory: boolean;
    archiveAuditCategory: boolean = false;;
    snackBarMessage: string;
    validationMessages: any[];

    constructor(private actions$: Actions, private softLabePipe: SoftLabelPipe, private auditService: AuditService, private translateService: TranslateService, private store: Store<State>) {
        this.softLabels$ = this.store.pipe(select(auditManagementReducers.getSoftLabelsAll));
        this.softLabels$.subscribe((x) => this.softLabels = x);
    }

    @Effect()
    loadAuditCategories$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditCategoryTriggered>(AuditCategoryActionTypes.LoadAuditCategoryTriggered),
        switchMap(getAction => {
            return this.auditService.upsertAuditCategory(getAction.auditCategory).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        this.auditCategoryId = result.data;
                        this.auditId = getAction.auditCategory.auditId;
                        this.auditCategoryList$ = this.store.pipe(select(auditModuleReducer.getAuditCategoryList));
                        this.auditCategoryList$.subscribe(result => {
                            this.auditCategoryList = result;
                        });
                        if (getAction.auditCategory.auditCategoryId && getAction.auditCategory.isArchived == true) {
                            this.newAuditCategory = false;
                            this.archiveAuditCategory = true;
                            this.deleteAuditCategoryId = this.auditCategoryId;
                            this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditArchived);
                            return new LoadAuditCategoryDelete(this.auditCategoryId);
                        }
                        else if (getAction.auditCategory.auditCategoryId) {
                            this.newAuditCategory = false;
                            this.archiveAuditCategory = false;
                            this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditEdited);
                            let categoryModel = new AuditCategory();
                            categoryModel.auditCategoryId = this.auditCategoryId;
                            categoryModel.auditId = this.auditId;
                            categoryModel.isArchived = false;
                            return new LoadAuditCategoryByIdTriggered(categoryModel);
                        }
                        else {
                            this.newAuditCategory = true;
                            this.archiveAuditCategory = false;
                            this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditCreated);
                            if (this.auditCategoryList == null || this.auditCategoryList.length == 0) {
                                return new LoadFirstAuditCategory();
                            }
                            else {
                                return new LoadAuditCategoryCompleted(this.auditCategoryId);
                            }
                        }
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditCategoryFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditCategoryException(err));
                })
            );
        })
    );

    // @Effect()
    // loadAuditCategoryCompleted$: Observable<Action> = this.actions$.pipe(
    //     ofType<LoadAuditCategoryCompleted>(AuditCategoryActionTypes.LoadAuditCategoryCompleted),
    //     pipe(
    //         map(
    //             () =>
    //                 new SnackbarOpen({
    //                     message: this.snackBarMessage,
    //                     action: this.translateService.instant(ConstantVariables.success)
    //                 })
    //         )
    //     )
    // );

    @Effect()
    loadAuditCategoryCompletedSuccessfully$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditCategoryCompleted>(AuditCategoryActionTypes.LoadAuditCategoryCompleted),
        pipe(
            map(
                () => {
                    if (this.archiveAuditCategory == false) {
                        let searchAuditCategory = new AuditCategory();
                        searchAuditCategory.auditCategoryId = this.auditCategoryId;
                        searchAuditCategory.isArchived = false;
                        return new LoadAuditCategoryByIdTriggered(searchAuditCategory);
                    }
                    else {
                        return new LoadAuditCategoryDelete(this.deleteAuditCategoryId);
                    }
                })
        )
    );

    @Effect()
    loadAuditCategoryById$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditCategoryByIdTriggered>(AuditCategoryActionTypes.LoadAuditCategoryByIdTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditCategories(getAction.auditCategory).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        let data = result.data;
                        this.latestAuditData = data[0];
                        return new LoadAuditCategoryByIdCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditCategoryFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditCategoryException(err));
                })
            );
        })
    );

    @Effect()
    loadAuditCategoriesForConducts$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditCategoriesForConductsTriggered>(AuditCategoryActionTypes.LoadAuditCategoriesForConductsTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditCategories(getAction.auditCategory).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        return new LoadAuditCategoriesForConductsCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditCategoryFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditCategoryException(err));
                })
            );
        })
    );

    @Effect()
    loadAuditCategoriesForConductEdit$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditCategoriesForConductsEditTriggered>(AuditCategoryActionTypes.LoadAuditCategoriesForConductsEditTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditCategoriesForConducts(getAction.auditCategory).pipe(
                map((result: any) => {
                    if (result.success == true) {
                        return new LoadAuditCategoriesForConductsEditCompleted(result.data);
                    }
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditCategoryFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditCategoryException(err));
                })
            );
        })
    );

    @Effect()
    loadAuditCategoryByIdCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditCategoryByIdCompleted>(AuditCategoryActionTypes.LoadAuditCategoryByIdCompleted),
        pipe(
            map(() => {
                if (this.newAuditCategory) {
                    this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditCreated);
                    return new RefreshAuditCategoryList();
                }
                else {
                    this.snackBarMessage = this.translateService.instant(ConstantVariables.SuccessMessageForAuditEdited);
                    return new AuditCategoryEditCompletedWithInPlaceUpdate();
                }
            })
        )
    );

    @Effect()
    loadAuditCategoriesForFirstCompleted$: Observable<Action> = this.actions$.pipe(
        ofType<LoadFirstAuditCategory>(AuditCategoryActionTypes.LoadFirstAuditCategory),
        pipe(
            map(() => {
                let categoryModel = new AuditCategory();
                categoryModel.auditId = this.auditId;
                categoryModel.isArchived = false;
                return new LoadAuditCategoryListTriggered(categoryModel);
            })
        )
    );

    @Effect()
    loadAuditCategoryByIdCompletedFully$: Observable<Action> = this.actions$.pipe(
        ofType<RefreshAuditCategoryList>(AuditCategoryActionTypes.RefreshAuditCategoryList),
        pipe(
            map(() => {
                let data = this.insertDataOfTheCategory(this.latestAuditData);
                return new LoadAuditCategoryListCompleted(data);
            })
        )
    );

    @Effect()
    loadAuditCategoryByIdCompletedFull$: Observable<Action> = this.actions$.pipe(
        ofType<AuditCategoryEditCompletedWithInPlaceUpdate>(AuditCategoryActionTypes.AuditCategoryEditCompletedWithInPlaceUpdate),
        pipe(
            map(() => {
                let data = this.editDataOfTheCategory(this.latestAuditData);
                return new LoadAuditCategoryListCompleted(data);
            })
        )
    );

    @Effect()
    loadAuditCategoryByIdCompletFull$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditCategoryDelete>(AuditCategoryActionTypes.LoadAuditCategoryDelete),
        pipe(
            map(() => {
                let data = this.deleteDataOfTheCategory(this.deleteAuditCategoryId);
                return new LoadAuditCategoryListCompleted(data);
            })
        )
    );

    @Effect()
    loadAuditsAfterDeleteFirst$: Observable<Action> = this.actions$.pipe(
        ofType<RefreshAuditCategoryList>(AuditCategoryActionTypes.RefreshAuditCategoryList),
        pipe(
            map(() => {
                let searchAudit = new AuditCompliance();
                searchAudit.auditId = this.auditId;
                searchAudit.isArchived = false;
                searchAudit.canRefreshAudit = true;
                return new LoadAuditByIdTriggered(searchAudit);
            })
        )
    );

    @Effect()
    loadAuditsAfterDeleteRandom$: Observable<Action> = this.actions$.pipe(
        ofType<LoadFirstAuditCategory>(AuditCategoryActionTypes.LoadFirstAuditCategory),
        pipe(
            map(() => {
                let searchAudit = new AuditCompliance();
                searchAudit.auditId = this.auditId;
                searchAudit.isArchived = false;
                searchAudit.canRefreshAudit = true;
                return new LoadAuditByIdTriggered(searchAudit);
            })
        )
    );

    @Effect()
    loadAuditsAfterDelete$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditCategoryDelete>(AuditCategoryActionTypes.LoadAuditCategoryDelete),
        pipe(
            map(() => {
                let searchAudit = new AuditCompliance();
                searchAudit.auditId = this.auditId;
                searchAudit.isArchived = false;
                searchAudit.canRefreshAudit = true;
                return new LoadAuditByIdTriggered(searchAudit);
            })
        )
    );

    @Effect()
    loadAuditCategoryList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditCategoryListTriggered>(AuditCategoryActionTypes.LoadAuditCategoryListTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditCategories(getAction.auditCategory).pipe(
                map((result: any) => {
                    if (result.success == true)
                        return new LoadAuditCategoryListCompleted(result.data);
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditCategoryFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditCategoryException(err));
                })
            );
        })
    );

    @Effect()
    loadAuditVersionCategoryList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadAuditVersionCategoryListTriggered>(AuditCategoryActionTypes.LoadAuditVersionCategoryListTriggered),
        switchMap(getAction => {
            return this.auditService.searchAuditCategories(getAction.auditCategory).pipe(
                map((result: any) => {
                    if (result.success == true)
                        return new LoadAuditVersionCategoryListCompleted(result.data);
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditCategoryFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditCategoryException(err));
                })
            );
        })
    );

    @Effect()
    loadCategoryList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadCategoriesTriggered>(AuditCategoryActionTypes.LoadCategoriesTriggered),
        switchMap(getAction => {
            return this.auditService.searchCategories(getAction.auditId).pipe(
                map((result: any) => {
                    if (result.success == true)
                        return new LoadCategoriesCompleted(result.data);
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditCategoryFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditCategoryException(err));
                })
            );
        })
    );

    @Effect()
    loadVersionCategoryList$: Observable<Action> = this.actions$.pipe(
        ofType<LoadVersionCategoriesTriggered>(AuditCategoryActionTypes.LoadVersionCategoriesTriggered),
        switchMap(getAction => {
            return this.auditService.searchVersionCategories(getAction.auditId).pipe(
                map((result: any) => {
                    if (result.success == true)
                        return new LoadVersionCategoriesCompleted(result.data);
                    else {
                        this.validationMessages = result.apiResponseMessages
                        return new AuditCategoryFailed(result.apiResponseMessages);
                    }
                }),
                catchError(err => {
                    this.exceptionMessage = err;
                    return of(new AuditCategoryException(err));
                })
            );
        })
    );

    @Effect()
    showValidationMessagesForAuditCategory$: Observable<Action> = this.actions$.pipe(
        ofType<AuditCategoryFailed>(AuditCategoryActionTypes.AuditCategoryFailed),
        pipe(
            map(
                () => {
                    for (var i = 0; i < this.validationMessages.length; i++) {
                        return new ShowExceptionMessages({
                            message: this.validationMessages[i].message
                        })
                    }
                }
            )
        )
    );

    @Effect()
    auditCategoryExceptionHandled$: Observable<Action> = this.actions$.pipe(
        ofType<AuditCategoryException>(AuditCategoryActionTypes.AuditCategoryException),
        pipe(
            map(
                () =>
                    new ShowExceptionMessages({
                        message: this.exceptionMessage.message
                    })
            )
        )
    );

    insertDataOfTheCategory(categoryData) {
        if (this.auditCategoryList == null || this.auditCategoryList.length == 0) {
            let categoriesData = [];
            categoriesData.push(categoryData);
            return this.auditCategoryList;
        }
        else if (categoryData.parentAuditCategoryId == null) {
            let categoriesData = [];
            for (let i = 0; i < this.auditCategoryList.length; i++) {
                categoriesData.push(this.auditCategoryList[i]);
            }
            categoriesData.push(categoryData);
            return categoriesData;
        }
        else {
            for (let i = 0; i < this.auditCategoryList.length; i++) {
                if (this.auditCategoryList[i].auditCategoryId == categoryData.parentAuditCategoryId) {
                    let categoriesData = [];
                    for (let j = 0; j < this.auditCategoryList.length; j++) {
                        categoriesData.push(Object.assign({}, this.auditCategoryList[j]));
                    }
                    let subCategoriesList = [];
                    if (this.auditCategoryList[i].subAuditCategories == null || this.auditCategoryList[i].subAuditCategories.length == 0) {
                        subCategoriesList.push(Object.assign({}, categoryData));
                        categoriesData[i].subAuditCategories = subCategoriesList;
                    }
                    else {
                        for (let j = 0; j < this.auditCategoryList[i].subAuditCategories.length; j++) {
                            subCategoriesList.push(Object.assign({}, this.auditCategoryList[i].subAuditCategories[j]));
                        }
                        subCategoriesList.push(Object.assign({}, categoryData));
                        categoriesData[i].subAuditCategories = subCategoriesList;
                    }
                    return categoriesData;
                }
                else {
                    let changedData = this.recursiveInsertDataOfTheCategory(this.auditCategoryList[i], categoryData);
                    if (changedData != null && changedData != undefined) {
                        let subCategoriesList = [];
                        for (let j = 0; j < this.auditCategoryList.length; j++) {
                            subCategoriesList.push(Object.assign({}, this.auditCategoryList[j]));
                        }
                        subCategoriesList.splice(i, 1, changedData);
                        return subCategoriesList;
                    }
                }
            }
        }
    }

    recursiveInsertDataOfTheCategory(categoryListData, categoryData) {
        if (categoryListData.subAuditCategories && categoryListData.subAuditCategories.length > 0) {
            for (let i = 0; i < categoryListData.subAuditCategories.length; i++) {
                if (categoryListData.subAuditCategories[i].auditCategoryId == categoryData.parentAuditCategoryId) {
                    let finalCategoryData;
                    finalCategoryData = Object.assign({}, categoryListData);
                    let mainCategoryList = [];
                    for (let j = 0; j < categoryListData.subAuditCategories.length; j++) {
                        mainCategoryList.push(Object.assign({}, categoryListData.subAuditCategories[j]));
                    }
                    finalCategoryData.subAuditCategories = mainCategoryList;
                    let tempCategoryData;
                    tempCategoryData = Object.assign({}, categoryListData.subAuditCategories[i]);
                    let subCategoriesList = [];
                    if (categoryListData.subAuditCategories[i].subAuditCategories == null || categoryListData.subAuditCategories[i].subAuditCategories.length == 0) {
                        subCategoriesList.push(Object.assign({}, categoryData));
                        tempCategoryData.subAuditCategories = subCategoriesList;
                        finalCategoryData.subAuditCategories.splice(i, 1, tempCategoryData);
                    }
                    else {
                        for (let j = 0; j < categoryListData.subAuditCategories[i].subAuditCategories.length; j++) {
                            subCategoriesList.push(Object.assign({}, categoryListData.subAuditCategories[i].subAuditCategories[j]));
                        }
                        subCategoriesList.push(Object.assign({}, categoryData));
                        tempCategoryData.subAuditCategories = subCategoriesList;
                        finalCategoryData.subAuditCategories.splice(i, 1, tempCategoryData);
                    }
                    return finalCategoryData;
                }
                else {
                    let changedData = this.recursiveInsertDataOfTheCategory(categoryListData.subAuditCategories[i], categoryData);
                    if (changedData != null && changedData != undefined) {
                        let categoryData = Object.assign({}, categoryListData);
                        let subCategoriesList = [];
                        for (let j = 0; j < categoryListData.subAuditCategories.length; j++) {
                            subCategoriesList.push(Object.assign({}, categoryListData.subAuditCategories[j]));
                        }
                        subCategoriesList.splice(i, 1, changedData);
                        categoryData.subAuditCategories = subCategoriesList;
                        return categoryData;
                    }
                }
            }
        }
        else {
            return null;
        }
    }

    editDataOfTheCategory(categoryData) {
        if (this.auditCategoryList && this.auditCategoryList.length > 0) {
            for (let i = 0; i < this.auditCategoryList.length; i++) {
                if (this.auditCategoryList[i].auditCategoryId == categoryData.auditCategoryId) {
                    let categoriesData = [];
                    for (let j = 0; j < this.auditCategoryList.length; j++) {
                        categoriesData.push(Object.assign({}, this.auditCategoryList[j]));
                    }
                    let tempCategoryData;
                    tempCategoryData = Object.assign({}, categoryData);
                    tempCategoryData.subAuditCategories = this.auditCategoryList[i].subAuditCategories;
                    categoriesData.splice(i, 1, tempCategoryData);
                    return categoriesData;
                }
                else {
                    let changedData = this.recursiveEditDataOfTheCategory(this.auditCategoryList[i], categoryData);
                    if (changedData != null && changedData != undefined) {
                        let categoriesList = [];
                        for (let j = 0; j < this.auditCategoryList.length; j++) {
                            categoriesList.push(Object.assign({}, this.auditCategoryList[j]));
                        }
                        categoriesList.splice(i, 1, changedData);
                        return categoriesList;
                    }
                }
            }
        }
    }

    recursiveEditDataOfTheCategory(categoryListData, categoryData) {
        if (categoryListData.subAuditCategories && categoryListData.subAuditCategories.length > 0) {
            for (let i = 0; i < categoryListData.subAuditCategories.length; i++) {
                if (categoryListData.subAuditCategories[i].auditCategoryId == categoryData.auditCategoryId) {
                    let finalCategoryData;
                    finalCategoryData = Object.assign({}, categoryListData);
                    let subCategoriesList = [];
                    for (let j = 0; j < categoryListData.subAuditCategories.length; j++) {
                        subCategoriesList.push(Object.assign({}, categoryListData.subAuditCategories[j]));
                    }
                    let tempCategoryData;
                    tempCategoryData = Object.assign({}, categoryData);
                    tempCategoryData.subAuditCategories = categoryListData.subAuditCategories[i].subAuditCategories;
                    subCategoriesList.splice(i, 1, tempCategoryData);
                    finalCategoryData.subAuditCategories = subCategoriesList;
                    return finalCategoryData;
                }
                else {
                    let changedData = this.recursiveEditDataOfTheCategory(categoryListData.subAuditCategories[i], categoryData);
                    if (changedData != null && changedData != undefined) {
                        let categoryData = Object.assign({}, categoryListData);
                        let subCategoriesList = [];
                        for (let j = 0; j < categoryListData.subAuditCategories.length; j++) {
                            subCategoriesList.push(Object.assign({}, categoryListData.subAuditCategories[j]));
                        }
                        subCategoriesList.splice(i, 1, changedData);
                        categoryData.subAuditCategories = subCategoriesList;
                        return categoryData;
                    }
                }
            }
        }
        else {
            return null;
        }
    }

    deleteDataOfTheCategory(auditCategoryId) {
        if (this.auditCategoryList && this.auditCategoryList.length > 0) {
            for (let i = 0; i < this.auditCategoryList.length; i++) {
                if (this.auditCategoryList[i].auditCategoryId == auditCategoryId) {
                    let categoriesData = [];
                    for (let j = 0; j < this.auditCategoryList.length; j++) {
                        categoriesData.push(Object.assign({}, this.auditCategoryList[j]));
                    }
                    categoriesData.splice(i, 1);
                    return categoriesData;
                }
                else {
                    let changedData = this.recursiveDeleteDataOfTheCategory(this.auditCategoryList[i], auditCategoryId);
                    if (changedData != null && changedData != undefined) {
                        let categoriesList = [];
                        for (let j = 0; j < this.auditCategoryList.length; j++) {
                            categoriesList.push(Object.assign({}, this.auditCategoryList[j]));
                        }
                        categoriesList.splice(i, 1, changedData);
                        return categoriesList;
                    }
                }
            }
        }
    }

    recursiveDeleteDataOfTheCategory(categoryListData, auditCategoryId) {
        if (categoryListData.subAuditCategories && categoryListData.subAuditCategories.length > 0) {
            for (let i = 0; i < categoryListData.subAuditCategories.length; i++) {
                if (categoryListData.subAuditCategories[i].auditCategoryId == auditCategoryId) {
                    let subCategoriesList = [];
                    for (let j = 0; j < categoryListData.subAuditCategories.length; j++) {
                        subCategoriesList.push(Object.assign({}, categoryListData.subAuditCategories[j]));
                    }
                    subCategoriesList.splice(i, 1);
                    let tempCategoryData;
                    tempCategoryData = Object.assign({}, categoryListData);
                    tempCategoryData.subAuditCategories = subCategoriesList;
                    return tempCategoryData;
                }
                else {
                    let changedData = this.recursiveDeleteDataOfTheCategory(categoryListData.subAuditCategories[i], auditCategoryId);
                    if (changedData != null && changedData != undefined) {
                        let categoryData = Object.assign({}, categoryListData);
                        let subCategoriesList = [];
                        for (let j = 0; j < categoryListData.subAuditCategories.length; j++) {
                            subCategoriesList.push(Object.assign({}, categoryListData.subAuditCategories[j]));
                        }
                        subCategoriesList.splice(i, 1, changedData);
                        categoryData.subAuditCategories = subCategoriesList;
                        return categoryData;
                    }
                }
            }
        }
        else {
            return null;
        }
    }
}