import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../constants/localstorage-properties';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private cookieService: CookieService) {
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let currentUser = this.cookieService.get(LocalStorageProperties.CurrentUser);
        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);

        if (currentCulture === 'null' || currentCulture === 'undefined') {
            currentCulture = 'en';
        }
        if (currentUser) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser}`,
                    CurrentCulture: currentCulture != null && currentCulture != "" ? currentCulture : 'en'
                }
            });
        }

        var updatedHandler = next.handle(request);
        return updatedHandler;
    }
}