import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { Product } from "../../models/product";
import { AssetService } from "../../services/assets.service";
import { ProductActionTypes, LoadProductsCompleted, LoadProductsTriggered, CreateProductTriggered, CreateProductCompleted, CreateProductFailed, ProductExceptionHandled, LoadProductsFailed } from "../actions/product.actions";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Injectable()
export class ProductEffects {
  ProductSearchResult: Product;
  toastrMessage: string;

  @Effect()
  loadProducts$: Observable<Action> = this.actions$.pipe(
    ofType<LoadProductsTriggered>(ProductActionTypes.LoadProductsTriggered),
    switchMap(searchAction => {
      this.ProductSearchResult = searchAction.productSearchResult;
      return this.assetService
        .getProductList(searchAction.productSearchResult)
        .pipe(map((productsList: any) => {
          if (productsList.success === true) {
            return new LoadProductsCompleted(productsList.data);
          } else {
            return new LoadProductsFailed(productsList.apiResponseMessages);
          }
        }),
          catchError(error => {
            return of(new ProductExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertProduct$: Observable<Action> = this.actions$.pipe(
    ofType<CreateProductTriggered>(ProductActionTypes.CreateProductTriggered),
    switchMap(productTriggeredAction => {
      if (productTriggeredAction.product.productId === null || productTriggeredAction.product.productId === '' || productTriggeredAction.product.productId === undefined) {
        this.toastrMessage = productTriggeredAction.product.productName + " " + this.translateService.instant(ConstantVariables.SuccessMessageForProductCreated);
      } else if (
        productTriggeredAction.product.productId !== undefined &&
        productTriggeredAction.product.isArchived === true
      ) {
        this.toastrMessage = productTriggeredAction.product.productName + " " + this.translateService.instant(ConstantVariables.SuccessMessageForProductArchived);
      } else {
        this.toastrMessage = productTriggeredAction.product.productName + " " + this.translateService.instant(ConstantVariables.SuccessMessageForProductUpdated);
      }
      return this.assetService
        .upsertProduct(productTriggeredAction.product)
        .pipe(map((productId: any) => {
            if (productId.success === true) {
              return new CreateProductCompleted(productId.data);
            } else {
              return new CreateProductFailed(productId.apiResponseMessages);
            }
          }),
          catchError(error => {
            return of(new ProductExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertProductSuccessfulAndLoadProducts$: Observable<Action> = this.actions$.pipe(
    ofType<CreateProductCompleted>(ProductActionTypes.CreateProductCompleted),
    pipe(map(() => {
        return new LoadProductsTriggered(this.ProductSearchResult);
      }),
    )
  );

  @Effect()
  upsertProductSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<CreateProductCompleted>(ProductActionTypes.CreateProductCompleted),
    pipe(map(() => new SnackbarOpen({
            message: this.toastrMessage, // TODO: Change to proper toast message
            action: this.translateService.instant(ConstantVariables.success)
          })
      )
    )
  );

  @Effect()
  showValidationMessagesForLoadProductsFailed$: Observable<Action> = this.actions$.pipe(
    ofType<LoadProductsFailed>(ProductActionTypes.LoadProductsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForCreateProducts$: Observable<Action> = this.actions$.pipe(
    ofType<CreateProductFailed>(ProductActionTypes.CreateProductFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  ProductExceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ProductExceptionHandled>(ProductActionTypes.ProductExceptionHandled),
    switchMap(searchAction => {
      return of(new ShowExceptionMessages({
        message: searchAction.errorMessage, // TODO: Change to proper toast message
      })
      )
    })
  );

  constructor(
    private actions$: Actions,
    private assetService: AssetService,
    private translateService: TranslateService,
    private cookieService: CookieService
    ) {
      const browserLang: string = this.cookieService.get(LocalStorageProperties.CurrentCulture);
      this.translateService.use(browserLang);
  }
}