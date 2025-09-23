import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, pipe, of } from "rxjs";
import { Action } from "@ngrx/store";
import { switchMap, map, catchError } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { ProductDetails } from "../../models/product-details";
import { AssetService } from "../../services/assets.service";
import { ProductDetailsActionTypes, LoadProductDetailsTriggered, LoadProductDetailsCompleted, CreateProductDetailsTriggered, CreateProductDetailsCompleted, CreateProductDetailsFailed, ProductDetailsExceptionHandled, DeleteProductDetailsCompleted, GetProductDetailsByIdTriggered, GetProductDetailsByIdCompleted, GetProductDetailsByIdFailed, UpdateProductDetailsById, LoadProductDetailsFailed } from "../actions/product-details.actions";
import { CookieService } from "ngx-cookie-service";
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { SnackbarOpen } from '../actions/snackbar.actions';
import { ShowValidationMessages, ShowExceptionMessages } from '../actions/notification-validator.action';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Injectable()
export class ProductDetailsEffects {
  ProductDetailsSearchResult: ProductDetails;
  toastrMessage: string;

  @Effect()
  loadProductDetailsList$: Observable<Action> = this.actions$.pipe(
    ofType<LoadProductDetailsTriggered>(ProductDetailsActionTypes.LoadProductDetailsTriggered),
    switchMap(searchAction => {
      this.ProductDetailsSearchResult = searchAction.productDetailsSearchResult;
      return this.assetService
        .getProductDetailsList(searchAction.productDetailsSearchResult)
        .pipe(map((productDetailsList: any) => {
          if (productDetailsList.success === true) {
            return new LoadProductDetailsCompleted(productDetailsList.data);
          } else {
            return new LoadProductDetailsFailed(
              productDetailsList.apiResponseMessages
            );
          }
        }),
          catchError(error => {
            return of(new ProductDetailsExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertProductDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateProductDetailsTriggered>(ProductDetailsActionTypes.CreateProductDetailsTriggered),
    switchMap(productDetailsTriggeredAction => {
      if (productDetailsTriggeredAction.productDetails.productDetailsId === null || productDetailsTriggeredAction.productDetails.productDetailsId === '' || productDetailsTriggeredAction.productDetails.productDetailsId === undefined) {
        this.toastrMessage = "" + this.translateService.instant(ConstantVariables.SuccessMessageForProductDetailsCreated);
      } else if (
        productDetailsTriggeredAction.productDetails.productDetailsId !== undefined &&
        productDetailsTriggeredAction.productDetails.isArchived === true
      ) {
        this.toastrMessage = "" + this.translateService.instant(ConstantVariables.SuccessMessageForProductDetailsDeleted);
      } else {
        this.toastrMessage = "" + this.translateService.instant(ConstantVariables.SuccessMessageForProductDetailsUpdated);
      }
      return this.assetService
        .upsertProductDetails(productDetailsTriggeredAction.productDetails)
        .pipe(map((productDetailsId: any) => {
          if (productDetailsId.success === true) {
            return new CreateProductDetailsCompleted(productDetailsId.data);
          } else {
            return new CreateProductDetailsFailed(productDetailsId.apiResponseMessages);
          }
        }),
          catchError(error => {
            return of(new ProductDetailsExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertProductDetailsSuccessfulAndLoadProductdetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateProductDetailsCompleted>(ProductDetailsActionTypes.CreateProductDetailsCompleted),
    pipe(
      map(() => {
        return new LoadProductDetailsTriggered(this.ProductDetailsSearchResult);
      }),

    )
  );

  @Effect()
  upsertProductDetailsSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<CreateProductDetailsCompleted>(ProductDetailsActionTypes.CreateProductDetailsCompleted),
    pipe(map(() => new SnackbarOpen({
      message: this.toastrMessage, // TODO: Change to proper toast message
      action: this.translateService.instant(ConstantVariables.success)
    })
    )
    )
  );

  @Effect()
  deleteProductDetailsSuccessfulSnackbar$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteProductDetailsCompleted>(ProductDetailsActionTypes.DeleteProductDetailsCompleted),
    pipe(map(() =>
      new SnackbarOpen({
        message: this.toastrMessage, // TODO: Change to proper toast message
        action: this.translateService.instant(ConstantVariables.success)
      })
    )
    )
  );

  @Effect()
  deleteProductDetailsSuccessfulAndLoad$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteProductDetailsCompleted>(ProductDetailsActionTypes.DeleteProductDetailsCompleted),
    pipe(
      map(() => {
        return new LoadProductDetailsTriggered(this.ProductDetailsSearchResult);
      })
    )
  );

  @Effect()
  getProductDetailsById$: Observable<Action> = this.actions$.pipe(
    ofType<GetProductDetailsByIdTriggered>(ProductDetailsActionTypes.GetProductDetailsByIdTriggered),
    switchMap(searchAction => {
      let ProductDetailsSearchModel = new ProductDetails();
      ProductDetailsSearchModel.productId = searchAction.productDetailsId;
      return this.assetService
        .searchProductDetailsList(ProductDetailsSearchModel)
        .pipe(map((ProductDetailsData: any) => {
          if (ProductDetailsData.success === true) {
            return new GetProductDetailsByIdCompleted(ProductDetailsData.data);
          } else {
            return new GetProductDetailsByIdFailed(
              ProductDetailsData.apiResponseMessages
            );
          }
        }),
          catchError(error => {
            return of(new ProductDetailsExceptionHandled(error));
          })
        );
    })
  );

  @Effect()
  upsertProductDetailsByIdSuccessful$: Observable<Action> = this.actions$.pipe(
    ofType<GetProductDetailsByIdCompleted>(ProductDetailsActionTypes.GetProductDetailsByIdCompleted),
    switchMap(searchAction => {
      return of(
        new UpdateProductDetailsById({
          ProductDetailsUpdate: {
            id: searchAction.ProductDetails.productId,
            changes: searchAction.ProductDetails
          }
        })
      )
    })
  );

  @Effect()
  showValidationMessagesForLoadProductDetails$: Observable<Action> = this.actions$.pipe(
    ofType<LoadProductDetailsFailed>(ProductDetailsActionTypes.LoadProductDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForCreateProductDetails$: Observable<Action> = this.actions$.pipe(
    ofType<CreateProductDetailsFailed>(ProductDetailsActionTypes.CreateProductDetailsFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  showValidationMessagesForGetProductDetailsFailed$: Observable<Action> = this.actions$.pipe(
    ofType<GetProductDetailsByIdFailed>(ProductDetailsActionTypes.GetProductDetailsByIdFailed),
    switchMap(searchAction => {
      return of(new ShowValidationMessages({
        validationMessages: searchAction.validationMessages,
      })
      )
    })
  );

  @Effect()
  ProductDetailsExceptionHandled$: Observable<Action> = this.actions$.pipe(
    ofType<ProductDetailsExceptionHandled>(ProductDetailsActionTypes.ProductDetailsExceptionHandled),
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