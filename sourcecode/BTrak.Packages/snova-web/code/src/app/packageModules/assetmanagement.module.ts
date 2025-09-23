import { Routes, RouterModule } from '@angular/router';
import { AssetmanagementModule, AssetRoutes,AssetModulesService } from '@thetradeengineorg1/snova-asset-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShellModule, AdminLayoutComponent, shellModulesInfo, ShellModulesService } from '@thetradeengineorg1/snova-shell-module';
import { info } from 'app/common/constants/modules';
import { moduleLoader } from 'app/common/constants/module-loader';
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AdminLayoutComponent,
        children: AssetRoutes
      }
    ]),
    CommonModule,
    ShellModule.forChild(moduleLoader as shellModulesInfo),
    AssetmanagementModule.forChild(moduleLoader as any)
  ],
  declarations: [],
  exports: [],
  providers: [
    {provide: ShellModulesService, useValue: moduleLoader as shellModulesInfo },
    {provide: AssetModulesService, useValue: moduleLoader as any }
  ],
  entryComponents: []
})

export class AssetModule { }