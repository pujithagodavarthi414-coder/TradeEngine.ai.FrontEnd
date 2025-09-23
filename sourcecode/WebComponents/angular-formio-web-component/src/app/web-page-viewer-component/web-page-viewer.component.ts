import { ChangeDetectorRef, ViewChild, ViewChildren } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import '../../app/globaldependencies/helpers/fontawesome-icons';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { WebPagesService } from 'src/app/services/webpages.service';
import { WebPageTemplatesListComponent } from '../templatesListPopup/templates-list-popup.component';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageProperties } from '../globaldependencies/constants/localstorage-properties';
import { WebTemplateInputModel } from '../models/template-input.model';

@Component({
  selector: 'app-web-page-viewer',
  templateUrl: './web-page-viewer.component.html'
})
export class WebPageViewerComponent implements OnInit {
  path: string = "/";
  templateId :string;
  isAppStoreAccess: boolean;
  templateView:boolean = true;
  template:any = null;
  @Input() set isAppStoreVisible(data: any) {
    console.log(data);
    this.isAppStoreAccess = data;
  }
  
  @Input() set dynamicTemplate(template: any) {
    if(template && template.templateId)
    {
      console.log(template.templateId);
      console.log(template.genericFormSubmittedId);
      var webTemplate : WebTemplateInputModel = {
        templateId:template.templateId,
        genericFormSubmittedId:template.genericFormSubmittedId,
        roleId:null
    }
      this.generateWebTemplate(webTemplate); 
    }
    else{
      this.getWebPageView();
    }
  }
  

  @Output() dynamicRoute = new EventEmitter<string>();
  userRoles:string;

  constructor(private cd: ChangeDetectorRef,private sanitizer: DomSanitizer, private webPagesService:WebPagesService,public dialog: MatDialog
    ,private toastr: ToastrService, ) { 
      var userModel = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel));
         if(userModel)
         {
            this.userRoles= userModel.roleIds;
         }
  }

  ngOnInit() {
    
  }

  opentemplates() {
    const dialogRef = this.dialog.open(WebPageTemplatesListComponent, {
      minWidth: "80vw",
      minHeight: "50vh",
    });
    
        dialogRef.afterClosed().subscribe(result => {
            this.saveWebPageView(result._id);
        });
  }

  generateWebTemplate(template:WebTemplateInputModel){
    template.roleId = this.userRoles;
    this.webPagesService.generateWebTemplate(template).subscribe((response: any) => {
      if(response.success==true)
      {
      this.template = response.data;
      }
      else{
        this.template = null;
        const validationMessage = response.apiResponseMessages[0].message;
        this.toastr.error(validationMessage);
      }
    })
  }

  saveWebPageView(id){
    let saveWebPageModel={
      path:this.path,
      templateId:id
    }
    this.webPagesService.saveWebPageView(saveWebPageModel).subscribe((response: any) => {
      let result = response.data;
      this.getWebPageView();
    })
  }

  getWebPageView() {
    let getWebPageModel = {
      path: this.path
    }
    this.webPagesService.getWebPageView(getWebPageModel).subscribe((response: any) => {
      let result = response.data[0];
      var template : WebTemplateInputModel = {
          templateId:result.templateId,
          genericFormSubmittedId:null,
          roleId:null
      }
      this.generateWebTemplate(template);
      if (result.templateId) {
        try {
         // this.router.navigateByUrl('webview/' + result.templateId);
         this.dynamicRoute.emit('webview/' + result.templateId);
        }
        catch (error) {
          console.error('Error occurred while dynamic web routing:', error);
        }
      }

    })
  }

  dynamicButtonRouteEvent(event)
  {
    if (event) {
      try {
       this.dynamicRoute.emit(event);
      }
      catch (error) {
        console.error('Error occurred while dynamic web button routing:', error);
      }
    }
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  templateViewAction(value){
    this.templateView = value;
  }

}