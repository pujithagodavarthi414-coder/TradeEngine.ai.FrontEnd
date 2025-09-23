import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from "@angular/core";
import { QueryBuilderConfig } from "angular2-query-builder";
import { CustomQueryHeadersModel } from "../../models/custom-query-headers.model";

@Component({
    selector: "customwidget-query-builder",
    templateUrl: "./customwidget-querybuilder.component.html"
})

export class CustomWidgetQueryBuilderComponent {

    @Input("widgetQueryColumns") set _widgetQueryColumns(value: any) {
        this.buildFilterInputs(value);
    }

    @Input("widgetQuery") set _widgetQuery(value: any) {
        if (value != null && value !== undefined) {
            this.query = JSON.parse(value);
        } else {
            this.query = null;
        }
    }

    fieldsS = {};
    filterslistCount = 0;
    config: QueryBuilderConfig = {
        fields: {}
    };
    query: any;
    @Output() querBuilderResult = new EventEmitter<string>();

    public operators = [
        {
            attributeType: "nvarchar",
            operators: ["Equals", "Does not Equal", "Starts With", "Ends With", "Contains", "Does Not Contain", "Does Not Start With", "Does Not End With"]
        },
        {
            attributeType: "int",
            operators: ["Equals", "Does not Equal", "Greater", "Equal or Greater", "Less", "Equal or Less"]
        },
        {
            attributeType: "datetime",
            operators: ["Date Equals to", "On or After date", "Before date"]
        }
    ];

    ngOnInit() {
    }

    constructor(private cdRef: ChangeDetectorRef) {
    }

    emitQueryOutput() {
        this.querBuilderResult.emit(JSON.stringify(this.query))
    }

    buildFilterInputs(headers: CustomQueryHeadersModel[]) {
        this.config.fields = {};
        this.fieldsS = {};
        this.filterslistCount = 0;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < headers.length; i++) {
            if (headers[i].includeInFilters) {
                this.filterslistCount = this.filterslistCount + 1;
                // tslint:disable-next-line: max-line-length
                if (headers[i].filter.toLowerCase() === "nvarchar" || headers[i].filter.toLowerCase() === "int" || headers[i].filter.toLowerCase() === "datetime" || headers[i].filter.toLowerCase() === "datetimeoffset" || headers[i].filter.toLowerCase() === "date") {
                    // tslint:disable-next-line: max-line-length
                    const type = (headers[i].filter.toLowerCase() === "nvarchar" || headers[i].filter.toLowerCase() === "varchar") ? "string" : headers[i].filter.toLowerCase() === "int" ? "number" : "datetime";
                    headers[i].filter = headers[i].filter.toLowerCase() == "date" ? "datetime" : headers[i].filter;
                    const currentOperator = this.operators.find((p) => p.attributeType.toLowerCase() === headers[i].filter.toLowerCase());
                    this.fieldsS[headers[i].field] = {
                        name: headers[i].field,
                        type: type === "datetime" ? "date" : type,
                        operators: currentOperator.operators
                    }
                } else if (headers[i].filter.toLowerCase() === "bit") {
                    this.fieldsS[headers[i].field] = {
                        name: headers[i].field,
                        type: "category",
                        operators: ["Equals"],
                        options: [
                            { name: "true", value: "1" },
                            { name: "false", value: "0" }
                        ]
                    }
                } else {
                    this.fieldsS[headers[i].field] = {
                        name: headers[i].field,
                        type: "string",
                        operators: ["Equals"]
                    }
                }

                this.config.fields = this.fieldsS;
                this.cdRef.markForCheck();
            }
        }
    }
}
