import { CustomAppBaseComponent } from "../../../../globaldependencies/components/componentbase";
import { OnInit, Component, Input, Output, EventEmitter, TemplateRef, ViewChild, ChangeDetectorRef } from "@angular/core";
import { GenericFormType } from "../models/generic-form-type-model";
import * as _ from "underscore";
import { GenericFormService } from '../services/generic-form.service';
import { MatDialog } from '@angular/material/dialog';
import * as $_ from 'jquery';
import { Router } from "@angular/router";
const $ = $_;

@Component({
  selector: "genericforms-view",
  templateUrl: "./genericforms-view.component.html"

})


export class GenericFormsViewComponent extends CustomAppBaseComponent implements OnInit {

  isTreeviewPinned: boolean = false;
  fetchInProgress: boolean;
  isArchivedTypes: boolean = false;
  formtypes: GenericFormType[];
  originalFormTypes: GenericFormType[];
  formtypesSearchText: string;
  formtypeSearchText: string;
  selectAllFormTypesByDefault: boolean = true;
  selectedFormType: string;
  selectedFormTypeId: string;
  selectedFormIds: string[] = [];
  isFromWizard: boolean;
  dashboardId: string;
  fullHeight: boolean = false;
  optionalParameters: any;

  @Output() selectForm = new EventEmitter<any>();
  @ViewChild("formTypeDialogComponent") formTypeDialogComponent: TemplateRef<any>;



  @Input("selectedFormTypeId")
  set _selectedFormTypeId(data: string) {
    if (data) {
      this.selectedFormTypeId = data;
    }
  }
  @Input("selectedFormIds")
  set _selectedFormId(data: string[]) {
    if (data) {
      this.selectedFormIds = data;
    }
  }
  @Input("isFromWizard")
  set _isFromWizard(data: boolean) {
    if (data) {
      this.isFromWizard = data;
    }
  }

  @Input("dashboardId")
  set _dashboardId(data: string) {
      if (data != null && data !== undefined && data !== this.dashboardId) {
          this.dashboardId = data;           
      }
  }

  constructor(private genericFormService: GenericFormService, public dialog: MatDialog,private cdRef: ChangeDetectorRef,private router: Router) {
    super();
  }

  openFormTypes() {
    this.isTreeviewPinned = !this.isTreeviewPinned;
    this.fitContent(this.optionalParameters);
  }

  ngOnInit() {
    super.ngOnInit();
    if(this.router.url.includes('/statusreportssettings')) {
      this.dashboardId = null;
      this.fullHeight = false;
  }
  if(this.router.url.includes('/dashboard-management/widgets')) {
      this.dashboardId = null;
      this.fullHeight = true;
  }
    this.getAllFormTypes();
  }

  getAllFormTypes() {
    this.fetchInProgress = true;
    var genericFormTypeModel = new GenericFormType();
    genericFormTypeModel.isArchived = this.isArchivedTypes;
    this.genericFormService.getAllFormTypes(genericFormTypeModel).subscribe((result: any) => {
      this.formtypes = result.data;
      var selectedFormType = _.find(this.formtypes, (formType) => formType.formTypeId == this.selectedFormTypeId);
      this.originalFormTypes = this.formtypes;
      if (selectedFormType) {
        this.selectFormType(selectedFormType.formTypeName)
        this.searchFormTypes();
        this.cdRef.detectChanges();
      }
      this.fetchInProgress = false;
      
    });

  }

  onSelectAForm(selectedForms){
    this.selectForm.emit(selectedForms);
  }

  searchFormTypes() {
    const searchText = this.formtypesSearchText;
    if (!searchText) {
      this.formtypes = this.originalFormTypes;
    } else {
      this.formtypes = [];
      this.originalFormTypes.forEach((item: any) => {
        if (item && item.formTypeName.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1) {
          this.formtypes.push(item);
        }
      });
    }
  }

  searchTextstring(text) {
    this.selectedFormType = text;
  }

  selectAll() {
    this.formtypeSearchText = '';
    this.selectedFormType = '';
    this.selectAllFormTypesByDefault = !this.selectAllFormTypesByDefault;
    this.searchFormTypes();
  }

  selectFormType(formtype) {
    this.formtypeSearchText = formtype;
    this.selectAllFormTypesByDefault = false;
    this.selectedFormType = formtype;
  }

  closeFormTypesSearch() {
    this.formtypesSearchText = "";
    !this.selectedFormType ? this.selectAllFormTypesByDefault = true : null;
    this.searchFormTypes();
  }

  closeFormSearch(data) {
    console.log(data);
    this.formtypeSearchText = '',
      this.selectedFormType = '';
    this.selectAllFormTypesByDefault = true;
  }

  openFormTypeDialog() {
    let dialogId = "create-form-type-dialog-component";
    const dialogRef = this.dialog.open(this.formTypeDialogComponent, {
      minWidth: "85vw",
      minHeight: "85vh",
      height: "70%",
      id: dialogId,
      data: { formPhysicalId: dialogId }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllFormTypes();
    });
  }

  fitContent(optionalParameters: any) {
    var interval;
    var count = 0;
    this.optionalParameters = null;
    this.optionalParameters = optionalParameters;
    if (optionalParameters['gridsterView']) {
      interval = setInterval(() => {
        try {
          if (count > 30) {
            clearInterval(interval);
          }
          count++;
          if ($(optionalParameters['gridsterViewSelector'] + ' .genericForm-scroll-height').length > 0) {
            var contentHeight = $(optionalParameters['gridsterViewSelector']).height() - 90;
            $(optionalParameters['gridsterViewSelector'] + ' .genericForm-scroll-height').css("cssText", `height: ${contentHeight}px !important;`);
            clearInterval(interval);
          }
        } catch (err) {
          clearInterval(interval);
        }
      }, 1000);
    }

  }

}