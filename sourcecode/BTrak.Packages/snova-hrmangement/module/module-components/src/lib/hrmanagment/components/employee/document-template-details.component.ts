import { Component, Input, ChangeDetectorRef, ViewChildren } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';

import { EmployeeService } from '../../services/employee-service';
import { CookieService } from 'ngx-cookie-service';
import { DocumentTemplateModel } from '../../models/Document-template-model';
import { ToastrService } from 'ngx-toastr';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { HRManagementService } from '../../services/hr-management.service';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { FileResultModel } from '../../models/fileResultModel';
import { FormControl, Validators } from '@angular/forms';
import { ApiUrls } from '../../../globaldependencies/constants/api-urls';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { TranslateService } from '@ngx-translate/core';
import { FileSizePipe } from '../../pipes/filesize-pipe';
import Resumable from "resumablejs";
import * as $_ from 'jquery';
const $ = $_;

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Component({
    selector: 'app-hr-component-document-template',
    templateUrl: 'document-template-details.component.html',
})

export class DocumentTemplateDetailsComponent extends CustomAppBaseComponent {
    @Input('selectedEmployeeId')
    set selectedEmployeeId(data: string) {
        if (data != null && data !== undefined && this.employeeId !== data) {
            this.employeeId = data;
            this.getUserId();
        }
    }

    @Input('isPermission')
    set isPermission(data: boolean) {
        this.permission = data;
    }

    @ViewChildren("upsertDocumentTemplatePopUp") upsertDocumentTemplatePopUp;

    public employeeId: string;
    public userId: string;
    public permission: boolean;
    templatesList: DocumentTemplateModel[];
    templatesListData: any;
    isAnyOperationIsInprogress: boolean = false;
    isTemplateGenerationInprogress: boolean = false;
    files: File[] = [];
    fileResultModel: FileResultModel[];
    filesPresent: boolean = false;
    fileIndex: number = 0;
    templateName = new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(250)]));
    maxFileSize = 20971520;
    moduleTypeId = 9;
    allowedFileTypes = '.docx,.doc';
    progressValue: number;
    fileCounter: number = 1;
    uploadedFileNames = [];
    state: State = {
        skip: 0,
        take: 999,
    };
    public sort: SortDescriptor[] = [{
        field: 'templateName',
        dir: 'asc'
    }];
    anyOperationInProgress: boolean;

    public ngDestroyed$ = new Subject();

    constructor(private store: Store<State>,
        private employeeService: EmployeeService, private cookieService: CookieService, private hrManagementService: HRManagementService, private cdRef: ChangeDetectorRef,
        private toastrService: ToastrService, private translateService: TranslateService, private filesize: FileSizePipe) {
        super();
        this.getDocumentTemplates();
        if (this.employeeId == undefined || this.employeeId == null || this.employeeId == "")
            this.getEmployees();
    }

    ngOnInit() {
        super.ngOnInit();
        if (this.employeeId == undefined || this.employeeId == null || this.employeeId == "")
            this.getEmployees();
    }

    getEmployees() {
        const userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
        this.userId = userId;
        this.hrManagementService.getMyEmployeeId(userId).subscribe((result: any) => {
            if (result.success === true) {
                this.employeeId = result.data.employeeId;
            }
        });
    }

    getUserId() {
        this.employeeService.getEmployeeById(this.employeeId).subscribe((result: any) => {
            if (result.success === true) {
                this.userId = result.data.userId;
            }
        })
    }

    getDocumentTemplates() {
        this.isAnyOperationIsInprogress = true;
        let documentTemplateModel = new DocumentTemplateModel();
        documentTemplateModel.isArchived = false;
        this.hrManagementService.getDocumentTemplates(documentTemplateModel).subscribe((result: any) => {
            if (result.success === true) {
                this.templatesList = result.data;
                this.templatesListData = {
                    data: this.templatesList,
                    total: this.templatesList.length > 0 ? this.templatesList.length : 0,
                }
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            } else {
                this.isAnyOperationIsInprogress = false;
                this.toastrService.error("", result.apiResponseMessages[0].message);
            }
        });
    }

    public pageChange(event: PageChangeEvent): void {
        this.templatesListData = {
            data: this.templatesListData.slice(this.state.skip, this.state.skip + this.state.take),
            total: this.templatesListData.total
        };
    }

    public sortChange(sort: SortDescriptor[]): void {
        this.sort = sort;
        this.templatesListData = {
            data: orderBy(this.templatesListData.data, this.sort),
            total: this.templatesListData.total
        };
    }

    public generateReport(data) {
        this.isTemplateGenerationInprogress = true;
        let documentTemplateModel = new DocumentTemplateModel();
        documentTemplateModel.isArchived = false;
        documentTemplateModel.templatePath = data.templatePath;
        documentTemplateModel.templateName = data.templateName;
        documentTemplateModel.selectedEmployeeId = this.employeeId;
        this.hrManagementService.generateReport(documentTemplateModel).subscribe((result: any) => {
            if (result.success === true) {
                this.templatesList = result.data;
                this.isTemplateGenerationInprogress = false;
                this.cdRef.detectChanges();
            } else {
                this.isTemplateGenerationInprogress = false;
                this.toastrService.error("", result.apiResponseMessages[0].message);
            }
        });
    }

    setLabelNameForDropzone(fileName) {
        return fileName.substring(0, 20) + "...";
    }

    createDocumentTemplatePopupOpen(upsertDocumentTemplatePopUp) {
        this.filesPresent = false;
        this.files = [];
        this.templateName = new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(250)]));
        upsertDocumentTemplatePopUp.openPopover();
    }

    closeUpsertDocumentTemplatePopup() {
        this.upsertDocumentTemplatePopUp.forEach((p) => p.closePopover());
    }

    filesSelected(event) {
        this.files.push(...event.addedFiles);
        if (event.rejectedFiles.length > 0) {
            if (event.rejectedFiles[0].size > this.maxFileSize) {
                this.toastrService.error("", this.translateService.instant(ConstantVariables.FileSizeShouldNotExceed) + " " +
                    this.filesize.transform(this.maxFileSize));
            } else if (this.allowedFileTypes.search(event.rejectedFiles[0].type)) {
                this.toastrService.error("", this.translateService.instant(ConstantVariables.ThisFileTypeIsNotAllowed));
            }
        }
        if (this.files.length > 0) {
            this.filesPresent = true;
        }
    }

    onRemove(event) {
        this.files.splice(this.files.indexOf(event), 1);
        if (this.files.length > 0) {
            this.filesPresent = true;
        } else {
            this.filesPresent = false;
        }
    }

    uploadFiles() {
        if (!this.templateName.valid) {
            this.toastrService.error("", "Please give the template name");
        } else if (!this.filesPresent) {
            this.toastrService.error("", "Please select a template");
        } else {
            const formData = new FormData();
            this.files.forEach((file: File) => {
                this.fileIndex = this.fileIndex + 1;
                const fileKeyName = "file" + this.fileIndex.toString();
                formData.append(fileKeyName, file);
            });

            this.UploaderOnInit(environment.apiURL + ApiUrls.UploadFileChunks);
        }
    }

    private UploaderOnInit(url: string): void {
        let progress = 0;
        const r = new Resumable({
            target: url,
            chunkSize: 1 * 1024 * 1024, //3 MB
            query: { moduleTypeId: this.moduleTypeId },
            headers: {
                // enctype: "multipart/form-data",
                // "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${this.cookieService.get(LocalStorageProperties.CurrentUser)}`
            },
        });
        r.addFiles(this.files);
        r.on('fileAdded', (file, event) => {
            if (!this.fileResultModel || this.fileResultModel.length > 0) {
                this.fileResultModel = [];
                this.cdRef.detectChanges();
            }
            r.upload()
        });
        r.on('complete', (event) => {
            r.files.pop();
            this.progressValue = 0;
            this.filesPresent = false;
            this.uploadedFileNames = [];
            this.fileCounter = 1;
            this.fileIndex = 0;
            this.isAnyOperationIsInprogress = false;
            if (this.fileResultModel.length > 0) {
                this.upsertDocumentTemplate(this.fileResultModel);
            }
        });
        r.on('progress', () => {
            progress = Math.round(r.progress() * 100);
            this.progressValue = progress;
            this.cdRef.detectChanges();
        });
        r.on('fileSuccess', (file, response) => {
            if (file && file.fileName) {
                if (!this.uploadedFileNames.find(x => x == file.fileName)) {
                    this.uploadedFileNames.push(file.fileName)
                    this.fileCounter = this.uploadedFileNames.length;

                    let result = JSON.parse(response);
                    if (result && result.length > 0) {
                        if (!this.fileResultModel) {
                            this.fileResultModel = [];
                        }
                        let fileResult = new FileResultModel();
                        fileResult.fileExtension = result[0].FileExtension;
                        fileResult.fileName = result[0].FileName;
                        fileResult.filePath = result[0].FilePath;
                        fileResult.fileSize = result[0].FileSize;
                        this.fileResultModel.push(fileResult);
                    }
                    this.cdRef.detectChanges();
                }
            }
        });
    }

    upsertDocumentTemplate(fileResultModel) {
        this.isAnyOperationIsInprogress = true;
        let documentTemplateModel = new DocumentTemplateModel();
        documentTemplateModel.templateName = this.templateName.value;
        documentTemplateModel.templatePath = fileResultModel[0].filePath;
        documentTemplateModel.isArchived = false;
        this.hrManagementService.upsertDocumentTemplate(documentTemplateModel).subscribe((result: any) => {
            if (result.success === true) {
                this.closeUpsertDocumentTemplatePopup();
                this.getDocumentTemplates();
            } else {
                this.isAnyOperationIsInprogress = false;
                this.toastrService.error("", result.apiResponseMessages[0].message);
            }
        });
    }

    fitContent(optionalParameters : any) {
        var interval;
        var count = 0;

        if (optionalParameters['popupView']) {     
           
           interval = setInterval(() => {
                try {
        
                  if (count > 30) {
                    clearInterval(interval);
                  }
        
                  count++;
        
                  if ($(optionalParameters['popupViewSelector'] + ' .k-grid-content').length > 0) {
                  
                    if(optionalParameters['isAppStoreCustomViewFromDashboard']){
                      $(optionalParameters['popupViewSelector'] + ' app-widgetslist .widgets-list').attr('id', '');                      
                    }

                    $(optionalParameters['popupViewSelector'] + ' .k-grid-content').css("cssText", `height: calc(100vh - 445px) !important;`);
                    $(optionalParameters['popupViewSelector'] + ' .k-grid-content').addClass('widget-scroll');                      
                    clearInterval(interval);
                  }
        
                } catch (err) {
                  clearInterval(interval);
                }
              }, 1000);

        }
    }

}
