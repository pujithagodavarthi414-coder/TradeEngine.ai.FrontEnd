import { OnInit, Input, Component, ChangeDetectionStrategy } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { State, orderBy, SortDescriptor } from '@progress/kendo-data-query';

@Component({
    selector: "app-customsubquery-table",
    templateUrl: "./custom-subquery-table.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class CustomSubqueryTableComponent  implements OnInit {

    @Input("Ids") set Ids(grid: any) {
        if(grid) {
            this.data = grid;
            this.loadItems();
        }
    }

    public gridView: GridDataResult;    
    public pageSize = 10;
    data: any;
    public skip = 0;
    state: State = {
        skip: 0,
        take: 99999999,
    };
    public sort: SortDescriptor[];
    constructor( ) {
    }

    ngOnInit() {        
    }

    private loadItems(): void {
        this.gridView = {
            data: this.data.slice(this.skip, this.skip + this.pageSize),
            total: this.data.length
        };
    }

    pageChange(event: PageChangeEvent): void {

        this.skip = event.skip;
        this.loadItems();
    }

    // public dataStateChange(state: State): void {
    //     this.state = state;
    //     this.loadItemsSorted();
    // }

    sortChange(sort: SortDescriptor[]) {
        this.sort = sort;
        this.loadItemsSorted();
    }
    loadItemsSorted() {
            this.gridView =
                 //process(this.data, this.state);
                 {
                     data: orderBy(this.data, this.sort),
                     total: this.data.length
                 }
                
            
    }
}