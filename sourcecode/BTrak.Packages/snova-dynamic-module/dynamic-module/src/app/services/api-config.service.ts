import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { Headers, RequestOptions } from '@angular/http';
import { environment } from 'src/environments/environment';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  public api_url;
  public headers: HttpHeaders | undefined;
  token: any;
  
  constructor() {
    this.api_url = environment.apiURL;
      console.log(this.api_url);
   }
  
  getHeader() {
    //this.getToken();
    this.headers = new HttpHeaders({
      'Accept': 'multipart/form-data', 
      'encType': 'multipart/form-data', 'boundar': '----arbitrary boundary',
      'Ocp-Apim-Subscription-Key': '4beb171688c4437687f3c998c96d6b69', 
      'Access-Control-Allow-Origin': 'this.api_url',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',  
      'Access-Control-Allow-Headers': 'origin,X-Requested-With,content-type,accept',
      'Access-Control-Allow-Credentials': 'true', 
      'boundary': '--',
    });
  }

  getMultiPartHeader() {
    this.getToken();
    let headers = new Headers();
    headers.append("Ocp-Apim-Subscription-Key", "4beb171688c4437687f3c998c96d6b69");
    headers.append("Content-Type", "multipart/form-data");
    headers.append('Access-Control-Allow-Origin', '*')
    headers.append("Authorization", "Bearer" + this.getToken());
  }

  getToken(){
    this.token = localStorage.getItem("auth.access_token");
    return this.token;
  }
    
}
