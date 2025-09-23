import { Component} from '@angular/core';


@Component({
    selector: 'app-fm-component-test-case-template',
    templateUrl: `test-case-template.component.html`
    
})

export class TestcaseTemplateComponent{

    isAnyOperationIsInprogress: boolean = false;
    testcaseTemplates:any;
}
