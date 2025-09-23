import { AfterViewInit, ChangeDetectorRef, ComponentRef, ElementRef, EventEmitter, OnDestroy, Output, Renderer2, Self, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { WebPagesService } from 'src/app/services/webpages.service';
import { DynamicComponentFactory, DynamicComponentFactoryFactory } from './dynamic-component-factory';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ViewsFormComponent } from '../view-form/view-form.component';
import { LocalStorageProperties } from '../globaldependencies/constants/localstorage-properties';
import { ToastrService } from 'ngx-toastr';
import { CustomMessageDialogContentComponent } from '../custom-message-dialog/custom-message-dialog-component';
import { DynamicSubmitFormUnAuthComponent } from '../submit-form-unauth/dynamic-submit-form-unauth.component';

@Component({
  selector: 'app-dynamic-html-creation-unauth',
  template: ``,
  providers: [
    DynamicComponentFactoryFactory, // IMPORTANT!
  ],
})
export class DynamicHtmlCreationUnAuthComponent implements OnInit, AfterViewInit, OnDestroy {
  // @Input() set template(data: any) {
  //   if (data) {
  //     this.dynamicHtmlString = data.htmlFile;
  //     this.templateTagStyles = data.templateTagStyles;
  //     this.dynamicHtml();
  //   }
  // }

  @Input("templateTagStyles")
  set _templateTagStyles(tagStyles: any) {
    console.log("Entered input template tag styles");
    if (tagStyles) {
      this.templateTagStyles = tagStyles;
    }
  }

  @Input("htmlTemplate")
  set _htmlTemplate(htmlFile: any)  {
    console.log("Entered input htmlTemplate  and template : "  + htmlFile.htmlString);
    if (htmlFile) {
      this.dynamicHtmlString = htmlFile.htmlString;
      this.genericFormSubmittedId = htmlFile.genericFormSubmittedId;
      //this.dynamicHtml();
    }
  }

  @Output() dynamicButtonRoute = new EventEmitter<string>();
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild("customMessageDialog") customMessageDialog: TemplateRef<any>;

  dynamicHtmlString: string;
  path: string;
  isAppStoreAccess: boolean = true;
  dynamicFormMode: string = "view";
  templateTagStyles: any;
  customMessageDialogId: string;
  customMessage :string =null;
  customMessageFontSize:number = null;
  genericFormSubmittedId:any=null;

  private readonly factories: DynamicComponentFactory<any>[] = [];
  private readonly hostElement: Element;
  viewsFormComponent: any;
  templateHtml$: Observable<string>;
  components: any[] = [DynamicSubmitFormUnAuthComponent
  ];
  constructor(private cd: ChangeDetectorRef, private sanitizer: DomSanitizer, private webPagesService: WebPagesService, public dialog: MatDialog
    , private renderer: Renderer2, private toastr: ToastrService
    // @Self - best practice; to avoid potential bugs if you forgot to `provide` it here
    , @Self() private cmpFactory: DynamicComponentFactoryFactory,
    elementRef: ElementRef,public customDialog: MatDialog,) {
    this.hostElement = elementRef.nativeElement;

  }
  ngOnInit() {
    if(this.dynamicHtmlString)
    {
    this.dynamicHtml();
    }

  }

  ngAfterViewInit(): void {

  }

  dynamicHtml() {
    //clear dynamic form local storage values
    localStorage.setItem(LocalStorageProperties.DynamicFormId, null);
    localStorage.setItem(LocalStorageProperties.DynamicCustomApplicationId, null);

    this.templateHtml$ = of(this.replaceDynamicTags(this.dynamicHtmlString)).pipe(delay(1000));
    this.templateHtml$.subscribe(tpl => {
      this.hostElement.innerHTML = tpl
      this.initFactories();
      this.createAllComponents();
      this.bindButtonEvents();
    });

  }

  private bindButtonEvents(): void {
    const buttons = this.hostElement.querySelectorAll('button[data-button-type="custom"]');
    buttons.forEach(button => {
      var buttonName = button.getAttribute('data-button-name');
      var eventType = button.getAttribute('data-button-event-type');
      var functionality = button.getAttribute('data-button-functionality');
      var customMessage = button.getAttribute('data-button-custom-message');
      var customMessageFontSize = button.getAttribute('data-button-custom-message-font-size');
      var btnNavigationUrl = button.getAttribute('data-button-btnNavigationUrl');
      if (functionality && this.genericFormSubmittedId && functionality.includes('%GenericFormSubmittedId%')) {
        // Replace the string with another value
        functionality = functionality.replace('%GenericFormSubmittedId%', this.genericFormSubmittedId);
      }
      this.renderer.listen(button, 'click', () => this.customButtonClickEvent(buttonName,eventType, functionality , customMessage,customMessageFontSize,btnNavigationUrl));
    });
  }

  private initFactories(): void {
    this.components.forEach(c => {
      const f = this.cmpFactory.create(c);
      this.factories.push(f);
    });
  }

  // Create components dynamically
  private createAllComponents(): void {
    const el = this.hostElement;
    const compRefs: ComponentRef<any>[] = [];
    this.factories.forEach(f => {
      const comps = f.create(el);
      compRefs.push(...comps);
    });
  }

  private removeAllComponents(): void {
    this.factories.forEach(f => f.destroy());
  }

  ngOnDestroy(): void {
    this.removeAllComponents();
  }

  replaceDynamicTags(htmlTemplate) {
    if(this.templateTagStyles)
    {
    return this.replaceDynamicFormTags(htmlTemplate);
    }
    else{
      return htmlTemplate;
    }
  }

  replaceDynamicFormTags(htmlTemplate) {
    var customForm = this.templateTagStyles.filter(style => style.type === "Custom Form");

    if (customForm) {
      customForm.forEach((form) => {
        var formProperties = JSON.parse(form.style);
        localStorage.setItem(LocalStorageProperties.DynamicFormId, JSON.stringify(formProperties.formId));
        localStorage.setItem(LocalStorageProperties.DynamicCustomApplicationId, JSON.stringify(formProperties.customApplicationId));
        //this.dynamicFormMode = formProperties.formMode == "view" ? true : false;
        this.dynamicFormMode = formProperties.formMode;
        localStorage.setItem(LocalStorageProperties.DynamicFormMode, this.dynamicFormMode.toString())
        htmlTemplate = htmlTemplate.replace(form.tagName, '<app-dynamic-submit-form-unauth-component></app-dynamic-submit-form-unauth-component>');
      });
      if (this.templateTagStyles) {
        return this.replaceDynamicButtonTags(htmlTemplate);
      }
      else {
        return htmlTemplate;
      }
    }
  }

  replaceDynamicButtonTags(htmlTemplate) {
    var customButton = this.templateTagStyles.filter(style => style.type === "Custom Button");

    if (customButton) {
      customButton.forEach((button) => {
        var customButtonStyles = JSON.parse(button.style);
        var borderRadius = "0px";
        if (customButtonStyles.buttonShape) {
          if (customButtonStyles.buttonShape == "Rectangle curved edges")
            borderRadius = "8px";
          if (customButtonStyles.buttonShape == "Oval")
            borderRadius = "50%";
        }
        htmlTemplate = htmlTemplate.replace(
          button.tagName,
          `<button class="m-2 p-2" mat-button mat-raised-button 
      style="background-color:${customButtonStyles.backgroundColor};border-radius:${borderRadius};border-color:${customButtonStyles.borderColor};color:${customButtonStyles.fontColor};"
      data-button-type="custom" data-button-name="${customButtonStyles.buttonName}"
      data-button-event-type="${customButtonStyles.eventType}"  data-button-functionality="${customButtonStyles.customButtonFunctionlity}"
      data-button-custom-message="${customButtonStyles.customMessage}" data-button-custom-message-font-size="${customButtonStyles.csFontSize}"
      data-button-btnNavigationUrl="${customButtonStyles.btnNavigationUrl}"

    >${customButtonStyles.buttonName}</button>`
        );
      });
    }
    return htmlTemplate;
  }

  customButtonClickEvent(buttonName,buttonEventType, customButtonFunctionlity , customMessage ,customMessageFontSize,btnNavigationUrl) {
    if (buttonEventType == 'Page navigation') {
      this.dynamicButtonRoute.emit(customButtonFunctionlity);
    }
    else if(buttonEventType =="Workflow")
    {
      this.triggerWorkflow(customButtonFunctionlity , customMessage,customMessageFontSize,buttonName,btnNavigationUrl)
    }
    else {
      this.executeTypeScriptCode(customButtonFunctionlity);
    }
  }

  executeTypeScriptCode(code: string) {
    try {
      eval(code);
    } catch (error) {
      console.error('Error occurred while executing dynamic typescript code:', error);
    }
  }

  triggerWorkflow(workflowId , customMessage,customMessageFontSize,buttonName,btnNavigationUrl)
  {
    var jsonObject = null;
    if (buttonName && btnNavigationUrl) {
      // Forming JSON object
      jsonObject = {
        buttonName: buttonName,
        btnNavigationUrl: btnNavigationUrl
      };
    }
    
    var inputModel = {
      workflowId:workflowId,
      navigationUrl :jsonObject !=null ? JSON.stringify(jsonObject) : null
    }
    this.customMessage =null;
    this.customMessageFontSize =null;
    this.webPagesService.triggerWorkflow(inputModel).subscribe((response: any) => {
      if(response && response.data)
      {
        if (customMessage && customMessage != "undefined") {
          console.log(customMessage);
          this.customMessage = customMessage;
          this.customMessageFontSize = customMessageFontSize;
          this.customMessageDialogId = "custom-message-dialog";

          const dialogRef = this.dialog.open(CustomMessageDialogContentComponent, {
            width: "28%",
            maxHeight: "90vh",
            disableClose: true,
            data: { customMessage: this.customMessage , customMessageFontSize :this.customMessageFontSize },
          });

        }
        else{
          this.toastr.success("workflow triggered");
        }
     }
      else{
        var validationmessage = response.apiResponseMessages[0].message;
            this.toastr.error(validationmessage);
      }
    })

  }
  closeAddButtonDialog() {
    var docDialog = this.customDialog.getDialogById(this.customMessageDialogId);
    docDialog.close();
  }

}