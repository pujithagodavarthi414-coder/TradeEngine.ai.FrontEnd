import { Component, ChangeDetectorRef, Input } from "@angular/core";

import { UserService } from "../../services/user.Service";
import { Router } from "@angular/router";
import { EmployeeDetailsHistoryModel } from '../../models/employee-details-history.model';
import '../../../globaldependencies/helpers/fontawesome-icons';
import * as $_ from 'jquery';
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";
import { SoftLabelConfigurationModel } from "../../models/softLabels-model";
const $ = $_;

@Component({
    selector: "app-fm-component-employee-details-history",
    templateUrl: `employee-details-history.html`
})

export class EmployeeDetailsHistory {

    @Input("userId")
    set selected_Employee_Id(data: string) {
        if (data != null && data !== undefined) {
            this.userId = data;
        }
    }

    optionalParameters: any;
    employeeHistory: EmployeeDetailsHistoryModel[];
    softLabels: SoftLabelConfigurationModel[];
    isAnyOperationInProgress: boolean;
    userId: string;
    category: string;
    pageSize: number = 20;
    pageIndex: number = 0;
    pageSizeOptions: number[] = [20, 40, 60, 80, 100];

    constructor(private cdRef: ChangeDetectorRef, private userService: UserService,private routes: Router) {
    }

    ngOnInit() {
        this.getHistory();
        this.getSoftLabelConfigurations();
    }

    getSoftLabelConfigurations() {
        if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
          this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }
      }


    getHistory() {
        var employeeInput = new EmployeeDetailsHistoryModel();
        employeeInput.category = this.category;
        employeeInput.pageIndex = this.pageIndex + 1;
        employeeInput.pageSize = this.pageSize;
        employeeInput.userId = this.userId;
        this.isAnyOperationInProgress = true;
        this.userService.getEmployeeDetailsHistory(employeeInput).subscribe((result: any) => {
            if (result.success) {
                this.employeeHistory = result.data;
            }
            this.isAnyOperationInProgress = false;
            this.cdRef.detectChanges();

            this.setAppHeight(this.optionalParameters);
        });
    }

    getFilteredAssetComments(pageEvent) {
        if (pageEvent.pageSize != this.pageSize) {
            this.pageIndex = 0;
        } else {
            this.pageIndex = pageEvent.pageIndex;
        }
        this.pageSize = pageEvent.pageSize;
        this.getHistory();
    }

    reload(){
        this.getHistory();
    }
    profilePage(e) {
        this.routes.navigateByUrl('/dashboard/profile/' + e + '/overview');
    }

    setAppHeight(optionalParameters: any) {

        if (optionalParameters['gridsterView']) {
            $(optionalParameters['gridsterViewSelector'] + ' .employee-history #style-1').height($(optionalParameters['gridsterViewSelector']).height() - 150);
        }
        else if (optionalParameters['popupView']) {
            var height = $(optionalParameters['popupViewSelector']).height();
            var contentHeight = height - 250;
            contentHeight = (contentHeight < 250)? 250 : contentHeight;
            $(optionalParameters['popupViewSelector'] + ' .employee-history #style-1').height(contentHeight);
        }
        else if (optionalParameters['individualPageView']) {
            $(optionalParameters['individualPageSelector'] + ' .employee-history #style-1').height($(optionalParameters['individualPageSelector']).height() - 150);
        }    
    }

    fitContent(optionalParameters: any) {

        this.optionalParameters = optionalParameters;
        this.setAppHeight(this.optionalParameters);
    }

}