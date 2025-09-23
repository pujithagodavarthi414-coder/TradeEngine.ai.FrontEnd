import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[skillExperience]'
})

export class SkillExperienceDirective {

    regexStr = '^(\\d+(\\.?\\d{0,2}))$';

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        let keyLocation = event.target.selectionStart;
        let string = event.srcElement.value.substring(0, keyLocation) + event.key + event.srcElement.value.substring(keyLocation, event.srcElement.value.length)
        return new RegExp(this.regexStr).test(string);
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
        this.validateFields(event);
    }

    validateFields(event) {
        setTimeout(() => {
            this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^0-9.]/g, '');
            event.preventDefault();
        }, 1)
    }
}