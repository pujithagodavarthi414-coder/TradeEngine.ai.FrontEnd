import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AppBaseComponent } from "../componentbase";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { State } from "@progress/kendo-data-query";
import { KycHistoryModel } from "../../models/kyc-history.model";

@Component({
    selector: "app-billing-component-kyc-history",
    templateUrl: "client-kyc-history.component.html"
})
export class ClientKycHistoryComponent extends AppBaseComponent implements OnInit {

    isInProgress: boolean = false;
    kycHistoryList: KycHistoryModel[] = [];
    temp: KycHistoryModel[] = [];
    searchText: string;
    state: State = {
        skip: 0,
        take: 20,
    };
    isArchived: boolean = false;
    clientId: string;

    @Input("clientId")
    set _pageCount(data: any) {
        if (data) {
            this.clientId = data;
        }
    }

    constructor(private BillingDashboardService: BillingDashboardService,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService,) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        this.getAllKycHistory();
    }

    getAllKycHistory() {
        this.isInProgress = true;
        let kycHistoryModel = new KycHistoryModel();
        kycHistoryModel.isArchived = false;
        kycHistoryModel.clientId = this.clientId;
        this.BillingDashboardService.getClientKycHistory(kycHistoryModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.temp = responseData.data;
                    this.kycHistoryList = responseData.data;
                    this.isInProgress = false;
                    this.cdRef.detectChanges();
                }
                else {
                    this.isInProgress = false;
                    this.toastr.error("", responseData.apiResponseMessages[0].message);
                }
            });
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = "";
        }

        const temp = this.temp.filter(((log) =>
            (log.clientName ? log.clientName.toLowerCase().indexOf(this.searchText) > -1 : null)
            || (log.oldValue ? log.oldValue.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
            || (log.newValue ? log.newValue.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
            || (log.createdDateTime ? log.createdDateTime.toLowerCase().indexOf(this.searchText) > -1 : null)
            || (log.description ? log.description.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
            || (log.createdUser ? log.createdUser.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        ));
        this.kycHistoryList = temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }
}