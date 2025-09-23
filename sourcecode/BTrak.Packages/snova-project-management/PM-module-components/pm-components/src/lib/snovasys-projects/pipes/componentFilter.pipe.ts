import { Injectable, Pipe, PipeTransform } from "@angular/core";
import * as _ from "underscore";

@Pipe({
    name: "componentFilter",
    pure: true
})
@Injectable({ providedIn: 'root' })
export class ComponentFilterPipe implements PipeTransform {
    transform(components: any[], field: string, componentId: any): any[] {
        if (!componentId) {
            return components;
        } else {
            var componentsList = componentId.split(",");
            return _.filter(components, function (s) {
                return componentsList.includes(s.projectFeatureId);
            });
        }

    }
}
