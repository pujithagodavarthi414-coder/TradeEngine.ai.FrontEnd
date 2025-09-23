import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { RelationshipDetailsModel} from '../models/relationship-details-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { Observable } from 'rxjs';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class RelationshipDetailsService {
  constructor(private http: HttpClient) { }

 
  getRelationshipDetailsList(RelationshipDetails: RelationshipDetailsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(RelationshipDetails);

    return this.http.post<RelationshipDetailsModel[]>(APIEndpoint + ApiUrls.SearchRelationship, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}