import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
// import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: "app-sidebar-top",
  templateUrl: "./sidebar-top.component.html"
})

export class SidebarTopComponent implements OnInit, OnDestroy, AfterViewInit {
  // private sidebarPS: PerfectScrollbar;
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.sidebarPS = new PerfectScrollbar('#sidebar-top-scroll-area', {
    //     suppressScrollX: true
    //   })
    // })
  }

  ngOnDestroy() {
    // if(this.sidebarPS) {
    //   this.sidebarPS.destroy();
    // }
  }
}
