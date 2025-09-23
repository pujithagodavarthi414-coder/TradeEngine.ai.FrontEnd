import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({ name: 'orderBy' })

@Injectable({ providedIn: 'root' })

export class OrderByPipe implements PipeTransform {

    transform(notifications: any[]): any[] {
        if (notifications && notifications.length > 0) {
            notifications = notifications.sort((notificationSortAscModel, notificationSortDescModel) => {
                return notificationSortDescModel.notificationCreatedDateTime - notificationSortAscModel.notificationCreatedDateTime;
            });
            return notifications;

        }
    }
}