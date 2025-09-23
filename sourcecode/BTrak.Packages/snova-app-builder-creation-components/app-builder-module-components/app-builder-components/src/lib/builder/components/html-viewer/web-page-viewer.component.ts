import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute , Router , NavigationEnd} from '@angular/router';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-web-page-view-component',
  templateUrl: './web-page-viewer.component.html'
})

export class WebPageViewComponent implements OnInit,OnDestroy {
  isAppStoreAccess=true;
  templateId:string=null;
  genericFormSubmittedId:string = null;
  dynamicTemplate :{templateId:string;genericFormSubmittedId:string}=null;
  constructor(private route: ActivatedRoute ,  private router: Router) {
    this.route.params.subscribe((params) => {
      this.templateId = params["templateId"];
      this.genericFormSubmittedId = params["genericFormSubmittedId"];
      this.dynamicTemplate= {templateId : this.templateId,genericFormSubmittedId:this.genericFormSubmittedId};
  });
  }

  ngOnInit() {
    
  }
  webViewdynamicRoute(event){
    if(event && event.detail)
    {
      try {
         this.router.navigateByUrl(event.detail);
       }
       catch (error) {
         console.error('Error occurred while dynamic web routing in app builder:', error);
       }

    }
  }

  ngOnDestroy(): void {
    
  }
}