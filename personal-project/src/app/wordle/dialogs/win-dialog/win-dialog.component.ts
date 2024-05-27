import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

interface DialogData {
  guessesUsed: number;
  correctWord: string;
}

@Component({
  selector: 'app-win-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './win-dialog.component.html',
  styleUrl: './win-dialog.component.scss'
})
export class WinDialogComponent {


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<WinDialogComponent>,
  ) {}
}
