import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { AppBaseComponent } from '../../componentbase';
import { MatDialog } from '@angular/material/dialog';
import { ProgramDetails } from '../../../models/programs-details.model';
import { ProgramModel } from '../../../models/programs-model';
import { LivesManagementService } from '../../../services/lives-management.service';

@Component({
    selector: 'app-smile-budget-breakdown',
    templateUrl: './smile-budget-breakdown.component.html',
    styleUrls: ['./smile-budget-breakdown.component.scss']
})

export class SmileBudgetBreakDownComponent extends AppBaseComponent implements OnInit {
    isDataPresent: boolean;
    budgetList: any[] = [];
    executionTableData: any = [];
    programId: string;
    isAnyOperationInprogress: boolean;
    totalBudget: any;
    investmentReceived: any;
    balanceAmount: any;
    phase1Budget: any;
    phase2Budget: any;
    phase3Budget: any;

    constructor(private router: Router, private route: ActivatedRoute, private toaster: ToastrService, private snackbar: MatSnackBar,
        private TranslateService: TranslateService, private cdRef: ChangeDetectorRef, public dialog: MatDialog, private livesService: LivesManagementService) {
        super();
        this.route.params.subscribe((routeParams => {
            if (routeParams.id) {
                this.programId = routeParams.id;
                this.getBudgetDetailsBasedOnProgramId();
            }
        }))
    }

    ngOnInit() {
        this.assignData();
    }

    getBudgetDetailsBasedOnProgramId() {
        this.isAnyOperationInprogress = true;
        var searchModel: any = {};
        searchModel.programId = this.programId;
        this.livesService.getBudgetAndInvestments(searchModel).subscribe((respone: any) => {
            this.isAnyOperationInprogress = false;
            if (respone.success) {
                let budgetList = respone.data;
                budgetList = budgetList.sort(function (sorta, sortb) {
                    return sortb.createdDateTime - sorta.createdDateTime
                })
                this.budgetList = budgetList;
                this.assignData();
            }
        });
    }

    assignData() {
        if (this.budgetList.length > 0) {
            this.isDataPresent = true;
            var data = {};
            data["district"] = this.budgetList[0].formData.selectStage;
            data["area"] = this.budgetList[0].formData.targetAreaDivisionInPhase01Ha ? this.budgetList[0].formData.targetAreaDivisionInPhase01Ha : null;
            data["division"] = this.budgetList[0].formData.targetShfDivisionInPhase01;
            data["entities"] = this.budgetList[0].formData.entitiesInvolved;
            this.executionTableData.push(data);

            data = {};
            data["district"] = this.budgetList[0].formData.selectStage1;
            data["area"] = this.budgetList[0].formData.targetAreaDivisionInPhase01Ha1 ? this.budgetList[0].formData.targetAreaDivisionInPhase01Ha1 : null;
            data["division"] = this.budgetList[0].formData.targetShfDivisionInPhase2;
            data["entities"] = this.budgetList[0].formData.entitiesInvolved1;
            this.executionTableData.push(data);

            data = {};
            data["district"] = this.budgetList[0].formData.selectStage2;
            data["area"] = this.budgetList[0].formData.targetAreaDivisionInPhase01Ha2 ? this.budgetList[0].formData.targetAreaDivisionInPhase01Ha2 : null;
            data["division"] = this.budgetList[0].formData.targetShfDivisionInPhase3;
            data["entities"] = this.budgetList[0].formData.entitiesInvolved2;
            this.executionTableData.push(data);
            this.totalBudget = this.budgetList[0].formData.totalBudgetUsd;
            this.investmentReceived = this.budgetList[0].formData.investmentReceivedUsd;
            this.balanceAmount = this.budgetList[0].formData.balanceAmount;
            this.phase1Budget = this.budgetList[0].formData.totalEstimatedBudgetForPhase01Usd;
            this.phase2Budget = this.budgetList[0].formData.estimatedBudgetPhase02Usd;
            this.phase3Budget = this.budgetList[0].formData.estimatedBudgetPhase03Usd;
        } else {
            this.isDataPresent = false;
            this.executionTableData = [];
        }
    }
}
