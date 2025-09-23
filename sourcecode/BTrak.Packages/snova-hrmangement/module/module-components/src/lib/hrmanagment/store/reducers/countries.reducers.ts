import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { CountryModel } from "../../models/countries-model";
import { CountryListActions, CountryListActionTypes } from "../actions/countries.actions";

export interface State extends EntityState<CountryModel> {
    loadingCountryList: boolean;
    exceptionMessage: string;
}

export const CountryAdapter: EntityAdapter<
    CountryModel
> = createEntityAdapter<CountryModel>({
    selectId: (country: CountryModel) => country.countryId
});

export const initialState: State = CountryAdapter.getInitialState({
    loadingCountryList: false,
    exceptionMessage: ''
});

export function reducer(
    state: State = initialState,
    action: CountryListActions
): State {
    switch (action.type) {
        case CountryListActionTypes.LoadCountryListItemsTriggered:
            return { ...state, loadingCountryList: true };
        case CountryListActionTypes.LoadCountryListItemsCompleted:
            return CountryAdapter.addAll(action.countryList, {
                ...state,
                loadingCountryList: false
            });
        default:
            return state;
    }
}