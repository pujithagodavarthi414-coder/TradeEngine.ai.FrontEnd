import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../constants/api-urls';



@Injectable({
  providedIn: 'root' 
})
export class ChatService {
    constructor(private httpClient:HttpClient) {
       
      }
  environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
  APIEndpoint = this.environment.apiURL;
  getRecentChannelMessages(){
    const httpOptions  = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.httpClient.get<any>(this.APIEndpoint+"api/ChatApi/GetRecentChannelMessages", httpOptions) 
          .pipe(map(result => {
            return result;
          }))
  }

   getRecentIndividualMessages(){
    const httpOptions  = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.httpClient.get<any>(this.APIEndpoint+"api/ChatApi/GetRecentIndividualMessages", httpOptions) 
          .pipe(map(result => {
            return result;
          }))
  }
  
  getPubnubKeys(): Observable<any> {
    const httpOptions  = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.httpClient.get(this.APIEndpoint+"api/ChatApi/GetPubnubKeys", httpOptions) 
          .pipe(map(result => {
            return result;
          }))
  }
  

  getAllUsersForSlackApp(): Observable<any> {
    const httpOptions  = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.httpClient.post(this.APIEndpoint+"User/UsersApi/GetAllUsersForSlackApp", httpOptions) 
          .pipe(map(result => {
            return result;
          }))
  }

  getUserChannels(): Observable<any> {
    const httpOptions  = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.httpClient.post(this.APIEndpoint+ "api/ChatApi/GetUserChannels", httpOptions) 
          .pipe(map(result => {
            return result;
          }))
  }

}
