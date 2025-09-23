import { Injectable, Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "insertSpacePipe"
})

@Injectable({providedIn:'root'})

export class InsertSpacePipe implements PipeTransform {

  transform(text: string): string {

    if(text && text != "") {

      //text = text.replace(/([A-Z])/g, ' $1').trim();
      return text;
    }

    return "";

  }

}