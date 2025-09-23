import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { LeadSubmissionDetails } from "../../models/lead-submissions.model";
import { ScoModel } from "../../models/sco-model";
import { BillingDashboardService } from '../../services/billing-dashboard.service';

@Component({
    selector: "app-billing-component-sco-decision",
    templateUrl: "sco-decision.component.html"
})

export class ScoDecisionComponent {
    comments: string = null;
    isRequired: boolean;
    leadSubmissionId: string;
    scoId: string=null;
    loadingIndicator: boolean = false;
    leadSubmissionDetails: any;
    scoAccept: boolean;
    placeHolder: string;
    canSubmit: boolean = false;
    submitLoadingIndicator: boolean = false;
    submittedMsg: string;
    form: any = { components: [] };
    formData: any = { data: {} };
    readOnly: boolean = true;

    constructor(public routes: Router,
        private BillingDashboardService: BillingDashboardService,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService,
        private route: ActivatedRoute, private translateService: TranslateService) {
        this.route.params.subscribe(routeParams => {
            if (routeParams.id) {
                this.leadSubmissionId = routeParams.id;
            }
            else if (routeParams.id1 && routeParams.id2) {
                this.leadSubmissionId = routeParams.id1;
                this.scoId = routeParams.id2;
            }
        })
        if (this.routes.url.includes('scoAccept')) {
            this.scoAccept = true;
            this.isRequired = false;
            this.placeHolder = "Enter comments";
        }
        if (this.routes.url.includes('scoReject')) {
            this.scoAccept = false;
            this.isRequired = true;
            this.placeHolder = "Enter comments for rejection";
        }
    }

    ngOnInit() {
        this.getLeadSubmissions();
    }

    submitComments(isAccept) {
        let leadSubmission = new LeadSubmissionDetails();
        leadSubmission.leadFormId = this.leadSubmissionDetails[0].leadSubmissionId;
        leadSubmission.clientId = this.leadSubmissionDetails[0].clientId;
        leadSubmission.companyId = this.leadSubmissionDetails[0].companyId;
        leadSubmission.userId = this.leadSubmissionDetails[0].userId;
        leadSubmission.createdDateTime = this.leadSubmissionDetails[0].createdDateTime;
        leadSubmission.fullName = this.leadSubmissionDetails[0].buyerName;
        leadSubmission.isScoAccepted = isAccept;
        leadSubmission.comments = this.comments;
        leadSubmission.email = this.leadSubmissionDetails[0].email;
        leadSubmission.companyName = this.leadSubmissionDetails[0].companyName;
        leadSubmission.scoId = this.scoId;
        if (!isAccept && !this.comments) {
            this.toastr.error("", "Comments are required to reject the sco");
            return;
        }
        this.submitLoadingIndicator = true;
        this.BillingDashboardService.UpsertSCOStatus(leadSubmission)
            .subscribe((responseData: any) => {
                let formId = responseData.data;
                if (formId) {
                    //this.submittedMsg = "Your response is submitted successfully";
                    this.submittedMsg = "Thank You for your response";
                    this.canSubmit = false
                }
                this.submitLoadingIndicator = false;
                this.cdRef.detectChanges();
            });
    }


    getLeadSubmissions() {
        let leadSubmissionDetails = new ScoModel();
        leadSubmissionDetails.leadSubmissionId = this.leadSubmissionId;
        leadSubmissionDetails.scoId = this.scoId;
        this.loadingIndicator = true;
        this.BillingDashboardService.getScoGenerationById(leadSubmissionDetails)
            .subscribe((responseData: any) => {
                this.leadSubmissionDetails = responseData.data;
                if (this.leadSubmissionDetails && this.leadSubmissionDetails[0].isScoAccepted == null) {
                    this.canSubmit = true;
                }
                else {
                    this.canSubmit = false;
                    this.submittedMsg = "Your response is already submitted";
                }
                this.loadingIndicator = false;
            });
    }

    onChange(event) {

    }

    onSubmit(event) {

    }
}