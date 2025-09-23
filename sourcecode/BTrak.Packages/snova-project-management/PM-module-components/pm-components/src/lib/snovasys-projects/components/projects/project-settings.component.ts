import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-pm-project-settings",
    templateUrl: "./project-settings.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  
  export class ProjectSettingsComponent {
    @Input() referenceId: string;
    @Input() referenceTypeId: string;
  }