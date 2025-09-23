import { Pipe, PipeTransform, Injectable } from "@angular/core";

@Pipe({
    name: "testrailName"
})

@Injectable({ providedIn: 'root' })

export class TestrailNamePipe implements PipeTransform {
    transform(items: any[], searchText: string, parameter: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        let filteredItems = [];
        if (parameter == "testsuite") {
            items.forEach((item: any) => {
                if (item.testSuiteName.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1)
                    filteredItems.push(item);
            });
        }
        if (parameter == "testrun") {
            items.forEach((item: any) => {
                if (item.testRunName.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1)
                    filteredItems.push(item);
            });
        }
        if (parameter == "milestone") {
            items.forEach((item: any) => {
                if (item.milestoneTitle.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1)
                    filteredItems.push(item);
            });
        }
        if (parameter == "project") {
            items.forEach((item: any) => {
                if (item.projectName.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1)
                    filteredItems.push(item);
            });
        }
        if (parameter == "testreport") {
            items.forEach((item: any) => {
                if (item.testRailReportName.toLowerCase().indexOf(searchText.toLowerCase().trim()) != -1)
                    filteredItems.push(item);
            });
        }
        if (parameter == "testsuitecopy") {
            items.forEach((item: any) => {
                if (item.testSuiteId.toLowerCase() != searchText.toLowerCase())
                    filteredItems.push(item);
            });
        }
        return filteredItems;
    }
}
