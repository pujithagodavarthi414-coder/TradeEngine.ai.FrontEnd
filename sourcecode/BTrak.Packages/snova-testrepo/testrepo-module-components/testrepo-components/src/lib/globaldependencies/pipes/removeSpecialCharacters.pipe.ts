import { Pipe, PipeTransform, Injectable } from "@angular/core";

@Pipe({ name: "removeSpecialCharacters", pure: true })

@Injectable({ providedIn: 'root' })

export class RemoveSpecialCharactersPipe implements PipeTransform {
  transform(sourceText: string): string {
    if (!sourceText) {
      return null;
    }
    var sourceText = sourceText.replace(/-/g, "");
    return sourceText.replace(/[^a-zA-Z0-9\s]/g, '');
  }
}