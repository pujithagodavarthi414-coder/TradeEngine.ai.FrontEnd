import { Component, OnInit } from '@angular/core';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { Router } from '@angular/router';
import { UserModel } from '../models/user';
import { PayRollService } from '../services/PayRollService';

@Component({
    selector: 'app-payslip',
    templateUrl: `payslip.component.html`
})

export class PaySlipComponent extends CustomAppBaseComponent implements OnInit {
    selectedEmployeeId: string;

    constructor(private router: Router,private payRollService: PayRollService,) {
        super()

        var userModel = new UserModel();

        if (this.router.url.split("/")[3]) {
            userModel.userId = this.router.url.split("/")[3];
        }

        this.payRollService.getUserById(userModel).subscribe((response: any) => {
            if (response) {
                this.selectedEmployeeId = response.employeeId;
            }
        });
    }
}

