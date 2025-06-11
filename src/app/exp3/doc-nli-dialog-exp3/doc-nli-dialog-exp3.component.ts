import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';



@Component({
  selector: 'app-doc-nli-dialog-exp3',
  templateUrl: './doc-nli-dialog-exp3.component.html',
  styleUrls: ['./doc-nli-dialog-exp3.component.scss']
})
export class DocNliDialogExp3Component {

  constructor(private _bottomSheetRef: MatBottomSheetRef<DocNliDialogExp3Component>) {}

  selectLabel(label: string): void {
    this._bottomSheetRef.dismiss(label);
  }
}
