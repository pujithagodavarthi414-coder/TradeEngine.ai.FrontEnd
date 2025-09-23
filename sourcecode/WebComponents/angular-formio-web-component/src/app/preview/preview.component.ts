import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DocumentEditor, DocumentEditorComponent, DocumentEditorContainer } from '@syncfusion/ej2-angular-documenteditor';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './preview.component.html',
})
export class PDFPreviewComponent implements OnInit { 
    
    @ViewChild('document_editor_preview')
    public documentEditorPreview!: DocumentEditorComponent;
    public sfdtformat : any
    constructor() {

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
    ngOnInit(): void {
    }
    

}