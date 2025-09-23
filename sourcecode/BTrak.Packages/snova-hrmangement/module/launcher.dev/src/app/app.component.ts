import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  selectedEmployeeId: string = '82a2a1eb-fcb4-4799-af59-567b2ff85f50';

  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
    console.log(translate);
  }
  employeeId: string = 'A7CAB209-6F28-4F70-8D76-4CF82E3B1765'
}
