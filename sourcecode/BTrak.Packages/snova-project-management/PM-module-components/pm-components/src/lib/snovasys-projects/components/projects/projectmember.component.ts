import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ProjectMember } from "../../models/projectMember";

@Component({
  selector: "app-projectmember",
  templateUrl: "./projectmember.component.html"
})
export class ProjectMemberComponent {
  @Output() getSelectedEvent = new EventEmitter<string>();
  member;
  @Input("projectMember")
  set inputdata(projectMember: ProjectMember) {
    this.member = projectMember;
  }
  selectedProjectMember
  @Input("selectedProjectMember")
  set _selectedProjectMember(data: boolean) {
    this.selectedProjectMember = data;
  }

  getSelectedMember(userId) {
     this.getSelectedEvent.emit(userId);
  }
}
