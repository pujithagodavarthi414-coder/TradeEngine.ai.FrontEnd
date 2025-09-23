import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConsideredHours } from '../../../models/projects/consideredHours';
import { ProjectManagementService } from '../../../services/project-management.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-pm-component-consideredhours",
  templateUrl: "consideredhours.component.html"
})
export class ConsideredHoursComponent implements OnInit {
  @ViewChildren('upsertConsideredHoursPopover') upsertConsideredHoursPopovers;

  consideredHoursForm: FormGroup;
  consideredHours: any[];
  consideredHoursModel: ConsideredHours;
  showSpinner: boolean;
  titletext: string;
  buttontext: string;
  isThereAnError: boolean;
  validationmessage: string;
  considerHourName: string;
  consideredHoursId: string;
  anyOperationInProgress: boolean;
  showPlusIcon: boolean;
  showRefreshIcon: boolean;
  toastrMessage: string;
  timeStamp:any;
  consideredHoursDataInProgress: boolean = false;

  constructor(
    private consideredHoursService: ProjectManagementService,
    private snackbar: MatSnackBar,private translateService: TranslateService,
    private cdRef: ChangeDetectorRef
  ) {
    
        
   }

  ngOnInit() {
    this.clearForm();
    this.GetAllConsideredHours();
  }

  GetAllConsideredHours() {
    this.consideredHoursDataInProgress = true;
    const consideredHoursmodel = new ConsideredHours();
    this.consideredHoursService
      .GetAllConsideredHours(consideredHoursmodel)
      .subscribe((responseData: any) => {
        this.consideredHours = responseData.data;
        this.consideredHoursDataInProgress = false;
      });

  }

  clearForm() {
    this.isThereAnError = false;
    this.titletext = "Create considered hours";
    this.buttontext = "Add";
    this.showPlusIcon = true;
    this.showRefreshIcon = false;
    this.showSpinner = false;
    this.anyOperationInProgress = false;
    this.consideredHoursForm = new FormGroup({
      considerHourName: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.maxLength(250)])
      )
    });
  }

  SaveConsideredHours() {
    this.anyOperationInProgress = true;
    this.consideredHoursModel = this.consideredHoursForm.value;
    this.consideredHoursModel.considerHourId = this.consideredHoursId;
    this.consideredHoursModel.timeStamp = this.timeStamp;
    this.consideredHoursService
      .UpsertConsideredHours(this.consideredHoursModel)
      .subscribe((responseData: any) => {
        const success = responseData.success;
        this.anyOperationInProgress = false;

        if (success) {
          this.GetAllConsideredHours();
          if (
            this.consideredHoursModel.considerHourId === null ||
            this.consideredHoursModel.considerHourId === undefined
          ) {
            this.toastrMessage =
              this.consideredHoursModel.considerHourName +
              " " +
              "considered hours created successfully";
          } else {
            this.toastrMessage =
              this.consideredHoursModel.considerHourName +
              " " +
              "considered hours updated successfully";
          }
          this.snackbar.open(this.toastrMessage, "", { duration: 3000 });
          this.clearForm();
          this.upsertConsideredHoursPopovers.forEach((p) => p.closePopover());
        } else {
          this.isThereAnError = true;
          this.validationmessage = responseData.apiResponseMessages[0].message;
          this.cdRef.detectChanges();
        }
      });
  }
  closeDialog() {
    this.upsertConsideredHoursPopovers.forEach((p) => p.closePopover());
  }

  onKey() {
    this.isThereAnError = false;
  }

  EditConsideredHours(consideredHours, upsertConsideredHoursPopover) {
    this.showPlusIcon = false;
    this.showRefreshIcon = true;
    this.anyOperationInProgress = false;
    this.isThereAnError = false;
    this.consideredHoursId = consideredHours.considerHourId;
    this.timeStamp = consideredHours.timeStamp;
    this.titletext = "Edit considered hours";
    this.buttontext = "Update";
    this.consideredHoursForm = new FormGroup({
      considerHourName: new FormControl(
        consideredHours.considerHourName,
        Validators.compose([Validators.required, Validators.maxLength(250)])
      )
    });
    upsertConsideredHoursPopover.openPopover();
  }


  createTransition(upsertConsideredHoursPopover) {
    upsertConsideredHoursPopover.openPopover();
  }



  closeSearch() {
    this.considerHourName = '';

  }


}
