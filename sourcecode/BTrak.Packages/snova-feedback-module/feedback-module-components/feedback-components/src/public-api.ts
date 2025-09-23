import { SubmitBugComponent } from './lib/feedback-components/components/bug-feedback.component';
import { FeedbackListComponent } from './lib/feedback-components/components/feedbacks-list.component';
import { FeedBackComponent } from './lib/feedback-components/components/submit-feedback.component';
import { FeedBackService } from './lib/feedback-components/services/feedback.service';

export { SubmitBugComponent };
export { FeedbackListComponent };
export { FeedBackComponent };
export { FeedBackService };

export * from './lib/feedback-components/store/actions/feedback.action';

export * from './lib/feedback-components/feedback.module';

export { FeedBackEffects } from './lib/feedback-components/store/effects/feedback.effects';

export { State as fileUploadState } from './lib/feedback-components/store/reducers/feedback.reducers';
export { reducer as fileUploadReducers } from './lib/feedback-components/store/reducers/feedback.reducers';
export { feedBackAdapter } from './lib/feedback-components/store/reducers/feedback.reducers';