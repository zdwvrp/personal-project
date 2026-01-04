import { Component } from '@angular/core';

@Component({
  selector: 'app-mtg-life-counter',
  templateUrl: './mtg-life-counter.component.html',
  styleUrls: ['./mtg-life-counter.component.scss'],
  standalone: false
})
export class MtgLifeCounterComponent {
  game: any = {};

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
    initiator: null,
    editableGameState: null,
  };
  lifeChangeInitiatorMap: {
    0: 'damage',
    1: 'heal'
  };

  ngOnInit() {
    this.actionButtonState = 'code';
    const ongoingGame = localStorage.getItem("game");
    if (ongoingGame) {
      this.loadGameSnapshotFromLocalStorage();
    } else {
      // Instantiate New Game
      this.instantiateNewGame();
    }

  }

  ///////////////////
  /* Local Storage */
  ///////////////////

  takeGameSnapshot() {
    const gameString = JSON.stringify(this.game);
    localStorage.setItem("game", gameString);
  }

  loadGameSnapshotFromLocalStorage() {
    const ongoingGame = JSON.parse(localStorage.getItem("game"));
    this.game = { ...ongoingGame };
    console.log("INFO | Session restored!!");
  }


  ////////////////////
  /* Game Functions */
  ////////////////////

  instantiateNewGame() {
    console.log("INFO | Instantiating new game...");
    this.game.numberOfPlayers = 4;
    this.game.players = [];
    for(var i = 0; i < this.game.numberOfPlayers; i++) {
      this.addPlayerToGame();
    }

    this.game.logs = []; // Stack; Keeps track of damage logs that can be undone if desired.
  }

  createGameLog(dealingPlayerId: number, playerLifeChanges: Array<any>) {
    const newGameLog = {
      dealingPlayerId: dealingPlayerId,
      playerLifeChanges: playerLifeChanges
    };

    this.game.logs.push(newGameLog); // Add log to game object.
    this.takeGameSnapshot(); // Take new snapshot here.
  }

  //////////////////////
  /* Player Functions */
  //////////////////////

  addPlayerToGame() {
    this.game.players.push(this.getNewPlayerObj());
  }
  removePlayerFromGame(playerId: number | null = null) {
    if (playerId !== null) {
      // remove the specified player //
    } else {
      this.game.players.pop();
    }
  }

  getNewPlayerObj() {
    return {
      // player properties here
      life: this.startingLifeTotal,
      id: this.game.players.length,
    }
  }

  damagePlayer(player) {
    if (this.lifeChangeState.enabled) {
      this.lifeChangeState.editableGameState.players[player.id].life--;
    } else {
      console.log("ERROR | Attempted to damage player while life change is disabled...");
    }
    
  }
  healPlayer(player) {
    if (this.lifeChangeState.enabled) {
      this.lifeChangeState.editableGameState.players[player.id].life++;
    } else {
      console.log("ERROR | Attempted to heal player while life change is disabled...");
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
          // Collapse action menu
          this.actionMenuHidden = true;
          break;
        case 'code_off':
          // Expand action menu
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
        if (this.lifeChangeState.enabled) {
          this.toggleLifeChange(null);
        }
        // End current action & trigger things accordingly
        break;
      default:
        console.error('Unknown current action button state "', this.actionButtonState, '"...');
    }
  }

  toggleLifeChange(initiator: string | null) {
    if (initiator === null || initiator === this.lifeChangeState.initiator) {
      // Done altering player health
      this.lifeChangeState.enabled = false;
      this.lifeChangeState.initiator = null;

      // Set actionButton values (will probably need to flesh this out more lowkey)
      this.actionButtonCurrentAction = null;
      this.changeActionButtonState('code_off');

      // Create game log
      const playerLifeChanges = [];
      this.game.players.forEach((player, pid) => {
        if (player.life !== this.lifeChangeState.editableGameState.players[pid].life) {
          playerLifeChanges.push({
            playerId: player.id,
            prevLife: player.life,
            newLife: this.lifeChangeState.editableGameState.players[pid].life
          });
        }
      });

      if (playerLifeChanges.length > 0) {
        this.createGameLog(0, playerLifeChanges);
      }

      // Adjust live life totals accordingly
      this.game.players.forEach((player, pid) => {
        player.life = this.lifeChangeState.editableGameState.players[pid].life;
      });

      // Lastly, reset the editable game state for next use.
      this.lifeChangeState.editableGameState = null;
    } else {
      // Allow player health to be altered
      this.lifeChangeState.enabled = !this.lifeChangeState.enabled;
      this.lifeChangeState.initiator = initiator;

      this.lifeChangeState.editableGameState = {};
      this.lifeChangeState.editableGameState.players = JSON.parse(JSON.stringify(this.game.players));

      // Set actionButton values
      this.actionButtonCurrentAction = initiator;
      this.changeActionButtonState('check');
    }
  }

  getLifeChangeDifference(playerId) {
    if (this.lifeChangeState.enabled) {
      const lifeChange = this.lifeChangeState.editableGameState.players[playerId].life - this.game.players[playerId].life;
      console.log("INFO | getLifeChangeDifference(", playerId, ") => ", this.game.players[playerId].life, " - ", this.lifeChangeState.editableGameState.players[playerId].life, " = ", lifeChange);
      return this.lifeChangeState.editableGameState.players[playerId].life - this.game.players[playerId].life;
    }
    return null;
  }
}

// Rotate display based on whose turn it is
// Add small bar with quick actions
