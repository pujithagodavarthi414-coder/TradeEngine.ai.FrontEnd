import { Routes } from '@angular/router';
import { MessengerComponent } from './components/messenger/messenger.component';


export const ChatRoutes: Routes = [ 
        {
        path: "",
        component: MessengerComponent,
        data: { title: "chat", breadcrumb: "chat" }
      } 
];