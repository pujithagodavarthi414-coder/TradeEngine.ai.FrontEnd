import { Directive, TemplateRef } from "@angular/core";

@Directive({ selector: '[ng-message-tmp]' })
export class NgMessageTemplateDirective {
    constructor(public template: TemplateRef<any>) { }
}
