import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'profile'
})
export class ProfilePipe implements PipeTransform {
  transform(value: any) {
    var names = value.split(' ');
    var profile: string = '';
    // names.forEach((val: string) => {
    //   profile += val[0];
    // });

    //profile pipe with only two characters
    profile = names[1] ? names[0][0] + names[1][0] : names[0] ? names[0][0] : '';
    return profile.toUpperCase();
  }
}