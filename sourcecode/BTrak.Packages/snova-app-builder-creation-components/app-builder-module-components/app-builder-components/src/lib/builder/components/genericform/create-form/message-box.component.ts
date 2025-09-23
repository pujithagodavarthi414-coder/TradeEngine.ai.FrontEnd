import {
  Component,
  Input,
  ContentChild,
  TemplateRef
} from "@angular/core";
import { NgMessageTemplateDirective } from "./message-box.directive";

@Component({
  selector: "app-common-message-box",
  templateUrl: "./message-box.component.html",

})
export class MessageBoxComponent {
  @Input() textToDisplay: string;
  @ContentChild(NgMessageTemplateDirective, { read: TemplateRef }) messageAdditionalTemplate: TemplateRef<any>;
}
