import { Component } from '@angular/core';

@Component({
  selector: 'app-mtg-life-counter',
  templateUrl: './mtg-life-counter.component.html',
  styleUrls: ['./mtg-life-counter.component.scss'],
  standalone: false
})
export class MtgLifeCounterComponent {
  players: number = 4;
  playerArray: Array<Object> = [];

  startingLifeTotal: number = 40;
  startingLifeTotalOptions: Array<number> = [20, 40];

  actionMenuHidden: boolean = true;
  actionButtonState: string = 'code';
  actionButtonStateMap: Array<string> = [
    'code',
    'code_off',
    'check'
  ];

  actionButtonCurrentAction: string | null = null;
  actionButtonCurrentActionMap: Array<string> = [
    'damage',
    'heal'
  ];

  lifeChangeState = {
    enabled: false,
    initiator: null
  };
  lifeChangeInitiatorMap: {
    0: 'damage',
    1: 'heal'
  };
  lifeChangeEnabled: boolean = false;

  ngOnInit() {
    this.actionButtonState = 'code';
    const ongoingGame = localStorage.getItem("players");
    if (ongoingGame) {
      this.loadGameSnapshotFromLocalStorage();
    } else {
      // Instantiate New Game
      this.playerArray = [];
      for(var i = 0; i < this.players; i++) {
        this.addPlayerToPlayerArray();
      }
    }

  }

  ///////////////////
  /* Local Storage */
  ///////////////////

  takeGameSnapshot() {
    const players = {players: [...this.playerArray]};
    const playersString = JSON.stringify(players);
    localStorage.setItem("players", playersString);
  }

  loadGameSnapshotFromLocalStorage() {
    const players = localStorage.getItem("players");
    this.playerArray = JSON.parse(players).players;
    console.log("INFO | Session restored!!");
  }


  //////////////////////
  /* Player Functions */
  //////////////////////

  addPlayerToPlayerArray() {
    this.playerArray.push(this.getNewPlayerObj());
  }

  getNewPlayerObj() {
    return {
      // player properties here
      life: this.startingLifeTotal,
    }
  }




  //////////////////
  /* GAME ACTIONS */
  //////////////////

  changeActionButtonState(newState: string) {
    const prevState = '' + this.actionButtonState;
    if (this.actionButtonStateMap.includes(newState)) {

      // Perform different actions based on newState
      switch(newState) {
        case 'code':
          this.actionMenuHidden = true;
          break;
        case 'code_off':
          this.actionMenuHidden = false;
          break;
        case 'check':
          // End current action & trigger things accordingly
          break;
        default:
          console.error('Unknown action button state "', newState, '"...');
      }
      console.log('Changing ACTION BUTTON STATE from "', prevState, '" to "', newState, '"');
      this.actionButtonState = newState;
    }
  }
  actionButtonClicked() {
    switch(this.actionButtonState) {
      case 'code':
        this.changeActionButtonState('code_off')
        break;
      case 'code_off':
        this.changeActionButtonState('code');
        break;
      case 'check':
        // End current action & trigger things accordingly
        break;
      default:
        console.error('Unknown current action button state "', this.actionButtonState, '"...');
    }
  }

  damagePlayer(player) {
    player.life--;
  }
  healPlayer(player) {
    player.life++;
  }

  toggleLifeChange(initiator: string | null) {
    if (initiator === null || initiator === this.lifeChangeState.initiator) {
      // Done altering player health
      this.lifeChangeState.enabled = false;
      this.lifeChangeState.initiator = null;

      // Set actionButton values (will probably need to flesh this out more lowkey)
      this.actionButtonCurrentAction = null;
      this.changeActionButtonState('code_off');

      // Take snapshot
      this.takeGameSnapshot();
    } else {
      // Allow player health to be altered
      this.lifeChangeState.enabled = !this.lifeChangeState.enabled;
      this.lifeChangeState.initiator = initiator;

      // Set actionButton values
      this.actionButtonCurrentAction = initiator;
      this.changeActionButtonState('check');
    }
  }
}

// Rotate display based on whose turn it is
// Add small bar with quick actions
