import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'audit-list-loading',
    templateUrl: './audit-list-loading.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuditListLoadingComponent {
    Array = Array;
    num: number = 3;
}