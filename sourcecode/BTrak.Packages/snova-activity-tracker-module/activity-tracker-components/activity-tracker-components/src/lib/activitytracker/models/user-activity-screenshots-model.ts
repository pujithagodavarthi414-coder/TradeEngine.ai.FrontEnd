import { SafeResourceUrl } from '@angular/platform-browser';
import { NgxGalleryImage } from 'ngx-gallery-9';


export class UserActivityScreenshotsModel implements NgxGalleryImage{
    small?: string | SafeResourceUrl;
    medium?: string | SafeResourceUrl;
    big?: string | SafeResourceUrl;
    description?: string;
    url?: string;
    label?: string;
    id?: string;
    public screenShotId: string;
    public name: string;
    public screenShotUrl: string;
    public screenShotName: string;
    public applicationName: string;
    public applicationTypeName: string;
    public screenShotDateTime: Date;
}