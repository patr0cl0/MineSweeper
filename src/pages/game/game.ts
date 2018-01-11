import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
// import { NativeAudio } from '@ionic-native/native-audio';

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {

  board: any[][];
  points: number;
  setting;
  boardSetting;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public storageCtrl: Storage
            /*private nativeAudio: NativeAudio*/) {

                // this.nativeAudio.preloadSimple('uniqueId1', 'Treatment.mp3').then();
                // this.nativeAudio.play('uniqueId1').then();
    this.points = 0;
    storageCtrl.ready().then(() => {
      storageCtrl.get('setting').then((setting) => {
        if(!setting) {
          this.setting = {
            name:"Player",
            dificult:"intermedio",
            sound:"true"
          };
        } else {
          this.setting = JSON.parse(setting);
        }

        this.fillBoardSetting(this.setting);
        this.fillBoard(this.boardSetting);
      })
    })
  }

  fillBoardSetting(setting) {
    let cols, rows, mines;

    console.log (setting);
    switch(setting.dificult) {
      case 'facil':
        cols = 6;
        rows = 9;
        mines = 9;
        break;
      case 'intermedio':
        cols = 9;
        rows = 9;
        mines = 15;
        break;
      case 'dificil':
        cols = 8;
        rows = 12;
        mines = 20;
        break;
      case 'experto':
        cols = 9;
        rows = 14;
        mines = 30;
        break;
    }

    let boardSetting = {
      cols: cols,
      rows: rows,
      mines: mines
    };

    this.boardSetting = boardSetting;
    console.log(this.boardSetting);
  }
  fillBoard(boardSetting) {
    this.board = new Array();
    for (let i = 0; i < boardSetting.rows; i++) {
      this.board[i] = new Array();
      for (let j = 0; j < boardSetting.cols; j++) {
        this.board[i][j] = new Cell(i, j);
      }
    }

    // Pick totalBees spots
    let options = [];
    for (let i = 0; i < boardSetting.rows; i++) {
      for (let j = 0; j < boardSetting.cols; j++) {
        options.push([i, j]);
      }
    }


    for (let n = 0; n < boardSetting.mines; n++) {
      let index = Math.floor(Math.random() * options.length);
      let choice = options[index];
      let i = choice[0];
      let j = choice[1];
      // Deletes that spot so it's no longer an option
      options.splice(index, 1);
      this.board[i][j].mine = true;
    }


    for (let i = 0; i < boardSetting.rows; i++) {
      for (let j = 0; j < boardSetting.cols; j++) {
        this.board[i][j].aroundMinesCount(this.board, boardSetting.cols, boardSetting.rows);
      }
    }
  }
  reveal(cell) {
    if (cell.revealed){
      return ;
    }
    let space = document.getElementById('cell'+cell.x+'and'+cell.y);
    cell.revealed = true;
    if (cell.mine){
      cell.revealed = false;
      this.gameOver();
    } else if (cell.aroundMines > 0){
      this.points+= cell.aroundMines;
      space.style.background = 'darkcyan';
      space.innerHTML =  cell.aroundMines;
    } else {
      this.points+= 1;
      space.style.background = 'darkcyan';
      space.innerHTML =  ' ';
    }
    if (cell.aroundMines == 0) {
      this.revealRecursibly(cell);
    }
  }
  revealRecursibly(cell) {
    for (let xoff = -1; xoff <= 1; xoff++) {
      let i = cell.x + xoff;
      if (i < 0 || i >= this.boardSetting.rows)
        continue;

      for (let yoff = -1; yoff <= 1; yoff++) {
        let j = cell.y + yoff;
        if (j < 0 || j >= this.boardSetting.cols)
          continue;

        let nextCell = this.board[i][j];
        if (!nextCell.revealed) {
          this.reveal(nextCell);
        }
      }
    }
  }
  gameOver() {
    this.storageCtrl.ready().then(() => {
      this.storageCtrl.get('pointsTable').then((pointsTable) => {
        if (!pointsTable){
          let pointsTable = new Array();
          let player = {
              name: this.setting.name,
              points: this.points
            };
            pointsTable.push(player);
          this.storageCtrl.set('pointsTable',pointsTable);
        } else {
          pointsTable.reverse();
          let player = {
            name: this.setting.name,
            points: this.points
          };
          pointsTable.push(player);
          for (let i=1; i < pointsTable.length; i++) // bubbleSort
        		for (let j=0 ; j < pointsTable.length - 1; j++)
        			if (pointsTable[j].points > pointsTable[j+1].points){
        			   let temp = pointsTable[j];
        			   pointsTable[j] = pointsTable[j+1];
        			   pointsTable[j+1] = temp;
        		   }
          pointsTable.reverse();
          if (pointsTable.length > 9){
            for (let i = 9; i < pointsTable.length; i++){
              pointsTable.splice(i,1);
            }
          }
           this.storageCtrl.set('pointsTable',pointsTable);
        }
      })
    })

    for (let i = 0; i < this.boardSetting.rows; i++) {
      for (let j = 0; j < this.boardSetting.cols; j++) {
        if(this.board[i][j].revealed)
            continue;

        this.board[i][j].revealed = true;
        let space = document.getElementById('cell'+this.board[i][j].x+'and'+this.board[i][j].y);
        if (this.board[i][j].mine){
          space.style.background = 'darkcyan';
          space.innerHTML =  '@';
        }else if (this.board[i][j].aroundMines > 0){
          space.style.background = 'darkcyan';
          space.innerHTML =  this.board[i][j].aroundMines;
        } else {
          space.style.background = 'darkcyan';
          space.innerHTML =  ' ';
        }
      }
    }
    let alert = this.alertCtrl.create({
      title: 'GameOver! :(',
      subTitle: 'Haz tocado una mina, y perdiste por eso.',
      buttons: [
        {
          text: 'Okey...',
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamePage');
  }
  check(cell) {

    this.reveal(cell);

    if (cell.mine) {
      console.log("gameOver");
    } else {

    }

  }

}

class Cell {
  x;
  y;
  revealed;
  mine;
  aroundMines;
  constructor(i,j) {
    this.x = i;
    this.y = j;
    this.revealed = false;
    this.mine = false;
    this.aroundMines = 0;
  }
  aroundMinesCount(board,cols,rows) {

    if (this.mine) {
      this.aroundMines = -1;
      return;
    }
    let total = 0;
    for (let xoff = -1; xoff <= 1; xoff++) {
      let i = this.x + xoff;
      if (i < 0 || i >= rows) continue;

      for (let yoff = -1; yoff <= 1; yoff++) {
        let j = this.y + yoff;
        if (j < 0 || j >= cols) continue;

        let cell = board[i][j];
        if (cell.mine) {
          total++;
        }
      }
    }
    this.aroundMines = total;
  }
}
