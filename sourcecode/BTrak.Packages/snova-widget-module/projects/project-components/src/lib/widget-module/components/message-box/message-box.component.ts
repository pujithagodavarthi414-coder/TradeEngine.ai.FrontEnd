import {
  Component,
  Input,
  ContentChild,
  TemplateRef
} from "@angular/core";
import { NgMessageTemplateDirective } from "../../../globaldependencies/directives/message-box.directive";

@Component({
  selector: "app-common-message-boxs",
  templateUrl: "./message-box.component.html",

})
export class MessageBoxComponent {
  @Input() textToDisplay: string;
  @ContentChild(NgMessageTemplateDirective, { read: TemplateRef }) messageAdditionalTemplate: TemplateRef<any>;
}
