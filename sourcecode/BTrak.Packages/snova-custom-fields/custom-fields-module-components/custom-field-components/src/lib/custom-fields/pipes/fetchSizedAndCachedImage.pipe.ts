import { PipeTransform, Pipe, Injectable } from "@angular/core";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
@Pipe({ name: "fetchSizedAndCachedImage", pure: true })
@Injectable({providedIn:'root'})

export class FetchSizedAndCachedImagePipe implements PipeTransform {

  transform(imageFullPath: string, width: string, height: string): string {
    if (!imageFullPath) {
      return null;
    }

    var queryString = imageFullPath ;

    var widthString = width == "" ? "" : "width=" + width;
    var heightString = height == "" ? "" : "height=" + height;

    if (widthString !== "" && heightString !== "") {
      queryString +=  "?"+ widthString + "&" + heightString;
    } else if (widthString !== "") {
      queryString +=  "?"+ widthString;
    } else if (heightString !== "") {
      queryString +=  "?"+ heightString;
    }
    
    const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    var returnedImage = environment.apiURL + "remote.axd?" + queryString;

    return returnedImage;
  }
}
