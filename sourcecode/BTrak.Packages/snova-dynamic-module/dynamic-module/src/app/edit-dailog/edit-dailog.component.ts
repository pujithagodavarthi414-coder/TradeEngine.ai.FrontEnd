import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DailogBoxComponent, DialogData } from '../dailog-box/dailog-box.component';
import { FormGroup, FormControl, FormBuilder, FormArray } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModuleModel, TabModel } from '../models/module';
import { RoleModel } from '../models/role-model';
import { AddModulesService } from '../services/add-modules.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-edit-dailog',
  templateUrl: './edit-dailog.component.html',
  styleUrls: ['./edit-dailog.component.css']
})
export class EditDailogComponent implements OnInit {

  moduleForm: any;
  roles: any[] = [];
  fileName = '';
  dynamicModuleData: any[] = [];
  moduleName: any;
  moduleIcon: any;
  viewPermission: any;
  editPermission: any;
  contractTemplateFormJson: any;
  editDetails : any;
  isEdit: boolean;
  constructor(private fb: FormBuilder,
    private addModulesService: AddModulesService,
    private http: HttpClient,
    private dialogRef: MatDialogRef<DailogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData
  ) { 
    this.clearForm();
    this.editDetails = this.data.rowData;
    this.moduleForm.valueChanges.subscribe((selectedValue:any) => {
      console.log('form value changed')
      console.log(selectedValue)
    })
    this.moduleForm.controls.tabs.valueChanges.subscribe((selectedValue:any) => {
      console.log('form value changed')
      console.log(selectedValue)
    })
    this.isEdit = this.data.isEdit;
    if(this.isEdit) {
      var model : any = {};
      model.moduleName = this.editDetails.dynamicModuleName;
       model.moduleIcon = this.editDetails.moduleIcon;
       model.viewPermission = this.editDetails.viewRole? this.editDetails.viewRole.split(",") : null;
       model.editPermission = this.editDetails.editRole? this.editDetails.editRole.split(",") : null;
      this.moduleForm.patchValue(model);
      this.editDetails.dynamicTabs.forEach((element:any) => {
        this.getTabs.push(this.fb.group({
          tabName:element.dynamicTabName,
          viewTabPermission: new FormControl(element.viewRole ? element.viewRole.split(',') : null),
          editTabPermission: new FormControl(element.editRole ? element.editRole.split(',') : null)
        }));
      });
    }
  }
  clearForm() {
    this.moduleForm = new FormGroup({
      moduleName: new FormControl(),
      moduleIcon: new FormControl(),
      viewPermission: new FormControl(),
      editPermission: new FormControl(),
      isEditable: new FormControl(true),
      isNewRow: new FormControl(false),
      tabs: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getRoles();
  }

  get getTabs() {
    return (this.moduleForm.get('tabs') as FormArray);
  }

  addTab() {
    var control = this.fb.group({
      tabName: new FormControl(),
      viewTabPermission: new FormControl(),
      editTabPermission: new FormControl(),
    });
    var tabs = (this.moduleForm.get('tabs') as FormArray);
    tabs.push(control);
  }

  getRoles() {
    var companyModel = new RoleModel();
    companyModel.isArchived = false;
    this.addModulesService.getRoles(companyModel).subscribe((response: any) => {
      if (response.success == true) {
        this.roles = response.data;
      }
      else {
      }
    });
  }


  saveUpsertDynamicModule() { 
    var moduleModel = new ModuleModel();
    moduleModel.dynamicModuleName = this.moduleForm.value.moduleName;
    moduleModel.moduleIcon = this.moduleForm.value.moduleIcon;
    moduleModel.viewRole = this.moduleForm.value.viewPermission?.toString();
    moduleModel.editRole = this.moduleForm.value.editPermission?.toString();
    var tabs = Array<TabModel>();
    if (this.moduleForm.value.tabs && this.moduleForm.value.tabs.length > 0) {
      this.moduleForm.value.tabs.forEach((el: any) => {
        var tab = new TabModel();
        tab.dynamicTabName = el.tabName;
        tab.viewRole = el.viewTabPermission?.toString();
        tab.editRole = el.editTabPermission?.toString();
        tabs.push(tab);
      });
    }
    moduleModel.dynamicTabs = tabs;
    this.addModulesService.getUpsertDynamicModule(moduleModel).subscribe((response: any) => {
      if (response.success == true) {
        this.dialogRef.close(true);
      }
      else {
      }
    });
  }



  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("thumbnail", file);
      const upload$ = this.http.post("", formData);
      upload$.subscribe();
    }
  }

}
