export class RoomModel {
    id: string;
    name: string;
    maxParticipants?: number;
    participantCount: number;
    receiverId: string;
    participantName: string;
    status: string;
    roomSid: string;
}