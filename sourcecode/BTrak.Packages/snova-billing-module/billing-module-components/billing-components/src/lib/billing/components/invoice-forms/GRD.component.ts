import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren } from "@angular/core"
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { GRDMOdel } from "../../models/GRD-Model";
import { SiteService } from "../../services/site.service";
import { AppBaseComponent } from "../componentbase";

@Component({
    selector: "app-manage-GRDS",
    templateUrl: "GRD.component.html",
    changeDetection: ChangeDetectionStrategy.Default
})

export class GRDComponent extends AppBaseComponent implements OnInit {
    @ViewChildren("addSitePopUp") grdPopUps;
    @ViewChildren("archiveSitePopUp") archiveGRDPopUpS
    isLoading: boolean;
    grdModel: GRDMOdel[] = [];
    grdModelList: GridDataResult;
    archiveGRDMOdel: GRDMOdel;
    state: State = {
        skip: 0,
        take: 10
    };
    grdId: string;
    timestamp: any;
    grdForm: FormGroup;
    isAddIsInProgress: boolean;
    isArchiveInProgress: boolean;
    minDate: any;

    constructor(private siteService : SiteService, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        super();
      this.getAllGRDs();
      this.clearForm();
    }
    ngOnInit() {
     super.ngOnInit();
    }

    getAllGRDs() {
        this.isLoading = true;
        var sitemodel = new GRDMOdel();
        sitemodel.isArchived = false;
        this.siteService.getGRD(sitemodel).subscribe((response: any) => {
            this.isLoading = false;
            if(response.success) {
                this.grdModel = response.data;
                if (this.grdModel.length > 0) {
                    this.grdModelList = {
                        data: this.grdModel.slice(this.state.skip, this.state.take + this.state.skip),
                        total: this.grdModel.length
                    }
                } else {
                    this.grdModelList = {
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
        this.grdId = null;
        this.timestamp = null;
        this.grdForm = new FormGroup({
            name : new FormControl("", [
                Validators.required,
                Validators.maxLength(250)
            ]),
            repriseTariff: new FormControl("", [
            ]),
            startDate: new FormControl("", [Validators.required]),
            endDate: new FormControl("", [Validators.required])
        })
    }

    upsertSite() {
        this.isAddIsInProgress = true;
        var upsertSitemodel = new GRDMOdel();
        upsertSitemodel = this.grdForm.value;
        upsertSitemodel.id = this.grdId;
        upsertSitemodel.timeStamp = this.timestamp;
        this.siteService.upsertGRD(upsertSitemodel).subscribe((response: any)=> {
            this.isAddIsInProgress = false;
            if(response.success) {
                this.clearForm();
                this.grdPopUps.forEach((p) => { p.closePopover(); });
                this.getAllGRDs();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
            this.cdRef.detectChanges();
        })
    }

    archiveSite() {
        this.isArchiveInProgress = true;
        var upsertSitemodel = new GRDMOdel();
        upsertSitemodel = this.archiveGRDMOdel;
        upsertSitemodel.isArchived = true;
        this.siteService.upsertGRD(upsertSitemodel).subscribe((response: any)=> {
            this.isArchiveInProgress = false;
            if(response.success) {
                this.archiveGRDPopUpS.forEach((p) => { p.closePopover(); });
                this.getAllGRDs();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    editSitePopUp(dataItem, sitePopUp) {
       this.grdId = dataItem.id;
       this.timestamp = dataItem.timeStamp;
       this.grdForm.patchValue(dataItem);
       sitePopUp.openPopover();
    }

    openSitePopUp(sitePopUp) {
      this.clearForm();
      sitePopUp.openPopover();
    }

    deleteSitePopUp(dataItem, sitePopUp) {
        this.archiveGRDMOdel = dataItem;
        sitePopUp.openPopover();
     }

     dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort) {
            this.grdModel = orderBy(this.grdModel, this.state.sort);
        }
        this.grdModelList = {
            data: this.grdModel.slice(this.state.skip, this.state.take + this.state.skip),
            total: this.grdModel.length
        }
    }

    closeDeletePopup() {
        this.archiveGRDPopUpS.forEach((p) => { p.closePopover(); });
    }
    closePopUp() {
        this.grdPopUps.forEach((p) => { p.closePopover(); });
    }

    selectedDate(event) {
       this.minDate = new Date(event);
       this.cdRef.detectChanges();
    }
}