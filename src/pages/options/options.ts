import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-options',
  templateUrl: 'options.html',
})
export class OptionsPage {
  name:string;
  dificult:string;
  sound:any;

  constructor(public storageCtrl:Storage) {
    storageCtrl.ready().then(() => {
      storageCtrl.get('setting').then((setting) => {
        if (!setting) {
          this.name = "Player";
          this.dificult = "intermedio";
          this.sound = "true";

          let setting = JSON.stringify({
            name: this.name,
            dificult: this.dificult,
            sound: this.sound
          });
          storageCtrl.set('setting',setting);
        } else {
          let newSetting = JSON.parse(setting);
          this.name = newSetting.name;
          this.dificult = newSetting.dificult;
          this.sound = newSetting.sound;
        }
      }).catch((error) => {
        console.log(error);
      })
    })
  }

  ionViewDidLoad() {
  }
  catchForm() {
    this.storageCtrl.ready().then(() => {
      let setting = JSON.stringify({
        name: this.name,
        dificult: this.dificult,
        sound: this.sound,
      });
      this.storageCtrl.set('setting',setting);
    })
  }
  deleteRecords() {
    this.storageCtrl.ready().then(() => {
      this.storageCtrl.remove('pointsTable');
    })
  }
}
