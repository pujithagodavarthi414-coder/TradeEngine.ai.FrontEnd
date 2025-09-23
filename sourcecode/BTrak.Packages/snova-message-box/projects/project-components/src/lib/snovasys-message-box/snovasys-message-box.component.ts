import {
    Component,
    Input,
    ContentChild,
    TemplateRef
  } from "@angular/core";
  import { SnNgMessageTemplateDirective } from "./snovasys-message-box.directive";
  
  @Component({
    selector: "app-common-message-box",
    templateUrl: "./snovasys-message-box.component.html",
  
  })
  export class SnovasysMessageBoxComponent {
    @Input() textToDisplay: string;
    @ContentChild(SnNgMessageTemplateDirective, { read: TemplateRef }) messageAdditionalTemplate: TemplateRef<SnNgMessageTemplateDirective>;
  }
  