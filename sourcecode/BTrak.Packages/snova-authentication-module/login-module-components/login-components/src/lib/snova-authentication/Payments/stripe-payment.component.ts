import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../auth/authentication.service';
import { CompanyPaymentUpsertModel } from '../models/company-payment-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Component({
    selector: 'app-stripe-payments',
    templateUrl: './stripe-payment.component.html'
})
export class StripePaymentComponent implements OnInit {
    [x: string]: any;
    handler: any = null;
    require: any
    elements: any;
    stripe: any;
    card: any;
    error: string;
    totalAmount: any = 0;
    activeUsers: any = 0;
    planInterval: any;
    noOfPurchases: any;
    selectedPlanName: any;
    companyMainLogo: any = "https://bviewstorage.blob.core.windows.net/6671cd0d-5b91-4044-bdcc-e1f201c086c5/projects/d72d1c2f-dfbe-4d48-9605-cd3b7e38ed17/Main-Logo-9277cc4b-0c1f-4093-a917-1a65e874b3c9.png";
    isDisable: boolean = false;
    siteUrl: any;
    constructor(
        private cd: ChangeDetectorRef,
        private toastr: ToastrService, private authenticationService: AuthenticationService, private param: ActivatedRoute,
        private router: Router,
    ) {

        this.param.queryParams.subscribe(routeParams => {

            if (routeParams) {
                this.planInterval = routeParams.planInterval;
                this.noOfPurchases = this.activeUsers = routeParams.activeUsers;
                this.selectedPlanName = routeParams.planType;
                this.costCalculation();
            }
        });
    }

    ngOnInit() {
        this.isDisable = false;
        this.getTheme();
    }
    getTheme() {
        this.authenticationService.getThemes().subscribe((response: any) => {
            if (response.success) {
                this.siteUrl = response.data.registrerSiteAddress;
                this.companyMainLogo = response.data.companyMainLogo;
                this.companyMiniLogo = response.data.companyMiniLogo;
                this.cdRef.detectChanges();
            }
        });
    }

    pay() {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
        var service = this.authenticationService;
        var purchases = this.noOfPurchases;
        var totalAmt = this.totalAmount;
        var plan = this.selectedPlanName;
        var planInterval = this.planInterval;
        var tosters = this.toastr;
        var router = this.router;
        var handler = (<any>window).StripeCheckout.configure({
            key: 'pk_test_51HmAScBhbYiQx04hpuuftoTzo1peYvYye4PrkJveBE7juN6U7a51kjsOpXcWMBoMCzMyE8wl2Oy65EiFVwgbv5ME00eFztBZoB',
            image: this.companyMiniLogo,
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
                            router.navigate(['/sessions/signin']);
                        }
                        else {
                            tosters.error(responseData.apiResponseMessages[0].message);
                        }
                    });
                }
            }
        });
        var description = this.planInterval == 'month' ? 'Monthly subscription' : 'Annual subscription'
        handler.open({
            name: this.selectedPlanName,
            description: description,
            amount: this.totalAmount * 100,
            currency: 'GBP',
            billingAddress: "true",
            shippingAddress: "false"
        });

    }


    ngOnDestroy() {
        if (this.card) {
            // We remove event listener here to keep memory clean
            this.card.destroy();
        }
    }

    costCalculation() {
        var purchases = Number(this.noOfPurchases)
        if (!isNaN(purchases) && this.activeUsers > purchases) {
            this.toastr.warning("No. of purchases should be more than active users");
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

}