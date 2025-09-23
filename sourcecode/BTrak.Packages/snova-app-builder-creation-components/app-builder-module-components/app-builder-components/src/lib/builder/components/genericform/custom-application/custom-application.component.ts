import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CustomApplicationModel } from '../models/custom-application-input.model';
import { CustomApplicationSearchModel } from '../models/custom-application-search.model';
import { TranslateService } from '@ngx-translate/core';
import { GenericFormService } from '../services/generic-form.service';
import { CustomAppBaseComponent } from "../../../../globaldependencies/components/componentbase";
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardFilterModel } from '../../../models/dashboard-filter.model';
import { Page } from '../../../models/page.model';
import { ConstantVariables } from '../../../../globaldependencies/constants/constant-variables';
import { LocalStorageProperties } from '../../../../globaldependencies/constants/localstorage-properties';
import * as introJs from 'intro.js/intro.js';
import * as _ from "underscore";
import { GenericFormType } from '../models/generic-form-type-model';
@Component({
    selector: 'app-fm-component-custom-application',
    templateUrl: `custom-application.component.html`
})

export class CustomApplicationComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }
    @ViewChild("newProcessWidgetComponent") newProcessWidgetComponent: TemplateRef<any>;
    dashboardFilters: DashboardFilterModel;
    customApplicationList: CustomApplicationModel[];
    temp: CustomApplicationModel[];
    formTypes: any[] = [];
    Arr = Array;
    num: number = 8;
    validationMessage: string;
    gettingCustomApplicationFormsInProgress: boolean = true;

    sortBy: string = 'customApplicationName';
    sortDirection: boolean = true;
    page = new Page();
    searchText: string = '';
    accessConductForm: Boolean = false;
    formId: string = "new-process-widget-component";
    introJS = new introJs();
    isStartEnable: boolean = false;

    constructor(
        private routes: Router,
        private genericFormService: GenericFormService,
        private toastr: ToastrService,
        private cdRef: ChangeDetectorRef,
        private translateService: TranslateService,
        private snackbar: MatSnackBar,
        public dialog: MatDialog
        ) {
        super();
        this.getFormTypes();
    }

    ngOnInit() {
        super.ngOnInit();
        this.page.size = 35;
        this.page.pageNumber = 0;
        this.getCustomApplications();
        this.checkIntroEnable();
    }

    ngAfterViewInit() {
        if (this.canAccess_feature_ViewApplications && this.canAccess_feature_AddOrUpdateApplications) {
            this.introJS.setOptions({
                steps: [
                    {
                        element: '#app-1',
                        intro: this.translateService.instant('INTROTEXT.APP-BUILDER-1'),
                        position: 'bottom'
                    },
                    {
                        element: '#app-2',
                        intro: this.translateService.instant('INTROTEXT.APP-BUILDER-2'),
                        position: 'bottom'
                    },
                    {
                        element: '#app-3',
                        intro: this.translateService.instant('INTROTEXT.APP-BUILDER-3'),
                        position: 'bottom'
                    },
                ]
            });
        }
        else if (this.canAccess_feature_ViewApplications) {
            this.introJS.setOptions({
                steps: [
                    {
                        element: '#app-1',
                        intro: this.translateService.instant('INTROTEXT.APP-BUILDER-1'),
                        position: 'bottom'
                    },
                    {
                        element: '#app-2',
                        intro: this.translateService.instant('INTROTEXT.APP-BUILDER-2'),
                        position: 'bottom'
                    },
                ]
            });
        }
    }
    enableIntro() {
        this.introJS.start();
    }

    getFormTypes() {
        var genericFormTypeModel = new GenericFormType();
        genericFormTypeModel.isArchived = false;
        this.genericFormService.getAllFormTypes(genericFormTypeModel).subscribe((result: any) => {
            this.formTypes = result.data;
        });
    }

    getFormType(row) {
        let formTypes = this.formTypes;
        let filteredList = _.filter(formTypes, function (type) {
            return type.formTypeId == row.fields.FormTypeId;
        })
        if (filteredList.length > 0) {
            return filteredList[0].formTypeName;
        } else {
            return "";
        }
    }

    openCustomApplicationFormPopover() {
        const dialogRef = this.dialog.open(this.newProcessWidgetComponent, {
            width: "90vw",
            hasBackdrop: true,
            direction: "ltr",
            disableClose: true,
            id: this.formId,
            panelClass: "custom-modal-box",
            data: { formPhysicalId: this.formId }
        });
        dialogRef.afterClosed().subscribe((response) => {
            this.getCustomApplications();
        });
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getCustomApplications();
    }

    onSort(event) {
        if (this.page.totalElements > 0) {
            const sort = event.sorts[0];
            this.sortBy = sort.prop;
            if (sort.dir === 'asc')
                this.sortDirection = true;
            else
                this.sortDirection = false;
            this.page.size = 10;
            this.page.pageNumber = 0;
            this.getCustomApplications();
        }
    }

    canCopyPublicUrl(publicUrl) {
        if(publicUrl) {
            return publicUrl.includes("http") ? true : false;
        }
        else {
            return false;
        }
    }

    getCustomApplications() {
        let customApplicationSearchModel = new CustomApplicationSearchModel();
        customApplicationSearchModel.sortBy = this.sortBy;
        customApplicationSearchModel.sortDirectionAsc = this.sortDirection;
        customApplicationSearchModel.pageNumber = this.page.pageNumber + 1;
        customApplicationSearchModel.pageSize = this.page.size;
        customApplicationSearchModel.isArchived = false;
        customApplicationSearchModel.isList = true;
        this.gettingCustomApplicationFormsInProgress = true;
        this.genericFormService.getCustomApplication(customApplicationSearchModel)
            .subscribe((responseData: any) => {
                let success = responseData.success;
                this.gettingCustomApplicationFormsInProgress = false;
                if (success) {
                    this.customApplicationList = responseData.data;
                    this.temp = responseData.data;
                    this.page.totalElements = responseData.data.length > 0 ? responseData.data[0].totalCount : 0;
                    this.page.totalPages = this.page.totalElements / this.page.size;
                    this.cdRef.detectChanges();
                }
                else {
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                    this.cdRef.detectChanges();
                }
            });
    }

    editCustomApplication(event) {
        const dialogRef = this.dialog.open(this.newProcessWidgetComponent, {
            width: "90vw",
            hasBackdrop: true,
            direction: "ltr",
            id: this.formId,
            data: {
                selectedAppId: event.customApplicationId,
                formPhysicalId: this.formId
            },
            disableClose: true,
            panelClass: "custom-modal-box"
        });
        dialogRef.afterClosed().subscribe((response) => {
            this.getCustomApplications();
        });
    }

    copyLink(address) {
        var copyText = address;
        const selBox = document.createElement("textarea");
        selBox.value = copyText;
        document.body.appendChild(selBox);
        selBox.select();
        document.execCommand("copy");
        document.body.removeChild(selBox);
        this.snackbar.open(this.translateService.instant("USERSTORY.LINKCOPIEDSUCCESSFULLY"), this.translateService.instant(ConstantVariables.success), { duration: 2000 });
    }

    goToUrl(url) {
        window.open(url, '_blank');
    }

    navigateToCustomApplication(row) {
        if (this.canAccess_feature_ConductForm)
            this.routes.navigateByUrl("forms/application-form/" + row.customApplicationId + "/" + row.customApplicationName);
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }
        const temp = this.temp.filter((store => (store.customApplicationName && store.customApplicationName.toLowerCase().indexOf(this.searchText) > -1) 
        || (store.formName && store.formName.toLowerCase().indexOf(this.searchText) > -1) 
        || (store.formTypeName && store.formTypeName.toLowerCase().indexOf(this.searchText) > -1)));
        this.customApplicationList = temp;
    }
    closeSearch() {
        this.filterByName(null);
    }

    navigateToForms() {
        this.routes.navigateByUrl("applications/view-forms");
    }
    checkIntroEnable() {
        let intro = JSON.parse(localStorage.getItem(LocalStorageProperties.IntroModules));
        if (intro) {
            intro.forEach(element => {
                if (element.moduleId == 'e23d114e-86e8-4883-b104-c7c6679745b1') {
                    if (element.enableIntro == 'True') {
                        this.isStartEnable = true;
                    }
                }
            });
        }
    }
}