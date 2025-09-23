import { Component, OnInit, Inject, ViewChild, ViewChildren } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatOption } from "@angular/material/core";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { PaymentService } from '../../services/payment.service';
import { PurchaseMoreLicensesComponent } from './purchase-more-licenses';

@Component({
  selector: "app-product-services-component",
  templateUrl: "./product-service.component.html"
})

export class ProductAndServicesComponent implements OnInit {


  selectedTab: string;
  selectedTabIndex: number;
  paymentDetails: any;
  isSubscriptionCancel: boolean = false;
  isAnyOperationIsInprogress: boolean = false;
  isFromRoute: boolean = false;
  totalNoOfActiveUsers: any = 0;
  totalNoOfPurchases: any = 0;
  isShowRenewal: boolean = false;
  productName: string = "Snovasys";
  isTrailValid: boolean = true;
  noOfDays: any = 0;
  company: any;
  renewalDate: any;
  isCancelled: boolean;
  subscriptionType: any;
  isLoading: boolean = true;
  paymentHistory : any;
  @ViewChildren("closeBookingPopup") closeBookingPopup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService
    , private paymentService: PaymentService
    , public router: Router
    , private cookieService: CookieService,
    public dialog: MatDialog,) {

  }

  ngOnInit() {
    if (this.cookieService.check(LocalStorageProperties.CompanyDetails) && this.cookieService.check(LocalStorageProperties.CompanyId)) {
      this.company = JSON.parse(this.cookieService.get(LocalStorageProperties.CompanyDetails));
      this.noOfDays = this.company != null && this.company != undefined ? this.company.trailDays : 0;
    }
    this.getActiveUsersCount();
    this.getPurchasedLicensesCount();
    this.getPaymentHistory();
  }

  cancelSubscription() {
    this.paymentService.cancelSubscription().subscribe((responseData: any) => {
      if (responseData.success == true) {
        this.toastr.success("Your subscription has been cancelled successfully");
        this.isSubscriptionCancel = true;
        setTimeout(()=>{
          this.getPurchasedLicensesCount();
          this.getPaymentHistory();
     }, 2000);
       
      }
      else {
        this.toastr.error(responseData.apiResponseMessages[0].message);
        this.isSubscriptionCancel = false;
      }
    });
  }
  getActiveUsersCount() {
    this.paymentService.getActiveUsersCount().subscribe((responseData: any) => {
      if (responseData.success == true) {
        this.totalNoOfActiveUsers = responseData.data;
      }
    });
  }

  getPurchasedLicensesCount() {
    this.isLoading = true;
    this.paymentService.getPurchasedLicensesCount().subscribe((responseData: any) => {
      if (responseData.success == true) {
        if (responseData.data) {
          this.totalNoOfPurchases = responseData.data.purchasedLicensesCount;
          this.isShowRenewal = responseData.data.isShowRenewal;
          this.productName = responseData.data.purchaseType;
          this.isTrailValid = false;
          this.renewalDate = responseData.data.renewalDate;
          this.isCancelled = responseData.data.isCancelled;
          this.subscriptionType = responseData.data.subscriptionType;
        }
        else {
          this.isTrailValid = true;
        }
      }
      this.isLoading = false;
    });
  }

  navigateToSubscription() {
    this.router.navigate(["/shell/payments-plans"]);
  }

  purchaseMoreLicenses() {
    const dialogRef = this.dialog.open(PurchaseMoreLicensesComponent, {
      height: "45%",
      width: "28%",
      hasBackdrop: true,
      direction: "ltr",
      data: { noOfPurchases: this.totalNoOfPurchases, productName: this.productName, subscriptionType: this.subscriptionType },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result !=undefined && result.isReload == true){
        this.getPaymentHistory();
        this.getPurchasedLicensesCount();
      }
    });
  }
  navigateToPlans() {
    this.router.navigate(["/shell/payments-plans"]);
  }
  getPaymentHistory(){
    this.paymentService.getPaymentHistory().subscribe((responseData: any) => {
      if (responseData.success == true) {
        this.paymentHistory = responseData.data
      }
      else {
        this.toastr.error(responseData.apiResponseMessages[0].message);
      }
    });
  }
  openpop(closeBookingPopup) {
    closeBookingPopup.openPopover();
  }
  close() {
    this.closeBookingPopup.forEach((p) => p.closePopover());
}

}
