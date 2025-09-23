import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
    selector: '[trim]'
})

export class TrimDirective {

     inputText: any;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ){
        this.inputText = el.nativeElement;
    }

    @HostListener('keypress')
    onEvent() {
        setTimeout(() => { // get new input value in next event loop!
            let enteredText: string = this.inputText.value;
            if(enteredText && (enteredText.startsWith(' '))) {
                this.inputText.value = enteredText.trim();
                let event: Event = document.createEvent("Event");
                event.initEvent('input', true, true);
                Object.defineProperty(event, 'target', {value: this.inputText, enumerable: true});
                // this.renderer.invokeElementMethod(this.inputText, 'dispatchEvent', [event]);
            }
        },0);
    }
}