import { Component, ViewChild, OnInit, ElementRef, ChangeDetectorRef, Input, ViewEncapsulation, Output, EventEmitter, TemplateRef, ContentChild, ViewChildren, QueryList } from '@angular/core';
import { CustomToolbarItemModel, DocumentEditor, DocumentEditorComponent, DocumentEditorContainerComponent, DocumentEditorSettingsModel, PrintService, ToolbarService } from '@syncfusion/ej2-angular-documenteditor';
import { TitlebarComponent } from '../titlebar/titlebar.component'
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import { ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { Dialog } from '@syncfusion/ej2-popups';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { DocumentService } from 'src/app/services/document.service';
import { WEB_API_ACTION } from 'src/app/models/data';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { MatDialog } from '@angular/material/dialog';
import { GenericFormService } from 'src/app/services/generic-form-service';
import { CustomApplicationSearchModel } from 'src/app/models/custom-application-search.model';
import { WorkflowModel } from 'src/app/models/workflow-model';
import { WorkflowService } from 'src/app/services/workflows.service';
import { MatOption } from '@angular/material/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LocalStorageProperties } from 'src/app/constants/localstorage-properties';

@Component({
  selector: 'app-document-editor',
  templateUrl: './document-editor.component.html',
  providers: [ToolbarService, PrintService]
})

export class DocumentEditormainComponent implements OnInit {
  usersList: any;
  templatepermissionsDialogId: string;
  randomColors: string[] = [];
  userRoles: string;
  userId: string;
  @Input("selectedHtmlFile")
  set _selectedHtmlFile(data: any) {
    if (data) {
      this.selectedHtmlFile = data;
      this.templateType = data.templateType;
      this.previewType = data.templateType;
      this.allowAnonymous = data.allowAnonymous;

      if (data.templateTagStyles) {
        this.templateTagStyles = data.templateTagStyles;
      }
      else {
        this.templateTagStyles = [];
      }

      if (data.templatePermissions) {
        this.templatePermissions = data.templatePermissions;
        this.templatePermissions.forEach(element => {
          this.randomColors.push(this.getRandomColor())
        });
      }
      else {
        this.templatePermissions = [];
      }
    }

  };
  @Output() loadHtmlTemplates = new EventEmitter();

  @ViewChild("openAppPreview") openAppPreview: TemplateRef<any>;
  @ViewChild("addFormDialog") addFormDialog: TemplateRef<any>;
  @ViewChild("templatePermissionsPopUp") templatePermissionsPopUp: TemplateRef<any>;
  @ViewChild("dynamicTableDialog") dynamicTableDialog: TemplateRef<any>;
  @ViewChild("addButtonDialog") addButtonDialog: TemplateRef<any>;
  @ViewChild("tileViewDialog") tileViewDialog: TemplateRef<any>;
  @ViewChild("dynamicImageDialog") dynamicImageDialog: TemplateRef<any>;
  @ViewChild('iframe') iframe: ElementRef;
  @ViewChild('documenteditor_default')
  public container: DocumentEditorContainerComponent;
  @ViewChild('addFormFirstField', { static: false }) addFormFirstField!: ElementRef;
  @ViewChild('dynamicTableFirstField', { static: false }) dynamicTableFirstField!: ElementRef;
  @ViewChild('addButtonFirstField', { static: false }) addFormButtonField!: ElementRef;
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  @ViewChild('docDialog') public docDialog: DialogComponent;
  @ViewChild('roleInput', { static: false }) roleInput: ElementRef<HTMLInputElement>;
  @ViewChild('userInput', { static: false }) userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  selectedHtmlFile: any;
  public titleBar: TitlebarComponent;
  public dialogObject: Dialog;
  public contentChanged: boolean;
  public treeview: TreeViewComponent;

  public idCollection: string[] = [];
  showpreview: boolean = false;
  public content: any;
  public showpopup: boolean = false
  public documenturl: any = '';
  templateId: any = null;
  iframeContent: any = "";
  showhtmlPreview: boolean = false;
  sfdtdata: string = "";
  addDataSource: boolean = false;
  TemplateNameForm: FormGroup;
  mongoQueryParams: { name: string; type: string }[] = [];
  mongoQueryDummyValues: { name: string; value: string }[] = [];
  showaddMongoQueryParams: boolean = false;
  showaddMongoQueryDummyValues: boolean = false;
  addDataSourceFormSubmitted: boolean = false;
  savedDataSource: any;
  tempMenuItems: any = [];
  newTemplateId: string = Guid.create().toString();
  editDataSourceId: any = null;
  editMongoParamtypeIndex: any = null;
  editmongoQueryDummyValueIndex: any = null;
  anyOperationInProgress: boolean = false;
  previewDialogId: string;
  editDataSourceValues: { id: string, dataSourceName: string, mongoQuery: string, mongoParamsType: { name: string; type: string }[], mongoDummyParams: { name: string; value: string }[] } = null;
  addFormDialogId: string;
  dynamicTablePropertiesDialogId: string;
  addButtonDialogId: string;
  tileViewDialogId: string;
  dynamicImageDialogId: string;
  addForm: FormGroup;
  dynamicTablePropertiesForm: FormGroup;
  addButton: FormGroup;
  tileViewFormGroup: FormGroup;
  dynamicImageFormGroup: FormGroup;
  addFormTouched: boolean = false;
  dynamicTablePropertiesTouched: boolean = false;
  addButtonClicked: boolean = false;
  buttonShapes = ["Rectangle sharp edges", "Rectangle curved edges", "Oval"];
  colors = ["aqua", "black", "blue", "fuchsia", "gray", "green", "lime", "maroon", "navy", "olive", "purple", "red", "silver", "teal", "white", "yellow"];
  buttonEventTypes = ["Page navigation", "Trigger", "Workflow"];
  showDataSourceDiv: boolean = true;
  dynamicDocumentEditorFlexValue: number = 85;
  dynamicDocumentEditorFlexValueLg: number = 80;
  dynamicDocumentEditorFlexValueLtLg: number = 70;
  dynamicDataSourceFlexValue = 15;
  dynamicDataSourceFlexValueLg = 20;
  dynamicDataSourceFlexValueLtLg = 30;
  customApplicationsData: any;
  selectedCustomApplication: any;
  isReadOnly = true;
  previewType: string = null;
  settings: DocumentEditorSettingsModel = { optimizeSfdt: false };
  templateType: string = null;
  workflowsLoading: boolean = false;
  validationMessage: any;
  workflows: any = [];
  temp: any;
  existingButtons: string[];
  allowAnonymous: boolean = false;
  allRoles: { roleId: string, roleName: string, userId: string, userName: string }[] = [];
  allUsers: { roleId: string, roleName: string, userId: string, userName: string }[] = [];
  templatePermissionsForm: FormGroup;
  @ViewChild("allSelected") private allSelected: MatOption;
  @ViewChild("allEditSelected") private allEditSelected: MatOption;
  rolesCtrl = new FormControl();
  usersCtrl = new FormControl();
  rolesPermCtrl = new FormControl('edit');
  usersPermCtrl = new FormControl('edit');
  filteredRoles: Observable<any[]>;
  filteredUsers: Observable<any[]>;
  roles: any[] = [];
  users: any[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  templatePermissions: any;

  BtnClick() {
    this.docDialog.show();
  }
  dynamicTables: string[] = [];
  templateTagStyles: any = [];
  showtreePopUp: boolean = false;
  public range: Range;
  public allowDragAndDrop: boolean = true;
  public hostUrl: string = 'https://ej2services.syncfusion.com/production/web-services/';
  public dialogButtons: ButtonPropsModel[] = [
    { buttonModel: { content: 'Insert', isPrimary: true }, click: this.onInsert.bind(this) },
    { buttonModel: { content: 'Cancel' }, click: this.dialogOverlay.bind(this) }];

  constructor(private service: DocumentService, private http: HttpClient, private toastr: ToastrService, private cdRef: ChangeDetectorRef,
    public previewDialog: MatDialog, public formDialog: MatDialog, public buttonDialog: MatDialog, public tileViewMatDialog: MatDialog,
    public dynamicTablePropertiesDialog: MatDialog, public dynamicImageMatDialog: MatDialog,
    private genericFormService: GenericFormService, private workflowService: WorkflowService, public templatePermissionsDialog: MatDialog) {
    this.filteredRoles = this.rolesCtrl.valueChanges.pipe(
      startWith(null),
      map((role: any | null) => role ? this._filterRoles(role) : this.allRoles.slice()));

    this.filteredUsers = this.usersCtrl.valueChanges.pipe(
        startWith(null),
        map((user: any | null) => user ? this._filterUsers(user) : this.allUsers.slice()));

  }

  ngOnInit(): void {
    var userModel = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel));
    if (userModel) {
      this.userRoles = userModel.roleIds;
      this.userId = userModel.id;
    }

    this.TemplateNameForm = new FormGroup({
      templateName: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      )
    });
    if (this.selectedHtmlFile && this.selectedHtmlFile.fileName) {
      this.templateId = this.selectedHtmlFile._id;
      this.TemplateNameForm.controls['templateName'].setValue(this.selectedHtmlFile.fileName);
    }

    this.getTreeData();
    this.service.editdocument$.subscribe((data: any) => {
      var htmlContent: any = { content: data.sfdtFile };
      console.log(htmlContent)
      this.container.documentEditor.open(JSON.stringify(htmlContent))
    })
    this.getCustomApplications();
    this.allRoles = [];
    this.allUsers=[];
    this.getRoles();
    this.getUsersBasedonRole();
  }

  onCreate(): void {
    this.container.documentEditor?.selection?.selectAll();
    // To get the selected content as sfdt
    var selectedContent: string = this.container.documentEditor.selection.sfdt;
    var titleBarElement: any = document.getElementById('default_title_bar');
    this.titleBar = new TitlebarComponent(titleBarElement, this.container.documentEditor, true, this.service, this.http);
    this.container.documentEditor.documentName = 'Document Editor';
    this.container.serviceUrl = this.hostUrl + WEB_API_ACTION;

    //edit template
    if (this.selectedHtmlFile && this.container.documentEditor) {
      if (this.selectedHtmlFile.sfdtJson) {
        var test = JSON.parse(this.selectedHtmlFile.sfdtJson);
        this.container.documentEditor.open(this.selectedHtmlFile.sfdtJson);
      }
      else {
        this.container.documentEditor.open(this.selectedHtmlFile.sfdtFile);
      }

    }
    else {
      this.container.documentEditor.openBlank();
    }

    this.titleBar.updateDocumentTitle();
    //Sets the language id as EN_US (1033) for spellchecker and docker image includes this language dictionary by default.
    //The spellchecker ensures the document content against this language.
    //this.container.documentEditor.spellChecker.languageID = 1033;
    this.container.documentEditor.spellChecker.enableOptimizedSpellCheck = true;

    setInterval(() => {
      this.updateDocumentEditorSize();
    }, 100);
    var i = 0;

    //Adds event listener for browser window resize event.
    window.addEventListener("resize", this.onWindowResize);
    document.getElementById("listview")?.addEventListener("dragstart", function (event) {
      event.dataTransfer?.setData("Text", (event.target as any).innerText);
      (event.target as any).classList.add('de-drag-target');

    });
    document.getElementById("tree")?.addEventListener("click", function (event) {
      var datadisplay = `<h1> Hello </h1>`
      if (datadisplay != null) {
        var datatext =
          document.getElementById("tree")?.innerHTML;
        datatext = datadisplay;

      }

      // event.dataTransfer?.setData("Text", (event.target as any).innerText);

    })

    // Prevent default drag over for document editor element
    this.container.documentEditor.element.addEventListener("dragover", function (event) {
      event.preventDefault();
    });
    document.getElementById("editing")?.addEventListener("dragstart", function (event) {
      event.dataTransfer?.setData("Text", (event.target as any).innerText);
      (event.target as any).classList.add('de-drag-target');

    });
    // Drop Event for document editor element
    var id: any;
    this.container.documentEditor.element.addEventListener("drop", (e) => {
      var text = e.dataTransfer?.getData('Text');//.replace(/\n/g, '').replace(/\r/g, '').replace(/\r\n/g, '');

      this.listData.forEach((data: any) => {
        if (text == data.text) {
          // text = "#"+text+"#" + '     ' + data.subMenuName
          text = "#" + text
        }
      })
      this.hierarchicalData.forEach((data: any) => {
        data.child.forEach((response: any) => {
          if (response.child != undefined && response.child.length > 0) {
            response.child.forEach((dataofchild: any) => {
              if (text == dataofchild.name) {
                text = "#" + text;
                //id = response.id;
              }
            })
          }
          else {
            if (text == response.name) {
              text = "#" + data.dataSource + "." + text;
              //id = response.id;
            }
          }
        })
      })
      this.container.documentEditor.selection.select({ x: e.offsetX, y: e.offsetY, extend: false });
      //this.container.documentEditor.editor.insertText(text);
      if (text != null) {
        this.container.documentEditor.editor.insertText(text);
        //  this.insertField(text,id);
      }
    });

    document.getElementById("tree")?.addEventListener("click", (e) => {
      var text = ''
      this.container.documentEditor.editor.insertHyperlink("www.google.com");
      this.container.documentEditor.editor.insertText(text);

      e.preventDefault();
    });

    document.addEventListener("dragend", (event) => {
      if ((event.target as any).classList.contains('de-drag-target')) {
        (event.target as any).classList.remove('de-drag-target');
      }
    });

    var treeElement: any = this.treeview.element;
    //Get all the TreeView element instances
    var instances: any = treeElement.ej2_instances;
    for (var i = 0; i < instances.length; i++) {
      //Validate whether the instance is draggable
      if (instances[i].getModuleName() == "draggable") {
        //Specify the dragging area for tree nodes in TreeView
        instances[i].dragArea = ".control_wrapper";
        break;
      }
    }
  }

  onDocumentChange(): void {
    if (!isNullOrUndefined(this.titleBar)) {
      //this.titleBar.updateDocumentTitle();
    }
    this.container.documentEditor.focusIn();
  }

  onDestroy(): void {
    //Removes event listener for browser window resize event.
    window.removeEventListener("resize", this.onWindowResize);
  }

  onWindowResize = (): void => {
    //Resizes the document editor component to fit full browser window automatically whenever the browser resized.
    this.updateDocumentEditorSize();
  }

  updateDocumentEditorSize(): void {
    //Resizes the document editor component to fit full browser window.
    // var windowWidth = window.innerWidth;
    // //Reducing the size of title bar, to fit Document editor component in remaining height.
    // var windowHeight = window.innerHeight - this.titleBar.getHeight();
    // this.container.resize(windowWidth, windowHeight);
  }

  public listData: any[] = [];

  public Preview: CustomToolbarItemModel = {
    prefixIcon: "e-de-ctnr-eye",
    tooltipText: "Tree view",
    text: "view",
    id: "view"
  };
  //Custom button.
  public addButtonTool: CustomToolbarItemModel = {
    prefixIcon: "e-icons e-button",
    tooltipText: "Add Button",
    text: "Add Button",
    id: "AddButton"
  };
  //Custom form .
  public customAddForm
    : CustomToolbarItemModel = {
      prefixIcon: "e-icons e-add-edit-form-field",
      tooltipText: "Add Form",
      text: "Add Form",
      id: "AddForm"
    };
  //Custom table 
  //Custom form .
  public dynamicTable
    : CustomToolbarItemModel = {
      prefixIcon: "e-icons e-table-2",
      tooltipText: "Dynamic Table",
      text: "Dynamic Table",
      id: "DynamicTable"
    };

  public tileView
    : CustomToolbarItemModel = {
      prefixIcon: "e-icons e-grid-view",
      tooltipText: "Tile view",
      text: "Tile view",
      id: "tile-view"
    };
  public dynamicImage
    : CustomToolbarItemModel = {
      prefixIcon: "e-icons e-image",
      tooltipText: "Dynamic image",
      text: "Dynamic image",
      id: "dynamic-image"
    };

  public items = ['New', 'Open', 'Separator', 'Undo', 'Redo', 'Separator', 'Image', 'Table', 'Hyperlink', 'Bookmark', 'TableOfContents', 'Separator',
    'Header', 'Footer', 'PageSetup', 'PageNumber', 'Break', 'InsertFootnote', 'InsertEndnote', 'Separator', 'Find', 'Separator', 'Comments', 'TrackChanges',
    'Separator', 'LocalClipboard', 'RestrictEditing', 'Separator', 'FormFields', 'UpdateFields', this.customAddForm, this.addButtonTool,this.dynamicTable, this.dynamicImage];


  public onToolbarClick(args: any): void {
    switch (args.item.id) {

      case 'Custom':
        //Disable image toolbar item.
        this.container.toolbar.enableItems(8, false);
        break;
      case 'tree':
        this.showTree();
        break;
      case 'htmlcode':
        this.showHtmlCode();
        break;
      case 'view':
        this.showView();
        break;
      case 'AddButton':
        //this.onInputFieldToolClick();
        this.openAddButtonConfigurationDialog();
        break;
      case 'AddForm':
        this.openAddFormConfigurationDialog();
        break;
      case 'DynamicTable':
        this.openDynamicTablePropertiesDialog();
        break;
      case 'tile-view':
        this.openTileViewConfigurationDialog();
        break;
      case 'dynamic-image':
        this.openDynamicImageConfigurationDialog();
        break
      case 'New':
        // var defaultSectionFormat = {
        //   headerDistance: 0,
        //   footerDistance: 0,
        //   topMargin: 10,
        //   bottomMargin: 10,

        // };
        // this.container.documentEditor.setDefaultSectionFormat(defaultSectionFormat);
        break;
      case 'custombutton':
        this.showcustomPopup();
        break;

    }
  };

  onInputFieldToolClick() {
    if (this.container && this.container.documentEditor) {
      // Get the current cursor position
      const currentPosition = this.container.documentEditor.selection.start;

      // Create a new input field text
      const inputFieldText = 'Input field';

      // Insert the input field text at the current cursor position
      this.container.documentEditor.editor.insertText(inputFieldText);
    }
  }

  showHtmlCode() {
    this.container.documentEditor.selection.selectAll();
    // To get the selected content as sfdt
    var selectedContent: string = this.container.documentEditor.selection.sfdt;
  }

  showTree() {
    this.container.documentEditor.focusIn();
    this.showtreePopUp = true;
    this.buttonClick()
  }

  onContentChange(): void {
    this.contentChanged = true;
  }
  public hierarchicalData: object[] = []
  public field: any;
  // Enable TreeView editing option

  public onInsert(): void {
    const activeElement: Element | null = this.dialogObject.element.querySelector('.char_block.e-active');
    if (activeElement) {
      this.range.insertNode(document.createTextNode((activeElement as any).textContent));
    }
    this.dialogOverlay();
  }

  public dialogOverlay(): void {
    const activeElement: Element | null = this.dialogObject.element.querySelector('.char_block.e-active');
    if (activeElement) {
      activeElement.classList.remove('e-active');
    }
    this.dialogObject.hide();
  }

  public dialogCreate(): void {
    var dialogElement: HTMLElement = document.getElementById('rteSpecial_character') as HTMLElement;
    dialogElement.onclick = (e: Event) => {
      var target: HTMLElement = e.target as HTMLElement;
      var activeElement: Element | null = this.dialogObject.element.querySelector('.char_block.e-active');
      if (target.classList.contains('char_block')) {
        target.classList.add('e-active');
        if (activeElement) {
          activeElement.classList.remove('e-active');
        }
      }
    };
  }

  public onOpenDialog(event: any) {
    // Call the show method to open the Dialog
    this.ejDialog.show();
  }

  pushChildElementsToMenu(parent) {
    for (var prop in parent) {
      if (Object.prototype.hasOwnProperty.call(parent, prop) && prop != "_id") {
        if (parent[prop] && parent[prop].constructor && parent[prop].constructor.name === "Object" && parent[prop] !== null && parent[prop].tableHeaders == null && parent[prop].tableBody == null) {
          this.pushChildElementsToMenu(parent[prop]);
        }
        else {
          this.tempMenuItems.push({ field: "", name: prop, htmlAttributes: { draggable: true } })
        }
      }
    }
  }

  getTreeData() {
    if (this.anyOperationInProgress != true) {
      this.anyOperationInProgress = true;
      var templateId = this.templateId ? this.templateId : this.newTemplateId;
      this.service.getTreeData(templateId).subscribe((result: any) => {
        var response = result.data;
        if (response) {
          response.map((parent: any) => {
            parent.name = parent.dataSource;
            parent.htmlAttributes = { draggable: false };
            parent.id = parent._id;
            parent.mongoResult = JSON.parse(parent.mongoResult);
            parent.child = [];
            this.tempMenuItems = [];
            this.pushChildElementsToMenu(parent.mongoResult);
            parent.child = this.tempMenuItems;
          })
          this.hierarchicalData = response;
          this.field = { dataSource: this.hierarchicalData, id: 'id', text: 'name', child: 'child' };
          this.checkForDynamicTables(this.field.dataSource);
        }
        this.anyOperationInProgress = false;
      })
    }
  }

  checkForDynamicTables(fieldArray) {
    this.dynamicTables = [];
    // Loop through each object in the field array
    fieldArray.forEach(item => {
      // Check if mongoResult exists
      if (item.mongoResult && typeof item.mongoResult === 'object') {
        // Loop through properties of mongoResult
        for (const property in item.mongoResult) {
          if (
            item.mongoResult[property] &&
            item.mongoResult[property].hasOwnProperty('tableHeaders') &&
            item.mongoResult[property].hasOwnProperty('tableBody')
          ) {
            // Construct the string dataSource.propertyName and push it to dynamicTables array
            const tableName = `${item.dataSource}.${property}`;
            this.dynamicTables.push(tableName);
          }
        }
      }
    });

    // Output the dynamicTables array
    console.log(this.dynamicTables);
  }

  showView() {
    this.hierarchicalData.forEach((data: any) => {
      var name: any;
      var field: any;
      data.child.forEach((response: any) => {
        if (response.child != undefined && response.child.length > 0) {
          response.child.forEach((dataofChild: any) => {
            name = dataofChild.name;
            field = dataofChild.field;
            const text = this.container.documentEditor.searchModule.findAll("#" + name);
            if (this.container.documentEditor.searchModule.searchResults.length > 0) {
              this.container.documentEditor.searchModule.searchResults.replaceAll(name + ": " + field)
            }
          })
        } else {
          name = response.name;
          field = response.field
          const text = this.container.documentEditor.searchModule.findAll("#" + name);
          if (this.container.documentEditor.searchModule.searchResults.length > 0) {
            this.container.documentEditor.searchModule.searchResults.replaceAll(name + ": " + field)
          }
        }
      })
    })
  }

  buttonClick() {
    this.ejDialog.show();
  }

  insertField(fieldName: any, draggedItemId: any): void {
    var draggedText: any = fieldName.replace(/\n/g, '').replace(/\r/g, '').replace(/\r\n/g, '');
    this.container.documentEditor.editor.insertBookmark(draggedText + draggedItemId);
    this.container.documentEditor.editor.insertText(draggedText);
    this.container.documentEditor.focusIn();
  }

  GetID() {
    var bookmarkCollection = this.container.documentEditor.getBookmarks();
    for (var i = 0; i < bookmarkCollection.length; i++) {
      if (bookmarkCollection[i].indexOf("draggedItem_") != -1) {
        this.idCollection.push(bookmarkCollection[i]);
      }
    }
  }

  bindData() {
    this.hierarchicalData.forEach((data: any) => {
      data.child.forEach((response: any) => {
        const text = this.container.documentEditor.searchModule.findAll("#" + response.name);
        if (this.container.documentEditor.searchModule.searchResults.length > 0) {
          this.container.documentEditor.searchModule.searchResults.replaceAll(response.field)
        }
        this.container.documentEditor.focusIn();
      })

    })
  }

  public onOpentreeDialog() {
    // Call the show method to open the Dialog
    this.ejDialog.show();
  }

  backbuttonclick() {
    this.service.notifyCallback(false)
  }

  previewTypeChange(event) {
    console.log(event.target.value);
    this.previewType = event.target.value;
  }

  dialogClose() {
    this.showpreview = false;
    //this.showDocmentPreview = false;
    //this.showhtmlPreview = false;
    var previewDialog = this.previewDialog.getDialogById(this.previewDialogId);
    previewDialog.close();
  }

  showcustomPopup() {
    this.showpopup = true;
  }

  filesChange(event: any) {
    const file = event.target.files;
    this.uploadEventHandler(file[0]);
  }

  uploadEventHandler(files: any) {
    var file = files;
    var fileSize = file.size;
    var fileName = file.name;
    var filetype = file.type;
    var blockSizeInKB = 1024;
    var blockSize = blockSizeInKB * 1024;
    var blocks: any = [];
    var offset = 0;
    var index = 0;
    var list = "";
    while (offset < fileSize) {
      var start = offset;
      var end = Math.min(offset + blockSize, fileSize);
      blocks.push({
        filetype: filetype,
        index: index,
        start: start,
        end: end,
        name: fileName
      });
      list += index + ",";
      offset = end;
      index++;
    }
    var putBlocks: any = [];
    var responseIndex = 0;
    var moduleTypeId = 1;
    var ser = this;

    blocks.sort().forEach((block: any) => {
      putBlocks.push(block);
      var blob = file.slice(block.start, block.end);
      var fd = new FormData();
      fd.append("file", blob);
      this.service.uploadFileUrl(fd, block.index, moduleTypeId, fileName, filetype, null).subscribe((response: any) => {
        if (response.success) {
          blocks[responseIndex]
          responseIndex = responseIndex + 1;
          var list = putBlocks.map(function (el: any) { return el.index }).join(',');
          this.service.getBlobUrl(moduleTypeId, fileName, list, filetype, null).subscribe((response1: any) => {
            if (response1.success) {
              var data = {
                fileName: fileName,
                filePath: response1.data
              }
            } else {
            }
          })
        }

      })
    })
  }

  clickPdf() {
    this.saveAsPDF();
  }

  saveAsDocument() {
    this.container.documentEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {

      //  The blob can be processed further 
      var fileName = this.container.documentEditor.documentName + '.docx';
      var formData = new FormData();
      var filetype = exportedDocument.type;
      formData.append('file', exportedDocument);
      var httpRequest = new XMLHttpRequest();
      this.service.uploadFileUrl(formData, 0, 1, fileName, filetype, null).subscribe((response: any) => {
        if (response.success) {
          this.service.getBlobUrl(1, fileName, 0, filetype, null).subscribe((response1: any) => {
            if (response1.success) {
              console.log("response", response1)
            }
          });
        }
      })
    });
  }

  templateTypeChange(event) {
    console.log(event.target.value);
    this.templateType = event.target.value;
  }

  saveTemplate() {
    var hasAccessToEdit = this.canEditTemplate()
    if (hasAccessToEdit) {
      if (this.templateType) {
        var sfdt: any = this.container.documentEditor.serialize();
        var base64String = btoa(unescape(encodeURIComponent(sfdt)));
        var sfdtString = sfdt.toString();

        var datasources: string[] = [];
        if (this.hierarchicalData != null) {
          this.hierarchicalData.forEach((data: any) => {
            datasources.push(data.dataSource);
          })
        }

        if (this.templateTagStyles != null && this.templateTagStyles.length > 0) {
          this.templateTagStyles.forEach((style, index) => {
            if (!sfdtString.includes(style.tagName)) {
              this.templateTagStyles.splice(index, 1);
            }
          })
        }

        var templateDetails = {
          fileName: this.TemplateNameForm.value.templateName,
          templateType: this.templateType,
          sFDTFile: base64String,
          sfdtJson: sfdtString,
          templateTagStyles: this.templateTagStyles,
          allowAnonymous: this.allowAnonymous,
          _id: this.templateId ? this.templateId : this.newTemplateId,
          datasources: datasources.length ? datasources.join(', ') : null,
          templatePermissions: this.templatePermissions
        };

        if (templateDetails.fileName != "" && templateDetails.fileName != null) {
          if (this.templateId != "" && this.templateId != null) {
            if (this.anyOperationInProgress != true) {
              this.anyOperationInProgress = true;
              this.service.updateTemplate(templateDetails).subscribe((update: any) => {
                if (update.success == true) {
                  this.templateId = update.data;
                  this.toastr.success('Template updated successfully');
                  this.loadHtmlTemplates.emit(true);
                }
                else {
                  this.toastr.error("Template update failed");
                }
                this.anyOperationInProgress = false;
              })
            }
          } else {
            if (this.anyOperationInProgress != true) {
              this.anyOperationInProgress = true;
              this.service.saveTemplate(templateDetails).subscribe((responsedata: any) => {
                if (responsedata.success == true) {
                  this.templateId = responsedata.data._id;
                  this.iframeContent = responsedata.data.htmlFile;
                  this.toastr.success('Template saved successfully');
                  this.loadHtmlTemplates.emit(true);
                } else {
                  this.toastr.error("Template saving failed");
                }
                this.anyOperationInProgress = false;

              })
            }
          }
        }
        else {
          this.toastr.error("Please give template name");
        }
      }
      else {
        this.toastr.error("Please select template type")
      }
    }
    else {
      this.toastr.error("User or role has no access to edit the template")
    }
  }


  saveAsPDF() {
    this.container.documentEditor.saveAsBlob('Sfdt').then((exportedDocument: Blob) => {

      //  The blob can be processed further 
      var fileName = this.container.documentEditor.documentName + '.sfdt';
      var formData = new FormData();
      var filetype = exportedDocument.type;
      formData.append('file', exportedDocument);
      var httpRequest = new XMLHttpRequest();
      this.service.uploadFileUrl(formData, 0, 1, fileName, filetype, null).subscribe((response: any) => {
        if (response.success) {
          this.service.getBlobUrl(1, fileName, 0, filetype, null).subscribe((response1: any) => {
            if (response1.success) {
              this.service.gethtmlBlob(response1.data, ".html", this.container.documentEditor.documentName).subscribe((htmlfile: any) => {
                this.service.getpdfBlob(htmlfile, ".pdf", this.container.documentEditor.documentName).subscribe((pdffile: any) => {
                })
              })
            }
          });

        }
      })
    })
  }

  previewasDocument() {
    this.container.documentEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {

      //  The blob can be processed further 
      var fileName = this.container.documentEditor.documentName + '.docx';
      var formData = new FormData();
      var filetype = exportedDocument.type;
      formData.append('file', exportedDocument);
      var httpRequest = new XMLHttpRequest();
      this.service.uploadFileUrl(formData, 0, 1, fileName, filetype, null).subscribe((response: any) => {
        if (response.success) {

          this.service.getBlobUrl(1, fileName, 0, filetype, null).subscribe((response1: any) => {
            if (response1.success) {
              this.documenturl = response1.data
            }
          });

          // }
        }
      })
    });
  }

  open() {
    var url = "https://bviewstorage.blob.core.windows.net/4dbd4adf-0635-4dc8-bfaa-c07c585ddece/hrm/854c302e-1f6d-427c-be2a-d78ef4a1b68a/version-1/Getting_Started-1.html";
    var contenttype: any;
    if (url.includes(".html")) {
      contenttype = ".html"
    }
    if (url.includes(".docx")) {
      contenttype = ".docx"
    }
    if (url.includes(".pdf")) {
      contenttype = ".pdf"
    }
    this.service.importfromurl(url, contenttype).subscribe((data: any) => {
      this.container.documentEditor.open(data);

    })
  }

  html() {
    this.convertSfdtToHtml()
  }

  async convertSfdtToHtml(): Promise<string> {
    this.container.serviceUrl = 'https://ej2services.syncfusion.com/production/web-services/';
    const htmlBlob: Blob = await this.container.documentEditor.saveAsBlob('Html');
    const htmlString: string = await this.getBlobContentAsString(htmlBlob);
    console.log(htmlString)
    this.iframeContent = htmlString
    return htmlString;
  }

  async getBlobContentAsString(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsText(blob);
    });
  }

  previewTemplate() {
    if (this.previewType) {
      var sfdtData: any = this.container.documentEditor.serialize();
      this.sfdtdata = sfdtData;
      this.showpreview = true;
      this.openPreviewDialog();
    }
    else {
      this.toastr.error("Please select preview type");
    }
  }

  openPreviewDialog() {
    this.previewDialogId = "preview-popup";
    const dialogRef = this.previewDialog.open(this.openAppPreview, {
      width: this.previewType == "pdf" ? "50%" : "80%",
      maxHeight: "90vh",
      disableClose: true,
      id: this.previewDialogId,
      //data: { items: applications }
    });

  }
  closeAppPreview() {
    var previewDialog = this.previewDialog.getDialogById(this.previewDialogId);
    previewDialog.close();
  }
  openAddDataSource() {
    var hasAccessToEdit = this.canEditTemplate()
    if (hasAccessToEdit) {
    this.addDataSource = true;
    }
    else {
      this.toastr.error("User or role has no access to edit the template")
    }
  }

  refreshTreeDataEvent(event) {
    this.getTreeData();
  }
  closeDataSourceEvent(event) {
    this.addDataSource = false;
    this.editDataSourceValues = null;
  }

  editDataSource(data) {
    this.openAddDataSource();
    this.editDataSourceValues = { id: data.id, dataSourceName: data.dataSource, mongoQuery: data.mongoQuery, mongoParamsType: data.mongoParamsType, mongoDummyParams: data.mongoDummyParams }
  }

  archiveDataSource(data) {
    if (data != null) {
      var dataSourceDetails = {
        _id: data._id,
        templateId: this.templateId,
        dataSourceMongoQuery: { dataSource: data.dataSource, mongoQuery: data.mongoQuery },
        dataSorceParamsType: data.mongoParamsType,
        dataSourceDummyParamValues: data.mongoDummyParams,
        update: true,
        archive: true
      };
      if (this.anyOperationInProgress != true) {
        this.anyOperationInProgress = true;
        this.service.saveDataSource(dataSourceDetails).subscribe((responsedata: any) => {
          if (responsedata.success == true && responsedata.data != null) {
            this.toastr.success('Data source archived successfully');
            this.getTreeData();
          } else {
            this.toastr.error("Data source archiving failed");
          }
          this.anyOperationInProgress = false;
        })
      }
    }
  }

  newTemplate() {
    this.selectedHtmlFile = null;
    this.templateId = null;
    this.hierarchicalData = null;
    this.previewType = null;
    this.templateType = null;
    this.TemplateNameForm.controls['templateName'].setValue("");
    this.field = { dataSource: null, id: 'id', text: 'name', child: 'child' };
    //reduce header/footer length
    //  var defaultSectionFormat = {
    //   headerDistance: 0,
    //   footerDistance: 0,
    //   topMargin: 10,
    //   bottomMargin: 10,

    // };
    // this.container.documentEditor.setDefaultSectionFormat(defaultSectionFormat);
    this.container.documentEditor.openBlank();
  }

  openAddFormConfigurationDialog() {
    this.selectedCustomApplication = null;
    this.addForm = new FormGroup({
      customApplicationName: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      formName: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      formId: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      customApplicationId: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      formMode: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
    });
    if (this.customApplicationsData) {
      this.addFormDialogId = "add-form-dialog";
      const dialogRef = this.formDialog.open(this.addFormDialog, {
        width: '860px',
        position: {
          top: '12vh'
        },
        autoFocus: true,
        disableClose: true,
        panelClass: 'table-dialog',
        id: this.addFormDialogId,
        // panelClass: "pdf-designer-mat-dialog"
      });

      setTimeout(() => {
        this.addFormFirstField.nativeElement.focus();
      }, 1000);
    }
    else {
      this.toastr.warning("No custom applications found to add forms");
    }
  }

  openDynamicTablePropertiesDialog() {
    if (this.dynamicTables && this.dynamicTables.length > 0) {
      this.dynamicTablePropertiesForm = new FormGroup({
        tableName: new FormControl(null,
          Validators.compose([
            Validators.required
          ])
        ),
        tableWidth: new FormControl(null,
          [this.numberValidator()]
        ),
        headerFontColor: new FormControl(null,
          [this.colorValidator()]
        ),
        headerFontSize: new FormControl(null,
          [this.numberValidator()]
        ),
        headerFontBold: new FormControl(null,
        ),
        textAlign: new FormControl(null,
        ),
        headerBackGroundColor: new FormControl(null,
          [this.colorValidator()]
        ),
        tableBodyFontColor: new FormControl(null,
          [this.colorValidator()]
        ),
        tableBodyFontSize: new FormControl(null,
          [this.numberValidator()]
        ),
        // tableBodyBackgroundColor: new FormControl(null,

        // ),
        tableBodyAlternateRowColor: new FormControl(null,
          [this.colorValidator()]
        ),
        tableBorderColor: new FormControl(null,
          [this.colorValidator()]
        ),

      });
      this.dynamicTablePropertiesDialogId = "dynamic-table-dialog";
      const dialogRef = this.dynamicTablePropertiesDialog.open(this.dynamicTableDialog, {
        // width: "36%",
        // maxHeight: "90vh",
        // disableClose: true,
        width: '860px',
        position: {
          top: '12vh'
        },
        autoFocus: true,
        disableClose: true,
        panelClass: 'table-dialog',
        id: this.dynamicTablePropertiesDialogId,
        // panelClass: "pdf-designer-mat-dialog"
      });
    }
    else {
      this.toastr.warning("No dynamic tables exists in mango query");
    }
  }

  // colorValidator() {
  //   return (control: any) => {
  //     const colorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
  //     const isValid = colorRegex.test(control.value);

  //     return isValid ? null : { invalidColor: true };
  //   };
  // }

  colorValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        // If the control is empty, consider it valid
        return null;
      }

      const colorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
      const isValid = colorRegex.test(control.value);

      return isValid ? null : { invalidColor: true };
    };
  }

  numberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        // If the control is empty, consider it valid
        return null;
      }

      const numberRegex = /^[0-9]+$/;
      const isValid = numberRegex.test(control.value);

      return isValid ? null : { invalidNumber: true };
    };
  }

  openAddButtonConfigurationDialog() {
    this.customTemplateButtons();
    this.addButton = new FormGroup({
      buttonName: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      eventType: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      buttonShape: new FormControl("",
        Validators.compose([
        ])
      ),
      backgroundColor: new FormControl("",
        [this.colorValidator()]
      ),
      borderColor: new FormControl("",
        [this.colorValidator()]
      ),
      fontColor: new FormControl("",
        [this.colorValidator()]
      ),
      customButtonFunctionlity: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),
      btnNavigationUrl: new FormControl("",

      ),
      csFontSize: new FormControl("",

      ),
      customMessage: new FormControl("",

      ),
    });
    this.addButtonDialogId = "add-button-dialog";
    const dialogRef = this.buttonDialog.open(this.addButtonDialog, {
      // width: "28%",
      // maxHeight: "90vh",
      // disableClose: true,
      width: '860px',
      position: {
        top: '12vh'
      },
      autoFocus: true,
      disableClose: true,
      panelClass: 'table-dialog',
      id: this.addButtonDialogId,
    });

    setTimeout(() => {
      this.addFormButtonField.nativeElement.focus();
    }, 1000);
    this.getWorkflows();
  }

  openTileViewConfigurationDialog() {
    this.tileViewFormGroup = new FormGroup({
      tileView: new FormControl("",
        Validators.compose([
          Validators.required
        ])
      ),

    });
    this.tileViewDialogId = "tile-view-dialog";
    const dialogRef = this.tileViewMatDialog.open(this.tileViewDialog, {
      width: 'auto',
      position: {
        top: '12vh'
      },
      autoFocus: true,
      disableClose: true,
      panelClass: 'table-dialog',
      id: this.tileViewDialogId,
    });

    setTimeout(() => {
      this.addFormButtonField.nativeElement.focus();
    }, 1000);
    this.getWorkflows();
  }

  openDynamicImageConfigurationDialog() {
    this.dynamicImageFormGroup = new FormGroup({
      name: new FormControl("",
        Validators.compose([
          Validators.required
        ]),
      ),
      width: new FormControl("",
        Validators.compose([
          Validators.required
        ]),
      ),
      height: new FormControl("",
        Validators.compose([
          Validators.required
        ]),
      ),

    });
    this.dynamicImageDialogId = "dynamic-image-dialog";
    const dialogRef = this.dynamicImageMatDialog.open(this.dynamicImageDialog, {
      width: 'auto',
      position: {
        top: '12vh'
      },
      autoFocus: true,
      disableClose: true,
      panelClass: 'table-dialog',
      id: this.dynamicImageDialogId,
    });

    setTimeout(() => {
      this.addFormButtonField.nativeElement.focus();
    }, 1000);
    this.getWorkflows();
  }


  closeAddFormDialog() {
    this.addFormTouched = false;
    var docDialog = this.formDialog.getDialogById(this.addFormDialogId);
    docDialog.close();
  }

  closeTileViewDialog() {
    //this.addFormTouched = false;
    var docDialog = this.formDialog.getDialogById(this.tileViewDialogId);
    docDialog.close();
  }

  closeDynamicImageDialog() {
    //this.addFormTouched = false;
    var docDialog = this.formDialog.getDialogById(this.dynamicImageDialogId);
    docDialog.close();
  }

  closeDynamicTablePropertiesDialog() {
    this.dynamicTablePropertiesTouched = false;
    var docDialog = this.dynamicTablePropertiesDialog.getDialogById(this.dynamicTablePropertiesDialogId);
    docDialog.close();
  }


  closeAddButtonDialog() {
    this.addButtonClicked = false;
    var docDialog = this.buttonDialog.getDialogById(this.addButtonDialogId);
    docDialog.close();
  }

  addFormToEditor() {
    this.addFormTouched = true;
    if (this.addForm.valid) {
      var customFormProperties = this.addForm.value;
      if (customFormProperties.formName) {
        var formProperties = "{";
        formProperties = formProperties + '"' + "formName" + '"' + ":" + '"' + customFormProperties.formName + '"'
        if (customFormProperties.formId) { formProperties = formProperties + "," + '"' + "formId" + '"' + ":" + '"' + customFormProperties.formId + '"' }
        if (customFormProperties.customApplicationId) { formProperties = formProperties + "," + '"' + "customApplicationId" + '"' + ":" + '"' + customFormProperties.customApplicationId + '"' }
        if (customFormProperties.formMode) { formProperties = formProperties + "," + '"' + "formMode" + '"' + ":" + '"' + customFormProperties.formMode + '"' }
        formProperties = formProperties + "}";

        var cutomButtonStyle =
        {
          tagName: "#" + customFormProperties.formName,
          type: "Custom Form",
          style: formProperties,
        }

        // Find index of object with the same tagName in templateTagStyles
        const existingIndex = this.templateTagStyles.findIndex(item => item.tagName === cutomButtonStyle.tagName && item.type === cutomButtonStyle.type);

        // If object with same tagName exists, replace it with formStyle
        if (existingIndex !== -1) {
          this.templateTagStyles[existingIndex] = cutomButtonStyle;
          this.toastr.success("Custom form tag updated in editor");
        } else {
          // If object with same tagName does not exist, push formStyle into templateTagStyles
          this.templateTagStyles.push(cutomButtonStyle);
          // Insert the input field text at the current cursor position
          this.container.documentEditor.editor.insertText("#" + customFormProperties.formName);
          this.toastr.success("Custom form tag added to editor");
        }
        this.closeAddFormDialog();
      }
      else {
        this.toastr.warning("Please select the custom form name");
      }
    }
  }

  addTileViewToEditor() {

  }

  addDynamicImageToEditor() {
    var dynamicImageProperties = this.dynamicImageFormGroup.value;

    var dynamicImageStyle = "{";
    dynamicImageStyle = dynamicImageStyle + '"' + "width" + '"' + ":" + '"' + dynamicImageProperties.width + '"' + ","
    dynamicImageStyle = dynamicImageStyle + '"' + "height" + '"' + ":" + '"' + dynamicImageProperties.height + '"'
    dynamicImageStyle = dynamicImageStyle + "}";

    var imageStyle =
    {
      tagName: "#" + dynamicImageProperties.name,
      type: "Dynamic Image",
      style: dynamicImageStyle,
    }

    // Find index of object with the same tagName in templateTagStyles
    const existingIndex = this.templateTagStyles.findIndex(item => item.tagName === imageStyle.tagName && item.type === imageStyle.type);

    // If object with same tagName exists, replace it with dynamicTableStyle
    if (existingIndex !== -1) {
      this.templateTagStyles[existingIndex] = imageStyle;
      this.toastr.success("Dynamic image properties updated in editor");
    } else {
      // If object with same tagName does not exist, push dynamicTableStyle into templateTagStyles
      this.templateTagStyles.push(imageStyle);
      // Insert the input field text at the current cursor position
      this.container.documentEditor.editor.insertText("#" + dynamicImageProperties.name);
      this.toastr.success("Dynamic image tag added to editor");
    }
    this.closeDynamicImageDialog();

  }

  addDynamicTablePropertiesToEditor() {
    this.dynamicTablePropertiesTouched = true;
    console.log('Form Controls: ', this.dynamicTablePropertiesForm.controls);
    console.log('Form Valid: ', this.dynamicTablePropertiesForm.valid);
    if (this.dynamicTablePropertiesForm.valid) {
      var dynamicTableProperties = this.dynamicTablePropertiesForm.value;
      if (dynamicTableProperties.tableName) {

        var tableStyle = "{";
        // if (dynamicTableProperties.tableWidth) { 
        tableStyle = tableStyle + '"' + "tableWidth" + '"' + ":" + dynamicTableProperties.tableWidth
        // }
        if (dynamicTableProperties.headerFontColor) { tableStyle = tableStyle + "," + '"' + "headerFontColor" + '"' + ":" + '"' + dynamicTableProperties.headerFontColor + '"' }
        if (dynamicTableProperties.headerFontSize) { tableStyle = tableStyle + "," + '"' + "headerFontSize" + '"' + ":" + dynamicTableProperties.headerFontSize }
        if (dynamicTableProperties.headerFontBold) { tableStyle = tableStyle + "," + '"' + "headerFontBold" + '"' + ":" + dynamicTableProperties.headerFontBold }
        if (dynamicTableProperties.headerBackGroundColor) { tableStyle = tableStyle + "," + '"' + "headerBackGroundColor" + '"' + ":" + '"' + dynamicTableProperties.headerBackGroundColor + '"' }
        if (dynamicTableProperties.tableBodyFontColor) { tableStyle = tableStyle + "," + '"' + "tableBodyFontColor" + '"' + ":" + '"' + dynamicTableProperties.tableBodyFontColor + '"' }
        if (dynamicTableProperties.tableBodyFontSize) { tableStyle = tableStyle + "," + '"' + "tableBodyFontSize" + '"' + ":" + dynamicTableProperties.tableBodyFontSize }
        if (dynamicTableProperties.tableBodyAlternateRowColor) { tableStyle = tableStyle + "," + '"' + "tableBodyAlternateRowColor" + '"' + ":" + '"' + dynamicTableProperties.tableBodyAlternateRowColor + '"' }
        if (dynamicTableProperties.tableBorderColor) { tableStyle = tableStyle + "," + '"' + "tableBorderColor" + '"' + ":" + '"' + dynamicTableProperties.tableBorderColor + '"' }
        if (dynamicTableProperties.textAlign) { tableStyle = tableStyle + "," + '"' + "textAlign" + '"' + ":" + '"' + dynamicTableProperties.textAlign + '"' }
        tableStyle = tableStyle + "}";

        var dynamicTableStyle =
        {
          tagName: "#" + dynamicTableProperties.tableName,
          type: "Dynamic table",
          style: tableStyle,
        }

        // Find index of object with the same tagName in templateTagStyles
        const existingIndex = this.templateTagStyles.findIndex(item => item.tagName === dynamicTableStyle.tagName);

        // If object with same tagName exists, replace it with dynamicTableStyle
        if (existingIndex !== -1) {
          this.templateTagStyles[existingIndex] = dynamicTableStyle;
          this.toastr.success("Dynamic table tag updated in editor");
        } else {
          // If object with same tagName does not exist, push dynamicTableStyle into templateTagStyles
          this.templateTagStyles.push(dynamicTableStyle);
          // Insert the input field text at the current cursor position
          this.container.documentEditor.editor.insertText("#" + dynamicTableProperties.tableName);
          this.toastr.success("Dynamic table tag added to editor");


        }
        this.closeDynamicTablePropertiesDialog();
      }
      else {
        this.toastr.warning("Please select the dynamic table");
      }
    }
  }

  onDynamicTableNameChange(tableName) {
    if (this.templateTagStyles != null && this.templateTagStyles.length > 0) {
      var table = this.templateTagStyles.find(item => item.tagName === "#" + tableName);
      if (table) {
        var tableStyles = JSON.parse(table.style);
        if (tableStyles) {
          this.dynamicTablePropertiesForm.patchValue({
            tableWidth: tableStyles.tableWidth ? tableStyles.tableWidth : null,
            headerFontColor: tableStyles.headerFontColor ? tableStyles.headerFontColor : null,
            headerFontSize: tableStyles.headerFontSize ? tableStyles.headerFontSize : null,
            headerFontBold: tableStyles.headerFontBold ? tableStyles.headerFontBold : null,
            headerBackGroundColor: tableStyles.headerBackGroundColor ? tableStyles.headerBackGroundColor : null,
            tableBodyFontColor: tableStyles.tableBodyFontColor ? tableStyles.tableBodyFontColor : null,
            tableBodyFontSize: tableStyles.tableBodyFontSize ? tableStyles.tableBodyFontSize : null,
            tableBodyAlternateRowColor: tableStyles.tableBodyAlternateRowColor ? tableStyles.tableBodyAlternateRowColor : null,
            tableBorderColor: tableStyles.tableBorderColor ? tableStyles.tableBorderColor : null,
            textAlign: tableStyles.textAlign ? tableStyles.textAlign : null
          });
        }
      }
    }
  }

  addButtonToEditor() {
    this.addButtonClicked = true;
    if (this.addButton.valid) {
      var customButtonProperties = this.addButton.value;
      if (customButtonProperties.buttonName) {

        var buttonStyle = "{";
        buttonStyle = buttonStyle + '"' + "buttonName" + '"' + ":" + '"' + customButtonProperties.buttonName + '"'
        if (customButtonProperties.eventType) { buttonStyle = buttonStyle + "," + '"' + "eventType" + '"' + ":" + '"' + customButtonProperties.eventType + '"' }
        if (customButtonProperties.buttonShape) { buttonStyle = buttonStyle + "," + '"' + "buttonShape" + '"' + ":" + '"' + customButtonProperties.buttonShape + '"' }
        if (customButtonProperties.backgroundColor) { buttonStyle = buttonStyle + "," + '"' + "backgroundColor" + '"' + ":" + '"' + customButtonProperties.backgroundColor + '"' }
        if (customButtonProperties.borderColor) { buttonStyle = buttonStyle + "," + '"' + "borderColor" + '"' + ":" + '"' + customButtonProperties.borderColor + '"' }
        if (customButtonProperties.fontColor) { buttonStyle = buttonStyle + "," + '"' + "fontColor" + '"' + ":" + '"' + customButtonProperties.fontColor + '"' }
        if (customButtonProperties.customButtonFunctionlity) { buttonStyle = buttonStyle + "," + '"' + "customButtonFunctionlity" + '"' + ":" + '"' + customButtonProperties.customButtonFunctionlity + '"' }
        if (customButtonProperties.btnNavigationUrl) { buttonStyle = buttonStyle + "," + '"' + "btnNavigationUrl" + '"' + ":" + '"' + customButtonProperties.btnNavigationUrl + '"' }
        if (customButtonProperties.csFontSize) { buttonStyle = buttonStyle + "," + '"' + "csFontSize" + '"' + ":" + customButtonProperties.csFontSize }
        if (customButtonProperties.customMessage) { buttonStyle = buttonStyle + "," + '"' + "customMessage" + '"' + ":" + '"' + customButtonProperties.customMessage + '"' }

        buttonStyle = buttonStyle + "}";

        var cutomButtonStyle =
        {
          tagName: "#" + customButtonProperties.buttonName,
          type: "Custom Button",
          style: buttonStyle,
        }

        // Find index of object with the same tagName in templateTagStyles
        const existingIndex = this.templateTagStyles.findIndex(item => item.tagName === cutomButtonStyle.tagName && item.type === cutomButtonStyle.type);

        // If object with same tagName exists, replace it with dynamicTableStyle
        if (existingIndex !== -1) {
          this.templateTagStyles[existingIndex] = cutomButtonStyle;
          this.toastr.success("Custom button updated in editor");
        } else {
          // If object with same tagName does not exist, push dynamicTableStyle into templateTagStyles
          this.templateTagStyles.push(cutomButtonStyle);
          // Insert the input field text at the current cursor position
          this.container.documentEditor.editor.insertText("#" + customButtonProperties.buttonName);
          this.toastr.success("Custom button tag added to editor");
        }
        this.closeAddButtonDialog();
      }
      else {
        this.toastr.warning("Please select the custom button name");
      }
    }
  }

  toggleDataSourcesDiv(value) {
    this.showDataSourceDiv = value;
    if (value) {
      this.dynamicDocumentEditorFlexValue = 85;
      this.dynamicDocumentEditorFlexValueLg = 80;
      this.dynamicDocumentEditorFlexValueLtLg = 70;
      this.dynamicDataSourceFlexValue = 15;
      this.dynamicDataSourceFlexValueLg = 20;
      this.dynamicDataSourceFlexValueLtLg = 30;
    }
    else {
      this.dynamicDocumentEditorFlexValue = 100;
      this.dynamicDocumentEditorFlexValueLg = 100;
      this.dynamicDocumentEditorFlexValueLtLg = 100;
      this.dynamicDataSourceFlexValue = 0;
      this.dynamicDataSourceFlexValueLg = 0;
      this.dynamicDataSourceFlexValueLtLg = 0;
    }
    this.cdRef.detectChanges();
  }

  getCustomApplications() {
    const customApplicationSearchModel = new CustomApplicationSearchModel();
    customApplicationSearchModel.isArchived = false;
    this.genericFormService.getCustomApplication(customApplicationSearchModel)
      .subscribe((responseData: any) => {
        const success = responseData.success;
        if (success) {
          if (responseData.data) {
            this.customApplicationsData = responseData.data;
          }
        } else {
          var validationMessage = responseData.apiResponseMessages[0].message;
          this.toastr.error("", validationMessage);
        }
      });
  }

  customApplicationSelected(event) {
    var customApplicationId = event.target.value;
    this.selectedCustomApplication = this.customApplicationsData.find((el: any) => {
      return el?.customApplicationId == customApplicationId;
    });
    this.addForm.get('formName').patchValue(this.selectedCustomApplication.formName);
    this.addForm.get('formId').patchValue(this.selectedCustomApplication.formId);
    this.addForm.get('customApplicationId').patchValue(this.selectedCustomApplication.customApplicationId);
  }

  getWorkflows() {
    this.workflowsLoading = true;
    let wf = new WorkflowModel();
    wf.isArchived = false;
    this.workflowService.getWorkflows(wf).subscribe((result: any) => {
      if (result.success) {
        this.workflows = result.data;
        this.temp = result.data;
      }
      else {
        this.workflows = [];
        this.validationMessage = result.apiResponseMessages[0].message;
        this.toastr.error(this.validationMessage);
      }
      this.workflowsLoading = false;
    })
  }

  customTemplateButtons() {
    this.existingButtons = null;
    if (this.templateTagStyles) {
      // Use filter to find all buttons with type 'Custom Button'
      var customButtons = this.templateTagStyles.filter(button => button.type === 'Custom Button');

      if (customButtons.length > 0) {
        // Extract the 'tagName' property from each custom button
        var tagNames = customButtons.map(button => button.tagName);

        // Use map to create a new array with modified strings
        this.existingButtons = tagNames.map(tagName => tagName.replace('#', ''));

      }
    }
  }

  onExistingButtonSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const selectedButtonName = inputElement.value;

    if (selectedButtonName) {
      // Use filter to find all buttons with type 'Custom Button'
      var selectedButton = this.templateTagStyles.find(button => button.tagName === '#' + selectedButtonName);
      if (selectedButton) {
        var selectedButtonProperties = JSON.parse(selectedButton.style);
        // Your custom logic here
        this.addButton.get('buttonShape').patchValue(selectedButtonProperties.buttonShape);
        this.addButton.get('backgroundColor').patchValue(selectedButtonProperties.backgroundColor);
        this.addButton.get('borderColor').patchValue(selectedButtonProperties.borderColor);
        this.addButton.get('fontColor').patchValue(selectedButtonProperties.fontColor);
        this.addButton.get('eventType').patchValue(selectedButtonProperties.eventType);
        this.addButton.get('customButtonFunctionlity').patchValue(selectedButtonProperties.customButtonFunctionlity);
        this.addButton.get('btnNavigationUrl').patchValue(selectedButtonProperties.btnNavigationUrl);
        this.addButton.get('csFontSize').patchValue(selectedButtonProperties.csFontSize);
        this.addButton.get('customMessage').patchValue(selectedButtonProperties.customMessage);
      }
    }
  }

  // This method will toggle the value of allowAnonymous
  anonymousCheckboxChange(event: any) {
    this.allowAnonymous = event.target.checked;
  }

  getRoles() {
    this.service.getAllRoles().subscribe((result: any) => {
      if (result.success) {
        var rolesList = result.data;
        if (rolesList) {
          rolesList.forEach(role => {
            this.allRoles.push({ roleName: role.roleName, roleId: role.roleId, userId: null, userName: null });
          });
        }
      }
    });
  }

  getUsersBasedonRole() {
    this.service.getUsersBasedonRole().subscribe((result: any) => {
      if (result.success) {
        var users = result.data;
        if (users) {
          users.forEach(user => {
            this.allUsers.push({ roleName: null, roleId: null, userId: user.userId, userName: user.fullName });
          });
        }
      }
    });
  }

  openTemplatePermissions() {
    var hasAccessToEdit = this.canEditTemplate()
    if (hasAccessToEdit) {
      this.templatePermissionsForm = new FormGroup({
        editRoles: new FormControl("",
          Validators.compose([
          ])
        ),
        viewRoles: new FormControl("",
          Validators.compose([
          ])
        ),
        editUsers: new FormControl("",
          Validators.compose([
          ])
        ),
        viewUsers: new FormControl("",
          Validators.compose([
          ])
        )
      });
      if (this.allRoles || this.allUsers) {
        this.templatepermissionsDialogId = "template-permissions-dialog";
        const dialogRef = this.templatePermissionsDialog.open(this.templatePermissionsPopUp, {
          width: '560px',
          minHeight: '380px',
          position: {
            top: '12vh'
          },
          autoFocus: true,
          disableClose: true,
          panelClass: 'table-dialog',
          id: this.templatepermissionsDialogId,
          // panelClass: "pdf-designer-mat-dialog"
        });

        // setTimeout(() => {
        //   this.addFormFirstField.nativeElement.focus();
        // }, 1000);
      }
      else {
        this.toastr.warning("Unable to get users and roles");
      }
    }
    else {
      this.toastr.error("User or role has no access to edit the template")
    }

  }

  closeTemplatePermissionsDialog() {
    var docDialog = this.templatePermissionsDialog.getDialogById(this.templatepermissionsDialogId);
    docDialog.close();
  }

  addRole(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.roles.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.rolesCtrl.setValue(null);
    }
  }

  removeRole(role: string): void {
    const index = this.roles.indexOf(role);

    if (index >= 0) {
      this.roles.splice(index, 1);
    }
  }

  selectedRole(event: MatAutocompleteSelectedEvent): void {
    if (event && event.option && event.option.value) {
      if (!this.roles.includes(event.option.value)) {
        this.roles.push(event.option.value);
      }
      this.roleInput.nativeElement.value = '';
      this.rolesCtrl.setValue(null);
    }
  }

  private _filterRoles(value: any): any[] {
    if (typeof value === 'object' && value !== null) {
        const filterValue = value.roleName.toLowerCase();
        return this.allRoles.filter(role => role.roleName && role.roleName.toLowerCase().indexOf(filterValue) === 0);
      
    } else {
      const filterValue = value.toLowerCase();
      return this.allRoles.filter(role => role.roleName && role.roleName.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  addUser(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.users.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.rolesCtrl.setValue(null);
    }
  }

  removeUser(role: string): void {
    const index = this.users.indexOf(role);

    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }

  selectedUser(event: MatAutocompleteSelectedEvent): void {
    if (event && event.option && event.option.value) {
      if (!this.users.includes(event.option.value)) {
        this.users.push(event.option.value);
      }
      this.userInput.nativeElement.value = '';
      this.usersCtrl.setValue(null);
    }
  }

  private _filterUsers(value: any): any[] {
    if (typeof value === 'object' && value !== null) {
        const filterValue = value.userName.toLowerCase();
        return this.allUsers.filter(user => user.userName && user.userName.toLowerCase().indexOf(filterValue) === 0);
    } else {
      const filterValue = value.toLowerCase();
        return this.allUsers.filter(user => user.userName && user.userName.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  savePermissions() {
    if (this.roles ) {
      var rolePermissionSelected = this.rolesPermCtrl.value;
      this.roles.forEach(perm => {
        perm.permission = rolePermissionSelected;
         let existingPermissionIndex = this.templatePermissions.findIndex(templatePermission => templatePermission.roleId === perm.roleId);

        if (existingPermissionIndex == -1) {
          // Assuming the structure of a templatePermission object
          this.templatePermissions.push({
            roleId: perm.roleId,
            roleName: perm.roleName,
            userId: perm.userId,
            userName: perm.userName,
            permission: rolePermissionSelected
          });
        }
        else {
          this.templatePermissions[existingPermissionIndex].permission = rolePermissionSelected;
        }
      });
    }

    if (this.users ) {
      var userPermissionSelected = this.usersPermCtrl.value;
      this.users.forEach(perm => {
        perm.permission = rolePermissionSelected;        
         let existingPermissionIndex = this.templatePermissions.findIndex(templatePermission => templatePermission.userId === perm.userId);

        if (existingPermissionIndex == -1) {
          // Assuming the structure of a templatePermission object
          this.templatePermissions.push({
            roleId: perm.roleId,
            roleName: perm.roleName,
            userId: perm.userId,
            userName: perm.userName,
            permission: userPermissionSelected
          });
        }
        else {
          this.templatePermissions[existingPermissionIndex].permission = userPermissionSelected;
        }
      });
    }
    this.roles = [];
    this.users =[];
    this.closeTemplatePermissionsDialog();
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  onPermissionChange(event: any, selectedUserOrRole: any) {
    console.log('Selected permission:', event.target.value);
    console.log('userOrRole :', selectedUserOrRole);

    if (event.target && event.target.value === 'remove') {
      let existingPermissionIndex = -1;
      if (selectedUserOrRole.roleId) {
        existingPermissionIndex = this.templatePermissions.findIndex(templatePermission => templatePermission.roleId === selectedUserOrRole.roleId);
      } else {
        existingPermissionIndex = this.templatePermissions.findIndex(templatePermission => templatePermission.userId === selectedUserOrRole.userId);
      }

      if (existingPermissionIndex !== -1) {
        // Use splice to remove the item from the array
        this.templatePermissions.splice(existingPermissionIndex, 1);
      }
    }
  }

  canEditTemplate() {
    if (this.templatePermissions != null && this.templatePermissions.length > 0 && this.userRoles != null && this.userId != null) {
      var hasRoleAccess = this.templatePermissions.find(perm => perm.permission == "edit" && perm.roleId && perm.roleId == this.userRoles.toLowerCase());
      var hasUserAccess = this.templatePermissions.find(perm => perm.permission == "edit" && perm.userId && perm.userId == this.userId.toLowerCase());
      if (hasRoleAccess || hasUserAccess) {
        return true;
      }
      else {
        return false;
      }

    }
    else {
      return true;
    }

  }

}