
import { Injectable } from '@angular/core';
import { LocalStorageProperties } from 'activity-tracker-components/activity-tracker-components/src/lib/globaldependencies/constants/localstorage-properties';
import { CookieService } from "ngx-cookie-service";


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
