import { Component, Injectable, Input, OnInit, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpEvent, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { concat } from 'rxjs/observable/concat';
import { delay } from 'rxjs/operators/delay';
import { StatusImageDetails, createStubStatusImageDetails } from '../models/StatusImageDetails';
import { CreateGenericForm } from '../models/createGenericForm';
import { MatDialog } from '@angular/material/dialog';
import {  MatSnackBar } from '@angular/material/snack-bar';
import { StatusreportService } from '../services/statusreport.service';
import { FormControl, Validators } from '@angular/forms';
import { StatusReporting } from '../models/statusReporting';
import "../../globaldependencies/helpers/fontawesome-icons"
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { SoftLabelConfigurationModel } from '../models/soft-labels.model';
import { GoogleAnalyticsService } from '../services/google-analytics.service';
import { ConstantVariables } from '../../globaldependencies/constants/constant-variables';
import { Router } from '@angular/router';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
@Component({
  selector: 'app-dashboard-component-statusreporting',
  templateUrl: './statusReporting.component.html'
})

export class StatusReportingComponent extends CustomAppBaseComponent implements OnInit {

  @Input("isFromDialog")
  set _isFromDialog(data: boolean) {
    this.isFromDialog = data;
  }

  isFromDialog = false;
  openForm: boolean = false;
  submitFilter: boolean = false;
  buttonDisable: boolean = false;
  getReports: boolean = false;
  isStatusReportVisible: boolean = false;
  formSrc: any;
  selectedForm: any;
  statusReportDetails: any;
  statusReportsDetails: any;
  configurationId: any;
  reportDescription: string;
  filePath: string;
  fileName: string;
  UploadFileUrl = environment.apiURL + 'File/FileApi/UploadFile';
  genericFormListDetails: CreateGenericForm[];
  statusImageDetails: StatusImageDetails[];
  statusReporting: StatusReporting;
  searchText: string;
  anyOperationInProgress: Boolean;
  selectedConfigurationId: string;
  selectedFromName: string;
  maxDate: Date = new Date();
  createdOn: string;
  showCommentBox: boolean = false;
  alternativeComment: string;
  commentValidation: boolean = false;
  isCheked: boolean = false;
  selectedStatus = new FormControl('', [Validators.required]);
  isReadOnly: boolean = false;

  options: Object = {
    submitMessage: "",
    disableAlerts: true,
  }

  public initSettings = {
    plugins: "paste",
    branding: false,
    //powerpaste_allow_local_images: true,
    //powerpaste_word_import: 'prompt',
    //powerpaste_html_import: 'prompt',
    toolbar: 'link image code'
  };

  summaryLooping: any[] = [0, 1, 2];

  filePaths = [];
  fileNames = [];
  filesUploaded: any;
  formData: string;

  softLabels: SoftLabelConfigurationModel[];

  constructor(public dialog: MatDialog, private cdRef: ChangeDetectorRef, private statusreportService: StatusreportService, private snackbar: MatSnackBar, private toastr: ToastrService, private translateService: TranslateService,
    public googleAnalyticsService: GoogleAnalyticsService,private router: Router) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabels();
    this.getStatusReports();
    this.statusImageDetails = [
      createStubStatusImageDetails()
    ];
  }

  getStatusReports() {
    this.anyOperationInProgress = true;
    this.statusreportService.GetStatusReportingConfigurationForms().subscribe((result: any) => {
      this.genericFormListDetails = result.data;
      if (this.genericFormListDetails && this.genericFormListDetails.length > 0) {
        this.getForm(this.genericFormListDetails[0]);
      }
      this.anyOperationInProgress = false;
     // this.introStart();
      this.cdRef.detectChanges();
    })
  }

  getSoftLabels() {
    this.softLabels = JSON.parse(localStorage.getItem('SoftLabels'));
    this.cdRef.markForCheck();
  }

  getForm(form) {
    this.showCommentBox = false;
    this.commentValidation = false;
    this.buttonDisable = false;
    this.isCheked = false;
    this.alternativeComment = null;
    this.selectedConfigurationId = form.statusReportingConfigurationId;
    this.selectedFromName = form.formName;
    this.openForm = true;
    this.formSrc = JSON.parse(form.formJson);
    this.configurationId = form.statusReportingConfigurationOptionId;
    this.isStatusReportVisible = true;
  }

  onChangeNew(data) {
    if (data != undefined) {
      this.formData = data;
    }
  }

  checkDisable() {
    if (this.buttonDisable == true)
      return true;
    if (this.selectedForm && this.reportDescription && this.reportDescription.length <= 150)
      return false;
    else
      return true;
  }

  closeSearch() {
    this.searchText = '';
  }

  addComment() {
    this.showCommentBox = !this.showCommentBox;
    if (this.showCommentBox) {
      this.buttonDisable = true;
    }
    else {
      this.buttonDisable = false;
    }
    this.alternativeComment = null;
    this.commentValidation = false;
    this.formData = null;
  }

  onSubmit() {
    this.createAStatusReport();
  }

  checkValidation() {
    if (this.alternativeComment) {
      this.buttonDisable = false;
      this.cdRef.detectChanges();
    } else {
      this.buttonDisable = true;
      this.cdRef.detectChanges();
    }
  }

  createAStatusReport() {
    this.buttonDisable = true;
    this.isReadOnly = true;
    this.isReadOnly = false;
    this.statusReporting = new StatusReporting();
    this.statusReporting.StatusReportingConfigurationOptionId = this.configurationId;
    this.statusReporting.Description = this.alternativeComment;
    this.statusReporting.FormDataJson = JSON.stringify(this.formData);
    this.statusReporting.FileName = this.fileNames.toString();
    this.statusReporting.Filepath = this.filePaths.toString();
    this.statusReporting.formName = this.selectedFromName;

    this.googleAnalyticsService.eventEmitter("Status Report", "Submitted Status Report", this.statusReporting.formName, 1);

    this.statusreportService.CreateStatusReport(this.statusReporting).subscribe((result: any) => {
      if (result.success == true) {
        // this.snackbar.open(this.translateService.instant(ConstantVariables.StatusReportSubmission), "Ok", { duration: 3000 });
        this.toastr.success("", this.translateService.instant(ConstantVariables.StatusReportSubmission));
        var index = this.genericFormListDetails.findIndex(x => x.statusReportingConfigurationOptionId == this.configurationId);
        this.genericFormListDetails[index].isSubmitted = true;
        this.statusReportDetails = result.data;
        this.buttonDisable = false;
        this.getForm(this.genericFormListDetails[index]);
        // this.submitFilter = true;
        // this.getReports = true;
        // this.buttonDisable = false;
        // this.showCommentBox = false;
        // this.alternativeComment = null;
        this.commentValidation = false;
        // this.filePaths = [];
        // this.fileNames = [];
        // this.selectedStatus = new FormControl('', [Validators.required]);
        // this.openForm = false;
        // this.selectedForm = null;
        // this.configurationId = '';
        // this.reportDescription = '';
        // this.formData = null;
        // this.fileName = '';
        // this.filePath = '';
        // this.isStatusReportVisible = false;
        setTimeout(() => {
          this.getReports = false;
        }, 3000);
      }
      if (result.success == false) {
        var validationmessage = result.apiResponseMessages[0].message;
        this.toastr.error(validationmessage);
      }
    })
  }
}

@Injectable()
export class UploadInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url === 'saveUrl') {
      const events: Observable<HttpEvent<any>>[] = [0, 30, 60, 100].map((x) => of(<HttpProgressEvent>{
        type: HttpEventType.UploadProgress,
        loaded: x,
        total: 100
      }).pipe(delay(1000)));

      const success = of(new HttpResponse({ status: 200 })).pipe(delay(1000));
      events.push(success);

      return concat(...events);
    }
  }
}
