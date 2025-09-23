import { Component, Input } from '@angular/core';
import { EmployeeContactDetailsModel } from '../../models/employee-contact-details-model';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-hr-component-view-employee-contact-details',
  templateUrl: 'view-employee-contact-details.component.html',
})

export class ViewEmployeeContactDetailsComponent {
  @Input() selectedEmployeeContactDetailsData: EmployeeContactDetailsModel;
  @Input() employeeId: string;
  moduleTypeId = 1;
  referenceTypeId: string = ConstantVariables.ContactDetailsReferenceTypeId;
}