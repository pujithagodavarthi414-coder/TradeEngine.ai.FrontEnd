import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DocumentEditor, DocumentEditorComponent, DocumentEditorContainer } from '@syncfusion/ej2-angular-documenteditor';
import { DocumentService } from 'src/app/services/document.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
})
export class PreviewComponent implements OnInit { 
    
    @ViewChild('document_editor_preview')
    public documentEditorPreview!: DocumentEditorComponent;
    public sfdtformat : any
    previewType:string ="pdf";
    constructor(private service: DocumentService) {

    }
    ngAfterViewInit(): void {
      setTimeout(() => {
        this.documentEditorPreview.open(JSON.parse(this.sfdtformat));
        }, 500);
        //this.documentEditorPreview.open(JSON.parse(this.sfdtformat));
    }
    @Input("sfdtdata")
    set sfdtdata(data: any) {
            this.sfdtformat = data;
        
    }
    @Input("previewType")
    set _previewType(data: any) {
            if(data)
            this.previewType = data;  
    }
    ngOnInit(): void {
    }
    onCreate(): void {
      this.documentEditorPreview.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/';
      if(this.previewType=="html")
      this.documentEditorPreview.layoutType='Continuous';
  }
    

}