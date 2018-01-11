import { Component } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';
import { OptionsPage } from '../options/options';
import { GamePage } from '../game/game';
import { RecordModalPage } from '../record-modal/record-modal';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController) {

  }
  showCredits() {
    let alert = this.alertCtrl.create({
      title: 'Creditos',
      subTitle: 'Desarrollador: Fernando Salazar',
      buttons: ['Fino']
    });
    alert.present();
  }

  showRecords() {
    let modal = this.modalCtrl.create(RecordModalPage);
    modal.present();
  }
  redirectOptions() {
    this.navCtrl.push(OptionsPage);
  }
  redirectGame() {
    this.navCtrl.push(GamePage);
  }
}
