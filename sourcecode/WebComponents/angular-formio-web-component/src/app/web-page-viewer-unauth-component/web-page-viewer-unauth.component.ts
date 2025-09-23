import { ChangeDetectorRef, ViewChild, ViewChildren } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import '../globaldependencies/helpers/fontawesome-icons';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { WebPagesService } from 'src/app/services/webpages.service';
import { WebPageTemplatesListComponent } from '../templatesListPopup/templates-list-popup.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-web-page-viewer-unauth',
  templateUrl: './web-page-viewer-unauth.component.html'
})
export class WebPageViewerUnAuthComponent implements OnInit {
  path: string = "/";
  templateId :string;
  templateView:boolean = true;
  template:any =null;

  @Input() set dynamicTemplate(template: any) {
    if(template && template.templateId)
    {
      console.log(template.templateId);
      console.log(template.genericFormSubmittedId);
      this.generateWebTemplateUnAuth(template); 
    }
    else{
      console.log("no template");
    }
  }

  @Output() dynamicRoute = new EventEmitter<string>();

  constructor(private cd: ChangeDetectorRef,private sanitizer: DomSanitizer, private webPagesService:WebPagesService,public dialog: MatDialog
    ,private toastr: ToastrService) { 
  }

  ngOnInit() {
  }


  generateWebTemplateUnAuth(template){
    this.webPagesService.generateWebTemplateUnAuth(template).subscribe((response: any) => {
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