import { MatPaginatorIntl } from '@angular/material/paginator';
import { LocalStorageProperties } from '../globaldependencies/constants/localstorage-properties';

function getLanguageCode() {
    var c;
    var name = LocalStorageProperties.CurrentCulture + "=";
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
    return currentCulture;
}
const rangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 van ${length}`; }
  
  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
      var currentCulture = getLanguageCode();
    if(currentCulture == 'ko') {
        return `${startIndex + 1} - ${endIndex} 의 ${length}`;
    }
    else if(currentCulture == 'ar') {
        return `${startIndex + 1} - ${endIndex} من ${length}`;
    }
    else if(currentCulture == 'te') {
        return `${startIndex + 1} - ${endIndex} యొక్క ${length}`;
    }
    else {
        return `${startIndex + 1} - ${endIndex} of ${length}`;
    }
}

export function getPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  var currentCulture = getLanguageCode();
  
    if(currentCulture == 'ko') {
        paginatorIntl.itemsPerPageLabel = '페이지 당 항목:';
        paginatorIntl.nextPageLabel = '다음 페이지';
        paginatorIntl.previousPageLabel = '이전 페이지';
        paginatorIntl.getRangeLabel = rangeLabel;   
    }
    else if(currentCulture == 'ar') {
        paginatorIntl.itemsPerPageLabel = 'مواد لكل صفحة:';
        paginatorIntl.nextPageLabel = 'الصفحة التالية';
        paginatorIntl.previousPageLabel = 'الصفحة السابقة';
        paginatorIntl.getRangeLabel = rangeLabel;  
    }
    else if(currentCulture == 'te') {
        paginatorIntl.itemsPerPageLabel = 'ప్రతి పేజీకి అంశాలు:';
        paginatorIntl.nextPageLabel = 'తరువాతి పేజీ';
        paginatorIntl.previousPageLabel = 'ముందు పేజి';
        paginatorIntl.getRangeLabel = rangeLabel;  
    }
    else {
        paginatorIntl.itemsPerPageLabel = 'Items per page:';
        paginatorIntl.nextPageLabel = 'Next Page';
        paginatorIntl.previousPageLabel = 'Previous Page';
        paginatorIntl.getRangeLabel = rangeLabel;  
    }
  
  return paginatorIntl;
}