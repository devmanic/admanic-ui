import { NgModule } from '@angular/core';
import { ErrorHandler } from './error-handler.service';
import { ListRequestService } from './list-request.service';
import { ToastrService } from './toastr.service';
import { ClipboardService } from './clipboard.service';

@NgModule({
    declarations: [],
    imports: [],
    exports: [],
    providers: [
        ClipboardService,
        ErrorHandler,
        ListRequestService,
        ToastrService,
    ]
})
export class SharedModule {}
