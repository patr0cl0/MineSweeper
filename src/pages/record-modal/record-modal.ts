import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the RecordModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-record-modal',
  templateUrl: 'record-modal.html',
})
export class RecordModalPage {

    pointsTable: any[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storageCtrl: Storage) {
    this.pointsTable = [];

    storageCtrl.ready().then(() => {
      storageCtrl.get('pointsTable').then((pointsTable) => {
        if (pointsTable) {
          this.pointsTable = pointsTable;
        }
      })
    })
  }

  ionViewDidLoad() {

  }

}
