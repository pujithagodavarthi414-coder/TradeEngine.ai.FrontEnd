import { Pipe, PipeTransform } from '@angular/core';
import { orderBy,sortBy } from 'lodash';

@Pipe({ name: 'ColleagueSortBy' })
export class ColleagueSortByPipe implements PipeTransform {

  transform(value: any[],caseInsensitive=false, order = '', column: string = ''): any[] {
    if (!value || order === '' || !order) { return value; } // no array
    if (!column || column === '') { 
      const sorted=this.sortOnCaseSensitivity(value,caseInsensitive);
      if(order==='asc'){return sorted}
      else{return sorted.reverse();}
    } // sort 1d array
    if (value.length <= 1) { return value; } // array with only one item
    else{  
      const converted=this.convertMultiOnCaseSensitivity(value,column,caseInsensitive);
      return orderBy(converted, ['sortCol'], [order]).map(v=>{
        delete v['sortCol'];
        return v;
      });
    }
  }
  sortOnCaseSensitivity(value:any[],caseInsensitive:boolean){
    return sortBy(value,(v)=>{
        if(typeof v==='string'&&caseInsensitive){
        return v.toLowerCase()
        }
        return v;
      });
  }
  convertMultiOnCaseSensitivity(value:any[],column,caseInsensitive){
    let converted=value;
      if(caseInsensitive){
        converted=value.map(v=>{
          if(typeof v[column]==='string'){
          return {...v,sortCol:v[column].toLowerCase()}
        }
        return v;
        })
      }
      return converted;
  }
}