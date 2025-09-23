import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { LocalStorageProperties } from '../constants/localstorage-properties';
import { CookieService } from 'ngx-cookie-service';
const ArtificialDelay = environment.artificialDelay;
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private cookieService: CookieService){
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.cookieService.get(LocalStorageProperties.CurrentUser);
        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);
         if(currentCulture === 'null' || currentCulture === 'undefined'){
            currentCulture = 'en';
         }
        if (currentUser) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${currentUser}`,
                    CurrentCulture: currentCulture != null && currentCulture!="" ? currentCulture : 'en'
                }
            });
        }
        if(!environment.production && environment.useTestAuthenticator) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1laWQiOiIxMjcxMzNmMS00NDI3LTQxNDktOWRkNi1iMDJlMGUwMzY5NzEiLCJDb21wYW55IjoiNGFmZWI0NDQtZTgyNi00Zjk1LWFjNDEtMjE3NWUzNmEwYzE2IiwiaXNzIjoiaHR0cDovL215LnRva2VuaXNzdWVyLmNvbSIsImF1ZCI6Imh0dHA6Ly9teS53ZWJzaXRlLmNvbSIsImV4cCI6MTk4MjA4MTI0NywibmJmIjoxNTUwMDg0ODQ3fQ.yUHRfy1aCW9F_CvbBZmuK-mOWf5YrftathYJ0HYjd6Q`
                }
            });
        }
        var updatedHandler = next.handle(request);
        if(ArtificialDelay == 0) {
            return updatedHandler;
        }
        return updatedHandler.pipe(delay(ArtificialDelay));
    }
}