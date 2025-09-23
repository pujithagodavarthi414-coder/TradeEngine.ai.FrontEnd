import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewChildren } from "@angular/core"
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, State } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { GRDMOdel } from "../../models/GRD-Model";
import { GridForSiteProjectionModel } from "../../models/grid-for-Sites-Projection.model";
import { SiteModel } from "../../models/site-model"
import { SiteService } from "../../services/site.service";
import { AppBaseComponent } from "../componentbase";

@Component({
    selector: "app-manage-grid-for-sites-projection",
    templateUrl: "grid-sites-projection.component.html",
    changeDetection: ChangeDetectionStrategy.Default,
    styles: [`
    @media only screen and (max-width: 1440px) {
        .site-overflow {
          max-height: 375px !important;
        }
      }
    `]
})

export class GridforSitesProjectionComponent extends AppBaseComponent implements OnInit {
    sitesModel: GridForSiteProjectionModel[] = [];
    gridForSites: GridForSiteProjectionModel[] = [];
    gridForSitesProjectionModel: GridForSiteProjectionModel;
    gridForSitesModel: GridDataResult;
    isLoading: boolean;
    isAddIsInProgress: boolean;
    isArchiveInProgress: boolean;
    gridForSiteProjectionForm: FormGroup;
    timestamp: any;
    gridForSiteProjectionId: string;
    state: State = {
        skip: 0,
        take: 10
    };
    year:Date=new Date();
    @ViewChildren("addGridForSiteProjectionPopUp") gridForSitesProjectionPopups;
    @ViewChildren("archiveGridForSiteProjectionPopup") archiveGridForSiteProjectionPopups;
    minDate: Date;
    grdModel: GRDMOdel[] = [];
    constructor(private siteService: SiteService, private toastr: ToastrService, private cdRef: ChangeDetectorRef) {
        super();
      this.getAllSites();
      this.searchGridforSitesProjection();
      this.getAllGRDs();
      this.clearForm();

    }
    ngOnInit() {
      super.ngOnInit();
    }
    getAllGRDs() {
        var sitemodel = new GRDMOdel();
        sitemodel.isArchived = false;
        this.siteService.getGRD(sitemodel).subscribe((response: any) => {
            if(response.success) {
                this.grdModel = response.data;
                this.cdRef.detectChanges();
            } else {
                this.toastr.error('', response.apiResponseMessages[0].message);
            }
        })
    }
    searchGridforSitesProjection() {
        this.state.take = 10;
        this.state.skip = 0;
        this.isLoading = true;
        var gridForSiteProjectionModel = new GridForSiteProjectionModel();
        gridForSiteProjectionModel.isArchived = false;
        this.siteService.searchGridforSitesProjection(gridForSiteProjectionModel).subscribe((response: any) => {
            this.isLoading = false;
            if(response.success) {
                this.gridForSites = response.data;
                if (this.gridForSites.length > 0) {
                    this.gridForSitesModel = {
                        data: this.gridForSites.slice(this.state.skip, this.state.take + this.state.skip),
                        total: this.gridForSites.length
                    }
                } else {
                    this.gridForSitesModel = {
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
    getAllSites() {
        var sitemodel = new SiteModel();
        sitemodel.isArchived = false;
        this.siteService.searchSite(sitemodel).subscribe((response: any) => {
            if(response.success) {
                this.sitesModel = response.data;
                this.cdRef.detectChanges();
            } else {
                this.toastr.error('', response.apiResponseMessages[0].message);
            }
        })
    }

    clearForm() {
        this.gridForSiteProjectionId = null;
        this.timestamp = null;
        this.year=new Date();
        this.gridForSiteProjectionForm = new FormGroup({
            siteId : new FormControl(null, [
                Validators.required
            ]),
            gridId : new FormControl(null, [
                Validators.required
            ]),
            startDate : new FormControl(null, [
                Validators.required
            ]),
            endDate: new FormControl(null, [
                    Validators.required]),
        })
    }

    upsertGridforSitesProjection() {
        this.isAddIsInProgress = true;
        var upsertGridForSiteProjection = new GridForSiteProjectionModel();
        upsertGridForSiteProjection = this.gridForSiteProjectionForm.value;
        upsertGridForSiteProjection.gridForSiteProjectionId = this.gridForSiteProjectionId;
        upsertGridForSiteProjection.timeStamp = this.timestamp;
        this.siteService.upsertGridforSitesProjection(upsertGridForSiteProjection).subscribe((response: any)=> {
            this.isAddIsInProgress = false;
            if(response.success) {
                this.clearForm();
                this.gridForSitesProjectionPopups.forEach((p) => { p.closePopover(); });
                this.searchGridforSitesProjection();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    closePopUp() {
        this.gridForSitesProjectionPopups.forEach((p) => { p.closePopover(); });
    }

    archiveSite() {
        this.isArchiveInProgress = true;
        var upsertGridForSiteProjection = new GridForSiteProjectionModel();
        upsertGridForSiteProjection = this.gridForSitesProjectionModel;
        upsertGridForSiteProjection.gridForSiteProjectionId = this.gridForSitesProjectionModel.gridForSiteProjectionId;
        upsertGridForSiteProjection.isArchived = true;
        this.siteService.upsertGridforSitesProjection(upsertGridForSiteProjection).subscribe((response: any)=> {
            this.isArchiveInProgress = false;
            if(response.success) {
                this.archiveGridForSiteProjectionPopups.forEach((p) => { p.closePopover(); });
                this.getAllSites();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    editSitePopUp(dataItem, sitePopUp) {
       this.gridForSiteProjectionId = dataItem.gridForSiteProjectionId;
       this.year=dataItem.startingYear;
       this.timestamp = dataItem.timeStamp;
       this.gridForSiteProjectionForm.patchValue(dataItem);
       sitePopUp.openPopover();
    }

    openSitePopUp(sitePopUp) {
      this.clearForm();
      sitePopUp.openPopover();
    }

    deleteSitePopUp(dataItem, sitePopUp) {
        this.gridForSitesProjectionModel = dataItem;
        sitePopUp.openPopover();
     }

     dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (this.state.sort) {
            this.gridForSites = orderBy(this.gridForSites, this.state.sort);
        }
        this.gridForSitesModel = {
            data: this.gridForSites .slice(this.state.skip, this.state.take + this.state.skip),
            total: this.gridForSites .length
        }
    }

    closeDeletePopup() {
        this.archiveGridForSiteProjectionPopups.forEach((p) => { p.closePopover(); });
    }

    selectedDate(event) {
        this.minDate = new Date(event);
        this.cdRef.detectChanges();
     }
}