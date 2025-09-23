import { Pipe, PipeTransform, Injectable } from "@angular/core";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

@Injectable({providedIn:'root'})

@Pipe({ name: "fetchSizedAndCachedImage", pure: true })
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

    var returnedImage = environment.apiURL + "remote.axd?" + queryString;

    return returnedImage;
  }
}
