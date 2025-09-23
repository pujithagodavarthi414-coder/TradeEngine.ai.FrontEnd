import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "app-mail-extension",
    templateUrl: "./mail-extensions.component.html"
})

export class MailExtensionComponent implements OnInit {
    @Input("configuration")
    set _configuration(data : any) {
      this.configuration = data;
    }
    configuration: string;
    constructor() {
        
    }

    ngOnInit() {
        
    }
}