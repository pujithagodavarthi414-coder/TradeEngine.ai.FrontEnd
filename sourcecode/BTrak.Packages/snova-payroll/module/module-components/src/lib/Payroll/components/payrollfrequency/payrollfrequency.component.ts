import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CronOptions } from "cron-editor/lib/CronOptions";
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import { PayRollTemplateModel } from '../../../Payroll/models/PayRollTemplateModel';
import { PayfrequencyModel } from '../../../Payroll/models/payfrequency-model';
import { PayrollManagementService } from '../../services/payroll-management.service';
@Component({
  selector: 'app-payrollfrequency',
  templateUrl: './payrollfrequency.component.html'
})
export class PayrollfrequencyComponent extends CustomAppBaseComponent implements OnInit {
  public cronOptions: CronOptions = {
    formInputClass: 'form-control cron-editor-input',
    formSelectClass: 'form-control cron-editor-select',
    formRadioClass: 'cron-editor-radio',
    formCheckboxClass: 'cron-editor-checkbox',
    defaultTime: '10:00:00',
    use24HourTime: true,
    hideMinutesTab: false,
    hideHourlyTab: false,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: false,
    hideAdvancedTab: true,
    hideSeconds: true,
    removeSeconds: true,
    removeYears: true,
  };
  payRollTemplateId: string;
  public isCronDisabled = false;
  public cronExpression = "0/1 * 1/1 * ?";
  public payFrequencyId = null;
  timeStamp: any;
  validationMessage: string;
  isThereAnError: boolean = false;
  payRollTemplateModel: PayRollTemplateModel;
  roleFeaturesIsInProgress$: Observable<boolean>;

  @Input("payrollTemplateId")
  set _payrollTemplateId(data) {
    this.payRollTemplateId = data;

  }
  constructor(private cdRef: ChangeDetectorRef,private translateService: TranslateService,private toastr: ToastrService, private payrollManagementService: PayrollManagementService) {
     super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getAllPayRollTemplates();
  }

  getAllPayRollTemplates() {
    var payRollTemplateModel = new PayRollTemplateModel();
    payRollTemplateModel.payRollTemplateId = this.payRollTemplateId;
    payRollTemplateModel.isArchived = false;
    this.payrollManagementService.getAllPayRollTemplates(payRollTemplateModel).subscribe((response: any) => {
      if (response.success == true) {
        if (response.data && response.data.length > 0) {
          this.payRollTemplateModel = response.data[0];
          if(this.payRollTemplateModel.frequencyId && this.payRollTemplateModel.frequencyId != '00000000-0000-0000-0000-000000000000'){
            this.getPayFrequency();
          }
        }
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
    });
  }

  upsertPayFrequency() {
    let payfrequencyModel = new PayfrequencyModel();
    payfrequencyModel.cronExpression = this.cronExpression;

    if (this.payFrequencyId) {
      payfrequencyModel.payFrequencyId = this.payFrequencyId;
    }
    this.payrollManagementService.upsertPayFrequency(payfrequencyModel).subscribe((response: any) => {
      if (response.success == true) {
        if (this.payFrequencyId == null) {
          this.payRollTemplateModel.frequencyId = response.data;
          this.upsertPayRollTemplate(this.payRollTemplateModel)
        }
        this.cdRef.detectChanges();
        this.toastr.success("", this.translateService.instant("PAYROLLTEMPLATE.FEQUENCYUPDATEDFORTHETEMPLATESUCCESSFULLY"));
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
    });
  }

  upsertPayRollTemplate(model: PayRollTemplateModel) {
    this.payrollManagementService.upsertPayRollTemplate(model).subscribe((response: any) => {
      if (response.success == true) {
        this.payRollTemplateId = response.data;
        this.getAllPayRollTemplates();
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
    });
  }

  getPayFrequency() {
    var payfrequencyModel = new PayfrequencyModel();
    payfrequencyModel.payFrequencyId = this.payRollTemplateModel.frequencyId;
    payfrequencyModel.isArchived = false;
    this.payrollManagementService.getPayFrequency(payfrequencyModel).subscribe((response: any) => {
      if (response.success == true) {
        this.cronExpression = response.data[0].cronExpression;
        this.payFrequencyId = response.data[0].payFrequencyId;
      }
      else {
        this.isThereAnError = true;
        this.validationMessage = response.apiResponseMessages[0].message;
      }
    });
  }

}
