import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CableAPI } from '../../app/shared/shared';
import { AboutPage } from '../about/about';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  companies: any = [];
  constructor(public navCtrl: NavController, private cableAPI: CableAPI) {

  }

  public ionViewDidLoad() {
    let comp = this.cableAPI.getCompanies().subscribe(data => {
      this.companies = data;
    });
    console.log(this.companies);
  }
  public gotoAbout(item) {
    this.navCtrl.push(AboutPage, item);
  }
}
