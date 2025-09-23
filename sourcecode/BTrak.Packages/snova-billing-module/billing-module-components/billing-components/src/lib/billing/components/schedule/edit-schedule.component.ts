import { Component } from "@angular/core";
import '../../../globaldependencies/helpers/fontawesome-icons';




@Component({
  selector: "app-billing-component-client-schedule-edit",
  templateUrl: "edit-schedule.component.html"
})

export class EditScheduleComponent {
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
}