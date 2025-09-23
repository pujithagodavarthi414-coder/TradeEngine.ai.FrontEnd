import { Pipe, PipeTransform, Injectable } from '@angular/core';
import * as moment from "moment";
import { NotificationModel } from '../../shell-components/models/NotificationsOutPutModel';

@Pipe({ name: 'orderBy' })

@Injectable({ providedIn: 'root' })

export class OrderByPipe implements PipeTransform {

    transform(notifications: NotificationModel[]): any[] {
        if (notifications && notifications.length > 0) {
            notifications = notifications.sort((notificationSortAscModel, notificationSortDescModel) => {
                return moment.utc(notificationSortDescModel.createdDateTime).diff(moment.utc(notificationSortAscModel.createdDateTime));
            });
            return notifications;

        }
    }
}