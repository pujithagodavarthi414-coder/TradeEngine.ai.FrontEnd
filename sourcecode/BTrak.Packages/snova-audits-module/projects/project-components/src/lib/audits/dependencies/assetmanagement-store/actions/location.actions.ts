import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { LocationManagement } from '../../models/location-management';

export enum LocationActionTypes {
    LoadLocationsTriggered = '[Location Component] Initial Data Load Triggered',
    LoadLocationsCompleted = '[Location Component] Initial Data Load Completed',
    LoadLocationsFailed = '[Location Component] Initial Data Load Failed',
    CreateLocationTriggered = '[Location Component] Create Location Triggered',
    CreateLocationCompleted = '[Location Component] Create Location Completed',
    CreateLocationFailed = '[Location Component] Create Location Failed',
    GetLocationsByIdTriggered = '[location Component] Get location By Id Triggered',
    GetLocationsByIdCompleted = '[location Component] Get location By Id Completed',
    GetLocationsByIdFailed = '[location Component] Get location By Id Failed',
    DeleteLocationsCompleted = '[location Component] Delete location Completed',
    UpdateLocationsById = '[location Component] Update location By Id',
    RefreshLocations = '[location Component] Refresh location List',
    ExceptionHandled = '[Location Component] HandleException',
}

export class LoadLocationsTriggered implements Action {
    type = LocationActionTypes.LoadLocationsTriggered;
    seatingLocations: LocationManagement[];
    location: LocationManagement;
    locationId: string;
    locationsUpdates: { LocationsUpdate: Update<LocationManagement> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public locationSearchResult: LocationManagement) { }
}

export class LoadLocationsCompleted implements Action {
    type = LocationActionTypes.LoadLocationsCompleted;
    locationSearchResult: LocationManagement;
    location: LocationManagement;
    locationId: string;
    locationsUpdates: { LocationsUpdate: Update<LocationManagement> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public seatingLocations: LocationManagement[]) { }
}

export class LoadLocationsFailed implements Action {
    type = LocationActionTypes.LoadLocationsFailed;
    locationSearchResult: LocationManagement;
    seatingLocations: LocationManagement[];
    location: LocationManagement;
    locationId: string;
    locationsUpdates: { LocationsUpdate: Update<LocationManagement> }
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class CreateLocationTriggered implements Action {
    type = LocationActionTypes.CreateLocationTriggered;
    locationSearchResult: LocationManagement;
    seatingLocations: LocationManagement[];
    locationId: string;
    locationsUpdates: { LocationsUpdate: Update<LocationManagement> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public location: LocationManagement) { }
}

export class CreateLocationCompleted implements Action {
    type = LocationActionTypes.CreateLocationCompleted;
    locationSearchResult: LocationManagement;
    seatingLocations: LocationManagement[];
    location: LocationManagement;
    locationsUpdates: { LocationsUpdate: Update<LocationManagement> }
    validationMessages: any[];
    errorMessage: string;
    constructor(public locationId: string) { }
}

export class CreateLocationFailed implements Action {
    type = LocationActionTypes.CreateLocationFailed;
    locationSearchResult: LocationManagement;
    seatingLocations: LocationManagement[];
    location: LocationManagement;
    locationId: string;
    locationsUpdates: { LocationsUpdate: Update<LocationManagement> }
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class DeleteLocationsCompleted implements Action {
    type = LocationActionTypes.DeleteLocationsCompleted;
    locationsSearchResult: LocationManagement;
    seatingLocations: LocationManagement[];
    location: LocationManagement;
    locationId: string;
    locationsUpdates: { LocationsUpdate: Update<LocationManagement> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public LocationId: string) { }
}

export class GetLocationsByIdTriggered implements Action {
    type = LocationActionTypes.GetLocationsByIdTriggered;
    seatingLocations: LocationManagement[];
    location: LocationManagement;
    locationsUpdates: { LocationsUpdate: Update<LocationManagement> }
    validationMessages: any[];
    locationId: string;
    errorMessage: string;
    constructor(public LocationId: string) { }
}

export class GetLocationsByIdCompleted implements Action {
    type = LocationActionTypes.GetLocationsByIdCompleted;
    locationsSearchResult: LocationManagement;
    seatingLocations: LocationManagement[];
    locationId: string;
    location: LocationManagement;
    locationsUpdates: { LocationsUpdate: Update<LocationManagement> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public Location: LocationManagement) { }
}

export class GetLocationsByIdFailed implements Action {
    type = LocationActionTypes.GetLocationsByIdFailed;
    locationsSearchResult: LocationManagement;
    seatingLocations: LocationManagement[];
    location: LocationManagement;
    locationId: string;
    locationsUpdates: { LocationsUpdate: Update<LocationManagement> };
    errorMessage: string;
    constructor(public validationMessages: any[]) { }
}

export class UpdateLocationsById implements Action {
    type = LocationActionTypes.UpdateLocationsById;
    locationsSearchResult: LocationManagement;
    seatingLocations: LocationManagement[];
    location: LocationManagement;
    locationId: string;
    locationsUpdates: { LocationsUpdate: Update<LocationManagement> };
    validationMessages: any[];
    errorMessage: string;
    constructor(public LocationsUpdates: { LocationsUpdate: Update<LocationManagement> }) { }
}


export class RefreshLocations implements Action {
    type = LocationActionTypes.RefreshLocations;
    locationsSearchResult: LocationManagement;
    seatingLocations: LocationManagement[];
    locationId: string;
    locationsUpdates: { LocationsUpdate: Update<LocationManagement> };
    validationMessages: any[];
    location: LocationManagement;
    errorMessage: string;
    constructor(public Location: LocationManagement) { }
}

export class ExceptionHandled implements Action {
    type = LocationActionTypes.ExceptionHandled;
    locationSearchResult: LocationManagement;
    seatingLocations: LocationManagement[];
    location: LocationManagement;
    locationsUpdates: { LocationsUpdate: Update<LocationManagement> }
    locationId: string;
    validationMessages: any[];
    constructor(public errorMessage: string) { }
}

export type LocationActions = LoadLocationsTriggered
    | LoadLocationsCompleted
    | LoadLocationsFailed
    | CreateLocationTriggered
    | CreateLocationCompleted
    | CreateLocationFailed
    | DeleteLocationsCompleted
    | GetLocationsByIdTriggered
    | GetLocationsByIdCompleted
    | GetLocationsByIdFailed
    | UpdateLocationsById
    | RefreshLocations
    | ExceptionHandled;