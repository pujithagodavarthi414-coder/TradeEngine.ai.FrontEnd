import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren } from "@angular/core"
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { SiteModel } from "../../models/site-model"
import { SiteService } from "../../services/site.service";
import { AppBaseComponent } from "../componentbase";

@Component({
    selector: "app-manage-sites",
    templateUrl: "site.component.html",
    changeDetection: ChangeDetectionStrategy.Default,
    styles: [`
    @media only screen and (max-width: 1440px) {
        .site-overflow {
          max-height: 375px !important;
        }
      }
    `]
})

export class SitesComponent extends AppBaseComponent implements OnInit {
    sitesModel: SiteModel[] = [];
    archiveSiteModel: SiteModel;
    siteModel: GridDataResult;
    isLoading: boolean;
    isAddIsInProgress: boolean;
    isArchiveInProgress: boolean;
    siteForm: FormGroup;
    timestamp: any;
    siteId: string;
    state: State = {
        skip: 0,
        take: 10
    };
    year:Date=new Date();
    @ViewChildren("addSitePopUp") sitePopups;
    @ViewChildren("archiveSitePopUp") archiveSitePopups;
    minDate: Date;
    constructor(private siteService: SiteService, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        super();
      this.getAllSites();
      this.clearForm();

    }
    ngOnInit() {
      super.ngOnInit();
    }

    getAllSites() {
        this.state.take = 10;
        this.state.skip = 0;
        this.isLoading = true;
        var sitemodel = new SiteModel();
        sitemodel.isArchived = false;
        this.siteService.searchSite(sitemodel).subscribe((response: any) => {
            this.isLoading = false;
            if(response.success) {
                this.sitesModel = response.data;
                if (this.sitesModel.length > 0) {
                    this.siteModel = {
                        data: this.sitesModel.slice(this.state.skip, this.state.take + this.state.skip),
                        total: this.sitesModel.length
                    }
                } else {
                    this.siteModel = {
                        data: [],
                        total: 0
                    }
                }
                this.cdRef.detectChanges();
            } else {
                this.toastr.error('', response.apiResponseMessages[0].message);
            }
        })
    }

    clearForm() {
        this.siteId = null;
        this.timestamp = null;
        this.year=new Date();
        this.siteForm = new FormGroup({
            name : new FormControl("", [
                Validators.required,
                Validators.maxLength(250)
            ]),
            email: new FormControl("", [
                Validators.required,
                Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
                Validators.maxLength(50)
            ]),
            address: new FormControl("", []),
            addressee: new FormControl("", []),
            autoCTariff: new FormControl("", []),
            roofRentalAddress: new FormControl("", [
                Validators.required,
                Validators.maxLength(250)]),
            date: new FormControl(null, [
                Validators.required]),
            parcellNo: new FormControl("", [
                Validators.required,
                Validators.maxLength(250)]),
            m2: new FormControl(null, [
                Validators.required,Validators.max(9999999999)]),
            chf: new FormControl(null, [
                Validators.required,Validators.max(9999999999)]),
            term: new FormControl(null, [
                Validators.required,Validators.max(9999999999)]),
            muncipallity: new FormControl("", [
                Validators.required,
                Validators.maxLength(250)]),
            canton: new FormControl("", [
                Validators.required,
                Validators.maxLength(250)]),
            startingYear: new FormControl(null, [
                    Validators.required]),
            productionFirstYear: new FormControl(null, [
                Validators.required,Validators.max(9999999999)]),
            autoCExpected: new FormControl(null, [
                Validators.required,Validators.max(9999999999)]),
            annualReduction: new FormControl(null, [
                     Validators.required,Validators.max(9999999999)]),
            repriceExpected: new FormControl(null, [
                                    Validators.required,Validators.max(9999999999)]),
        })
    }

    upsertSite() {
        this.isAddIsInProgress = true;
        var upsertSitemodel = new SiteModel();
        upsertSitemodel = this.siteForm.value;
        upsertSitemodel.id = this.siteId;
        upsertSitemodel.timeStamp = this.timestamp;
        this.siteService.upsertSite(upsertSitemodel).subscribe((response: any)=> {
            this.isAddIsInProgress = false;
            if(response.success) {
                this.clearForm();
                this.sitePopups.forEach((p) => { p.closePopover(); });
                this.getAllSites();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    closePopUp() {
        this.sitePopups.forEach((p) => { p.closePopover(); });
    }

    archiveSite() {
        this.isArchiveInProgress = true;
        var upsertSitemodel = new SiteModel();
        upsertSitemodel = this.archiveSiteModel;
        upsertSitemodel.id = this.archiveSiteModel.siteId;
        upsertSitemodel.isArchived = true;
        this.siteService.upsertSite(upsertSitemodel).subscribe((response: any)=> {
            this.isArchiveInProgress = false;
            if(response.success) {
                this.archiveSitePopups.forEach((p) => { p.closePopover(); });
                this.getAllSites();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    editSitePopUp(dataItem, sitePopUp) {
       this.siteId = dataItem.siteId;
       this.year=dataItem.startingYear;
       this.timestamp = dataItem.timeStamp;
       this.siteForm.patchValue(dataItem);
       sitePopUp.openPopover();
    }

    openSitePopUp(sitePopUp) {
      this.clearForm();
      sitePopUp.openPopover();
      this.siteForm.get('startingYear').patchValue(this.year);
    }

    deleteSitePopUp(dataItem, sitePopUp) {
        this.archiveSiteModel = dataItem;
        sitePopUp.openPopover();
     }

     dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort) {
            this.sitesModel = orderBy(this.sitesModel, this.state.sort);
        }
        this.siteModel = {
            data: this.sitesModel .slice(this.state.skip, this.state.take + this.state.skip),
            total: this.sitesModel .length
        }
    }

    closeDeletePopup() {
        this.archiveSitePopups.forEach((p) => { p.closePopover(); });
    }

    downloadPdf() {
        this.siteService.downloadPdf().subscribe((response: any)=> {
            if(response.success) {
                console.log(response.data);
            }
        })
    }

    selectedDate(event) {
        this.minDate = new Date(event);
        this.cdRef.detectChanges();
     }
     numberOnlyWithVal(event, value) {

        const charCode = (event.which || event.dot) ? event.which : event.keyCode;
    
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
          if (charCode == 46 && value.toString().includes(".") == false) {
            return true;
          }
          return false;
        }
    
        return true;
    
      }

      
    yearEmitHandled(value) {
        this.siteForm.get('startingYear').patchValue(value);
    }
}