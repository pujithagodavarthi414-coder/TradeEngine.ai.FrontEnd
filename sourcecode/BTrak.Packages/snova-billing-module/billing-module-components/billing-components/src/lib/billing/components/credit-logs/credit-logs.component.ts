import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AppBaseComponent } from "../componentbase";
import { BillingDashboardService } from '../../services/billing-dashboard.service';
import { CreditLogModel } from "../../models/credit-log.model";
import { State } from "@progress/kendo-data-query";

@Component({
    selector: "app-billing-component-credit-logs",
    templateUrl: "credit-logs.component.html"
})
export class CreditLogsListComponent extends AppBaseComponent implements OnInit {

    isInProgress: boolean = false;
    logsList: CreditLogModel[] = [];
    temp: CreditLogModel[] = [];
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
        this.getAllCreditLogs();
    }

    getAllCreditLogs() {
        this.isInProgress = true;
        let creditLogModel = new CreditLogModel();
        creditLogModel.isArchived = false;
        creditLogModel.clientId = this.clientId;
        this.BillingDashboardService.getAllCreditLogs(creditLogModel)
            .subscribe((responseData: any) => {
                if (responseData.success) {
                    this.temp = responseData.data;
                    this.logsList = responseData.data;
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
            || (log.oldCreditLimit ? log.oldCreditLimit.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
            || (log.newCreditLimit ? log.newCreditLimit.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
            || (log.oldAvailableCreditLimit ? log.oldAvailableCreditLimit.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
            || (log.newAvailableCreditLimit ? log.newAvailableCreditLimit.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
            || (log.createdDateTime ? log.createdDateTime.toLowerCase().indexOf(this.searchText) > -1 : null)
            || (log.amount ? log.amount.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
            || (log.description ? log.description.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
            || (log.createdUser ? log.createdUser.toString().toLowerCase().indexOf(this.searchText) > -1 : null)
        ));
        this.logsList = temp;
    }

    closeSearch() {
        this.searchText = ""
        this.filterByName(null);
    }
}