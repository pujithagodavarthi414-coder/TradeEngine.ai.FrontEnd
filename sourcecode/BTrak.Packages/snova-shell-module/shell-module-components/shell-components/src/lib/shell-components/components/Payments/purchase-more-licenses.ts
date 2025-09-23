import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { CompanyPaymentUpsertModel } from '../../models/company-payment-model';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: "app-purchase-licenses",
  templateUrl: "./purchase-more-licenses.html"
})

export class PurchaseMoreLicensesComponent implements OnInit {

  handler: any = null;
  totalAmount: any = 0;
  isAnyOperationIsInprogress: boolean = false;
  isFromRoute: boolean = false;
  activeUsers: any = 0;
  planInterval: any;
  noOfPurchases: any;
  selectedPlanName: any;
  subscriptionType: string;
  companyMainLogo: any = "https://bviewstorage.blob.core.windows.net/6671cd0d-5b91-4044-bdcc-e1f201c086c5/projects/d72d1c2f-dfbe-4d48-9605-cd3b7e38ed17/Main-Logo-9277cc4b-0c1f-4093-a917-1a65e874b3c9.png";
  isDisable: boolean = false;
  isNewSub: boolean = false;
  spinnerType = SPINNER.pulse;
  isSucessPay: boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any
    , public dialogRef: MatDialogRef<PurchaseMoreLicensesComponent>,
    private toastr: ToastrService
    , public router: Router
    , private paymentService: PaymentService,) {
    if (data != undefined && data != null) {
      this.selectedPlanName = data.productName;
      this.subscriptionType = this.planInterval = data.subscriptionType;
      this.activeUsers = this.noOfPurchases = data.noOfPurchases;
      this.isNewSub = data.isSubscriberNew;
      this.costCalculation();
    }
  }

  ngOnInit() {

  }

  close() {
    this.dialogRef.close({ isReload: false });
  }

  costCalculation() {
    var purchases = Number(this.noOfPurchases)
    if (!isNaN(purchases) && this.activeUsers > purchases) {
      this.toastr.warning("No. of purchases should be more than previous one's");
      this.isDisable = true;
      return;
    }
    this.isDisable = false;
    if (this.noOfPurchases != undefined && this.noOfPurchases != null && this.noOfPurchases != ''
      && this.planInterval != undefined && this.planInterval != null && this.planInterval != '' && !isNaN(purchases)) {
      var perUser = 0;
      if (this.selectedPlanName == 'Standard')
        perUser = 3;
      else if (this.selectedPlanName == 'Premium')
        perUser = 5;
      else if (this.selectedPlanName == 'Enterprise')
        perUser = 10;
      else
        perUser = 0;

      var normalTotal = perUser * Number(this.noOfPurchases);
      if (this.planInterval == 'month') {
        this.totalAmount = normalTotal.toFixed(2);
      }
      else if (this.planInterval == 'year') {
        this.totalAmount = ((normalTotal - (normalTotal * 20 / 100)) * 12).toFixed(2);
      }
      else
        this.totalAmount = 0;
    }
  }
  pay() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    var service = this.paymentService;
    var purchases = this.noOfPurchases;
    var totalAmt = this.totalAmount;
    var plan = this.selectedPlanName;
    var planInterval = this.planInterval;
    var tosters = this.toastr;
    var router = this.router;
    var dailogRef = this.dialogRef;
    this.isSucessPay = true;
    var isSucessPay = this.isSucessPay;
    var handler = (<any>window).StripeCheckout.configure({
      key: environment.stripeAPIKey,
      image: 'https://bviewstorage.blob.core.windows.net/4afeb444-e826-4f95-ac41-2175e36a0c16/hrm/0b2921a9-e930-4013-9047-670b5352f308/snovasys-72112b03-95dc-432c-aeef-c89fa13eae32.png',
      locale: 'auto',
      token: function (token: any) {
        if (token) {
          var companyPaymentUpsertModel = new CompanyPaymentUpsertModel();
          companyPaymentUpsertModel.CardHolderName = token.card.name;
          companyPaymentUpsertModel.CardHolderBillingAddress = token.card.name;
          companyPaymentUpsertModel.PlanName = plan;
          companyPaymentUpsertModel.SubscriptionType = planInterval;
          companyPaymentUpsertModel.TotalAmount = totalAmt;
          companyPaymentUpsertModel.NoOfPurchases = purchases;
          companyPaymentUpsertModel.Email = token.email;
          companyPaymentUpsertModel.StripeTokenId = token.id;
          companyPaymentUpsertModel.AddressOptions = token.card;
          service.upsertCompanyPayments(companyPaymentUpsertModel).subscribe((responseData: any) => {
            if (responseData.success == true) {
              tosters.success("Your subscription has been successfully completed");
              isSucessPay = false;
              router.navigate(['/shell/Accounts']);
              dailogRef.close({ isReload: true });
            }
            else {
              tosters.error(responseData.apiResponseMessages[0].message);
              isSucessPay = false;
            }
          });
        }
      }
    });
    this.isSucessPay = isSucessPay;
    var description = this.planInterval == 'month' ? 'Monthly subscription' : 'Annual subscription'
    handler.open({
      name: this.selectedPlanName,
      description: description,
      amount: this.totalAmount * 100,
      currency: 'GBP',
      billingAddress: "true",
      shippingAddress: "false",
      closed: ()=>{this.close2();} 
    });

  }

  close2(){
    this.isSucessPay=!this.isSucessPay;
  }
}