import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PortFolioModel } from "../../models/portfolio-model";
import { GenericFormService } from "../genericForm/services/generic-form.service";
import { ToastrService } from "ngx-toastr";
import html2canvas from 'html2canvas';
import { orderBy, process, State } from "@progress/kendo-data-query";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";


@Component({
    selector: "app-custom-app-records-excel-uploader-component",
    templateUrl: "./custom-app-records-excel-uploader.html"
})

export class CustomAppRecordsExcelUploaderComponent implements OnInit, AfterViewInit {
    
    @Input("widgetData")
    set _widgetData(grid: any) {
       this.widgetData = grid;
    }
    isLoading: boolean;
    widgetData: any;
    fileInfo: string;
    activeView:string = "uploading-excels";
    uploadedExcelSheetDetails : any;
    state: State = {
        skip: 0,
        take: 10,
    };
    pageable: boolean = false;
    sortBy: string;
    searchText: string;
    sortDirection: boolean;
    isAnyOperationIsInprogress:boolean = false;
    isUploaded:boolean = false;
    isHavingErrors:boolean =false;
    excelDetailsGridData: GridDataResult;
    

    constructor(private genericFormService: GenericFormService, private toastr: ToastrService,
        private cdRef: ChangeDetectorRef) {
        
    }

    ngOnInit() {
        this.getUploadedExcelSheetDetails();
    }

    ngAfterViewInit() {
    }

    openUploadExcel(){

    }

    onFileSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.dailyUploadExcel(file);
            // Clear the input value to ensure the change event will trigger again for the same file
            input.value = '';
        }
    }
    
    dailyUploadExcel(file: File): void {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name);
    
        this.isLoading = true;
        this.genericFormService.dailyUploadExcel(formData).subscribe((response: any) => {
            if (response.success) {
                this.isLoading = false;
                this.toastr.success("Excel sheet uploaded successfully");
                this.getUploadedExcelSheetDetails();
                this.cdRef.detectChanges();
            } else {
                this.isLoading = false;
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        });
    }
      setActiveView(view: string) {
        this.activeView = view;
        if(this.activeView =='uploading-excels')
        {
            this.isUploaded = false;
            this.isHavingErrors = false;

        }
        else if(this.activeView =='uploaded-excels') {
            this.isUploaded = true;
            this.isHavingErrors = false;
        }
        else if(this.activeView =='excels-with-errors') {
            this.isUploaded = false;
            this.isHavingErrors = true;
        }
        this.getUploadedExcelSheetDetails() ;
    
      }
      

    dataStateChange(state: DataStateChangeEvent): void {
        this.cdRef.detectChanges();
        this.state = state;

        let gridData = this.uploadedExcelSheetDetails;
        if (this.state.sort) {
            gridData = orderBy(this.uploadedExcelSheetDetails, this.state.sort);
        }
        this.excelDetailsGridData = process(gridData, this.state);
    }
    
    getUploadedExcelSheetDetails() {
        var inputModel = {
            isUploaded : this.isUploaded,
            isHavingErrors : this.isHavingErrors
        }
    
        this.isLoading = true;
        this.uploadedExcelSheetDetails = null;
        this.genericFormService.getUploadedExcelSheetDetails(inputModel).subscribe((response: any) => {
            this.isLoading = false;
            if (response.success) {
                this.uploadedExcelSheetDetails = response.data;
                var gridData: any[] = this.uploadedExcelSheetDetails;
                this.excelDetailsGridData = process(gridData, this.state);
                this.cdRef.detectChanges();             
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        });
    }

    convertUtcToLocal(utcDateString: string): Date {
        const utcDate = new Date(utcDateString);
        const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
        return localDate;
      }

    
    
}