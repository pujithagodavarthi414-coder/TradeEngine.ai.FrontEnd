import { Injectable, ComponentRef, Injector, Type, ComponentFactory, ComponentFactoryResolver, ApplicationRef } from '@angular/core';

export class DynamicComponentFactory<T> {

    private embeddedComponents: ComponentRef<T>[] = [];

    constructor(
        private appRef: ApplicationRef,
        private factory: ComponentFactory<T>,
        private injector: Injector,
    ) { }

    //#region Creation process
    /**
     * Creates components (of type `T`) as detected inside `hostElement`.
     * @param hostElement The host/parent Dom element inside which component selector needs to be searched.
     * _rearrange_ components rendering order in Dom, and also remove any not present in this list.
     */
    create(hostElement: Element): ComponentRef<T>[] {
        // Find elements of given Component selector type and put it into an Array (slice.call).
        const htmlEls = Array.prototype.slice.call(hostElement.querySelectorAll(this.factory.selector)) as Element[];
        // Create components
        const compRefs = htmlEls.map(el => this.createComponent(el));
        // Add to list
        this.embeddedComponents.push(...compRefs);
        // Attach created components into ApplicationRef to include them change-detection cycles.
        compRefs.forEach(compRef => this.appRef.attachView(compRef.hostView));
        // Return newly created components in case required outside
        return compRefs;
    }

    private createComponent(el: Element): ComponentRef<T> {
        // Convert NodeList into Array, cuz Angular dosen't like having a NodeList passed for projectableNodes
        const projectableNodes = [Array.prototype.slice.call(el.childNodes)];

        // Create component
        const compRef = this.factory.create(this.injector, projectableNodes, el);
        const comp = compRef.instance;

        // Apply ALL attributes inputs into the dynamic component (NOTE: This is a generic function. Not required
        // when you are sure of initialized component's input requirements.
        // Also note that only static property values work here since this is the only time they're set.
        this.setComponentAttrs(comp, el);

        return compRef;
    }

    private setComponentAttrs(comp: T, el: Element): void {
        const anyComp = (comp as any);
        for (const key in anyComp) {
            if (
                Object.prototype.hasOwnProperty.call(anyComp, key)
                && el.hasAttribute(key)
            ) {
                anyComp[key] = el.getAttribute(key);
                // console.log(el.getAttribute('name'), key, el.getAttribute(key));
            }
        }
    }
    //#endregion

    //#region Destroy process
    destroy(): void {
        this.embeddedComponents.forEach(compRef => this.appRef.detachView(compRef.hostView));
        this.embeddedComponents.forEach(compRef => compRef.destroy());
    }
    //#endregion
}

/**
 * Use this Factory class to create `DynamicComponentFactory<T>` instances.
 *
 * @tutorial PROVIDERS: This class should be "provided" in _each individual component_ (a.k.a. Host component)
 * that wants to use it. Also, you will want to inject this class with `@Self` decorator.
 *
 * **Reason**: Well, you could have `providedIn: 'root'` (and without `@Self`, but that causes the following issues:
 *  1. Routing does not work correctly - you don't get the correct instance of ActivatedRoute.
 */
@Injectable()
export class DynamicComponentFactoryFactory {

    constructor(
        private appRef: ApplicationRef,
        private injector: Injector,
        private resolver: ComponentFactoryResolver,
    ) { }

    create<T>(componentType: Type<T>): DynamicComponentFactory<T> {
        const factory = this.resolver.resolveComponentFactory(componentType);
        return new DynamicComponentFactory<T>(this.appRef, factory, this.injector);
    }

}