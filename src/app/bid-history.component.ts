import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-bid-history',
  templateUrl: 'bid-history.html'
})
export class BidHistoryComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
