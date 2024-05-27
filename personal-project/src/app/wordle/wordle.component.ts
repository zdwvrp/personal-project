import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

interface GuessedLetter {
  letter: string;
  isInWord: boolean;
  isInCorrectPosition: boolean;
}
interface DisplayedLetter {
  letter: string;
  isInWord: boolean;
  isInCorrectPosition: boolean;
  hasBeenUsed: boolean;
}

@Component({
  selector: 'app-wordle',
  templateUrl: './wordle.component.html',
  styleUrls: ['./wordle.component.scss']
})
export class WordleComponent implements OnInit, AfterViewChecked {

  private readonly wordLength: number = 5;
  private readonly guessesAllowed: number = 6;

  letters: Array<Array<string>> = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m']
  ];

  words: Array<string> = [
    'slate',
    'irate',
    'quite',
    'slice',
    'trees',
    'boils',
    'hoist',
    'right',
    'write',
    'rhyme',
    'frost',
    'youth',
    'never',
    'exact',
    'drink',
    'pinky'
  ];
  wordleWord: string = '';
  wordleWordLetterCounts = {};

  displayedLetters: Array<Array<DisplayedLetter>> = [];
  guesses: Array<Array<GuessedLetter>> = [
    [],
    [],
    [],
    [],
    [],
    []
  ];
  guessesUsed: number = 0;
  currentGuess = '';

  @ViewChild('wordleInput') _wordleInput: ElementRef;
  @ViewChild('wordleForm') _wordleForm: NgForm;

  constructor() { }

  ngOnInit(): void {
    // init wordle word
    this.wordleWord = this.words[Math.round(Math.random() * (this.words.length - 1))];
    console.log('The word to guess is ' + this.wordleWord);

    // init wordle word letter counts
    for (let i = 0; i < this.wordLength; i++) {
      const wordLetter = this.wordleWord.charAt(i);
      if (!this.wordleWordLetterCounts[wordLetter]) {
        this.wordleWordLetterCounts[wordLetter] = 0;
      }
      this.wordleWordLetterCounts[wordLetter]++;
    }

    // init guesses
    this.guesses.forEach(guess => {
      for (let i = 0; i < this.wordLength; i++) {
        guess.push(this.createEmptyGuessedLetter());
      }
    });

    // init displayed letters
    this.letters.forEach((arrayOfLetters, i) => {
      arrayOfLetters.forEach((letter, j) => {
        if (!this.displayedLetters[i]) {this.displayedLetters[i] = [];}
        let newLetterObj = this.createEmptyDisplayedLetter();
        newLetterObj.letter = letter;
        this.displayedLetters[i].push(newLetterObj);
      });
    });
  }

  ngAfterViewChecked(): void {
    if (this._wordleInput !== undefined) {
      this._wordleInput.nativeElement.focus();
    }
  }

  createEmptyGuessedLetter(): GuessedLetter {
    return {
      letter: '',
      isInWord: false,
      isInCorrectPosition: false
    };
  }
  createEmptyDisplayedLetter(): DisplayedLetter {
    return {
      letter: '',
      isInWord: false,
      isInCorrectPosition: false,
      hasBeenUsed: false
    };
  }

  resetForm() {
    this.currentGuess = '';
    this._wordleInput.nativeElement.value = '';
  }

  handleWordleKeyUp(event, wordleInputValue: string) {
    wordleInputValue = wordleInputValue.replace(/[^a-zA-Z]/g, '');
    this._wordleInput.nativeElement.value = wordleInputValue;
    this.currentGuess = wordleInputValue.toUpperCase();
    this.updateCurrentGuess();
  }

  updateCurrentGuess() {
    this.guesses[this.guessesUsed].map((letter, i) => {
      letter.letter = this.currentGuess.charAt(i);
    });
  }

  // color - 'green' | 'yellow' | 'grey'
  updateDisplayedLetter(char: string, color: string) {
    this.displayedLetters.forEach(arrayOfLetters => {
      arrayOfLetters.forEach(letter => {
        if (letter.letter === char && !letter.isInCorrectPosition) {
          switch (color) {
            case 'green':
              letter.isInCorrectPosition = true;
              letter.isInWord = true;
              break;
            case 'yellow':
              letter.isInWord = true;
              break;
            case 'grey':

              break;
            default: 
              console.error('Invalid color code ' + color + '...');
              break;
          }

          letter.hasBeenUsed = true;
        }
      });
    });
  }

  trySubmitGuess() {
    const guess = this._wordleInput.nativeElement.value;
    console.log('trySubmitGuess guess: ' + guess );
    console.log('guess match: ', guess.match(/[^a-zA-Z]/))
    if (guess.match(/[a-zA-Z]/g) && guess.length === 5) {
      this.submitGuess(guess);
    } else {
      this.handleInvalidGuess(guess);
    }
  }

  handleInvalidGuess(guess) {
    console.log('invalid guess submitted: ', guess);
  }

  submitGuess(guess) {
    let letterCountsCopy = JSON.parse(JSON.stringify(this.wordleWordLetterCounts));
    console.log('guess submitted: ', guess);
    let numCorrect = 0;

    for (let i = 0; i < this.wordLength; i++) {
      // set green letters
      if (guess.charAt(i).toLowerCase() === this.wordleWord.charAt(i)) {
        this.guesses[this.guessesUsed][i].isInCorrectPosition = true;
        this.guesses[this.guessesUsed][i].isInWord = true;

        this.updateDisplayedLetter(guess.charAt(i).toLowerCase(), 'green');
        letterCountsCopy[guess.charAt(i).toLowerCase()]--;
        numCorrect++;
      }
    }

    for (let i = 0; i < this.wordLength; i++) {
      // set yellow letters
      if (!this.guesses[this.guessesUsed][i].isInCorrectPosition) {
        if (letterCountsCopy[guess.charAt(i).toLowerCase()] && letterCountsCopy[guess.charAt(i).toLowerCase()] > 0) {
          this.guesses[this.guessesUsed][i].isInWord = true;

          this.updateDisplayedLetter(guess.charAt(i).toLowerCase(), 'yellow');
          letterCountsCopy[guess.charAt(i).toLowerCase()]--;
        } else {
          this.updateDisplayedLetter(guess.charAt(i).toLowerCase(), 'grey');
        }
      }
    }

    this.guessesUsed++;

    if (numCorrect === this.wordLength) {
      // winner winner chicken dinner
    } else if (this.guessesUsed === this.guessesAllowed) {
      // game over :(
    } else {
      this.resetForm();
    }
  }

}
