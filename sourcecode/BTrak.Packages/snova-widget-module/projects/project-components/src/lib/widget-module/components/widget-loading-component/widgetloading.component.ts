import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output
} from "@angular/core";
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";

@Component({
  selector: "app-widget-loader",
  templateUrl: "./widgetloading.component.html",
  changeDetection: ChangeDetectionStrategy.Default
})

export class WidgetLoadingComponent implements OnInit {
  widget: any;
  injector: any;
  num = 5;
  Array = Array;
  @Output() closePopUp = new EventEmitter<any>();
  @Output() fileBytesData = new EventEmitter<any>();
  softLabels: any;
  @Input("widget")
  set _widget(data: any) {
    if (data != null) {
      this.widget = data;
    }
  }

  @Input("injector")
  set _injector(data: any) {
    if (data != null) {
      this.injector = data;
    }
  }

  constructor(private cdRef: ChangeDetectorRef) {
    this.getSoftLabelConfigurations();
  }

  getSoftLabelConfigurations() {
    this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
}

  
  outputs = {
    closePopUp: (close) => {
        this.closePopUp.emit(close);
    },
    fileBytes: (event) => {
      this.fileBytesData.emit(event);
  }
  }

  ngOnInit() {
    
  }
}