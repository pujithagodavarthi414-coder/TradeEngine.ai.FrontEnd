import { Directive, TemplateRef } from "@angular/core";

@Directive({ selector: '[ng-message-tmp]' })
export class SnNgMessageTemplateDirective {
    constructor(public template: TemplateRef<any>) { }
}
