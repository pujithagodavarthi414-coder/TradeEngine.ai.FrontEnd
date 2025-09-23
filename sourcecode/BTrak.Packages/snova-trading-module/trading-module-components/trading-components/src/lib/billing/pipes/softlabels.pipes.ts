import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";
@Pipe({
  name: "softLabelsPipe"
})
@Injectable({providedIn:'root'})
export class SoftLabelPipe implements PipeTransform {
  transform(searchText: string, softLabels: any[]): string {
    let replaceText;
    if (!softLabels || softLabels.length === 0) {
      return searchText;
    }
    if (searchText && searchText.trim()) {
      if (searchText.toLowerCase().match(/(^|\W)project($|\W)/)) {
        replaceText = softLabels[0].projectLabel;
        let re = /project/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)deadline($|\W)/)) {
        replaceText = softLabels[0].deadlineLabel;
        let re = /deadline/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)goal($|\W)/)) {
        replaceText = softLabels[0].goalLabel;
        let re = /goal/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)work item($|\W)/)) {
        replaceText = softLabels[0].userStoryLabel;
        let re = /work item/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)employee($|\W)/)) {
        replaceText = softLabels[0].employeeLabel;
        let re = /employee/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)projects($|\W)/)) {
        replaceText = softLabels[0].projectsLabel;
        let re = /projects/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)deadlines($|\W)/)) {
        replaceText = softLabels[0].deadlinesLabel;
        let re = /deadlines/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)goals($|\W)/)) {
        replaceText = softLabels[0].goalsLabel;
        let re = /goals/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)work items($|\W)/)) {
        replaceText = softLabels[0].userStoriesLabel;
        let re = /work items/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)employees($|\W)/)) {
        replaceText = softLabels[0].employeesLabel;
        let re = /employees/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)scenario($|\W)/)) {
        replaceText = softLabels[0].scenarioLabel;
        let re = /scenario/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)scenarios($|\W)/)) {
        replaceText = softLabels[0].scenariosLabel;
        let re = /scenarios/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)run($|\W)/)) {
        replaceText = softLabels[0].runLabel;
        let re = /run/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)runs($|\W)/)) {
        replaceText = softLabels[0].runsLabel;
        let re = /runs/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)version($|\W)/)) {
        replaceText = softLabels[0].versionLabel;
        let re = /version/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)versions($|\W)/)) {
        replaceText = softLabels[0].versionsLabel;
        let re = /versions/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)test report($|\W)/)) {
        replaceText = softLabels[0].testReportLabel;
        let re = /test report/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)test reports($|\W)/)) {
        replaceText = softLabels[0].testReportsLabel;
        let re = /test reports/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)estimated time($|\W)/)) {
        replaceText = softLabels[0].estimatedTimeLabel;
        let re = /estimated time/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)estimation($|\W)/)) {
        replaceText = softLabels[0].estimationLabel;
        let re = /estimation/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)estimations($|\W)/)) {
        replaceText = softLabels[0].estimationsLabel;
        let re = /estimations/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)estimate($|\W)/)) {
        replaceText = softLabels[0].estimateLabel;
        let re = /estimate/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)estimates($|\W)/)) {
        replaceText = softLabels[0].estimatesLabel;
        let re = /estimates/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)client($|\W)/)) {
        replaceText = softLabels[0].clientLabel;
        let re = /client/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }
      if (searchText.toLowerCase().match(/(^|\W)clients($|\W)/)) {
        replaceText = softLabels[0].clientsLabel;
        let re = /clients/gi;
        if (replaceText) {
          searchText = searchText.replace(re, replaceText);
        }
      }

      let searchString = searchText.split('.');
      let str = "";

      searchString.forEach(function (item) {

        if (item.trim() != "") {
          if(item !="HR")
            item = item.trim().charAt(0).toUpperCase() + item.trim().substr(1).toLowerCase();
          str = str != "" ? (str + ". " + item + ".") : item;
        }
      });

      searchText = str;
    }

    return searchText;
  }
}
