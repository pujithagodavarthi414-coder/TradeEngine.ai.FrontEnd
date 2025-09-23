import { Component, Input } from '@angular/core';

import { EmployeeJobDetailsModel } from '../../models/employee-job-model';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-hr-component-view-employee-job-details',
  templateUrl: 'view-employee-job-details.html',
})

export class ViewEmployeeJobDetailsComponent {
  @Input() jobDetailsData: EmployeeJobDetailsModel;
  
	moduleTypeId = 1;
  referenceTypeId: string = ConstantVariables.JobDetailsReferenceTypeId;
}