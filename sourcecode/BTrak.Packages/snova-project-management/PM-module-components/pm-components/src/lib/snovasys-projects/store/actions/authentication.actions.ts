import { Action } from "@ngrx/store";
export enum AuthenticationActionTypes {
  
  SignedOff = "[Snovasys-PM][Authentication] Signed Off",

}




export class SignedOff implements Action {
  type = AuthenticationActionTypes.SignedOff;
  
  constructor() { }
}


export type AuthenticationActions =
 
     SignedOff
  