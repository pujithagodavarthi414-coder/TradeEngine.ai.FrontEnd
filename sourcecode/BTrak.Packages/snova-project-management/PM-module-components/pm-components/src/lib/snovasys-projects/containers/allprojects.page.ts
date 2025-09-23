import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-pm-page-allprojects",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-pm-component-project-list fxLayout='column' [fromAuditMenu]="fromAuditMenu"></app-pm-component-project-list>
  `
})
export class AllProjectsPageComponent {
  @Input() fromAuditMenu: boolean;
  constructor(private dialog: MatDialog) {
    this.dialog.closeAll();
  }
}
