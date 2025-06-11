import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-doc-nli-dialog',
  templateUrl: './doc-nli-dialog.component.html',
  styleUrls: ['./doc-nli-dialog.component.scss']
})
export class DocNliDialogComponent {

  constructor(private _bottomSheetRef: MatBottomSheetRef<DocNliDialogComponent>) {}

  selectLabel(label: string): void {
    this._bottomSheetRef.dismiss(label);
  }
}
