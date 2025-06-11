import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-doc-wds-dialog',
  templateUrl: './doc-wds-dialog.component.html',
  styleUrls: ['./doc-wds-dialog.component.scss']
})
export class DocWdsDialogComponent implements OnInit {
  shuffledDefinitions: { definition: string; color: string; examples: string[] }[] = [];

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<DocWdsDialogComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Shuffle definitions but keep the colors in the fixed order
    const colorMap = ['blue', 'green', 'purple'];  // Fixed color order
    const shuffledDefs = this.shuffleArray(this.data.definitions);  // Shuffle the definitions
    this.shuffledDefinitions = shuffledDefs.map((def, index) => ({
      ...def,
      color: colorMap[index]  // Assign fixed colors in order
    }));
  }

  shuffleArray(array: any[]): any[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  selectLabel(definition: string, color: string): void {
    // Pass both the selected definition and its color
    this._bottomSheetRef.dismiss({ definition, color });
  }
}
