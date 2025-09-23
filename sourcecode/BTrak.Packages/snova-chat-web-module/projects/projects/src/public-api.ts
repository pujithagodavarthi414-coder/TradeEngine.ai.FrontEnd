
import { CustomAppBaseComponent } from './lib/globaldependencies/components/componentbase';
import { ChatComponent } from './lib/chat/components/chat-display/ChatComponent.component';
import { MessengerComponent } from './lib/chat/components/messenger/messenger.component';
import {  MyFilterPipe } from './lib/chat/components/chat-display/my-filter.pipe';
import { ChatService } from './lib/chat/services/chat.service';
import { SnovaChatModule } from './lib/chat/chat.module';
import {ChatRoutes} from './lib/chat/chat.routing';
import { AddMembersToChannelDialog } from './lib/chat/dialogs/add-members-to-channel/add-members-to-channel';
import { PushNotificationDialog } from './lib/chat/dialogs/push-notification/push-notifications-dialog';
import { ColleagueSortByPipe } from './lib/chat/components/messenger/colleague-sort-by.pipe';
import { AvatarComponent } from './lib/globaldependencies/components/avatar.component';
import { RemoveSpecialCharactersPipe } from './lib/chat/pipes/removeSpecialCharacters.pipe';
import { FetchSizedAndCachedImagePipe } from './lib/chat/pipes/fetchSizedAndCachedImage.pipe';
import { CreateChannelDialog } from './lib/chat/dialogs/create-channel/create-channel-dialog';

export { CustomAppBaseComponent };
export { ChatComponent };
export { MessengerComponent };
export { MyFilterPipe };
export { ChatService };
export { SnovaChatModule };
export {AddMembersToChannelDialog};
export { PushNotificationDialog };
export { AvatarComponent };
export { ColleagueSortByPipe };
export {RemoveSpecialCharactersPipe};
export {FetchSizedAndCachedImagePipe};
export {CreateChannelDialog};
export {ChatRoutes}
export * from "./lib/chat/chat.module";

