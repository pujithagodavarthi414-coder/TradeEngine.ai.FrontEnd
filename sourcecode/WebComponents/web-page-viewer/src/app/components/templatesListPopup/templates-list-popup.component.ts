import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild, Inject, TemplateRef, NgModuleFactoryLoader, ViewContainerRef, Type, NgModuleRef, NgModuleFactory, Compiler } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable, Subject, Subscription, of } from "rxjs";
import * as _ from 'underscore';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap'
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { WebPagesService } from "../../services/webpages.service";
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
@Component({
  selector: "app-templates-list-popup",
  templateUrl: "./templates-list-popup.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WebPageTemplatesListComponent {
  pag: any;
  fromSearch: boolean = false;
  anyOperationInProgress: boolean;
  canAccessDragOption = true;
  loadingCompleted = false;
  loadingApps=false;
  searchText = "";
  itemsPerPage: number = 16;
  currentPage: number = 1;
  totalItems: number = 0;
  Array = Array;
  num = 16;
  loaded: boolean = false;
  webPageTemplates=[];
    validationMessage: any;

  constructor(private webPagesService:WebPagesService,public AppDialog: MatDialogRef<WebPageTemplatesListComponent>,private cdRef: ChangeDetectorRef, private toastr: ToastrService) {
  }

  ngOnInit() {
        this.getPdfTemplates();
  }


  searchAppStore(event) {
    this.currentPage = 1;
    this.getPdfTemplates();
  }

  getPdfTemplates() {
    this.loadingApps=true;
    this.webPagesService.getPdfTemplates(this.searchText).subscribe((responseData: any) => {
        const success = responseData.success;
        if (success) {
            if (responseData.data) {
                this.loadingApps=false;
                var data = responseData.data;
                this.webPageTemplates = data;
                this.cdRef.detectChanges();
            }
        } else {
            this.validationMessage = responseData.apiResponseMessages[0].message;
            this.toastr.error("", this.validationMessage);
        }
    });
  }
  onSelect(webPageTemplate){
    this.AppDialog.close(webPageTemplate);
  }

  pageChanged(currentPage) {
    this.currentPage = currentPage;
    this.getPdfTemplates();
  }

  onNoClick(): void {
    this.AppDialog.close();
}

  initializeWidgets() {
    //this.loadWidgetsList();
    this.getPdfTemplates();
  }
  closeSearch() {
    this.searchText = "";
    this.currentPage = 1;
    this.itemsPerPage = 16;
      this.getPdfTemplates();
  }
  ngOnDestroy() {
  }

}