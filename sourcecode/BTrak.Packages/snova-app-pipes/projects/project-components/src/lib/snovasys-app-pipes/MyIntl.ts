import { TimeagoIntl, IL10nsStrings } from "ngx-timeago";
import {strings as enStrings} from 'ngx-timeago/language-strings/en';

export class MyIntl extends TimeagoIntl {
    constructor(){
      super();
  
      var c;
      var name = "CurrentCulture" + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      var currentCulture = 'en';
      for(var i = 0; i <ca.length; i++) {
        c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          currentCulture = c.substring(name.length, c.length);
          break;
        }
      }
      
      if(currentCulture == 'ko') { // korean
        const koStrings : IL10nsStrings = {
          prefixAgo: null,
          prefixFromNow: null,
          suffixAgo: '...전에',
          suffixFromNow: '지금부터',
          seconds: '일분보다 적게',
          minute: '약 1 분',
          minutes: '%d 의사록',
          hour: '약 한 시간',
          hours: '약 %d 시간',
          day: '하루',
          days: '%d 일',
          month: '약 한 달',
          months: '%d 개월',
          year: '약 1 년',
          years: '%d 연령',
          wordSeparator: ' ',
        };
        this.strings = koStrings;
      } else if(currentCulture == 'te') { //telugu
        const teStrings : IL10nsStrings = {
          prefixAgo: null,
          prefixFromNow: null,
          suffixAgo: 'క్రితం',
          suffixFromNow: 'ఇప్పటి నుండి',
          seconds: 'ఒక నిమిషం కన్నా తక్కువ',
          minute: 'ఒక నిమిషం',
          minutes: '%d నిమిషాలు',
          hour: 'ఒక గంట గురించి',
          hours: 'గురించి %d గంటలు',
          day: 'ఒక రోజు',
          days: '%d రోజులు',
          month: 'ఒక నెల గురించి',
          months: '%d నెలలు',
          year: 'గురించి ఒక సంవత్సరం',
          years: '%d సంవత్సరాలు',
          wordSeparator: ' ',
        };
        this.strings = teStrings;
      } else if(currentCulture == 'ar') { //arabic
        const arStrings : IL10nsStrings = {
          prefixAgo: null,
          prefixFromNow: null,
          suffixAgo: 'منذ',
          suffixFromNow: 'من الان',
          seconds: 'أقل من دقيقة',
          minute: 'حوالي دقيقة',
          minutes: '%d الدقائق',
          hour: 'حوالي ساعة',
          hours: 'حول %d ساعات',
          day: 'يوم',
          days: '%d أيام',
          month: 'شهر تقريبا',
          months: '%d الشهور',
          year: 'حوالي سنة',
          years: '%d سنوات',
          wordSeparator: ' ',
        };
        this.strings = arStrings;
      } else { // default set to english
        this.strings = enStrings;
      }
    }
  }