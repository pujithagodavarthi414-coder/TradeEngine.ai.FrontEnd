import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DashboardFilterModel } from '../../../models/dashboardFilterModel';
import { boardTypeapi } from '../../../models/projects/boardtypeApi';
import { ProjectManagementService } from '../../../services/project-management.service';
import { ConstantVariables } from '../../../helpers/constant-variables';
import { CustomAppBaseComponent } from '../../../../globaldependencies/components/componentbase';


@Component({
  selector: "app-pm-component-boardtypeapi",
  templateUrl: "boardtypeapi.component.html"
})
export class BoardTypeApiComponent extends CustomAppBaseComponent implements OnInit  {
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
      if (data && data !== undefined) {
          this.dashboardFilters = data;
      }
  }

  dashboardFilters: DashboardFilterModel;
  boardtypeForm: FormGroup;
  boardtypeapi: boardTypeapi[];
  boardtypeApi: boardTypeapi;
  titleHeader: string;
  buttonText: string;
  buttonIcon: string;
  isThereAnError: boolean;
  anyOperationInProgress: boolean;
  validationMessage: string;
  showSpinner: boolean;
  boardtypeId: string;
  apiName: string;
  timeStamp:any;
  boardTypeApiDataInProgress: boolean = false;
  isAnyOperationIsInprogress: boolean = false;
  
  @ViewChildren('upsertBoardTypeApiPopover') upsertBoardTypeApiPopovers;

  constructor(private boardType: ProjectManagementService,private snackbar: MatSnackBar,
    private cdRef: ChangeDetectorRef,private translateService: TranslateService
  ) { super();
    
    
  }

  ngOnInit() {
    this.clearForm();
    super.ngOnInit();
    this.GetAllBoardTypeApi();
  }

  clearForm() {
    this.titleHeader = this.translateService.instant(ConstantVariables.Created);
    this.buttonText = this.translateService.instant(ConstantVariables.Add);
    this.buttonIcon =this.translateService.instant(ConstantVariables.Plus);
    this.showSpinner = false;
    this.anyOperationInProgress = false;
    this.isThereAnError = false;
    this.boardtypeId = null;
    this.boardtypeForm = new FormGroup({
      apiName: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.maxLength(250)])
      )
    });
  }

  GetAllBoardTypeApi() {
    this.boardTypeApiDataInProgress = true;
    this.boardType.GetAllBoardTypeApi("").subscribe((responseData: any) => {
      this.boardtypeapi = responseData.data;
      this.boardTypeApiDataInProgress = false;
      this.cdRef.detectChanges();
    });
  }

  SaveBoardTypeApi(formDirective: FormGroupDirective) {
    this.showSpinner = true;
    this.anyOperationInProgress = true;
    this.boardtypeApi = this.boardtypeForm.value;
    this.boardtypeApi.boardTypeApiId = this.boardtypeId;
    this.boardtypeApi.timeStamp = this.timeStamp;
    this.boardType
      .UpsertBoardTypeApi(this.boardtypeApi)
      .subscribe((responseData: any) => {
        this.showSpinner = false;
        const success = responseData.success;
        this.anyOperationInProgress = false;
        if (success) {
          if (this.boardtypeApi.boardTypeApiId) {
            this.snackbar.open(this.boardtypeApi.apiName + " " +  this.translateService.instant(ConstantVariables.ToasterUpdated), "ok", {
              duration: 3000
            });
          }
          else {
            this.snackbar.open(this.boardtypeApi.apiName + " " +this.translateService.instant(ConstantVariables.Toaster), "ok", {
              duration: 3000
            });
          }
          formDirective.resetForm();
          this.clearForm();
          this.upsertBoardTypeApiPopovers.forEach((p) => p.closePopover());
          this.GetAllBoardTypeApi();
        } else {
          this.isThereAnError = true;
          this.validationMessage = responseData.apiResponseMessages[0].message;
          this.cdRef.detectChanges();
        }
      });
  }

  closeDialog(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.upsertBoardTypeApiPopovers.forEach((p) => p.closePopover());
  }

  EditBoardTypeApi(boardtype, upsertBoardTypeApiPopover) {
    this.isThereAnError = false;
    this.titleHeader = this.translateService.instant(ConstantVariables.Edit);
    this.buttonText = this.translateService.instant(ConstantVariables.Update);
    this.buttonIcon = "sync";
    this.boardtypeId = boardtype.boardTypeApiId;
    this.timeStamp = boardtype.timeStamp;
    this.boardtypeForm = new FormGroup({
      apiName: new FormControl(
        boardtype.apiName,
        Validators.compose([Validators.required, Validators.maxLength(250)])
      )
    });
    upsertBoardTypeApiPopover.openPopover();
  }

  GetBoardtypeslist() {
    this.apiName = this.apiName;
    this.GetAllBoardTypeApi();
  }

  onKey() {
    this.isThereAnError = false;
  }


  CreateboardTypeapi(upsertBoardTypeApiPopover) {
    upsertBoardTypeApiPopover.openPopover();
  }


  closeSearch() {
    this.apiName = '';

  }

}
