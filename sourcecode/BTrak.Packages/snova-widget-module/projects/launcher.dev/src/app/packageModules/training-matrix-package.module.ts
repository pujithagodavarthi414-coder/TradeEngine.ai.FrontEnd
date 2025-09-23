import { CommonModule } from "@angular/common";
import { NgModule, Type } from "@angular/core";

import { TrainingMatrixModule, CustomTrainingCoursesViewComponent, CustomTrainingCourseAssignmentComponent, CustomTrainingRecordViewComponent } from "@thetradeengineorg1/snova-training-matrix";
import { CustomTrainingMatrixViewComponent } from "@thetradeengineorg1/snova-training-matrix";

export class TrainingManagementComponentSupplierService {

  static components =  [
    { name: "training matrix", componentTypeObject: CustomTrainingMatrixViewComponent },
    { name: "training courses", componentTypeObject: CustomTrainingCoursesViewComponent },
    { name: "training assignments", componentTypeObject: CustomTrainingCourseAssignmentComponent },
    { name: "training record", componentTypeObject: CustomTrainingRecordViewComponent }
  ];
}

@NgModule({
  imports: [
    CommonModule,
    TrainingMatrixModule
  ]
})
export class TrainingMatrixPacakgeModule {
  static componentService = TrainingManagementComponentSupplierService;
}
