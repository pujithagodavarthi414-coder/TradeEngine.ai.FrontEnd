import { Component, forwardRef, OnInit, ViewChild } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SignaturePad } from "angular2-signaturepad";
import '../../../globaldependencies/helpers/fontawesome-icons';

@Component({
    selector: "app-component-signature-base",
    templateUrl: `signature-base.component.html`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SignatureBaseComponent),
            multi: true
        }
    ]
})

export class SignatureBaseComponent implements OnInit {

    @ViewChild(SignaturePad) public signaturePad: SignaturePad;

    public options: Object = {};

    public _signature: any = null;

    public propagateChange = null;

    get signature(): any {
        return this._signature;
    }

    set signature(value: any) {
        this._signature = value;
        this.propagateChange(this.signature);
    }

    public writeValue(value: any): void {
        if (!value) {
            return;
        }
        this._signature = value;
        this.signaturePad.fromDataURL(this.signature);
    }

    public registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    constructor(public snackbar: MatSnackBar) {
    }

    ngOnInit() {
    }

    public drawBegin(): void {
        console.log('Begin Drawing');
    }

    public drawComplete(): void {
        this.signature = this.signaturePad.toDataURL('image/jpeg', 0.7);
    }

    public registerOnTouched(): void {
    }

    public clear(): void {
        this.signaturePad.clear();
        this.signature = '';
    }
}
