import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { SnovaChatModule, ChatRoutes, ChatService } from '@thetradeengineorg1/snova-chat-web-module';
import { moduleLoader } from "app/common/constants/module-loader";

@NgModule({
    imports: [
        RouterModule.forChild([ 
            {
                path: '',
                component: AdminLayoutComponent,
                children: ChatRoutes
            }
        ]),
        CommonModule,
        ShellModule.forChild(moduleLoader as shellModulesInfo),
        SnovaChatModule
        
    ],
    declarations: [],
    exports: [],
    providers: [
        {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo}
    ],
    entryComponents: []
})

export class ChatManagementModule { }