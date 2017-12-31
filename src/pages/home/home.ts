import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CableAPI } from '../../app/shared/shared';
import { AboutPage } from '../about/about';
import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  myDate: String = new Date().toISOString();
  companies: any = [];
  areasInCompany: any = [];

  selectedCompany: any = [];
  selectedAreas: any = [];

  constructor(public navCtrl: NavController,
    public dbProvider: DatabaseProvider) {

  }

  public ionViewDidLoad() {

    this.dbProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.dbProvider.getAllCompanies().then(data => {
          this.companies = data;
          console.log("companies from db:", this.companies);
        });

        this.dbProvider.getAreasForCompany("1").then(data => {
          this.areasInCompany = data;
          console.log("selectedCompany for area filtering:", this.selectedCompany);
        });
      }
    });
    /*let comp = this.cableAPI.getCompanies().subscribe(data => {
      this.companies = data;
    });
    let area = this.cableAPI.getAreaData(1).subscribe(data => {
      this.areasInCompany = data;
    });*/
  }
  public onCompanyChange(selectedValue: any) {
    this.dbProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.dbProvider.getAreasForCompany(selectedValue).then(data => {
          this.areasInCompany = data;
        });
      }
    });
  }

  public gotoAbout(item) {
    //console.log(this.selectedAreaID);

    //this.navCtrl.push(AboutPage, item);
  }

  public gotoAboutPage() {
    console.log("in home page:", this.myDate);
    this.navCtrl.push(AboutPage, {
      selectedCompany: this.selectedCompany, selectedAreas: this.selectedAreas,
      selectedDate: this.myDate
    });
  }

}
