import {
  ComponentFactoryResolver,
  Injectable,
  KeyValueDiffers,
} from '@angular/core';

import { IoService } from './io.service';

@Injectable()
export class IoFactoryService {
  constructor(
    private differs: KeyValueDiffers,
    private cfr: ComponentFactoryResolver,
  ) {}

  create() {
    return new IoService(this.differs, this.cfr);
  }
}
