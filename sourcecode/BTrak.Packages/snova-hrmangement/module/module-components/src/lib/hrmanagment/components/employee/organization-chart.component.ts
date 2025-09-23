import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { IEmployee } from "ng2-org-chart";
import { Router } from "@angular/router";
import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { HRManagementService } from '../../services/hr-management.service';
declare var $: any;
declare var kendo: any;

@Component({
    selector: "app-hr-organization-chart",
    templateUrl: "organization-chart.component.html"
})






export class OrganizationChartComponent extends CustomAppBaseComponent implements OnInit {

    employeeId: string;
    isAnyOperationIsInprogress: boolean = false;
    orgChart: IEmployee;
    @ViewChild("orgdiagram") organizationChart: ElementRef;
    diagram: any;
    showValidation: boolean;
    data: any;

    constructor(
        public snackbar: MatSnackBar,
        public routes: Router,
        public hrManagementService: HRManagementService,
        private cdRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
        // this.canAccess_feature_CanViewOrganizationChart$.subscribe((result) => {
        // this.canAccess_feature_CanViewOrganizationChart = result;
        if (this.canAccess_feature_CanViewOrganizationChart == true) {
            this.getOrgchartDetails();
        }
        // })
    }

    async getOrgchartDetails() {
        this.isAnyOperationIsInprogress = true;
        this.hrManagementService.getOrgazationChartDetails().subscribe(async (result: any) => {
            if (result.success === true) {
                this.data = result.data;
                if (this.data.length > 0) {
                    this.showValidation = false;
                    this.cdRef.detectChanges();
                    await this.delay(200);
                    this.drawOrganizationChart();
                } else {
                    this.showValidation = true;
                }
            }
            this.isAnyOperationIsInprogress = false;
            this.cdRef.detectChanges();
        })
    }

    delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    drawOrganizationChart() {
        this.isAnyOperationIsInprogress = true;
        this.diagram = kendo.jQuery(this.organizationChart.nativeElement).kendoDiagram({
            dataSource: new kendo.data.HierarchicalDataSource({
                data: this.data,
                schema: {
                    model: {
                        children: "items"
                    }
                }
            }),
            zoomStart: function (ev) {
                ev.preventDefault(true);
            },
            pannable: false,
            layout: {
                type: "layered"
            },
            editable: false,
            selectable: {
                multiple: false,
                stroke: {
                    width: 0
                }
            },
            dataBound: function () {
                var bbox = this.boundingBox();
                this.wrapper.width(bbox.width + bbox.x + 50);
                this.wrapper.height(bbox.height + bbox.y + 50);
                this.resize();
            },
            shapeDefaults: {
                visual: this.visualTemplate
            },
            click: this.navigateToProfile
        }).data("kendoDiagram");
        this.isAnyOperationIsInprogress = false;
        this.cdRef.detectChanges();
    }

    navigateToProfile(e) {
        if (e.item instanceof kendo.dataviz.diagram.Shape) {
            const employeeId = e.item.options.dataItem.employeeId;
            window.open("/dashboard/profile/" + employeeId + "/overview", "_parent");
            // this.navigateToUser(employeeId);
        }
    }

    navigateToUser(e) {
        this.routes.navigateByUrl('/dashboard/profile/' + e + '/overview');
    }

    visualTemplate(options) {
        var dataviz = kendo.dataviz;
        var g = new dataviz.diagram.Group();
        var dataItem = options.dataItem;

        g.append(new dataviz.diagram.Rectangle({
            width: 220,
            height: 80,
            stroke: {
                width: 3,
                color: "#3c7e86"
            },
            fill: "#3da8b5"
        }));

        // g.drawingElement.options.tooltip = {
        //     content: dataItem.name,
        //     shared: true,
        //     stroke: {
        //         width: 3,
        //         color: "#3c7e86"
        //     },
        //     fill : "#3da8b5"
        // };

        var layout = new dataviz.diagram.Layout(new dataviz.diagram.Rect(85, 30, 100, 50), {
            alignContent: "center",
            spacing: 4
        });

        g.append(layout);
        if (dataItem.designation != null) {
            var texts = dataItem.designation.split(",");
            var designation = (texts[0].length > 17 || texts.length > 1) ? texts[0].substring(0, 15) + ".." : texts[0];
        }
        else {
            var texts = dataItem.designation == null ? "" : dataItem.designation;
        }

        layout.append(new dataviz.diagram.TextBlock({
            text: designation
        }));

        layout.reflow();

        var tooltipName = dataItem.name;
        var displayName = dataItem.name.length > 17 ? dataItem.name.substring(0, 15) + ".." : dataItem.name;


        g.drawingElement.options.tooltip = {
            content: tooltipName,
            text: tooltipName,
            shared: true
        };
        g.append(new dataviz.diagram.TextBlock({
            text: displayName,
            x: 85,
            y: 7,
            fill: "#000000de"
        }));

        g.append(new dataviz.diagram.Image({
            source: dataItem.img,
            x: 7,
            y: 7,
            width: 68,
            height: 68
        }));

        return g;
    }
}



// import { Component, ViewEncapsulation, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
// import {
//     DiagramComponent, Diagram, NodeModel, ConnectorModel, LayoutAnimation, SnapSettingsModel,
//     DiagramTools, DataBinding, HierarchicalTree, SnapConstraints, LayoutModel, Container, StackPanel, ImageElement, TextElement
// } from '@syncfusion/ej2-angular-diagrams';
// import { DataManager } from '@syncfusion/ej2-data';
// import { CustomAppBaseComponent } from '../../../globaldependencies/components/componentbase';
// import { DesignationModel } from '../../models/designations-model';
// import { HRManagementService } from '../../services/hr-management.service';
// import { Observable } from 'rxjs';
// Diagram.Inject(DataBinding, HierarchicalTree, LayoutAnimation);


// export interface EmployeeInfo {
//     name: string;
//     designation: string;
//     img: string;

// }
// export interface DataInfo {
//     [key: string]: string;
// }


// @Component({
//     selector: 'app-hr-organization-chart',
//     templateUrl: 'organization-chart.component.html',
//     encapsulation: ViewEncapsulation.None
// })
// export class OrganizationChartComponent extends CustomAppBaseComponent implements OnInit {
//     public Data: any;
//     public Designations: any;
//     showValidation: boolean;
//     @ViewChild('diagram')
//     public diagram: DiagramComponent;
//     public snapSettings: SnapSettingsModel = { constraints: SnapConstraints.None };
//     public tool: DiagramTools = DiagramTools.ZoomPan;
//     public orgData: any;
//     public designationsList:string[];
//     public randomColors:string[];
//     public colorAssign:object;
//     isAnyOperationIsInprogress: boolean = false;
//     themeColor: string;
//     designations:  Observable<DesignationModel[]>;
//     constructor(public hrManagementService: HRManagementService, private cdRef: ChangeDetectorRef,) {

//         super();
//     }

//     ngOnInit() {
//         super.ngOnInit();
//         this.themeColor = localStorage.themeColor;
//         this.isAnyOperationIsInprogress = true;
//         if (this.canAccess_feature_CanViewOrganizationChart == true) {

//             this.hrManagementService.getOrgazationChartDetails().subscribe((result: any) => {

//                 if (result.success === true) {
//                     this.Data = result.data;
//                     if (this.Data.length > 0) {
//                         this.showValidation = false;
//                         this.cdRef.detectChanges();

//                         this.data = {

//                             id: 'employeeId', parentId: 'parentId', dataSource: new DataManager(this.Data)
//                         };
//                     } else {
//                         this.showValidation = true;
//                     }
//                 }

//                 this.isAnyOperationIsInprogress = false;
//                 this.cdRef.detectChanges();
//             })
//         }
//         this.getDesignationList();
       
//     }

//     public data: Object;
//     delay(ms: number) {
//         return new Promise((resolve) => setTimeout(resolve, ms));
//     }

//     public layout: LayoutModel = {
//         type: 'OrganizationalChart',
//         margin: { top: 50, bottom: 0, left: 0, right: 0 }
//         // getLayoutInfo: (node: Node, tree: TreeInfo) => {
//         //     if (!tree.hasSubTree) {
//         //         tree.orientation = 'Vertical';
//         //         tree.type = 'Right';
//         //     }
//         // }
//     };

//     public nodeDefaults(obj: NodeModel): NodeModel {
//         obj.height = 60;
//         obj.style = { fill: 'transparent', strokeWidth: 2 };
//         // obj.constraints=NodeConstraints.Select;
//         return obj;
//     };

//     public connDefaults(connector: ConnectorModel): ConnectorModel {
//         connector.targetDecorator.shape = 'None';
//         connector.type = 'Orthogonal';
//         connector.style.strokeColor = 'black';
//         connector.cornerRadius = 2;
//         return connector;
//     };

//     getDesignationList() {
//         const designationSearchModel = new DesignationModel();
//         this.hrManagementService.getDesignation(designationSearchModel).subscribe((result: any) => {

//             if (result.success === true) {
//                 this.Designations = result.data;
//                 this.designationsList = [];
//                 this.Designations.forEach(obj =>{
//                     this.designationsList.push(obj.designationName)
//                 })
//                 } else {
//                     this.showValidation = true;
//                 }
//             })
            
            
//     }
//     randomColor(){
//         this.randomColors=[];
//         for(var i =0; i<= this.designationsList.length; i++){
//             var color = Math.floor(0x1000000 * Math.random()).toString(16);
//             var randColor= '#' + ('000000' + color).slice(-6);
//             this.randomColors.push(randColor);
//         }
//         for(var i =0; i<= this.designationsList.length; i++){
//             var key = this.designationsList[i];
//             var value = this.randomColors[i]
//             this.colorAssign[key]=value;
//         }
      
//     }

//     public setNodeTemplate(obj: NodeModel): Container {
        

//         // let codes: Object = this.colorAssign;
//         // {
//             // "Analyst Developer": '#FF1493',
//             // "Lead Developer": '#FF7F50',
//             // "Lead Generation Manager": '#F08080',
//             // "Manager": '#DAA520',
//             // "QA": '#D3D3D3',
//             // "Recruiter": '#4169E1',
//             // "Senior Software Engineer": '#F0E68C',
//             // "Software Engineer": '#BDB76B',
//             // "Software Trainee": '#DC143C',
//             // "Super Admin": '#20B2AA',
//             // "Temp Grp": '#2E8B57',
//             // "Business Analyst": '#00BFFF',
//             // "Business Development Executive": '#008080',
//             // "CEO": '#00FFFF',
//             // "Consultant": '#FF4500',
//             // "COO": '#E0FFFF',
//             // "Digital Sales Executive": '#FF8C00',
//             // "Director": '#00CED1',
//             // "Freelancer": '#90EE90',
//             // "GlobalAdmin": '#40E0D0',
//             // "Hr Consultant": '#5F9EA0',
//             // "HR Executive": '#87CEEB',
//             // "HR Manager": '#87CEFA',
//             // "Goal Responsible Person": '#DB7093',
//         // };

//         let node: StackPanel = new StackPanel();
//         node.id = obj.id + '_outerstack1';
//         node.style.strokeColor = 'silver';
//         node.cornerRadius = 5;
//         node.padding = { left: 1, right: 1, top: 5, bottom: 1 };

//         let content: StackPanel = new StackPanel();
//         content.id = obj.id + '_outerstack';
//         content.orientation = 'Horizontal';
//         content.style.strokeColor = 'none';
//         content.cornerRadius = 5;
//         content.padding = { left: 1, right: 10, top: 1, bottom: 5 };

//         let innerStack: StackPanel = new StackPanel();
//         innerStack.style.strokeColor = 'none';
//         innerStack.cornerRadius = 10;
//         innerStack.margin = { left: 5, right: 0, top: 0, bottom: 5 };
//         innerStack.id = obj.id + '_innerstack';

//         let image: ImageElement = new ImageElement();
//         image.width = 30;
//         image.height = 30;
//         image.margin = { left: 0, right: 5, top: 0, bottom: 0 };
//         image.style.strokeWidth = 0
//         image.style.strokeColor = 'none';
//         image.source = (obj.data as EmployeeInfo).img;
//         image.id = obj.id + '_pic';

//         let text: TextElement = new TextElement();
//         text.content = (obj.data as EmployeeInfo).name;
//         text.style.color = 'black';
//         text.style.fontSize = 14;
//         text.style.bold = true;
//         text.style.strokeColor = 'none';
//         text.horizontalAlignment = 'Left';
//         text.style.fill = 'none';
//         text.id = obj.id + '_text1';

//         let desigText: TextElement = new TextElement();
//         desigText.margin = { left: 0, right: 0, top: 5, bottom: 0 };
//         desigText.content = (obj.data as EmployeeInfo).designation;
//         desigText.style.color = 'black';
//         desigText.style.strokeColor = 'none';
//         desigText.style.fontSize = 8;
//         desigText.style.fill = 'none';
//         desigText.horizontalAlignment = 'Left';
//         desigText.style.textWrapping = 'Wrap';
//         desigText.id = obj.id + '_desig';

//         let col: TextElement = new TextElement();
//         col.height = 5;
//         col.content = '';
//         col.width = 180;
//         col.style.fill = '#3da8b5';
//         let colIden: StackPanel = new StackPanel();
//         colIden.id = obj.id + '_inner';
//         colIden.style.fill = '#3da8b5';
//         colIden.style.strokeColor = '#3da8b5';
//         colIden.cornerRadius = 5;
//         colIden.width = 200

//         innerStack.children = [text, desigText];
//         content.children = [image, innerStack];
//         colIden.children = [col]
//         node.children = [content, colIden]
//         return node;
//     };


// }



































