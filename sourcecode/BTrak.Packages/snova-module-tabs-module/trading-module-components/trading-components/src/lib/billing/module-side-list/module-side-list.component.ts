import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'module-side-list',
    templateUrl: './module-side-list.component.html'
})

export class ModuleSideListComponent implements OnInit {
    moduleList: any = [];
    @Output() refreshModuleChangeEmit = new EventEmitter<any>();
    moduleName: any;
    selectedModuleId: any;
    @Input("selectedModule")
    set _selectedModule(data: any) {
        if (data) {
            this.selectedModuleId = data;
        }
    }
    @Input("moduleList")
    set _moduleList(data: any) {
        if (data) {
            this.moduleList = data;
            if(this.moduleList.length>0)
            // this.moduleName=this.moduleList[0].dynamicModuleName;
            this.moduleName=this.moduleList.find(x=> x.dynamicModuleId==this.selectedModuleId).dynamicModuleName;
        }
    }
    constructor() { }

    ngOnInit(): void {
    }

    emitSelectedModule(item: any) {
        this.moduleName = item.dynamicModuleName;
        this.refreshModuleChangeEmit.emit(item.dynamicModuleId);
    }
}