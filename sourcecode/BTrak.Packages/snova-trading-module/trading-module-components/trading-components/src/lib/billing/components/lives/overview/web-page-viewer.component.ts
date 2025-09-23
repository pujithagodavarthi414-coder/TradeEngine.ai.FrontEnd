import { Component, OnInit, Input, ViewEncapsulation, Inject, ChangeDetectorRef, ViewContainerRef, ViewChild, TemplateRef , NgModuleRef , Compiler, Type, NgModuleFactory } from '@angular/core';

@Component({
  selector: 'app-web-page-view-component',
  templateUrl: './web-page-viewer.component.html'
})

export class WebPageViewComponent implements OnInit {
  isAppStoreAccess=true;
  constructor() {
  }

  ngOnInit() {
  }
}