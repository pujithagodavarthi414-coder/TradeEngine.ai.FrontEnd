import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleModel } from '../models/role-model';
import { AddModulesService } from '../services/add-modules.service';
import '../../globaldependencies/helpers/fontawesome-icons'
import { ConstantVariables } from '../constants/constant-variables';
import { ModuleModel, TabModel } from '../models/moduleModel';
import { FileUploadService } from '../services/fileUpload.service';
import { ToastrService } from 'ngx-toastr';

export interface DialogData {
  rowData: any;
  isEdit: boolean;
}

@Component({
  selector: 'app-dailog-box',
  templateUrl: './dailog-box.component.html',
  styleUrls: ['./dailog-box.component.css']
})
export class DailogBoxComponent implements OnInit {
  moduleForm: any;
  roles: any[] = [];
  fileName = '';
  selectedFile: File | any;
  fileToUpload: File | any;
  imageUrl: any;
  dynamicModuleData: any[] = [];
  moduleName: any;
  moduleIcon: any;
  viewPermission: any;
  editPermission: any;
  contractTemplateFormJson: any;
  isEditableNew: boolean = true;
  editDetails : any;
  isEdit: boolean;
  moduleTypeId = 1;
  referenceTypeId = ConstantVariables.ContractReferenceTypeId;
  referenceId = '';
  selectedStoreId: any;
  selectedParentFolderId: any;
  isFileExist: boolean = true;
  toUploadFiles: boolean = false;
  fileTypes = ['image/jpeg', 'image/jpg', 'image/png']
  file: any;
  tabsCount: number = 0;
  tabsInprogress: boolean;
  isLoading : boolean;

  constructor(private fb: FormBuilder,
    private addModulesService: AddModulesService,
    private fileUploadService: FileUploadService,
    private http: HttpClient,
    private dialogRef: MatDialogRef<DailogBoxComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData
  ) { 
    this.tabsInprogress = true;
    this.editDetails = this.data.rowData;
    let editDt = this.editDetails;
      this.clearForm();
      this.toUploadFiles = false;
      this.file = null
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
         this.moduleIcon = this.editDetails.moduleIcon;
         model.viewPermission = this.editDetails.viewRole? this.editDetails.viewRole.split(",") : null;
         model.editPermission = this.editDetails.editRole? this.editDetails.editRole.split(",") : null;
        this.moduleForm.patchValue(model);
        this.tabsInprogress=true;
        this.addModulesService.getGetDynamicModuleTabs({dynamicModuleId:editDt.dynamicModuleId}).subscribe((response: any) => {
          if (response.success == true && response.data && response.data.length > 0) {
            this.editDetails.dynamicTabs = response.data && response.data.length > 0 ? response.data : [];
            if(this.editDetails.dynamicTabs != null){
              this.editDetails.dynamicTabs.forEach((element:any) => {
                this.getTabs.push(this.fb.group({
                  dynamicTabId: element.dynamicTabId,
                  tabName:element.dynamicTabName,
                  viewTabPermission: new FormControl(element.viewRole ? element.viewRole.split(',') : null),
                  editTabPermission: new FormControl(element.editRole ? element.editRole.split(',') : null)
                }));
              });
              this.tabsCount = this.getTabs.controls.length;
              this.tabsInprogress=false;
            }
          }
          else {
          }
        });
      }
      this.tabsInprogress=false;
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
      dynamicTabId: new FormControl(),
      tabName: new FormControl(),
      viewTabPermission: new FormControl(),
      editTabPermission: new FormControl(),
    });
    var tabs = (this.moduleForm.get('tabs') as FormArray);
    tabs.push(control);
    this.tabsCount=tabs.controls.length;
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
saveIcon(){
  if(this.file){
    var moduleTypeId = 4;
    var formData = new FormData();
    formData.append("file", this.file);
    formData.append("isFromProfileImage", 'true');
    this.fileUploadService.UploadFile(formData, moduleTypeId).subscribe((response: any) => {
      if (response.data) {
        this.moduleIcon = response.data[0].filePath;
        this.saveUpsertDynamicModule();
      }
      else {
      }
    })
  } else{
    this.saveUpsertDynamicModule();
  }
}
clientuploadEventHandler(files: FileList) {
  this.file = files.item(0);
  var fileName = this.file.name;
  var fileExtension = fileName.split('.');
  if (this.fileTypes.includes(this.file.type)) {
  }
  else {
  }
}

  saveUpsertDynamicModule() {
    var moduleModel = new ModuleModel();
    moduleModel.dynamicModuleName = this.moduleForm.value.moduleName;
    moduleModel.moduleIcon = this.moduleIcon;
    moduleModel.viewRole = this.moduleForm.value.viewPermission?.toString();
    moduleModel.editRole = this.moduleForm.value.editPermission?.toString();
    moduleModel.dynamicModuleId = this.isEdit == true ? this.editDetails.dynamicModuleId : null;
    moduleModel.timeStamp = this.isEdit == true ? this.editDetails.timeStamp : null;
    var tabs = Array<TabModel>();
    if (this.moduleForm.value.tabs && this.moduleForm.value.tabs.length > 0) {
      this.moduleForm.value.tabs.forEach((el: any) => {
        var tab = new TabModel();
        tab.dynamicTabId = el.dynamicTabId;
        tab.dynamicTabName = el.tabName;
        tab.viewRole = el.viewTabPermission?.toString();
        tab.editRole = el.editTabPermission?.toString();
        tabs.push(tab);
        
      });
    }
    moduleModel.dynamicTabs = tabs;
    this.isLoading = true;
    this.addModulesService.getUpsertDynamicModule(moduleModel).subscribe((response: any) => {
      this.isLoading = false;
      if (response.success == true) {
        this.dialogRef.close(true);
        this.referenceId = response.data;
        this.toUploadFiles = true;
      }
      else {
        this.toastr.error("",response.apiResponseMessages[0].message);
      }
    });
  }



  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("thumbnail", file);
      const upload$ = this.http.post("", formData);
      upload$.subscribe();
    }
  }

  removeDynamicTabStep(i:number) {
    this.getTabs.removeAt(i);
    this.tabsCount=this.getTabs.controls.length;
  }



  //   onFileSelected(file: FileList) {  
  //     this.fileToUpload = files.item(0);  
  //     var reader = new FileReader();  
  //     reader.onload = (event: any) => {  
  //         this.moduleIcon = event.target.result;  
  //     }  
  //     reader.readAsDataURL(this.fileToUpload);  
  // } 
    filesExist(event:any) {
      this.isFileExist = event;
  }
  closeFilePopup() {
  }

}


