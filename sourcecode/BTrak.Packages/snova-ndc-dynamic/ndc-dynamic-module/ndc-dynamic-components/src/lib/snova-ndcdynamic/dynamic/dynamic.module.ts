import { CommonModule } from '@angular/common';
import {
  ANALYZE_FOR_ENTRY_COMPONENTS,
  ModuleWithProviders,
  NgModule,
  Type,
} from '@angular/core';

import { COMPONENT_INJECTOR, ComponentInjector } from './component-injector';
import { ComponentOutletInjectorDirective } from './component-outlet-injector.directive';
import { DynamicAttributesDirective } from './dynamic-attributes.directive';
import { DynamicDirectivesDirective } from './dynamic-directives.directive';
import { DynamicComponent } from './dynamic.component';
import { DynamicDirective } from './dynamic.directive';
import { IoFactoryService } from './io-factory.service';
import { WindowRefService, WINDOW_REF } from './window-ref.service';

export function windowRefFactory() {
  return window;
}

@NgModule({
  imports: [CommonModule],
  declarations: [
    DynamicComponent,
    DynamicDirective,
    ComponentOutletInjectorDirective,
    DynamicAttributesDirective,
    DynamicDirectivesDirective,
  ],
  exports: [
    DynamicComponent,
    DynamicDirective,
    ComponentOutletInjectorDirective,
    DynamicAttributesDirective,
    DynamicDirectivesDirective,
  ],
})




export class DynamicModule {
  static withComponents(
    components: Type<any>[],
    componentInjector: Type<ComponentInjector> = DynamicComponent
  ): ModuleWithProviders<DynamicModule> {
    return {
      ngModule: DynamicModule,
      providers: [
        // {
        //  // provide: ANALYZE_FOR_ENTRY_COMPONENTS,
        //  // useValue: components,
        //   //multi: true,
        // },
        { provide: COMPONENT_INJECTOR, useValue: componentInjector },
        IoFactoryService,
        { provide: WINDOW_REF, useFactory: windowRefFactory },
        WindowRefService
      ],
    };
  }
}
