import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from './models/localstorage-properties';
import { ComponentModel } from 'projects/project-components/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  receiverId: string = '1ABE8723-C82E-4502-8EA3-8BC6384A9714';

  componentModel: ComponentModel;

  constructor(translate: TranslateService, private cookieService: CookieService) {
    translate.setDefaultLang('en');
    translate.use('en');
    console.log(translate);
  }

  ngOnInit() {
    this.componentModel = new ComponentModel();
    this.componentModel.accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1laWQiOiI1ZWYxOWMzMy00OGIyLTQxNTMtOTk0MC1lOGMwY2M0MDAxMzkiLCJDb21wYW55IjoiZDFjZmNhNjAtY2JmNC00ZTJhLWFmM2EtZWJlM2EyY2QwYTE5IiwiaXNzIjoiaHR0cDovL215LnRva2VuaXNzdWVyLmNvbSIsImF1ZCI6Imh0dHA6Ly9teS53ZWJzaXRlLmNvbSIsImV4cCI6MjAzNzc5MzE2OSwibmJmIjoxNjA1NzkzMTY5fQ.MYWXhCgHE0IBRm9ToQM1pzlztaU0dbTbA9PyIdParP4';
    this.componentModel.backendApi = 'http://localhost:55224/';
    this.componentModel.parentComponent = this;
    this.componentModel.callBackFunction = ((component: any, commentsCount: number) => { component.componentModel.commentsCount = commentsCount; });
  }

}
