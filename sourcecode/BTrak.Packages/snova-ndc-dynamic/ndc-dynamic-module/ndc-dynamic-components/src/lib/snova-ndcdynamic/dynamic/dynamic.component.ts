import { ComponentInjector } from './component-injector';
import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  Output,
  StaticProvider,
  SimpleChanges,
  Type,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'ndc-dynamic',
  template: '',
})
export class DynamicComponent implements OnChanges, ComponentInjector {
  @Input()
  ndcDynamicComponent: Type<any>;
  
  @Input()
  ndcDynamicInjector: Injector;

  @Input()
  ndcDynamicFactory: any;
  
  @Input()
  ndcDynamicProviders: StaticProvider[];
  @Input()
  ndcDynamicContent: any[][];

  @Output()
  ndcDynamicCreated: EventEmitter<ComponentRef<any>> = new EventEmitter();

  componentRef: ComponentRef<any> | null;

  constructor(
    private _vcr: ViewContainerRef,
    private _cfr: ComponentFactoryResolver,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ndcDynamicComponent'] || changes['ndcDynamicFactory'] ) {
      this.createDynamicComponent();
    }
  }

  createDynamicComponent() {
    this._vcr.clear();
    this.componentRef = null;

    if (this.ndcDynamicComponent && this.ndcDynamicFactory) {
      this.componentRef = this._vcr.createComponent(
        this.ndcDynamicFactory,
        0,
        this._resolveInjector(),
        this.ndcDynamicContent,
      );
      this.ndcDynamicCreated.emit(this.componentRef);
    }
  }

  private _resolveInjector(): Injector {
    let injector = this.ndcDynamicInjector || this._vcr.parentInjector;

    if (this.ndcDynamicProviders) {
      injector = Injector.create({
        providers: this.ndcDynamicProviders,
        parent: injector,
      });
    }

    return injector;
  }
}
