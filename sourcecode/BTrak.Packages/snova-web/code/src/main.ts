import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key
registerLicense('Ngo9BigBOggjHTQxAR8/V1NGaF1cXGNCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdgWXZfc3RWRWJZVU1yXUc=');



// if (environment.production) {
//   window.console.log = () => {
//   };
//   enableProdMode();
// }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
