import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { PaymentService } from '../../services/payment.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatOption } from "@angular/material/core";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { PurchaseMoreLicensesComponent } from './purchase-more-licenses';

@Component({
    selector: 'app-company-plans',
    templateUrl: './company-plans.component.html',
    styleUrls: ['./company-plans.component.css']
})
export class CompanyPlansComponent implements OnInit {
    selectedIndex: any = 1;
    subscriptionForm: FormGroup;
    selectedPlanName: any;
    totalAmount: any = '0';
    totalNoOfActiveUsers: any = 0;
    companyMainLogo: any = "https://bviewstorage.blob.core.windows.net/6671cd0d-5b91-4044-bdcc-e1f201c086c5/projects/d72d1c2f-dfbe-4d48-9605-cd3b7e38ed17/Main-Logo-9277cc4b-0c1f-4093-a917-1a65e874b3c9.png";
    monthlyCheck: boolean = true;
    yearlyCheck: boolean = false;
    standardCostWithOutDiscount: any = 3;
    premiumCostWithOutDiscount: any = 5;
    enterpriseCostWithOutDiscount: any = 10;
    standardCost: any = 3;
    premiumCost: any = 5;
    enterpriseCost: any = 10;
    planText: any = '/mo/user';
    showAnnual: boolean = false;
    planInterval: any;
    isLoggedInUser: boolean = false;
    subscriptionType : any;
    isCancelled : boolean;
    renewalDate : any;
    noOfPurchases : any;
    isShowCurrentPlan : any;
    constructor(private toastr: ToastrService,
        private router: Router,
        private cookieService: CookieService
        ,private paymentService: PaymentService,
        public dialog: MatDialog,) { }

    ngOnInit() {
        this.totalNoOfActiveUsers = 0;
        this.totalAmount = 0;
        this.monthlyCheck = true;
        this.planInterval = 'month';
        this.yearlyCheck = false;
        this.getPurchasedLicensesCount();
        this.getActiveUsersCount();
    }
    
    changeEvent(plan) {
        if(this.subscriptionType == "year" && plan == 'month' && this.isShowCurrentPlan){
            this.toastr.warning("Changing the requested subscription is not allowed for this account at this time. Please contact support (0044-7944144944) to discuss further.");
            this.monthlyCheck = this.subscriptionType == "month";
            this.yearlyCheck = this.subscriptionType == "year";;
            return;
        }
        if (plan == 'month') {
            this.showAnnual = false;
            this.monthlyCheck = true;
            this.yearlyCheck = false;
            this.planText = '/mo/user';
            this.standardCost = 3;
            this.premiumCost = 5;
            this.enterpriseCost = 10;
            this.planInterval = 'month';
        }
        else {
            this.showAnnual = true;
            this.monthlyCheck = false;
            this.yearlyCheck = true;
            this.planText = '/yr/user';
            this.standardCostWithOutDiscount = 3 * 12;
            this.standardCost = (this.standardCostWithOutDiscount - (this.standardCostWithOutDiscount * 20 / 100)).toFixed(2);

            this.premiumCostWithOutDiscount = 5 * 12;
            this.premiumCost = (this.premiumCostWithOutDiscount - (this.premiumCostWithOutDiscount * 20 / 100)).toFixed(2);
            this.enterpriseCostWithOutDiscount = 10 * 12;
            this.enterpriseCost = (this.enterpriseCostWithOutDiscount - (this.enterpriseCostWithOutDiscount * 20 / 100)).toFixed(2);
            this.planInterval = 'year';
        }
    }
    getPurchasedLicensesCount() {
        this.paymentService.getPurchasedLicensesCount().subscribe((responseData: any) => {
            if (responseData.success == true) {
                if(responseData.data)
                {
                  this.noOfPurchases = responseData.data.purchasedLicensesCount;
                  this.selectedPlanName = responseData.data.purchaseType;
                  this.renewalDate = responseData.data.renewalDate;
                  this.isCancelled = responseData.data.isCancelled;
                  this.planInterval = this.subscriptionType = responseData.data.subscriptionType;
                  if(this.selectedPlanName == "Standard")
                    this.selectedIndex = 1;
                 else if(this.selectedPlanName == "Premium")
                    this.selectedIndex = 2;
                 else if(this.selectedPlanName == "Enterprise")
                    this.selectedIndex = 3;
                 
                  this.isShowCurrentPlan = responseData.data.isShowCurrentPlan;
                  if(this.isShowCurrentPlan){
                    this.yearlyCheck = this.planInterval =='year';
                    this.changeEvent(this.planInterval);
                  }
                }
              
            }
        });
      }

      subscription(newPlanName,index){
        if(this.selectedIndex > index && this.isShowCurrentPlan)
            this.toastr.warning("Changing the requested subscription is not allowed for this account at this time. Please contact support (0044-7944144944) to discuss further.");
        else{
            this.purchaseMoreLicenses(newPlanName);
        }
      }

      purchaseMoreLicenses(newPlanName) {
        const dialogRef = this.dialog.open(PurchaseMoreLicensesComponent, {
          height: "45%",
          width: "28%",
          hasBackdrop: true,
          direction: "ltr",
          data: { noOfPurchases: ((this.noOfPurchases == null || this.noOfPurchases == undefined ) ? this.totalNoOfActiveUsers : this.noOfPurchases), productName: newPlanName , subscriptionType: this.planInterval,isSubscriberNew:true},
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(() => {
          console.log("The dialog was closed");
        });
      }
      getActiveUsersCount() {
        this.paymentService.getActiveUsersCount().subscribe((responseData: any) => {
          if (responseData.success == true) {
            this.totalNoOfActiveUsers = responseData.data;
          }
        });
      }
}