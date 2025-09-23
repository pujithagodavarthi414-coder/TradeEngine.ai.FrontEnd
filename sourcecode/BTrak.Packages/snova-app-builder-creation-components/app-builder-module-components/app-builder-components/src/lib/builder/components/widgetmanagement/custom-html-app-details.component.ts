import { ChangeDetectorRef, Component, Input, ViewChild, ElementRef, TemplateRef, ViewChildren } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {  MatSnackBar } from "@angular/material/snack-bar";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { ToastrService } from "ngx-toastr";
import { CustomWidgetsModel } from "../../models/custom-widget.model";
import { MasterDataManagementService } from "../../services/master-data-management.service";
import { CreateAppDialogComponet } from "./create-app-dialog.component";
import { CustomHtmlAppModel } from "../../models/custom-html-app.model";
import { TranslateService } from "@ngx-translate/core";
import { ConstantVariables } from "../../../globaldependencies/constants/constant-variables";
declare var kendo: any;
import * as $_ from 'jquery';
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatOption } from "@angular/material/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import * as _ from "underscore";
import { WidgetService } from "../../services/widget.service";
import { UserService } from "../genericform/services/user.Service";
const $ = $_;
@Component({
    selector: "app-fm-component-custom-html-app-details",
    templateUrl: `custom-html-app-details.component.html`
})

export class CustomHtmlAppDetailsComponent extends CustomAppBaseComponent {
    commentText: any;
    shareDialog: any;
    shareDialogId: string;
    @ViewChild('shareDialogDocument') shareDialogComponent: TemplateRef<any>;
    validationMessage: any;

    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }

    @Input("widgetData") set _widgetData(data: any) {
        if (data.customWidgetId) {
            this.customWidgetId = data.customWidgetId;
            this.duplicateId = data.customWidgetId;
            this.cdRef.detectChanges();
            this.getWidgets();
        }
    }
    @ViewChild("htmlContentLoader") htmlContentLoader: ElementRef;
    @ViewChild("createAppDialogComponet") createAppDialogComponet: TemplateRef<any>;

    matData: any;
    currentDialogId: any;
    currentDialog: any;
    htmlCodeString: string = null;
    customWidgetId: string;
    duplicateId: string;
    customWidgetName: string;
    sample = true;
    fileUrls: string;
    isEditAppName = false;
    appName: string;
    changedAppName: string;
    timeStamp: any;
    roleIds: string[];
    toMailsList: string[] = [];
    selectable: boolean = true;
    sharingisinProgress:boolean=false;
    removable = true;
    toMail: string;
    count: number;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    userIds: any;
    selectedUserIds: any;
    usersList: any;
    selectedUserNames: any;
    @ViewChild("allSelected") private allSelected: MatOption;
  selectedUserEmails: any;
  sendReportForm: FormGroup;
  public initSettings = {
    plugins: 'lists advlist,wordcount,paste',
    //powerpaste_allow_local_images: true,
    //powerpaste_word_import: 'prompt',
    //powerpaste_html_import: 'prompt',
  };
  @ViewChildren("shareReportPopover") shareReportPopovers;

    constructor(
        private cdRef: ChangeDetectorRef,
        private masterDataManagementService: MasterDataManagementService,private widgetService: WidgetService,private toastr: ToastrService,
        private userService: UserService,
        private toaster: ToastrService, private dialog: MatDialog,
        private translateService: TranslateService,
        private snackbar: MatSnackBar,) {
        super();
        this.sharingisinProgress=false;
        this.initializeCustomApplicationForm();
        this.getUsersDropDown();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    editAppName() {
        this.isEditAppName = true;
        this.changedAppName = this.customWidgetName;
    }

    keyUpFunction(event) {
        if (event.keyCode == 13) {
            this.upsertCustomHtmlApp();
        }
    }


    upsertCustomHtmlApp() {
        this.cdRef.detectChanges();
        let customHtmlAppModel = new CustomHtmlAppModel();
        customHtmlAppModel.customHtmlAppName = this.changedAppName;
        customHtmlAppModel.htmlCode = this.htmlCodeString;
        customHtmlAppModel.customHtmlAppId = this.customWidgetId;
        customHtmlAppModel.timeStamp = this.timeStamp;
        customHtmlAppModel.selectedRoleIds = this.roleIds;
        customHtmlAppModel.fileUrls = this.fileUrls;
        this.masterDataManagementService.upsertCustomHtmlApp(customHtmlAppModel).subscribe((responseData: any) => {
            if (responseData.success == true) {
                this.customWidgetId = responseData.data;
                this.isEditAppName = false;
                this.snackbar.open(this.translateService.instant('APP.APPNAMEUPDATEDSUCCESSFULLY'),
                    this.translateService.instant(ConstantVariables.success), { duration: 3000 });
                this.getWidgets();
            } else {
                this.toaster.error(responseData.apiResponseMessages[0].message);
            }
        });
    }


    getWidgets() {
        const customWidgetModel = new CustomWidgetsModel();
        customWidgetModel.isArchived = false;
        customWidgetModel.customWidgetId = this.customWidgetId;
        this.masterDataManagementService.getCustomWidgets(customWidgetModel).subscribe((response: any) => {
            if (response.success === true) {
                this.htmlCodeString = response.data[0].widgetQuery;
                this.customWidgetName = response.data[0].customWidgetName;
                this.timeStamp = response.data[0].timeStamp;
                if (response.data[0].roleIds != null) {
                    this.roleIds = response.data[0].roleIds.split(",");
                }
                if (response.data[0].fileUrls) {
                    this.fileUrls = response.data[0].fileUrls;
                    this.htmlCodeString = this.htmlCodeString + '<script src="' + response.data[0].fileUrls + '"></script>';
                }
                this.loadPage();
            } else {
                this.toaster.error(response.apiResponseMessages[0].message);
            }
        });
    }

    navigateToEdit() {
        let dialogId = "create-app-dialog-componnet";
        const dialogRef = this.dialog.open(this.createAppDialogComponet, {
            width: "90vw",
            height: "90vh",
            id: dialogId,
            data: { appId: this.customWidgetId, isForHtmlApp: true, formPhysicalId: dialogId }
        });
        dialogRef.afterClosed().subscribe((isReloadRequired: boolean) => {
            if (isReloadRequired === true) {
                this.getWidgets();
                this.dialog.closeAll();
            }
        });
    }

    loadPage() {
        kendo.jQuery(this.htmlContentLoader.nativeElement).html(this.htmlCodeString);

        this.cdRef.detectChanges();
    }
    fitContent(optionalParameters: any) {
        var interval;
        var count = 0;
        if (optionalParameters['gridsterView']) {
            interval = setInterval(() => {
                try {
                    if (count > 30) {
                        clearInterval(interval);
                    }
                    count++;
                    if ($(optionalParameters['gridsterViewSelector'] + ' .html-app-height').length > 0) {
                        var appHeight = $(optionalParameters['gridsterViewSelector']).height();
                        var contentHeight = appHeight - 45;
                        $(optionalParameters['gridsterViewSelector'] + ' .html-app-height').height(contentHeight);
                        clearInterval(interval);
                    }

                } catch (err) {
                    clearInterval(interval);
                }
            }, 1000);
        }
    }
    getFileToSendReport(){
        this.SendWidgetReportEmail(".pdf",this.customWidgetName,this.htmlCodeString);
    }
    SendWidgetReportEmail(fileExtension,fileName,file){
        this.sharingisinProgress=true;
        var toEmails = this.selectedUserEmails;
        if(this.sendReportForm.value.toEmails != null && this.sendReportForm.value.toEmails !="" && this.sendReportForm.value.toEmails !=undefined){
            toEmails = (((toEmails != null && toEmails != "" && toEmails != undefined) ? toEmails+"," : "")+this.sendReportForm.value.toEmails.toString());
        }
        var toEmailsList = (toEmails!=undefined?toEmails:"").split(',');
        var reportType = "htmlReport";
        var body = this.commentText;
        var subject = this.sendReportForm.value.subject.toString();
        this.widgetService.SendWidgetReportEmail({toEmails:toEmailsList,fileExtension,fileName,file,reportType,body,subject}).subscribe((result: any) => {
            if (result.success === true) {
                this.toastr.success("Report shared successfully");
                this.sharingisinProgress=false;
                this.closeDialog();
                this.selectedUserEmails=null;
                this.toMailsList=[];
                this.cdRef.detectChanges();
            } else {
                this.validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
        });
    }
    initializeCustomApplicationForm() {
        this.sendReportForm = new FormGroup({
            userIds: new FormControl("",[]
            ),
            toEmails: new FormControl("", []),
            subject: new FormControl("", 
            Validators.compose([
                Validators.required
            ])),
            body: new FormControl("", 
            Validators.compose([
                Validators.required
            ]))
        })
    }
    removeToMailId(toMail) {
        const index = this.toMailsList.indexOf(toMail);
        if (index >= 0) {
            this.toMailsList.splice(index, 1);
        }
        if (this.toMailsList.length === 0) {
            this.count = 0;
        }
    }

    getUserlistByUserId() {
      const userids = this.sendReportForm.value.userIds;
      const index = userids.indexOf(0);
      if (index > -1) {
        userids.splice(index, 1);
      }
      this.selectedUserIds = userids;
      var usersList = this.usersList;
      if (userids && usersList && usersList.length > 0) {
        var users = _.filter(usersList, function (user) {
          return userids.toString().includes(user.id);
        });
        this.selectedUserNames = users.map(x => x.fullName).toString();
        this.selectedUserEmails = users.map(x => x.email).toString();
      }
    }
  
    toggleAllUsersSelected() {
      if (this.allSelected.selected) {
        this.sendReportForm.controls.userIds.patchValue([...this.usersList.map((item) => item.id),0]);
  
      } else {
        this.sendReportForm.controls.userIds.patchValue([]);
      }
      this.getUserlistByUserId();
    }
  
    toggleUserPerOne(all) {
      if (this.allSelected.selected) {
        this.allSelected.deselect();
        return false;
      }
      if (
        this.sendReportForm.controls.userIds.value.length ===
        this.usersList.length
      ) {
        this.allSelected.select();
      }
      this.getUserlistByUserId();
    }
    addToMailIds(event: MatChipInputEvent) {
        const inputTags = event.input;
        const mailTags = event.value.trim();
        if (mailTags != null && mailTags != "") {
            let regexpEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
            if (regexpEmail.test(mailTags)) {
                this.toMailsList.push(mailTags);
                this.count++;
            } else {
                // this.toastr.warning("", this.translateService.instant("HRMANAGAMENT.PLEASEENTERVALIDEMAIL"));
            }
        }
        if (inputTags) {
            inputTags.value = " ";
        }
    }
    getUsersDropDown() {
        this.userService.GetUsersDropDown().subscribe((result: any) => {
            if (result.success === true) {
                this.usersList = result.data;
                this.cdRef.detectChanges();
            } else {
            }

        });
    }
    
    closeDialog(){
        //   this.shareReportPopovers.forEach((p) => p.closePopover());
        if (this.shareDialog) {
            this.shareDialog.close();
            this.shareDialog.close({ success: true });
          }
          this.initializeCustomApplicationForm();
        }
        openFilterPopover() {
        //     this.gridData = grid;
        //   shareReportPopover.openPopover();
        let dialogId = "share-template-dialog";
        this.shareDialogId = dialogId;
        let id = setTimeout(() => {
          this.shareDialog = this.dialog.getDialogById(this.shareDialogId);
        }, 1200)
        const dialogRef = this.dialog.open(this.shareDialogComponent, {
          id: dialogId,
          width: "90vw",
          height: "90vh",
          maxWidth: "90vw",
          disableClose: true
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.cdRef.detectChanges();
        });
    
        }
        buttonDisabledInProgress(comments) {
    this.commentText=comments.event.target.innerHTML;
            if (this.commentText) {
              this.cdRef.detectChanges();
            }
          }

}
