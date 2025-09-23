import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/internal/operators/map';
import { AuthenticationService } from "../auth/authentication.service";
import { CompanyPaymentUpsertModel } from '../models/company-payment-model';

@Component({
    selector: 'app-payments',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
    selectedIndex: any;
    showDiv: boolean = false;
    subscriptionForm: FormGroup;
    selectedPlanName: any;
    totalAmount: any = '0';
    totalNoOfActiveUsers: any = 0;
    companyMainLogo: any = "https://bviewstorage.blob.core.windows.net/6671cd0d-5b91-4044-bdcc-e1f201c086c5/projects/d72d1c2f-dfbe-4d48-9605-cd3b7e38ed17/Main-Logo-9277cc4b-0c1f-4093-a917-1a65e874b3c9.png";
    monthlyCheck: boolean = true;
    yearlyCheck: boolean = false;
    standardCostWithOutDiscount : any = 3;
    premiumCostWithOutDiscount : any = 5;
    enterpriseCostWithOutDiscount: any = 10;
    standardCost: any = 3;
    premiumCost: any = 5;
    enterpriseCost: any = 10;
    planText: any = '/mo/user';
    showAnnual : boolean = false;
    planInterval : any ;
    siteUrl: any;
    constructor(private toastr: ToastrService, private authenticationService: AuthenticationService,
        private router: Router,) { }

    ngOnInit() {
        this.totalNoOfActiveUsers = 0;
        this.clearForm();
        this.totalAmount = 0;
        this.monthlyCheck = true;
        this.planInterval = 'month';
        this.yearlyCheck = false;
        this.getActiveUsersCount();
        this.getTheme();
    }
    selectedCard(selectedCard, name) {
        this.selectedPlanName = name;
        this.clearForm();
        this.selectedIndex = selectedCard;
        this.showDiv = true;
        this.totalAmount = 0;
        this.subscriptionForm.get("noOfPurchases").patchValue(this.totalNoOfActiveUsers);
    }
    closeSubscription() {
        this.showDiv = false;
    }
    clearForm() {
        this.subscriptionForm = new FormGroup({
            noOfPurchases: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50)])),
            subscriptionType: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            cardType: new FormControl('', [Validators.required]),
            customerName: new FormControl('', [Validators.required]),
            cardHolderBillingAddress: new FormControl('', [Validators.required]),
            cardNumber: new FormControl('', [Validators.required, Validators.maxLength(20)]),
            expiryDate: new FormControl('', Validators.compose([Validators.required])),
            email: new FormControl('', Validators.compose([Validators.required])),
            cVV: new FormControl('', Validators.compose([Validators.maxLength(3), Validators.minLength(3)]),
            ),
        })
    }

    changeSubscription(value) {

    }

    cvvInput() {

    }
    getTheme() {
        this.authenticationService.getThemes().subscribe((response: any) => {
          if (response.success) {
            this.siteUrl = response.data.registrerSiteAddress;
            this.companyMainLogo=response.data.companyMainLogo;
    
          }
        });
      }
    
    costCalculation(formDirective: FormGroupDirective) {
        let data = formDirective.form.value;
        var purchases = Number(data.noOfPurchases)
        if (!isNaN(purchases) && this.totalNoOfActiveUsers > purchases) {
            this.toastr.warning("No. of purchases should be more than active users");
            return;
        }
        if (data.noOfPurchases != undefined && data.noOfPurchases != null && data.noOfPurchases != ''
            && data.subscriptionType != undefined && data.subscriptionType != null && data.subscriptionType != '' && !isNaN(purchases)) {
            var perUser = 0;
            if (this.selectedPlanName == 'Standard')
                perUser = 3;
            else if (this.selectedPlanName == 'Premium')
                perUser = 5;
            else if (this.selectedPlanName == 'Enterprise')
                perUser = 10;
            else
                perUser = 0;

            var normalTotal = perUser * Number(data.noOfPurchases);
            if (data.subscriptionType == 'month') {
                this.totalAmount = normalTotal.toFixed(2);
            }
            else if (data.subscriptionType == 'year') {
                this.totalAmount = ((normalTotal - (normalTotal * 20 / 100)) * 12).toFixed(2);
            }
            else
                this.totalAmount = 0;
        }
    }

    saveSubscription(formDirective: FormGroupDirective) {
        let data = formDirective.form.value;

        var companyPaymentUpsertModel = new CompanyPaymentUpsertModel();
        companyPaymentUpsertModel.CardHolderName = data.customerName;
        companyPaymentUpsertModel.CardNumber = data.cardNumber;
        // companyPaymentUpsertModel.CardTypeId = data.cardType;
        companyPaymentUpsertModel.CardHolderBillingAddress = data.cardHolderBillingAddress;
        companyPaymentUpsertModel.PlanName = this.selectedPlanName;
        companyPaymentUpsertModel.SubscriptionType = data.subscriptionType;
        companyPaymentUpsertModel.TotalAmount = this.totalAmount;
        companyPaymentUpsertModel.CardSecurityCode = data.cVV;
        companyPaymentUpsertModel.CardExpiryDate = data.expiryDate;
        companyPaymentUpsertModel.NoOfPurchases = data.noOfPurchases;
        companyPaymentUpsertModel.Email = data.email;
        this.authenticationService.upsertCompanyPayments(companyPaymentUpsertModel).subscribe((responseData: any) => {
            if (responseData.success == true) {
                this.clearForm();
                this.closeSubscription();
                this.toastr.success("Your subscription has been successfully completed");
            }
            else {

            }
        });
    }

    getActiveUsersCount() {
        this.authenticationService.getActiveUsersCount().subscribe((responseData: any) => {
            if (responseData.success == true) {
                this.totalNoOfActiveUsers = responseData.data;
                this.subscriptionForm.get("noOfPurchases").patchValue(this.totalNoOfActiveUsers);
            }
        });
    }

    changeEvent(plan) {
        if (plan == 'monthly') {
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
            this.standardCost = (this.standardCostWithOutDiscount -  (this.standardCostWithOutDiscount * 20 / 100)).toFixed(2);

            this.premiumCostWithOutDiscount = 5 * 12;
            this.premiumCost = (this.premiumCostWithOutDiscount - (this.premiumCostWithOutDiscount * 20 / 100)).toFixed(2);
            this.enterpriseCostWithOutDiscount = 10 * 12;
            this.enterpriseCost = (this.enterpriseCostWithOutDiscount - (this.enterpriseCostWithOutDiscount * 20 / 100)).toFixed(2);
            this.planInterval = 'year';
        }
    }

    navigateToStripePayment(planType){
        this.router.navigate(['/sessions/stripe-payments'], {
            queryParams: {
                activeUsers: this.totalNoOfActiveUsers,
                planInterval: this.planInterval,
                planType : planType
            }
        });
    }
    
}