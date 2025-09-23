import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
  selector: "app-allgoals",
  template: `
    <app-allgoalslist></app-allgoalslist>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllgoalsComponent implements OnInit {
  constructor() {}

  ngOnInit() {

    
  }
}
