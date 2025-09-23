import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AddModulesService } from '../services/add-modules.service';
import { RoleModel } from '../models/role-model';
import { ActivatedRoute, Router } from '@angular/router';
import { SPINNER } from 'ngx-ui-loader';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  loadingIndicator: boolean;
  selectedIndex: any;
  links: any = [];
  moduleList: any = [];
  selectedModule: any;
  selectedTabId: any;
  totalLoadingTime: number = 0;
  interval;
  spinnerType = SPINNER.circle;
  tabsLoadingIndicator: boolean;
  selectedModuleId: any;
  routingLoad: boolean;
  reAllocateTab: boolean;
  constructor(private route: ActivatedRoute, private addModulesService: AddModulesService, private router: Router, private cdRef:ChangeDetectorRef) { 
    
    this.route.params.subscribe((routeParams => {
      if (routeParams.moduleid) {
        this.selectedModuleId = routeParams.moduleid;
        this.selectedTabId = routeParams.tabid;
        localStorage.setItem("isModuleTab","true");
        this.getGetDynamicModules();
      }else{
        this.getGetDynamicModules();
      }
    }));
  }

  ngOnInit(): void {
    // this.getGetDynamicModules();
  }

  getGetDynamicModules() {
    this.loadingIndicator = true;
    this.totalLoadingTime = 0;
    this.startTimer();
    var companyModel = new RoleModel();
    companyModel.isArchived = false;
    this.addModulesService.getGetDynamicModules(companyModel).subscribe((response: any) => {
      if (response.success == true && response.data && response.data.length > 0) {
        this.moduleList = response.data;
        if(this.selectedModuleId != "undefined" && this.selectedModuleId!=null){
          if(this.moduleList.length>0){
            this.selectedModule=this.moduleList.find(x=>x.dynamicModuleId===this.selectedModuleId);
            this.selectedModuleId=this.selectedModule.dynamicModuleId;
          }else{
          this.selectedModule = this.moduleList && this.moduleList.length > 0 ? this.moduleList[0] : null;
          this.selectedModuleId=this.selectedModule.dynamicModuleId;
          }
        } else{
          this.selectedModule = this.moduleList && this.moduleList.length > 0 ? this.moduleList[0] : null;
          this.selectedModuleId=this.selectedModule.dynamicModuleId;
        }
        this.getGetDynamicModuleTabs(this.selectedModule.dynamicModuleId);
      }
      else {
      }
      this.loadingIndicator = false;
    });
  }
  getGetDynamicModuleTabs(moduleId) {
    this.tabsLoadingIndicator=true;
    this.totalLoadingTime = 0;
    this.startTimer();
    this.addModulesService.getGetDynamicModuleTabs({dynamicModuleId:moduleId}).subscribe((response: any) => {
      if (response.success == true && response.data && response.data.length > 0) {
    this.links = response.data && response.data.length > 0 ? response.data : [];
    if(this.selectedTabId && !this.reAllocateTab){
      this.selectedIndex = this.links.findIndex((x: any) => x.dynamicTabId == this.selectedTabId);
    }else{
    this.selectedTabId = this.links && this.links.length > 0 ? this.links[0]?.dynamicTabId : null;
    this.selectedIndex =0;
    this.reAllocateTab=false;
    }
    this.router.navigate(["module/module-list/"+this.selectedModuleId+"/"+this.selectedTabId]);
    this.routingLoad = true;
      }
      else {
      }
      this.tabsLoadingIndicator=false;
    });
    this.cdRef.detectChanges();
  }

  refreshModuleChangeEmit(id: any) {
    this.selectedModule = this.moduleList.find((x: any) => x.dynamicModuleId == id);
    this.selectedModuleId=this.selectedModule.dynamicModuleId;
    this.reAllocateTab=true;
    this.getGetDynamicModuleTabs(id);
  }

  onTabChangeEvent(event: any) {
    this.selectedTabId = this.links[event.index]?.dynamicTabId;
    this.selectedIndex = this.links.findIndex((x: any) => x.dynamicTabId == this.selectedTabId);
    this.router.navigate(["module/module-list/"+this.selectedModuleId+"/"+this.selectedTabId]);
    this.routingLoad = true;
  }
  goToAddModule() {
  this.router.navigate(['module/add-module']);
  }
  startTimer() {
    this.interval = setInterval(() => {
      this.totalLoadingTime++;
    }, 1000)
  }
}
