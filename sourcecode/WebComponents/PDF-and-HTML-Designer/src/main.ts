import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key
 //registerLicense('Mgo+DSMBaFt/QHRqVVhjVFpGaV1BQmFJfFBmTGlZeFR1cEU3HVdTRHRcQlxhTH5XdUBmXHhZcnw=;Mgo+DSMBMAY9C3t2VVhkQlFadVdJX3xLfUx0RWFab1d6dFJMZVhBNQtUQF1hSn5SdEBjXXxbdXFST2ZU');
registerLicense('Ngo9BigBOggjHTQxAR8/V1NGaF1cXGNCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdgWXZfc3RWRWJZVU1yXUc=');



if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
