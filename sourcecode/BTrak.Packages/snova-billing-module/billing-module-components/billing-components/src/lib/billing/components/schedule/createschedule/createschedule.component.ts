import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import '../../../../globaldependencies/helpers/fontawesome-icons';

@Component({
  selector: 'app-createschedule',
  templateUrl: './createschedule.component.html',
})
export class CreatescheduleComponent implements OnInit {


  userForm : FormGroup;

  visible = true;
    constructor(){}
    ngOnInit(){
    }
    check(e)
    {
     if(e.value=="1")
     {
        this.visible=true;
     }
     if(e.value=="2")
     {
        this.visible=false;
     }  
    }   
    
    upsertSchedule()
    {

    }

}
