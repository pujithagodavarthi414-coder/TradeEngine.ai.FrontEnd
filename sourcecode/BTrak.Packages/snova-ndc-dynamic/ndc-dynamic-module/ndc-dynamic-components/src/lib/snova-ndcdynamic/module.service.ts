import { Observable } from 'rxjs/Observable';
import { Injectable, Compiler} from '@angular/core';

import 'rxjs/add/operator/map';

import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: "root"
})

export class ModuleService {
    public moduleJson: any;
    source = `${window.location.protocol}//${window.location.host}/`;

    constructor(private compiler: Compiler, private http: HttpClient) {
        console.log(compiler);
    }

    loadModules() {
        this.http.get("./assets/modules.json").subscribe(data => this.moduleJson = data);
    }
}