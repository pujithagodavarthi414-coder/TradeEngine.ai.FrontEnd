import { Component, OnInit, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DailogBoxComponent } from '../dailog-box/dailog-box.component';
import { ModuleModel } from '../models/moduleModel';
import { RoleModel } from '../models/role-model';
import { AddModulesService } from '../services/add-modules.service';

@Component({
  selector: 'app-add-module',
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.css']
})
export class AddModuleComponent implements OnInit {
  isLoading: boolean;
  dynamicModuleData: any[] = [];
  getDynamicModuleData: any[] = [];
  selectedRowValue: any = [];
  @ViewChildren("deleteModulePopUp") deleteModulePopUps;
  rowData: any;
  isDeleteLoading: boolean;
  constructor(public dialog: MatDialog,
    private addModulesService: AddModulesService, private router: Router) { }

  openDialog() {
    const dialogRef = this.dialog.open(DailogBoxComponent,{
      data:{
        rowData: {},
        isEdit: false
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.getGetDynamicModules();
      }
    });
  }


  ngOnInit(): void {
    this.getGetDynamicModules();
  }

  getGetDynamicModules() {
    this.isLoading = true;
    var companyModel = new RoleModel();
    companyModel.isArchived = false;
    this.addModulesService.getGetDynamicModules(companyModel).subscribe((response: any) => {
      if (response.success == true) {
        this.getDynamicModuleData = response.data;
      }
      else {
      }
      this.isLoading = false;
    });
  }
  getTabsName(tabs: any) {
    if (tabs && tabs.length > 0) {
      return tabs.map((t: any) => t.dynamicTabName)?.join(",");
    } else {
      return null;
    }
  }

  goToAddModule() {
    this.router.navigate(['module/module-list']);
    }


  selectedRow(event: any) {
    {
      // this.addModulesService.getGetDynamicModuleTabs({dynamicModuleId:event.dynamicModuleId}).subscribe((response: any) => {
      //   if (response.success == true && response.data && response.data.length > 0) {
      // event.dynamicTabs = response.data && response.data.length > 0 ? response.data : [];
      const dialogRef = this.dialog.open(DailogBoxComponent, {
        data:{
          rowData: event,
          isEdit: true
        }
      });
      dialogRef.afterClosed().subscribe((isReloadRequired: any) => {
        this.getGetDynamicModules();
      });
      //   }
      //   else {
      //   }
      // });
    }
  }
  deletePopUpOpen(popup, dataItem) {
    this.rowData = dataItem;
    popup.openPopover();
}
closeDeletePopUp() {
  this.deleteModulePopUps.forEach((p) => p.closePopover());
}
deleteDynamicModule() {
  var moduleModel = new ModuleModel();
  moduleModel = this.rowData;
  moduleModel.isArchived=true;
  this.isDeleteLoading = true;
  this.addModulesService.getUpsertDynamicModule(moduleModel).subscribe((response: any) => {
    if (response.success == true) {
      this.isDeleteLoading = false;
      this.closeDeletePopUp();
      this.getGetDynamicModules();
    }
    else {
    }
  });
}
}
