import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

interface DialogData {
  guessesUsed: number;
  correctWord: string;
}

@Component({
    selector: 'app-lose-dialog',
    imports: [MatDialogModule],
    templateUrl: './lose-dialog.component.html',
    styleUrl: './lose-dialog.component.scss'
})
export class LoseDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<LoseDialogComponent>,
  ) {}
}
