import { ChangeDetectorRef, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import '../../../assets/fontawesome-icons';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { WebPagesService } from 'src/app/services/webpages.service';
import { WebPageTemplatesListComponent } from '../templatesListPopup/templates-list-popup.component';
import { CustomAppBaseComponent } from 'src/app/constants/componentbase';
import { LocalStorageProperties } from 'src/app/constants/localstorage-properties';

@Component({
  selector: 'app-web-page-viewer',
  templateUrl: './web-page-viewer.component.html'
})
export class WebPageViewerComponent implements OnInit {
  htmlString: string;
  path: string;
  isAppStoreAccess: boolean;
  @Input() set isAppStoreVisible(data: any) {
    console.log(data);
    this.isAppStoreAccess = data;
  }

  constructor(private cd: ChangeDetectorRef,private router: Router,private sanitizer: DomSanitizer, private webPagesService:WebPagesService,private activatedRoute: ActivatedRoute,public dialog: MatDialog) { 
    this.path = this.router.url;
    this.getWebPageView();
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
  getTemplateById(id){
    this.webPagesService.getgriddata(id).subscribe((response: any) => {
      let result = response.data[0];
      this.htmlString= result.htmlFile;
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
  getWebPageView(){
    let getWebPageModel={
      path:this.path
    }
    this.webPagesService.getWebPageView(getWebPageModel).subscribe((response: any) => {
      let result = response.data[0];
      this.getTemplateById(result.templateId);
    })
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}