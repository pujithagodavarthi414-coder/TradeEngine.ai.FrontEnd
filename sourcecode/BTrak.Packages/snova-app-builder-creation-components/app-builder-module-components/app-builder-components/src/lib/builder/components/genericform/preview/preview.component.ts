import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DocumentEditor, DocumentEditorComponent, DocumentEditorContainer } from '@syncfusion/ej2-angular-documenteditor';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
})
export class PreviewComponent implements OnInit { 
    
    @ViewChild('document_editor_preview')
    public documentEditorPreview!: DocumentEditorComponent;
    public sfdtformat : any
    previewType:string ="pdf";
    constructor(private cdRef: ChangeDetectorRef,) {

    }
    ngAfterViewInit(): void {
      setTimeout(() => {
        this.documentEditorPreview.open(this.sfdtformat);
        }, 500);
        this.cdRef.detectChanges();
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