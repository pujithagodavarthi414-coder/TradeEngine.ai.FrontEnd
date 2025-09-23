import { Component, Input } from '@angular/core';
import { EmployeePersonalDetailsModel } from '../../models/employee-personal-details-model';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-hr-component-view-employee-personal-details',
  templateUrl: 'view-employee-personal-details.component.html',
})

export class ViewEmployeePersonalDetailsComponent {
  @Input() selectedEmployeeData: EmployeePersonalDetailsModel;
  @Input() macApplicable: boolean;
  @Input() maritalStatus: boolean;
  moduleTypeId = 1;
  referenceTypeId: string = ConstantVariables.PersonalDetailsReferenceTypeId;
}