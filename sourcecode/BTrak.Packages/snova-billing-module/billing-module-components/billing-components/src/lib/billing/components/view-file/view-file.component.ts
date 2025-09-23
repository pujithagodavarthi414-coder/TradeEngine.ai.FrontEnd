import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'app-view-file',
    templateUrl: 'view-file.component.html',
})

export class ViewFileComponent {
    loadingIndicator: boolean = true;
    fileUrl: any;
    noFile: boolean=false;
    message='Preview not available for the currnt file';

    constructor(private DatePipe: DatePipe,private sanitizer: DomSanitizer,
        private cdRef: ChangeDetectorRef, private toastr: ToastrService, private route: ActivatedRoute) {
            if (this.route.snapshot.queryParams["fileUrl"]) {
                this.fileUrl = sanitizer.bypassSecurityTrustResourceUrl(this.route.snapshot.queryParams["fileUrl"]);
                this.noFile = false;
            } else{
                this.noFile=true;
            }
            this.loadingIndicator=false;
    }

    ngOnInit() {
        if (this.route.snapshot.queryParams["fileUrl"]) {
            this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.route.snapshot.queryParams["fileUrl"]);
            this.noFile = false;
        } else{
            this.noFile=true;
        }
        this.loadingIndicator=false;
    }
}