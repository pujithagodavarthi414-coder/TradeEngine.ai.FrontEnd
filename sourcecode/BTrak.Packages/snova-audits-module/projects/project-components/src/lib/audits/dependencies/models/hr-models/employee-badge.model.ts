import { BadgeDetailsModel } from "./badge-details.model";

export class EmployeeBadgeModel {
    id: string;
    badgeId: string;
    assignedTo: string;
    badgeDescription: string;
    assignedToUser: string;
    assignedById: string;
    userId: string;
    assignedBy: string;
    isArchived: boolean;
    isForOverView: boolean;
    badgeName: string;
    description: string;
    badgeCount: number;
    badgeDetails: BadgeDetailsModel[]
}
