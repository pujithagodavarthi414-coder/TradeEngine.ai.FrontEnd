import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { User } from '../models/induction-user-model';
import { UserModel } from '../models/user';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class UserListService {
  private USERS_SEARCH_API_PATH = APIEndpoint + ApiUrls.GetAllUsers;
  private GET_USER_BY_NAME_API_PATH = APIEndpoint + "api/LoginApi/GetUserDetails";

  constructor(private http: HttpClient) {}

  GetAllUsers(): Observable<User[]> {
    var data = { UserId: null, FirstName: null,sortDirectionAsc:'true'};
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(data);
    return this.http.post<User[]>(
      `${this.USERS_SEARCH_API_PATH}`,
      body,
      httpOptions
    );
  }

  
  GetUsersList(UserInputModel:UserModel): Observable<User[]> {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(UserInputModel);
    return this.http.post<User[]>(
      `${this.USERS_SEARCH_API_PATH}`,
      body,
      httpOptions
    );
  }

  upsertUser(userModel:UserModel ): Observable<UserModel[]> {
    var data = { UserId: null, FirstName: null };
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(userModel);
    return this.http.post<UserModel[]>(APIEndpoint + ApiUrls.UpsertUser, body, httpOptions)
    .pipe(map(result => {
      return result;
    }));
}

  getLoggedUserData() {
    return this.http.get<any[]>(`${APIEndpoint + ApiUrls.GetLoggedInUser}`);
  }

  getUserByName(userName: string) {
    return this.http.get<any>(
      `${this.GET_USER_BY_NAME_API_PATH}?userName=${userName}`
    );
  }


  getUserById(userId: string): Observable<UserModel[]> {
    let paramsobj = new HttpParams().set('userId', userId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get<UserModel[]>(APIEndpoint + ApiUrls.GetUserById, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}
