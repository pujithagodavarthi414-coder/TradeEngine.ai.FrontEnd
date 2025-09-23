export class RecentFoodOrders {
    OrderedItems: string;
    EmployeeName: string;
    Comments: string;
    OrderedDate: string;

}

export function createStubRecentFoodOrders() {
    const recentFoodOrders = new RecentFoodOrders();

    recentFoodOrders.OrderedItems = 'Roti';
    recentFoodOrders.EmployeeName = 'Bala Koti';
    recentFoodOrders.Comments = 'Test Comments';
    recentFoodOrders.OrderedDate = '19-11-2018';

    return recentFoodOrders;
}
