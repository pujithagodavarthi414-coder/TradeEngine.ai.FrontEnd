import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";

@Component({
    selector: 'app-at-select-all',
    templateUrl: "./select-all.component.html",
})
export class SelectAllComponent {
    @Input() model: FormControl;
    @Input() values = [];

    isChecked(): boolean {
        return this.model.value && this.values.length && this.model.value.length === this.values.length;
    }

    isIndeterminate(): boolean {
        return this.model.value && this.values.length && this.model.value.length && this.model.value.length < this.values.length;
    }

    toggleSelection(change: MatCheckboxChange): void {
        if (change.checked) {
            this.model.setValue(this.values);
        } else {
            this.model.setValue([]);
        }
    }
}