import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { DashboardFilterModel } from '../../models/dashboardFilterModel';
import { ScriptsUpsertModel } from '../../models/scripts-model';
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { FileResultModel } from '../../models/file-result-model';

@Component({
    selector: 'custom-app-fm-component-scripts',
    templateUrl: `scripts.component.html`
})

export class ScriptsComponent extends CustomAppBaseComponent implements OnInit {
    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    dashboardFilters: DashboardFilterModel;
    @ViewChildren("upsertScriptsPopUP") upsertScriptsPopover;
    @ViewChildren("deleteScriptsPopup") deleteScriptsPopover;
    @ViewChildren('scriptUploader') uploader;
    @Output() isFilesExist = new EventEmitter<boolean>();

    isAnyOperationIsInprogress: boolean = true;
    isLatest: boolean = true;
    scripts: ScriptsUpsertModel[];
    validationMessage: string;
    isFiltersVisible: boolean = false;
    isThereAnError: boolean;
    scriptsForm: FormGroup;
    Script: string;
    timeStamp: any;
    temp: any;
    searchText: string;
    ScriptId: string;
    locationName: string;
    loading: boolean = false;
    fileTypes = ['text/javascript'];
    fileResultModel: FileResultModel[];
    showExtensionError = false;
    blobUrl: string;
    fileExtensions = [".js,"];
    files = [];
    filesPresent: boolean;
    fileUploaded: boolean;

    constructor(
        private masterDataManagementService: MasterDataManagementService, private snackbar: MatSnackBar, private cdRef: ChangeDetectorRef
        , private translateService: TranslateService,private toastr: ToastrService) {

        super();
        
        
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getScripts();
    }

    getScripts() {
        this.isAnyOperationIsInprogress = true;
        var scriptsModel = new ScriptsUpsertModel();
        scriptsModel.isLatest = this.isLatest;
        this.masterDataManagementService.getScript(scriptsModel).subscribe((response: any) => {
            if (response.success == true) {
                this.isThereAnError = false;
                this.clearForm();
                this.scripts = response.data;
                this.temp = this.scripts;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    createScripts(upsertScriptsPopUP) {
        upsertScriptsPopUP.openPopover();
        this.Script = this.translateService.instant('ScriptES.ADDScriptESTITLE');
    }

    closeupsertScriptsPopUPPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertScriptsPopover.forEach((p) => p.closePopover());
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    UpsertScript(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;

        let Script = new ScriptsUpsertModel();
        Script = this.scriptsForm.value;
        Script.scriptName = Script.scriptName.toString().trim();
        Script.version = Script.version.toString().trim();
        Script.description = Script.description.toString().trim();
        
        Script.scriptId = this.ScriptId;

        const file = this.files[0];
        const moduleTypeId = 10;
        if (file != null && file != undefined) {
            if (this.fileTypes.includes(file.type)) {
                const formData = new FormData();
                formData.append("file", file);
                this.masterDataManagementService.UploadFile(formData, moduleTypeId)
                    .subscribe((responseData: any) => {
                        const success = responseData.success;
                        if (success) {
                            this.fileResultModel = responseData.data;
                            this.blobUrl = responseData.data[0].filePath;
                            Script.scriptUrl = this.blobUrl;
                            this.masterDataManagementService.upsertScript(Script).subscribe((response: any) => {
                                if (response.success == true) {
                                    this.upsertScriptsPopover.forEach((p) => p.closePopover());
                                    this.clearForm();
                                    formDirective.resetForm();
                                    this.getScripts();
                                }
                                else {
                                    this.isThereAnError = true;
                                    this.validationMessage = response.apiResponseMessages[0].message;
                                    this.isAnyOperationIsInprogress = false;
                                }
                            });
                            
                            this.filesPresent = false;
                        } else {
                            this.toastr.warning("", responseData.apiResponseMessages[0].message);
                            this.filesPresent = false;
                        }
                    });
            } else {
                this.showExtensionError = true;
            }
        }
    }

    clearForm() {
        this.scriptsForm = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.Script = null;
        this.timeStamp = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.filesPresent = false;
        this.files = [];
        this.fileUploaded = false;
        this.scriptsForm = new FormGroup({
            scriptName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(250)
                ])
            ),
            version: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(250)
                ])
            ),
            description: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(2000)
                ])
            )
        })
    }

    onRemove(event) {
        this.files.splice(this.files.indexOf(event), 1);
        if (this.files.length > 0) {
            this.filesPresent = true;
            this.isFilesExist.emit(true);
        } else {
            this.filesPresent = false;
            this.isFilesExist.emit(false);
        }
    }

    filesSelected(event) {
        this.files.push(...event.target.files);

        if (this.files.length > 0) {
            this.filesPresent = true;
            this.isFilesExist.emit(true);
        }
    }

    deleteScriptsPopupOpen(row, deleteScriptsPopup) {
        this.ScriptId = row.scriptId;
        deleteScriptsPopup.openPopover();
    }

    closedeleteScriptsPopup() {
        this.clearForm();
        this.deleteScriptsPopover.forEach((p) => p.closePopover());
    }

    deleteScripts() {
        this.isAnyOperationIsInprogress = true;

        this.masterDataManagementService.deleteScript(this.ScriptId).subscribe((response: any) => {
            if (response.success == true) {
                this.deleteScriptsPopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getScripts();
            }
            else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        }
        else {
            this.searchText = "";
        }
        const temp = this.temp.filter(scripts => (scripts.scriptName.toLowerCase().indexOf(this.searchText) > -1));

        this.scripts = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }

    download(row){
        this.masterDataManagementService.DownloadFile(row.scriptName,row.version)
        .subscribe((responseData: any) => {
            if (responseData.success == true) {
                this.toastr.success("File downloaded!-Check downloads.");
            } else {
                this.toastr.error("Error in downloading file.",responseData.apiResponseMessages[0].message);
            }
        });
    }

}
