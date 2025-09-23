export class FoodOrdersStatus {
    EmployeeCount: string;
    OrderedDate: string;
    TotalAmount: string;
    ApprovedDate: string;
    OrderStatus: string;

}

export function createStubFoodOrdersStatus() {
    const foodOrdersStatus = new FoodOrdersStatus();

    foodOrdersStatus.EmployeeCount = '2';
    foodOrdersStatus.OrderedDate = '03-11-2018';
    foodOrdersStatus.TotalAmount = '400';
    foodOrdersStatus.ApprovedDate = '05-11-2018';
    foodOrdersStatus.OrderStatus = 'Approved';

    return foodOrdersStatus;
}
