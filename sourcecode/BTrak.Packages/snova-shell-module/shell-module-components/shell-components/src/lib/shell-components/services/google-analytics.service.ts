import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from "ngx-cookie-service";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

declare let ga: Function; // Declare ga as a function

@Injectable()
export class GoogleAnalyticsService {

  constructor(private cookieService: CookieService,) { }

  // create our event emitter to send our data to google analytics
  public eventEmitter(eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null) {
    ga('send', 'event', {
      eventCategory: this.cookieService.get(LocalStorageProperties.CompanyName) + " - " + eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction + " by " + this.cookieService.get(LocalStorageProperties.CurrentUserId),
      eventValue: eventValue
    });
  }
}
