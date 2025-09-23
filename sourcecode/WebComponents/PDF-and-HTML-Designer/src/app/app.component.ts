import { Component, ViewChild, OnInit } from '@angular/core';
import { CustomToolbarItemModel, DocumentEditor, DocumentEditorComponent, DocumentEditorContainerComponent, PrintService, ToolbarService } from '@syncfusion/ej2-angular-documenteditor';
import { TitlebarComponent } from '../app/components/titlebar/titlebar.component';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import { ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { Dialog } from '@syncfusion/ej2-popups';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { DocumentService } from './services/document.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ToolbarService, PrintService]
})
export class AppComponent implements OnInit {
 
  ngOnInit(): void {

  }

}