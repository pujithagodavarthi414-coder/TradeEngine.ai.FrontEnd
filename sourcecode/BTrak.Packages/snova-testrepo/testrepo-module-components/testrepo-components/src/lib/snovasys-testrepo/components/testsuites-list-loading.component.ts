import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'testsuites-list-loading',
    templateUrl: './testsuites-list-loading.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TestSuitesListLoadingComponent {
    Array = Array;
    num: number = 3;
}