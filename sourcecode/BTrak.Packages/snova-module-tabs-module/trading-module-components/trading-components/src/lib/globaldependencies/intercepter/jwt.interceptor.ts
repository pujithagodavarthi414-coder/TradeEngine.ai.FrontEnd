import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../../billing/constants/localstorage-properties';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private cookieService: CookieService) {
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

        let currentUser = this.cookieService.get(LocalStorageProperties.CurrentUser);
        let currentCulture = this.cookieService.get(LocalStorageProperties.CurrentCulture);

        if (currentCulture === 'null' || currentCulture === 'undefined') {
            currentCulture = 'en';
        }
        if (currentUser) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser}`,
                    CurrentCulture: currentCulture != null && currentCulture != "" ? currentCulture : 'en',
                    
                }
            });
        }
        if (!environment.production && environment.useTestAuthenticator) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjVFQjQwM0ExNjNFQ0JBNkNFQjVERDM4ODZGOTJDRjVGIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2NTk5NDQ0MzEsImV4cCI6MTY1OTk1MTYzMSwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eXNlcnZpY2Uuc3RhZ2luZy5ueHVzd29ybGQuY29tIiwiY2xpZW50X2lkIjoiQjUyQ0U0MjQtNUQ0RC00OUQ0LThEMEYtRUVBMzc4ODUzRDM5IDNEMTlFQjRFLTkwMTUtNEU4My05RDFGLTJBMjkzNkUwQzE3MSIsImp0aSI6IjY0MzY5RUM3NDE3NkNGQkI1NDEzQjMzM0I1OTJGNzA4IiwiaWF0IjoxNjU5OTQ0NDMxLCJzY29wZSI6WyIzRDE5RUI0RS05MDE1LTRFODMtOUQxRi0yQTI5MzZFMEMxNzEiXX0.UvBgMhLF6yxdn5Z0uHFDC03xf_xqEt9rrogkoe4pvAyQn3tBzsoXS7qcR56jTXqble7h6kJPYfxSgF1t6LqOfeZFAgOjqY2pP1ECQ8k3UAhowwSAWfp2EjdCWkYSd12ZFfPHlkKnRdO1xpf6-xHKoziYwPhQcG-KP1MlY9WivbLebbVMuJH8gC_0lLoKz1RhQ0g-m2WbsJNbvrfncBqxZgWojBXMlScWS-x9MKA13fz8QZfIUIlUNIl0p5fnrHt8vgM5zLnSYHXb_O7ncoeOD8KC4rLTqq4MCFfuZgWsK671kih4SOojIfo4QqHEFqPqAhquVXEG2h6gVKIzxvu7Hg`
                }
            });
        }
        var updatedHandler = next.handle(request);
        return updatedHandler;
    }
}