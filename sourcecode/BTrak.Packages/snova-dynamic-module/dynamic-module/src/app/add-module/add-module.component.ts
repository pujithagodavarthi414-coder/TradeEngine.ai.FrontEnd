import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DailogBoxComponent } from '../dailog-box/dailog-box.component';
import { RoleModel } from '../models/role-model';
import { AddModulesService } from '../services/add-modules.service';
import { EditDailogComponent } from '../edit-dailog/edit-dailog.component';
import { truncate } from 'fs';
@Component({
  selector: 'app-add-module',
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.css']
})
export class AddModuleComponent implements OnInit {
  dynamicModuleData: any[] = [];
  getDynamicModuleData: any[] = [];
  selectedRowValue: any = [];
  constructor(public dialog: MatDialog,
    private addModulesService: AddModulesService) { }

  openDialog() {
    const dialogRef = this.dialog.open(DailogBoxComponent,{
      data:{
        rowData: {},
        isEdit: true
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
    var companyModel = new RoleModel();
    companyModel.isArchived = false;
    this.addModulesService.getGetDynamicModules(companyModel).subscribe((response: any) => {
      if (response.success == true) {
        this.getDynamicModuleData = response.data;
      }
      else {
      }
    });
  }
  getTabsName(tabs: any) {
    if (tabs && tabs.length > 0) {
      return tabs.map((t: any) => t.dynamicTabName)?.join(",");
    } else {
      return null;
    }         
  }


  selectedRow(event: any) {
    {
      const dialogRef = this.dialog.open(DailogBoxComponent, {
        data:{
          rowData: event.dataItem,
          isEdit: true
        }
      });
      dialogRef.afterClosed().subscribe((isReloadRequired: any) => {
        this.getGetDynamicModules();
      });

    }
  }


}
