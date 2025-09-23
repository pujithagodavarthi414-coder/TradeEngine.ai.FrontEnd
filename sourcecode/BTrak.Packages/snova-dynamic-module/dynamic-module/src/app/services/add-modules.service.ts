import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from '../globaldependencies/environments/environment';
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class AddModulesService {
  public GetAllRoles = APIEndpoint + 'Roles/RolesApi/GetAllRoles';
  public UpsertDynamicModule = APIEndpoint + 'Widgets/WidgetsApi/UpsertDynamicModule';
  public GetDynamicModules = APIEndpoint + 'Widgets/WidgetsApi/GetDynamicModules';

  constructor(private http: HttpClient) {
  }

  getRoles(roleModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(roleModel);
    return this.http.post(this.GetAllRoles, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }
  UploadFile(formData:any, moduleTypeId:any) {
    const httpOptions = {
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
    };

    return this.http
      .post(`${APIEndpoint + 'File/FileApi/UploadFile'}?moduleTypeId=` + moduleTypeId, formData, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }



  getUpsertDynamicModule(dynamicModuleUpsertModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(dynamicModuleUpsertModel);
     return this.http.post(this.UpsertDynamicModule, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }



//   getUpsertDynamicModule(dynamicModuleUpsertModel: any) {
//   var companyModel = new RoleModel();
//     this.headers = this.ApiConfigService.getHeader();
//     var form = new FormData();
//     form.append('news_object', JSON.stringify(dynamicModuleUpsertModel));
//     form.append('file_type', object.file_type);
//     form.append('search_combination', object.search_combination);
//     form.append('flag_status', object.flag_status);
//     form.append('user_id', userId);
//     return this.http.post(this.api_url + "add-news-pin-details", form, this.headers)
//         .pipe(map(result => {
//             return result;
//         }));
// }


// saveUpsertDynamicModule() {
//   debugger;
//   var companyModel = new RoleModel();
//   companyModel.isArchived = false;
//   companyModel.DynamicModuleName=this.moduleName,
//   companyModel.ModuleIcon=this.moduleIcon,
//   companyModel.ViewRole=this.viewPermission,
//   companyModel.EditRole=this.editPermission,
//   this.addModulesService.getUpsertDynamicModule(companyModel).subscribe((response: any) => {
//     if (response.success == true) {
//       this.dynamicModuleData = response.data;
//     }
//     else {
//     }
//   });
// }

  getGetDynamicModules(dynamicModuleUpsertModel: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(dynamicModuleUpsertModel);
    return this.http.post(this.GetDynamicModules, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

}
