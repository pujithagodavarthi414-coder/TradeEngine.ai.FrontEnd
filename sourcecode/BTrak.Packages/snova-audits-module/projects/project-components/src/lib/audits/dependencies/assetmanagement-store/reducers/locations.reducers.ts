import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { LocationManagement } from '../../models/location-management';

import { LocationActions, LocationActionTypes } from '../actions/location.actions';

export interface State extends EntityState<LocationManagement> {
    loadingLocations: boolean;
    creatingLocation: boolean;
    createLocationErrors: string[];
    selectedSeatingId: string | null;
    exceptionMessage: string;
    gettingLocationsById: boolean;
    locationsData: LocationManagement
}

export const locationAdapter: EntityAdapter<
    LocationManagement
> = createEntityAdapter<LocationManagement>({
    selectId: (location: LocationManagement) => location.seatingId
});

export const initialState: State = locationAdapter.getInitialState({
    loadingLocations: false,
    creatingLocation: false,
    createLocationErrors: [''],
    selectedSeatingId: null,
    exceptionMessage: '',
    gettingLocationsById: false,
    locationsData: null
});

export function reducer(
    state: State = initialState,
    action: LocationActions
): State {
    switch (action.type) {
        case LocationActionTypes.LoadLocationsTriggered:
            return { ...state, loadingLocations: true };
        case LocationActionTypes.LoadLocationsCompleted:
            return locationAdapter.addAll(action.seatingLocations, {
                ...state, loadingLocations: false
            });
        case LocationActionTypes.LoadLocationsFailed:
            return { ...state, loadingLocations: false };
        case LocationActionTypes.CreateLocationTriggered:
            return { ...state, creatingLocation: true };
        case LocationActionTypes.CreateLocationCompleted:
            return { ...state, creatingLocation: false };
        case LocationActionTypes.CreateLocationFailed:
            return { ...state, creatingLocation: false, createLocationErrors: action.validationMessages };
        case LocationActionTypes.ExceptionHandled:
            return { ...state, creatingLocation: false, exceptionMessage: action.errorMessage };
        case LocationActionTypes.DeleteLocationsCompleted:
            return locationAdapter.removeOne(action.locationId, { ...state, creatingLocations: false });
        case LocationActionTypes.GetLocationsByIdTriggered:
            return { ...state, gettingLocationsById: true };
        case LocationActionTypes.GetLocationsByIdCompleted:
            return { ...state, gettingLocationsById: false, locationsData: action.location };
        case LocationActionTypes.GetLocationsByIdFailed:
            return { ...state, gettingLocationsById: false };
        case LocationActionTypes.UpdateLocationsById:
            return locationAdapter.updateOne(action.locationsUpdates.LocationsUpdate, state);
        case LocationActionTypes.RefreshLocations:
            return locationAdapter.upsertOne(action.location, state);
        default:
            return state;
    }
}