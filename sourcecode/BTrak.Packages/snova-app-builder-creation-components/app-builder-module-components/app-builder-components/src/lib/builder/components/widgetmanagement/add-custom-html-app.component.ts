import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild, ElementRef } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { RoleManagementService } from "../../services/role-management.service";
import { ToastrService } from "ngx-toastr";
import { CustomHtmlAppModel } from "../../models/custom-html-app.model";
import { CustomWidgetsModel } from "../../models/custom-widget.model";
import { MasterDataManagementService } from "../../services/master-data-management.service";
import { CustomTagModel } from "../../models/custom-tags.model";
import { CustomTagService } from "../../services/customTag.service";
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";
import { SoftLabelConfigurationModel } from "../../models/softlabels.model";
declare var kendo: any;

@Component({
    selector: "app-fm-component-add-custom-html",
    templateUrl: `add-custom-html-app.component.html`
})

export class AddCustomHtmlAppComponent  {

    @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChild("htmlContentLoader") htmlContentLoader: ElementRef;
    @ViewChild("allModuleSelected") private allModuleSelected: MatOption;
    @Input("selectedAppId")
    set _selectedAppId(data: string) {
        this.clearForm();
        if (data != null && data !== undefined) {
            this.customHtmlAppId = data;
            this.getWidgets();
        }
    }


    @Input("fromSearch")
    set _fromSearch(data: string) {
        if (data) {
            this.fromSearch = data;
        }
    }

    @Input("tagSearchText")
    set _tagSearchText(data: string) {
        if (data) {
            this.tagSearchText = data;
        }
    }

    @Input("tagModel")
    set _tagModel(data: CustomTagModel) {
        this.tagModel = data;
    }

    tagSearchText: string;
    fromSearch: string;

    @Output() closeDialog = new EventEmitter<boolean>();
    tagModel: CustomTagModel;
    htmlForm: FormGroup;
    htmlCodestring: string = null;
    tags: CustomTagModel[] = [];
    rolesDropDown: any[];
    selectedRoleIds: string[] = [];
    customHtmlAppId: string;
    isAnyOperationIsInprogress: boolean;
    timeStamp: any;
    scriptFilePath: string;
    id: string;
    iFrame: boolean = true;
    modulesDropDown : any[];
    selectedModuleIds : string[]=[]; 
    softLabels: SoftLabelConfigurationModel[];
    constructor(
        private roleManagementService: RoleManagementService,
        private cdRef: ChangeDetectorRef, private masterDataManagementService: MasterDataManagementService,
        private customTagsService: CustomTagService,
        private toaster: ToastrService) {
            this.getSoftLabelConfigurations();

    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
      }

    ngOnInit() {
        this.id = "frameId";
        this.clearForm();
        this.GetAllRoles();
        this.GetAllModules();
    }

    clearForm() {
        this.htmlForm = new FormGroup({
            customHtmlAppName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            description: new FormControl(null,
                Validators.compose([
                    Validators.maxLength(250)
                ])),
            selectedRoleIds: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            moduleIds: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            
            htmlCode: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            )
        });
    }

    GetAllRoles() {
        this.roleManagementService
            .getAllRoles()
            .subscribe((responseData: any) => {
                this.rolesDropDown = responseData.data;
            });
    }
    GetAllModules() {
        this.masterDataManagementService.getAllModule().subscribe((response: any) => {
            if (response.success === true) {
                this.modulesDropDown = response.data;
            }
            else {
                this.toaster.error(response.apiResponseMessages[0].message);
            }
        });
}

    getTagsList(tags) {
        this.tags = tags;
    }

    upsertCustomHtmlApp() {
        this.isAnyOperationIsInprogress = true;
        this.cdRef.detectChanges();
        let customHtmlAppModel = new CustomHtmlAppModel();
        customHtmlAppModel = this.htmlForm.value;
        customHtmlAppModel.customHtmlAppId = this.customHtmlAppId;
        customHtmlAppModel.isArchived = false;
        customHtmlAppModel.timeStamp = this.timeStamp;
        customHtmlAppModel.fileUrls = this.scriptFilePath;
        this.masterDataManagementService.upsertCustomHtmlApp(customHtmlAppModel).subscribe((responseData: any) => {
            if (responseData.success == true) {
                const customTagsModel = new CustomTagModel();
                customTagsModel.referenceId = responseData.data;
                customTagsModel.tagsList = this.tags;
                this.customTagsService.upsertCustomTag(customTagsModel).subscribe((result: any) => {
                    if (result.success === true) {
                        this.customHtmlAppId = responseData.data;
                        this.isAnyOperationIsInprogress = false;
                        this.closeDialog.emit(true);
                    } else {
                        var validationMessage = result.apiResponseMessages[0].message;
                        this.toaster.error(validationMessage);
                    }
                });
                // this.routes.navigate(["/appmanagement/customapps"]);
            } else {
                this.toaster.error(responseData.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    getWidgets() {
        this.isAnyOperationIsInprogress = true;
        const customWidgetModel = new CustomWidgetsModel();
        customWidgetModel.isArchived = false;
        customWidgetModel.customWidgetId = this.customHtmlAppId;
        customWidgetModel.isFormTags = true;
        this.masterDataManagementService.getCustomWidgets(customWidgetModel).subscribe((response: any) => {
            if (response.success === true) {
                this.htmlForm.get('customHtmlAppName').patchValue(response.data[0].customWidgetName);
                this.htmlForm.get('description').patchValue(response.data[0].description);
                if (response.data[0].roleIds != null) {
                    const roleIds = response.data[0].roleIds.split(",");
                    this.htmlForm.get('selectedRoleIds').patchValue(roleIds);
                }
                if (response.data[0].moduleIds != null) {
                    const moduleIds = response.data[0].moduleIds.split(",");
                    this.htmlForm.get('moduleIds').patchValue(moduleIds);
                }
                this.timeStamp = response.data[0].timeStamp;
                this.htmlForm.get('htmlCode').patchValue(response.data[0].widgetQuery);
                this.htmlCodestring = response.data[0].widgetQuery;
                if (response.data[0].fileUrls) {
                    this.htmlCodestring = this.htmlCodestring + '<script src="' + response.data[0].fileUrls + '"></script>';
                    this.scriptFilePath = response.data[0].fileUrls;
                }

                kendo.jQuery(this.htmlContentLoader.nativeElement).html(this.htmlCodestring);

                this.cdRef.detectChanges();
                this.isAnyOperationIsInprogress = false;
            } else {
                this.toaster.error(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    toggleRolesPerOne() {
        if (this.allSelected.selected) {
            this.allSelected.deselect();
            return false;
        }
        if (
            this.htmlForm.get("selectedRoleIds").value.length === this.rolesDropDown.length
        ) {
            this.allSelected.select();
        }
    }

    toggleAllRolesSelected() {
        if (this.allSelected.selected) {
            this.htmlForm.get("selectedRoleIds").patchValue([
                ...this.rolesDropDown.map((item) => item.roleId),
                0
            ]);
            this.selectedRoleIds = this.rolesDropDown.map((item) => item.roleId);
        } else {
            this.htmlForm.get("selectedRoleIds").patchValue([]);
        }
    }

    compareSelectedRolesFn(rolesList: any, selectedRoleIds: any) {
        if (rolesList === selectedRoleIds) {
            return true;
        } else {
            return false;
        }
    }

    toggleModulePerOne() {
        if (this.allModuleSelected.selected) {
            this.allModuleSelected.deselect();
            return false;
        }
        if (
            this.htmlForm.get("moduleIds").value.length === this.modulesDropDown.length
        ) {
            this.allModuleSelected.select();
        }
    }

    toggleAllModuleSelected() {
        if (this.allModuleSelected.selected && this.modulesDropDown) {
            this.htmlForm.get("moduleIds").patchValue([
                ...this.modulesDropDown.map((item) => item.moduleId),
                0
            ]);
            this.selectedModuleIds = this.modulesDropDown.map((item) => item.moduleId);
        } else {
            this.htmlForm.get("moduleIds").patchValue([]);
        }
    }

    compareSelectedModuleFn(rolesList: any, moduleIds: any) {
        if (rolesList === moduleIds) {
            return true;
        } else {
            return false;
        }
    }

    previewHtml() {
        var htmlCodestring = this.htmlForm.get("htmlCode").value;
        if (this.scriptFilePath) {
            htmlCodestring = htmlCodestring + '<script src="' + this.scriptFilePath + '"></script>';
        }

        kendo.jQuery(this.htmlContentLoader.nativeElement).html(htmlCodestring);
        this.cdRef.detectChanges();
        // var iframeSelector: HTMLIFrameElement = document.querySelector('iframe[id=' + this.id + ']');
        // iframeSelector.src = 'data:text/html,' + encodeURIComponent(htmlCodestring);
        // this.cdRef.detectChanges();
    }

    navigatetocustomwidgets() {
        this.closeDialog.emit(false);
        // this.routes.navigate(["/appmanagement/customapps"]);
    }

    filePath(event) {
        this.scriptFilePath = event;
    }
}
