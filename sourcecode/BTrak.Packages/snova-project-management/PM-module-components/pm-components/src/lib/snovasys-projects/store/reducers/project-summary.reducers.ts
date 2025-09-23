import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { ConfigurationTypes } from "../../models/ConfigurationTypes";
import {
  ConfigurationTypesActions,
  ConfigurationTypesActionTypes
} from "../actions/configuration-types.action";
import {
  ProjectSummaryActionsUnion,
  ProjectSummaryActionTypes
} from "../actions/project-summary.action";

// tslint:disable-next-line: interface-name
export interface State {
  loading: boolean;
  activeGoalsCount: number;
  backLogGoalsCount: number;
  underReplanGoalsCount: number;
  archivedGoalsCount: number;
  projectMemberCount: number;
  projectFeatureCount: number;
  parkedGoalsCount: number;
  activeSprintsCount: number;
  replanSprintsCount: number;
  completedSprintsCount: number;
  templatesCount: number;
}

export const configurationTypeAdapter: EntityAdapter<
  ConfigurationTypes
> = createEntityAdapter<ConfigurationTypes>({
  // tslint:disable-next-line: no-shadowed-variable
  selectId: (ConfigurationTypes: ConfigurationTypes) =>
    ConfigurationTypes.configurationTypeId
});

export const initialState: State = {
  loading: false,
  activeGoalsCount: 0,
  backLogGoalsCount: 0,
  underReplanGoalsCount: 0,
  archivedGoalsCount: 0,
  projectMemberCount: 0,
  projectFeatureCount: 0,
  parkedGoalsCount: 0,
  activeSprintsCount: 0,
  replanSprintsCount: 0,
  completedSprintsCount: 0,
  templatesCount: 0
};

export function reducer(
  state: State = initialState,
  action: ProjectSummaryActionsUnion
): State {
  switch (action.type) {
    case ProjectSummaryActionTypes.ProjectSummaryTriggered:
      return { ...state, loading: true };
    case ProjectSummaryActionTypes.ProjectSummaryCompleted:
      return {
        ...state,
        loading: false,
        activeGoalsCount: (action as ProjectSummaryActionsUnion)
          .projectOverViewModel.activeGoalsCount,
        backLogGoalsCount: (action as ProjectSummaryActionsUnion)
          .projectOverViewModel.backLogGoalsCount,
        underReplanGoalsCount: (action as ProjectSummaryActionsUnion)
          .projectOverViewModel.underReplanGoalsCount,
        archivedGoalsCount: (action as ProjectSummaryActionsUnion)
          .projectOverViewModel.archivedGoalsCount,
        projectMemberCount: (action as ProjectSummaryActionsUnion)
          .projectOverViewModel.projectMemberCount,
        projectFeatureCount: (action as ProjectSummaryActionsUnion)
          .projectOverViewModel.projectFeatureCount,
        parkedGoalsCount: (action as ProjectSummaryActionsUnion)
          .projectOverViewModel.parkedGoalsCount,
        activeSprintsCount: (action as ProjectSummaryActionsUnion)
        .projectOverViewModel.activeSprintsCount,
        replanSprintsCount:  (action as ProjectSummaryActionsUnion)
        .projectOverViewModel.replanSprintsCount,
        completedSprintsCount:  (action as ProjectSummaryActionsUnion)
        .projectOverViewModel.completedSprintsCount,
        templatesCount:  (action as ProjectSummaryActionsUnion)
        .projectOverViewModel.templatesCount
      };
    case ProjectSummaryActionTypes.ProjectSummaryLoadFailed:
      return { ...state, loading: false };
    default:
      return state;
  }
}
