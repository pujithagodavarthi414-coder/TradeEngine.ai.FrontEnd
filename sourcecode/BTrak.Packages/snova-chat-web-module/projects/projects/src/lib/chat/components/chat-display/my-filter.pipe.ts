import { Injectable, Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'myFilter'
})

@Injectable({ providedIn: 'root' })

export class MyFilterPipe implements PipeTransform {

  transform(Chat: any[], searchText: string): any {
   if(!Chat) {
     return[];
   }
   if(!searchText) {
     return Chat;
   }
   searchText = searchText.toLowerCase();
   return Chat.filter(it => {
     return it.textMessage.toLowerCase().includes(searchText);
   });
  }

}