import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({ name: 'projectOrder' })
@Injectable({ providedIn: 'root' })
export class ProjectOrderPipe implements PipeTransform {

    transform(projectList: any[]): any[] {
        let projects;
        if (projectList) {
            projects = projectList.length > 0 ? projectList.slice().sort((projectAsc, projectDesc) => {
                return projectAsc.projectName.localeCompare(projectDesc.projectName);
            }) : [];
        }
        return projects;
    }
}
