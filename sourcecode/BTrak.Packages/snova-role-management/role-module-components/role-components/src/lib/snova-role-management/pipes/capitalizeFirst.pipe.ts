import { Pipe, PipeTransform, Injectable } from '@angular/core';
/*
 * Capitalize the first letter of the string
 * Takes a string as a value.
 * Usage:
 *  value | capitalizefirst
 * Example:
 *  // value.name = daniel
 *  {{ value.name | capitalizefirst  }}
 *  fromats to: Daniel
*/
@Pipe({
  name: 'capitalizeFirst',
  pure: true
})

@Injectable({ providedIn: "root" })

export class CapitalizeFirstPipe implements PipeTransform {
  transform(value: string): string {
    if (value === null) return 'Not assigned';
    return value.charAt(0).toUpperCase() + value.substr(1).toLowerCase();;
  }
}