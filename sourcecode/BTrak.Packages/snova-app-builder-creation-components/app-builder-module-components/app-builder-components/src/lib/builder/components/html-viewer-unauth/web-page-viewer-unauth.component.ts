import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router , NavigationEnd} from '@angular/router';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-web-page-view-unauth-component',
  templateUrl: './web-page-viewer-unauth.component.html'
})

export class WebPageViewUnAuthComponent implements OnInit {
  genericFormSubmittedId:string = null;
  dynamicTemplate :{templateId:string;genericFormSubmittedId:string}=null;

  constructor(private route: ActivatedRoute ,  private router: Router) {
    this.route.params.subscribe((params) => {
      var templateId = params["templateId"];
      this.genericFormSubmittedId = params["genericFormSubmittedId"];
      this.dynamicTemplate= {templateId : templateId,genericFormSubmittedId:this.genericFormSubmittedId};
  });
  }

  ngOnInit() {
 
  }
  webViewdynamicRoute(event){
    if(event && event.detail)
    {
      try {
         //this.routes.navigateByUrl(event.detail);
         this.router.navigate([event.detail]);
       }
       catch (error) {
         console.error('Error occurred while dynamic web routing in app builder:', error);
       }

    }
  }
}