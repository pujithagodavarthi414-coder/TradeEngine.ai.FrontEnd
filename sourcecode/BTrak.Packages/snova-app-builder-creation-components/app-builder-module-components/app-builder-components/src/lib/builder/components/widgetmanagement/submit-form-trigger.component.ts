import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'app-submit-form-trigger',
    templateUrl: "./submit-form-trigger.component.html",
})

export class SubmitFormTriggerComponent implements OnInit {
    formId: string;
    customApplicationId: string;
    submittedId: string;
    allowAnnonymous:boolean =false;
    constructor(private route: ActivatedRoute) {
        this.route.params.subscribe((params) => {
            this.formId = params["formId"];
            this.customApplicationId = params["customapplicationId"];
            this.submittedId = params["submittedId"];
        });

    }

    ngOnInit() {

    }

    formSubmit(event) {
        
    }
}