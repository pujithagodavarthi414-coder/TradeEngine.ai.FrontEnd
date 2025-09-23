import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[mobileNumber]'
})

export class MobileNumberDirective {

  regexStr = '^[0-9]*$';

  constructor(private el: ElementRef) { }

  @HostListener('keypress', ['$event']) onKeyPress(event) {
    return new RegExp(this.regexStr).test(event.srcElement.value + event.key);
  }

  @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }

  validateFields(event) {
    setTimeout(() => {
      this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^0-9]/g, '');
      event.preventDefault();
    }, 1)
  }
}