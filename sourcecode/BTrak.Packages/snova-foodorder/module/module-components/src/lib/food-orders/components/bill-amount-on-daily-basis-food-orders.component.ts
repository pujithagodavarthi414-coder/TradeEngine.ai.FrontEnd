import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { ChartReadyEvent, ChartErrorEvent } from 'ng2-google-charts';

import { DailyFoodOrder } from '../models/dailyFoodorder.model';

import { FoodOrderService } from '../services/food-order.service';

import { ToastrService } from 'ngx-toastr';
import { DashboardFilterModel } from '../models/dashboardFilterModel';
import { EntityDropDownModel } from '../models/entity-dropdown.module';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import '../../globaldependencies/helpers/fontawesome-icons';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-hr-component-bill-amount-on-daily-basis-food-orders',
  templateUrl: `bill-amount-on-daily-basis-food-orders.component.html`,
})

export class DailyBasisOrdersComponent extends CustomAppBaseComponent {

  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }

  dashboardFilters: DashboardFilterModel;
  date: Date = new Date();
  validationMessage: string;
  selectedEntity: string;
  entities:EntityDropDownModel[];
  dailyFoodorder: DailyFoodOrder[];
  modifiedDailyFoodOrder: any;
  showGraphDetails: boolean;
  responsive = true;
  isHide:boolean ;
  isOpen = true;
  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart',
    options: {
      height: 800,
      legend: 'none',
      hAxis: {
        direction: -1,
        slantedText: true,
        Response: true,
        slantedTextAngle: 90,
        textStyle: {
          fontSize: 11
        }
      },
      vAxis: { gridlines: { count: 10 } },
    }
  }

  constructor(private foodOrderService: FoodOrderService,private cdRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private toaster: ToastrService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getEntityDropDown();
    this.getMonthlyFoodOrders();
  }

  ngOnChanges() {
    this.changeData();
  }

  error(event: ChartErrorEvent) {
  }

  changeData(): void {
    if (this.modifiedDailyFoodOrder && this.modifiedDailyFoodOrder.length <= 1) {
      this.columnChart.dataTable = [
        ['date', 'Cost'],
        ['-', 0]
      ];
      this.columnChart.component.draw();
    }
    else {
      this.columnChart.dataTable = this.modifiedDailyFoodOrder;
      this.columnChart.component.draw();
      this.cdRef.detectChanges();
    }
  }

  getPreviousSelectedDate() {
    const day = this.date.getDate() + 1;
    const month = 0 + (this.date.getMonth());
    const year = this.date.getFullYear();
    const newDate = day + '/' + month + '/' + year;
    this.date = this.convertStringToDateFormat(newDate);
    this.getMonthlyFoodOrders();
  }

  getCurrentSelectedDate() {
    const day = this.date.getDate() + 1;
    const month = 0 + (this.date.getMonth() + 2);
    const year = this.date.getFullYear();
    const newDate = day + '/' + month + '/' + year;
    this.date = this.convertStringToDateFormat(newDate);
    this.getMonthlyFoodOrders();
  }

  convertStringToDateFormat(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    } else if ((typeof value === 'string') && value === '') {
      return new Date();
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  getMonthlyFoodOrders() {
    this.foodOrderService.getMonthlyFoodOrders(this.date,this.selectedEntity).subscribe((Response: any) => {
      this.dailyFoodorder = Response.data;
      let cost = this.translateService.instant("COST");
      let modifiedDailyFoodOrder: any[] = [['date', cost]];
      this.dailyFoodorder.forEach(item => {
        let temp: any[] = [];
        let datePipe: DatePipe = new DatePipe('en-US')
        let filteredDate = datePipe.transform(item.orderedDateTime, 'yyyy-MM-dd');
        item.orderedDateTime = filteredDate;
        temp.push(item.orderedDateTime);
        temp.push(item.amount);
        modifiedDailyFoodOrder.push(temp);
      });
      this.modifiedDailyFoodOrder = modifiedDailyFoodOrder;
      this.changeData();
    });
  }

  ready(event: ChartReadyEvent) {
  }
  
  getEntityDropDown() {
    let searchText = "";
    this.foodOrderService.getEntityDropDown(searchText).subscribe((responseData: any) => {
      if (responseData.success === false) {
        this.validationMessage = responseData.apiResponseMessages[0].message;
        this.toaster.error(this.validationMessage);
      }
      else {
        this.entities = responseData.data;    
        if(this.entities==null){
          this.isHide = true;
        }   
      }     
    });
  }
  
  entityValues(name){
    this.selectedEntity=name;
    this.getMonthlyFoodOrders();
  } 

  filterClick(){
    this.isOpen = !this.isOpen;
  }

  resetAllFilters(){
    this.selectedEntity ="";
    this.getMonthlyFoodOrders();
  }
}
