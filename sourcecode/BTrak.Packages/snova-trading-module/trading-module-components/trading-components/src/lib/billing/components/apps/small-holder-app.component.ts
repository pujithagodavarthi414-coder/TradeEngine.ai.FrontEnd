import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { LivesManagementService } from "../../services/lives-management.service";

@Component({
    selector: 'smallholder-app',
    templateUrl: './small-holder-app.component.html'
})

export class SmallHolderApplication implements OnInit {
    data: any;
    Object = Object;
    keys: any;
    isDataPresent : boolean;
    isAnyOperationInprogress : boolean;
    constructor(private ls: LivesManagementService, private cdRef: ChangeDetectorRef) {        
    }

    ngOnInit(): void {
        this.getIndependentSmallholderCertification();
    }

    getIndependentSmallholderCertification() {
        this.isAnyOperationInprogress = true;
        var obj = {};
        this.ls.getIndependentSmallholderCertification(obj)
                .subscribe((res: any) => {
                    this.isAnyOperationInprogress = false;
                    if(res.success && res.data && res.data.length > 0) {
                        this.isDataPresent = true;
                        this.data = res.data;
                        this.keys = Object.keys(res.data[0]);
                        this.cdRef.detectChanges()
                    } else {
                        this.isDataPresent = false;
                        this.data = [];
                        this.cdRef.detectChanges()
                    }
                });
    }

    getKeys(obj: any) {
        return Object.keys(obj);
    }
    getValues(obj: any) {
        return Object.values(obj);
    }
}