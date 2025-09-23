import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import {  MessageDetails } from '../models/messageDetails';



@Injectable({
  providedIn: 'root' 
})
export class ChatService {
  msg(msgId:  MessageDetails) {
    throw new Error('Method not implemented.');
  }
 

  GetAllUsersForSlackApp: string = "User/UsersApi/GetAllUsersForSlackApp";
  GetPersonalChatOrChannelChat: string = "Chatapi/ChatApi/GetPersonalChatOrChannelChat";
  Authorise = "api/LoginApi/Authorise";
  SendMessagesToUserOrChannel="api/ChatApi/SendMessagesToUserOrChannel";
  GetUserChannels = "api/ChatApi/GetUserChannels";
  UploadChatFileUrl = "api/SlackFilesApi/SendFiles";
  GetRecentIndividualMessages = "api/ChatApi/GetRecentIndividualMessages";
  GetRecentChannelMessages = "api/ChatApi/GetRecentChannelMessages";
  GetRecentConversations = "api/ChatApi/GetRecentConversations";
  GetChannelMembers = "api/ChatApi/GetChannelMembers";
  GetSharedorUnsharedchannels = "api/ChatApi/GetSharedorUnsharedchannels";
  UpsertChannel = "api/ChatApi/UpsertChannel";
  AddEmployeesToChannel = "api/ChatApi/AddEmployeesToChannel";
  ArchiveChannelMembers = "api/ChatApi/ArchiveChannelMembers";
  
   environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
   APIEndpoint = this.environment.apiURL;
   constructor(private httpClient: HttpClient ) { }

   archiveChannelMembers(inputModel): Observable<any> {
    const httpOptions  = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(inputModel);
    return this.httpClient.post(this.APIEndpoint + this.ArchiveChannelMembers, body, httpOptions) 
          .pipe(map(result => {
            return result;
          }))
  }

   getChannelMembers(inputModel): Observable<any> {
    const httpOptions  = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(inputModel);
    return this.httpClient.post(this.APIEndpoint + this.GetChannelMembers, body, httpOptions) 
          .pipe(map(result => {
            return result;
          }))
  }
  upsertChannel(inputModel): Observable<any> {
    const httpOptions  = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(inputModel);
    return this.httpClient.post(this.APIEndpoint + this.UpsertChannel, body, httpOptions) 
          .pipe(map(result => {
            return result;
          }))
  }
  addEmployeesToChannel(inputModel): Observable<any> {
    const httpOptions  = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(inputModel);
    return this.httpClient.post(this.APIEndpoint + this.AddEmployeesToChannel, body, httpOptions) 
          .pipe(map(result => {
            return result;
          }))
  }
  getSharedorUnsharedchannels(inputModel): Observable<any> {
    const httpOptions  = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(inputModel);
    return this.httpClient.post(this.APIEndpoint + this.GetSharedorUnsharedchannels, body, httpOptions) 
          .pipe(map(result => {
            return result;
          }))
  }

   getRecentConversations(): Observable<any> {
    const httpOptions  = { 
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.httpClient.get(this.APIEndpoint + this.GetRecentConversations, httpOptions) 
          .pipe(map(result => {
            return result;
          }))
  }

   getRecentChannelMessages(): Observable<any> {
    const httpOptions  = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.httpClient.get(this.APIEndpoint + this.GetRecentChannelMessages, httpOptions) 
          .pipe(map(result => {
            return result;
          }))
  }

   getRecentIndividualMessages(): Observable<any> {
    const httpOptions  = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.httpClient.get(this.APIEndpoint + this.GetRecentIndividualMessages, httpOptions) 
          .pipe(map(result => {
            return result;
          }))
  }

   uploadChatFileUrl(messageObj): Observable<any> {
    const httpOptions  = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(messageObj);
    return this.httpClient.post(this.APIEndpoint + this.UploadChatFileUrl, body, httpOptions) 
          .pipe(map(result => {
            return result;
          }))
  }
  getAllUsersForSlackApp(): Observable<any> {
    const httpOptions  = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.httpClient.post(this.APIEndpoint + this.GetAllUsersForSlackApp, httpOptions) 
          .pipe(map(result => {
            return result;
          }))
  }
  
  getPersonalChatOrChannelChat(chatObj): Observable<any>{
    const httpOptions  = {
      headers: new HttpHeaders({ "Content-Type": "application/json"
     })
    };
    const body = JSON.stringify(chatObj);
    return this.httpClient.post(this.APIEndpoint + this.GetPersonalChatOrChannelChat, body, httpOptions)
          .pipe(map(result => {
            return result;
          }))          
  }
 
  sendingMessages(messageObj):Observable<any>{
    const httpOptions  = {
      headers: new HttpHeaders({ "Content-Type": "application/json"
     })
    };
    const body = JSON.stringify(messageObj);
    return this.httpClient.post(this.APIEndpoint + this.SendMessagesToUserOrChannel, body, httpOptions)
          .pipe(map(result => {
            return result;
          })) 
  }


  getUserChannels(): Observable<any> {
    const httpOptions  = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.httpClient.post(this.APIEndpoint + this.GetUserChannels, httpOptions) 
          .pipe(map(result => {
            return result;
          }))
  }
}