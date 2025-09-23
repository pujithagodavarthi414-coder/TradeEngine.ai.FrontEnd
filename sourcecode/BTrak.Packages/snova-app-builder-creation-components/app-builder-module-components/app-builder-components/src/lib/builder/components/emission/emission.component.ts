import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PortFolioModel } from "../../models/portfolio-model";
import { GenericFormService } from "../genericForm/services/generic-form.service";
import { ToastrService } from "ngx-toastr";
import html2canvas from 'html2canvas';

@Component({
    selector: "app-emission-component",
    templateUrl: "./emission.component.html"
})

export class EmissionComponent implements OnInit, AfterViewInit {
    
    @Input("widgetData")
    set _widgetData(grid: any) {
       this.widgetData = grid;
    }
    @Output() fileBytes = new EventEmitter<any>();
    @ViewChild('listElement') listElement: ElementRef;
    isLoading: boolean;
    portFolioList: PortFolioModel[] = [];
    widgetData: any;
   

    constructor(private genericFormService: GenericFormService, private toastr: ToastrService,
        private cdRef: ChangeDetectorRef) {
        this.portFolioList = [
            {
                "source": "Total Electricity",
                "totalCO2Emission": "71.25m kwh",
                "fontIconName": "bolt",
                "color": "#f2bd72",
                "imagePath": ""
            },
            {
                "source": "Total Heating",
                "totalCO2Emission": "1.98m KBTU",
                "fontIconName": "fire",
                "color": "red",
                "imagePath": ""
            },
            {
                "source": "Total Cooling",
                "totalCO2Emission": "1.79m KBTU",
                "fontIconName": "snowflake",
                "color": "#20508a",
                "imagePath": ""
            },
            {
                "source": "Total Energy",
                "totalCO2Emission": "250.21m KBTU",
                "fontIconName": "",
                "color": "#54a870",
                "imagePath": "bar_chart"
            },
            {
                "source": "Total Water",
                "totalCO2Emission": "1.70b gal",
                "fontIconName": "tint",
                "color": "#5a88bf",
                "imagePath": ""
            },
            {
                "source": "Total Natural Gas",
                "totalCO2Emission": "738,945 thm",
                "fontIconName": "",
                "color": "#bd71de",
                "imagePath": "align_vertical_top"
            },
            {
                "source": "Total Wind Power",
                "totalCO2Emission": "58,015 kwh",
                "fontIconName": "cloud",
                "color": "4b9dcc",
                "imagePath": ""
            },
            {
                "source": "Total Recycling",
                "totalCO2Emission": "402 MT",
                "fontIconName": "recycle",
                "color": "#aed4bc",
                "imagePath": ""
            },
            {
                "source": "Total Waste",
                "totalCO2Emission": "461 MT",
                "fontIconName": "trash",
                "color": "#bec4c1",
                "imagePath": ""
            },
            {
                "source": "Total Solar Production",
                "totalCO2Emission": "2.5m kwh",
                "fontIconName": "certificate",
                "color": "#50cc79",
                "imagePath": "power"
            },
            {
                "source": "Total Manufacturing Output",
                "totalCO2Emission": "3.4m units",
                "fontIconName": "industry",
                "color": "grey",
                "imagePath": ""
            },
            {
                "source": "Energy Star Score",
                "totalCO2Emission": "93",
                "fontIconName": "star",
                "color": "#4b9dcc",
                "imagePath": ""
            }
        ]
        this.getEmissionsList();
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.exportEmissions();
    }

    getEmissionsList() {
        var searchModel: any = {};
        this.isLoading = true;
        this.genericFormService.getCo2EmissionReport(searchModel).subscribe((response: any) => {
            this.isLoading = false;
            if (response.success) {
                let portFolioList = response.data;
                portFolioList = this.getIconsList(portFolioList);
                this.portFolioList = portFolioList;
                this.cdRef.detectChanges();
            } else {
                this.toastr.error("", response.apiResponseMessages[0].message);
            }
        })
    }

    getIconsList(portFolioList) {
        portFolioList.forEach((folio) => {
            if (folio.source == 'Product Transport') {
                folio.imagePath = '../../../../assets/images/Product Transport.png';
            } else if (folio.source == 'Waste Gases') {
                folio.imagePath = '../../../../assets/images/waste gases.png';
            } else if (folio.source == 'Commuting') {
                folio.imagePath = '../../../../assets/images/Commuting.png';
            } else if (folio.source == 'RECs-Green Power') {
                folio.imagePath = '../../../../assets/images/Green power.png';
            } else if (folio.source == 'Business Travel') {
                folio.imagePath = '../../../../assets/images/Business Travel.png';
            } else if (folio.source == 'Mobile Sources') {
                folio.imagePath = '../../../../assets/images/Mobile sources.png';
            } else if (folio.source == 'Offsets') {
                folio.imagePath = '../../../../assets/images/CarbonOffsets.png';
            } else if (folio.source == 'Electricity') {
                folio.imagePath = '../../../../assets/images/electricity.png';
            } else if (folio.source == 'Fire Suppression') {
                folio.imagePath = '../../../../assets/images/fire-supression.png';
            } else if (folio.source == 'Steam') {
                folio.imagePath = '../../../../assets/images/Steam.png';
            } else if (folio.source == 'Purchased Gases') {
                folio.imagePath = '../../../../assets/images/purchased gases.png';
            } else if (folio.source == 'Refrigeration and AC') {
                folio.imagePath = '../../../../assets/images/Refrigeration and AC.png';
            } else if (folio.source == 'Stationary Combustion') {
                folio.imagePath = '../../../../assets/images/stationary combustion.png';
            }
        })
        return portFolioList;
    }


    getStyle(form) {
        let styles;
        if (form.imagePath && !form.fontIconName) {
            styles = {
                "margin-top": "-6px !important"
            };
        }
        return styles;
    }

    exportEmissions() {
        setTimeout(() => {
            let Id = "emissions";
            const list = this.listElement.nativeElement;
            html2canvas(list).then(canvas => {
                let imageData = canvas.toDataURL('image/png');
                var model: any = {};
                model.fileBytes = imageData;
                model.uniqueChartNumber = 0;
                model.visualisationName = "Emissions";
                model.isSystemWidget = true;
                model.widgetName = "Emissions";
                model.fileType = ".img";
                this.fileBytes.emit(model);
            });
        }, 1000);
    }

    waitForImagesToLoad(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const images = this.listElement.nativeElement.getElementsByTagName('img');
            let loadedCount = 0;
            const totalCount = images.length;
    
            if (totalCount === 0) {
                resolve();
            }
    
            const handleImageLoad = () => {
                loadedCount++;
                if (loadedCount === totalCount) {
                    resolve();
                }
            };
    
            for (let i = 0; i < totalCount; i++) {
                const image = images[i];
                if (image.complete) {
                    handleImageLoad();
                } else {
                    image.onload = handleImageLoad;
                    image.onerror = () => {
                        reject(new Error('Image loading failed'));
                    };
                }
            }
        });
    }
}