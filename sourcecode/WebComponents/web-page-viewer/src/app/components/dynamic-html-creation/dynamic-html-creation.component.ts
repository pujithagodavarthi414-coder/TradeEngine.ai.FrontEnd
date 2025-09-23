import { AfterViewInit, ChangeDetectorRef, ComponentRef, ElementRef, OnDestroy, Self, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { WebPagesService } from 'src/app/services/webpages.service';
import { DynamicComponentFactory, DynamicComponentFactoryFactory } from './dynamic-component-factory';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ViewsFormComponent } from '../view-form/view-form.component';
import { LocalStorageProperties } from 'src/app/constants/localstorage-properties';
import { DynamicSubmitFormComponent } from '../submit-form/submit-form.component';

@Component({
  selector: 'app-dynamic-html-creation',
  template: ``,
  providers: [
    DynamicComponentFactoryFactory, // IMPORTANT!
],
})
export class DynamicHtmlCreationComponent implements OnInit,AfterViewInit, OnDestroy {
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
  dynamicHtmlString: string;
  path: string;
  isAppStoreAccess: boolean = true;
  @Input() set htmlString(data: any) {
    this.dynamicHtmlString = data;
    if(this.dynamicHtmlString)
    {
    this.loadDynamicHtml();
    }
  }
  private readonly factories: DynamicComponentFactory<any>[] = [];
  private readonly hostElement: Element;
  viewsFormComponent:any;
  templateHtml$: Observable<string> ;
  components: any[] = [DynamicSubmitFormComponent
  ];
  constructor(private cd: ChangeDetectorRef,private router: Router,private sanitizer: DomSanitizer, private webPagesService:WebPagesService,private activatedRoute: ActivatedRoute,public dialog: MatDialog
    // @Self - best practice; to avoid potential bugs if you forgot to `provide` it here
    ,@Self() private cmpFactory: DynamicComponentFactoryFactory,
    elementRef: ElementRef,) { 
    this.path = this.router.url;
    this.hostElement = elementRef.nativeElement;
    
  }
  ngOnInit() {
    localStorage.setItem(LocalStorageProperties.DynamicFormId, null);
    localStorage.setItem(LocalStorageProperties.DynamicCustomApplicationId, null);
  }

  ngAfterViewInit(): void {
  //   this.templateHtml$ = of(this.dynamicHtmlString).pipe(delay(1000));
  //   this.templateHtml$.subscribe(tpl => {
  //     this.hostElement.innerHTML = tpl
  //     this.initFactories();
  //     this.createAllComponents();
  // });
}

loadDynamicHtml(){
  this.templateHtml$ = of(this.replaceDynamicTags(this.dynamicHtmlString)).pipe(delay(1000));
  this.templateHtml$.subscribe(tpl => {
    this.hostElement.innerHTML = tpl
    this.initFactories();
    this.createAllComponents();
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
      // Here you can make use of compRefs, filter them, etc.
      // to perform any custom operations, if required.
      // compRefs
      //     .filter(c => c.instance instanceof YourComponent2)
      //     .forEach(c => {
      //         c.instance.name = 'hello';
      //         c.instance.filtering = 'false';
      //         c.instance.someFoo('welcome');
      //     );
  });
}

private removeAllComponents(): void {
  this.factories.forEach(f => f.destroy());
}

ngOnDestroy(): void {
  this.removeAllComponents();
}

  replaceDynamicTags(htmlTemplate) {
    return this.replaceDynamicFormTags(htmlTemplate);
  }

replaceDynamicFormTags(htmlTemplate){
//To replace dynamic form tags 
const formPattern = /#CustomForm\.(.*?)\.([^.\s<]*)\.([^.\s<]*)/;

var customFormMatches = htmlTemplate.match(formPattern);

if (customFormMatches && customFormMatches.length >= 4) {
  var formName = customFormMatches[1];
  var formId = customFormMatches[2];
  if(formId)
  {
    localStorage.setItem(LocalStorageProperties.DynamicFormId, JSON.stringify(formId));
  }
  var customApplicationId = customFormMatches[3];
  if(customApplicationId)
  {
    localStorage.setItem(LocalStorageProperties.DynamicCustomApplicationId, JSON.stringify(customApplicationId));
  }
  htmlTemplate = htmlTemplate.replace(customFormMatches[0], '<app-dynamic-submit-form-component></app-dynamic-submit-form-component>');
}
return this.replaceDynamicButtonTags(htmlTemplate);

}

replaceDynamicButtonTags(htmlTemplate){
//To replace dynamic button tags with dynamic button html 
const buttonPattern = /#CustomButton\.(.*?)\.(.*?)\.(.*?)\.(.*?)\.(.*?)(?=<)/ ;

var customButtonMatches = htmlTemplate.match(buttonPattern);

if (customButtonMatches && customButtonMatches.length >= 5) {
  var buttonName = customButtonMatches[1];
  var buttonEvent = customButtonMatches[2];
  var buttonShape = customButtonMatches[3]
  var backgroundColor = customButtonMatches[4];
  var fontColor = customButtonMatches[5];
  var borderRadius = "0px";
  if(buttonShape)
  {
     if(buttonShape =="Rectangle curved edges")
     borderRadius = "8px";
     if(buttonShape =="Oval")
     borderRadius = "50%";
  }
  var dynamicHtmlTemplate = htmlTemplate.replace(customButtonMatches[0], `<button class="m-2 p-2 glossy-button-button" mat-button mat-raised-button 
  style="background-color:`+backgroundColor+`;border-radius:`+borderRadius+`;color:` +fontColor +`;" (click)="testButton()">Forward</button>`);
  this.replaceDynamicButtonTags(dynamicHtmlTemplate);
}
return dynamicHtmlTemplate;
}

testButton(){

}
}