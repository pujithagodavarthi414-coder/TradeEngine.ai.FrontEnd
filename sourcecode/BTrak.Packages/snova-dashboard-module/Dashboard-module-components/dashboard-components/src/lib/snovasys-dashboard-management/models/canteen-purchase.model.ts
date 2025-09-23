export class CanteenPurchaseItemModel {
    userPurchasedCanteenFoodItemId: string;
    canteenItemId: string;
    canteenItemName: string;
    amount: number;
    quantity: number;
    purchasedDateTime: Date;
    purchasedByUserId: string;
    purchasedByUserName: string;
    purchasedByProfileImage: string;
    totalCount: number;
    balance: number;
}