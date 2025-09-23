import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { CustomApplication } from "../models/custom-application.model";
import { CookieService } from "ngx-cookie-service";
import { forkJoin, Subject } from "rxjs";
import { GenericFormService } from '../services/generic-form.service';
import { LocalStorageProperties } from '../../../../globaldependencies/constants/localstorage-properties';
import { GenericFormSubmitted } from '../models/generic-form-submitted.model';
import { ApplicationDialogComponent } from './application-dialog.component';
import { UserService } from "../services/user.Service";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-application",
    templateUrl: "./application.component.html"
})

export class ApplicationComponent implements OnInit {
    @ViewChild('formio') formio;

    applicationName: string;
    genericFormName: string;
    id: string;
    validationMessage: string;
    genericFormSubmittedId: string = null;
    isFormReady: boolean = false;
    submittedData: any;
    applicationId: string;
    formObject: any;
    public basicForm = {
        components: [
            {
                input: true,
                tableView: true,
                inputType: "text",
                inputMask: "",
                label: "Text Field",
                key: "textField",
                placeholder: "",
                prefix: "",
                suffix: "",
                multiple: false,
                defaultValue: "",
                protected: false,
                unique: false,
                persistent: true,
                validate: {
                    required: false,
                    minLength: "",
                    maxLength: "",
                    pattern: "",
                    custom: "",
                    customPrivate: false
                },
                conditional: {
                    show: false,
                    when: null,
                    eq: ""
                },
                type: "textfield",
                $$hashKey: "object:249",
                autofocus: false,
                hidden: false,
                clearOnHide: true,
                spellcheck: true
            }
        ]
    };
    formSrc: any;
    themeModel: any;
    tempFormSrc: any;
    uniqueNumber: string;
    publicMessage: string;
    viewFinal: boolean = false;
    disableFormSubmit: boolean = false;
    companyMainLogo: string = 'assets/images/Main-Logo.png';
    formData: any;
    public ngDestroyed$ = new Subject();

    constructor(public route: Router, private router: ActivatedRoute, private  userService: UserService,
        private cookieService: CookieService, private genericFormService: GenericFormService, private toastr: ToastrService,
        private dialog: MatDialog, private cdRef: ChangeDetectorRef) {
        this.router.params.subscribe(routeParams => {
            this.applicationName = routeParams.name;
            this.genericFormName = routeParams.formname;
            if(routeParams.id){
                this.id = routeParams.id;
            }
        });
    }

    ngOnInit() {
        this.loadApplicationForm();
        this.formObject = Object.assign({}, this.basicForm);
    }

    loadApplicationForm() {
        let customApplication = new CustomApplication();
        customApplication.customApplicationName = this.applicationName;
        customApplication.genericFormName = this.genericFormName;
        this.genericFormService.getPublicCustomApplication(customApplication)
            .subscribe((response: any) => {
                if (response.success) {
                    let data = response.data;
                    this.applicationId = data.customApplicationId;
                    if(this.id){
                        this.getDropDownLists(data);
                    } else {
                        this.formSrc = JSON.parse(data.formJson);
                        this.tempFormSrc = JSON.parse(data.formJson);
                        this.publicMessage = data.publicMessage;
                    }
                }
            });

        if (this.cookieService.get(LocalStorageProperties.CompanyMainLogo) && this.cookieService.get(LocalStorageProperties.CompanyMainLogo) != "") {
            this.companyMainLogo = this.cookieService.get(LocalStorageProperties.CompanyMainLogo);
        }
    }

    closePopup() {
        this.formSrc = Object.assign({}, this.tempFormSrc);
    }

    onChangeNew() {
        if (this.isFormReady == true) {
            if (this.disableFormSubmit == false) {
                this.createAStatusReport(false)
            }
        } else {
            this.isFormReady = true;
        }
    }

    onChangeNewCustom(event) {
        // if (this.isFormReady == true) {
        //     if (this.disableFormSubmit == false) {
        //         this.createAStatusReport(false)
        //     }
        // } else {
        //     this.isFormReady = true;
        // }
    }

    onSubmit() {
        this.createAStatusReport(true);
        if(this.id){
            this.registerCandidate();
        }
    }

    onSubmitCustom(data) {
        this.submittedData = data.detail;
        this.createAStatusReport(true);
        if(this.id){
            this.registerCandidate();
        }
    }

    createAStatusReport(isFinalSubmit) {
        this.disableFormSubmit = true;
        // this.submittedData = this.formio.formio.data;
        let genericForm = new GenericFormSubmitted();
        genericForm.formJson = JSON.stringify(this.submittedData);
        genericForm.publicFormId = this.applicationId;
        if (this.genericFormSubmittedId) {
            genericForm.genericFormSubmittedId = this.genericFormSubmittedId;
        }
        genericForm.isFinalSubmit = isFinalSubmit;
        this.genericFormService.submitPublicGenericApplication(genericForm).subscribe((result: any) => {
            if (result.success == true) {
                if (isFinalSubmit && result.data.length < 34 && !this.id) {
                    this.uniqueNumber = result.data;
                    const dialogRef = this.dialog.open(ApplicationDialogComponent, {
                        height: '20%',
                        hasBackdrop: true,
                        direction: 'ltr',
                        data: { publicMessage: this.publicMessage, uniqueNumber: this.uniqueNumber },
                        disableClose: true,
                        panelClass: 'registered-successfully'
                    });
                    dialogRef.afterClosed().subscribe(() => {
                        this.viewFinal = true;
                        this.disableFormSubmit = false;
                        this.cdRef.markForCheck();
                    });
                    this.genericFormSubmittedId = null;
                } else {
                    if(!this.id) {
                        this.genericFormSubmittedId = result.data;
                        this.disableFormSubmit = false;
                    }
                }
                this.disableFormSubmit = false;
                this.cdRef.detectChanges();
            }
        })
    }

    goToSubmitView() {
        this.formSrc = Object.assign({}, JSON.parse(JSON.stringify(this.tempFormSrc)));
        this.formData = {};
        this.viewFinal = false;
        this.cdRef.markForCheck();
    }

    getDropDownLists(data: any){
        let designation = this.userService.getDropDownLists({ JobOpeningId: this.id, Type: "designation" });
        let state = this.userService.getDropDownLists({ JobOpeningId: this.id, Type: "state" });
        let country = this.userService.getDropDownLists({ JobOpeningId: this.id, Type: "country" });
        let skills = this.userService.getDropDownLists({ JobOpeningId: this.id, Type: "skills" });
        let documents = this.userService.getDropDownLists({ JobOpeningId: this.id, Type: "documents" });
        forkJoin([designation, state, country, skills, documents]).subscribe(results => {
            var parsedData = JSON.parse(data.formJson);
           if(results[0]["success"] == true) {
            var designationList = results[0]["data"];
            parsedData.components[0].columns[0].components[4].data.values.splice(0,1);
            designationList.forEach(x => {
                parsedData.components[0].columns[0].components[4].data.values.push({label: x.designationName,value: x.designationId}); 
            });
           } else {
            this.validationMessage = results[0]["apiResponseMessages"][0].message;
            this.toastr.warning("", this.validationMessage);
           }

           if(results[1]["success"] == true){
            var stateList = results[1]["data"];
            parsedData.components[1].columns[0].components[1].data.values.splice(0,1);
            stateList.forEach(x => {
                parsedData.components[1].columns[0].components[1].data.values.push({label: x.stateName,value: x.stateId});  
            });
           } else {
            this.validationMessage = results[1]["apiResponseMessages"][0].message;
            this.toastr.warning("", this.validationMessage);
           }

           if(results[2]["success"] == true){
            var countryList = results[2]["data"];
            parsedData.components[1].columns[1].components[1].data.values.splice(0,1);
            countryList.forEach(x => {
                parsedData.components[1].columns[1].components[1].data.values.push({label: x.countryName,value: x.countryId});  
            });
           } else {
            this.validationMessage = results[2]["apiResponseMessages"][0].message;
            this.toastr.warning("", this.validationMessage);
           }

           if(results[3]["success"] == true){
               var skillList = results[3]["data"];
               parsedData.components[4].components[0].data.values.splice(0,1);
               skillList.forEach(x => {
                parsedData.components[4].components[0].data.values.push({label: x.skillName,value: x.skillId});
               });
           } else {
            this.validationMessage = results[3]["apiResponseMessages"][0].message;
            this.toastr.warning("", this.validationMessage);
           }

           if(results[4]["success"] == true){
                var documentList = results[4]["data"];
                parsedData.components[5].components[2].data.values.splice(0,1);
                documentList.forEach(x => {
                    parsedData.components[5].components[2].data.values.push({label: x.documentTypeName,value: x.documentTypeId});
                });
            } else {
                this.validationMessage = results[4]["apiResponseMessages"][0].message;
                this.toastr.warning("", this.validationMessage);
            }
            parsedData.components[5].components[3].url = window.location.protocol + "//" + window.location.hostname+"/backend/File/FileApi/UploadFileForRecruitment?moduleTypeId="+15+"&jobOpeningId="+this.id;
            parsedData.components[5].components[3].options = "";

            parsedData.components[6].url = window.location.protocol + "//" + window.location.hostname+"/backend/File/FileApi/UploadFileForRecruitment?moduleTypeId="+15+"&jobOpeningId="+this.id;
            parsedData.components[6].options = "";
           
            this.formSrc = parsedData;
            this.tempFormSrc = parsedData;
            this.publicMessage = data.publicMessage;
        });
    }

    registerCandidate(){
        this.submittedData = this.formio.formio.data;
        let genericForm = new GenericFormSubmitted();
        genericForm.formJson = JSON.stringify(this.submittedData);
        genericForm.publicFormId = this.applicationId;
        genericForm.genericFormSubmittedId = this.id;
        this.userService.upsertCandidateFormSubmitted(genericForm).subscribe((result: any) => {
            if(result.success){
                this.uniqueNumber = result.data;
                    const dialogRef = this.dialog.open(ApplicationDialogComponent, {
                        height: '20%',
                        hasBackdrop: true,
                        direction: 'ltr',
                        data: { publicMessage: this.publicMessage, uniqueNumber: this.uniqueNumber },
                        disableClose: true,
                        panelClass: 'registered-successfully'
                    });
                    dialogRef.afterClosed().subscribe(() => {
                        this.viewFinal = true;
                        this.disableFormSubmit = false;
                        this.cdRef.markForCheck();
                    });
                    this.genericFormSubmittedId = null;
            } else {

            }
        });
    }   
}