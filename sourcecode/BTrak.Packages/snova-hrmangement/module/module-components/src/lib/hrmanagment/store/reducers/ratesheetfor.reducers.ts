import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { RateSheetForDetailsActions, RateSheetForDetailsActionTypes } from "../actions/ratesheetfor-actions";
import { RateSheetForModel } from '../../models/ratesheet-for-model';

export interface State extends EntityState<RateSheetForModel> {
    loadingRateSheetForDetails: boolean;
    creatingRateSheetForDetails: boolean;
    validationMessages: any[];
    errorMessage: string;
    rateSheetForID: string;
    rateSheetFor: RateSheetForModel;
    rateSheetForDetails: RateSheetForModel[];
    gettingRateSheetForDetailsById: boolean;
}

export const rateSheetForDetailsAdapter: EntityAdapter<RateSheetForModel> =
    createEntityAdapter<RateSheetForModel>({
        selectId: (rateSheetFor: RateSheetForModel) => rateSheetFor.rateSheetForId
    });

export const initialState: State = rateSheetForDetailsAdapter.getInitialState({
    loadingRateSheetForDetails: false,
    creatingRateSheetForDetails: false,
    validationMessages: [""],
    errorMessage: "",
    rateSheetForID: "",
    rateSheetFor: null,
    rateSheetForDetails: [],
    gettingRateSheetForDetailsById: false
});

export function reducer(state: State = initialState, action: RateSheetForDetailsActions): State {
    switch (action.type) {
        case RateSheetForDetailsActionTypes.GetRateSheetForTriggered:
            return { ...state, loadingRateSheetForDetails: true };
        case RateSheetForDetailsActionTypes.GetRateSheetForCompleted:
            return rateSheetForDetailsAdapter.addAll(action.rateSheetForDetails, {
                ...state, loadingRateSheetDetails: false
            });
        case RateSheetForDetailsActionTypes.GetRateSheetForFailed:
            return { ...state, loadingRateSheetForDetails: false, validationMessages: action.validationMessages };
    }
};
