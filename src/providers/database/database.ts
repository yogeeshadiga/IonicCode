import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';

import { BehaviorSubject } from 'rxjs/Rx';

import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';

@Injectable()
export class DatabaseProvider {

  db: SQLite;
  cableDatabase: SQLiteObject;

  private databaseReady: BehaviorSubject<boolean>;

  constructor(public sqlitePorter: SQLitePorter, private storage: Storage,
    public plt: Platform, private sqlite: SQLite, private http: Http) {
    this.databaseReady = new BehaviorSubject(false);
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'cable.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.cableDatabase = db;
          console.log('Hello Cable DB');
          this.storage.get('database_filled').then(val => {
            if (val) {
              this.databaseReady.next(true);
            } else {
              this.fillDatabaseFromJSON();
            }
          });
        })
        .catch(e => console.log(e));
    });
  }

  fillDatabaseFromJSON() {
    this.http.get('assets/StorageJSON.json')
      .map(res => res.text())
      .subscribe(sql => {
        console.log('values:', sql);
        this.sqlitePorter.importJsonToDb(this.cableDatabase, sql)
          .then(data => {
            console.log('data filled:', data);
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
            /*
                        this.getAllCompanies();
                        this.getAreasForCompany(1);
                        this.getSubscriberPaymentsForAreaAndMonthYear("1", "01", "2018");

                        let paymentmade = { paid_amount: "600", payment_date: "2018-01-10", other_action: "N/M", payment_history_id: "1" };
                        this.updatePaymentHistory(paymentmade);
                        this.getSubscriberPaymentsForAreaAndMonthYear("1", "01", "2018");*/
          })
          .catch(e => console.error(e));
      });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

  //method to save payments collected
  updatePaymentHistory(data) {
    return this.cableDatabase.executeSql('UPDATE payment_history SET paid_amount=?,payment_date=?, other_action=? WHERE payment_history_id=?',
      [data.paid_amount, data.payment_date, data.other_action, data.payment_history_id])
      .then(res => {
        console.log("called udpate!!!");
        console.log(res);
      })
      .catch(e => {
        console.log(e);
      });
  }

  getAllCompanies() {
    return this.cableDatabase.executeSql("SELECT * FROM company", []).then((data) => {
      console.log("records from company");
      console.log(data);

      let companies = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          companies.push({ company_id: data.rows.item(i).company_id, company_name: data.rows.item(i).company_name });
        }
        console.log(companies);
        return companies;
      }
    })
      .catch(e => { console.error(e); return []; });
  }

  public getAreasForCompany(_company_id) {
    return this.cableDatabase.executeSql("SELECT * FROM area WHERE company_id='" + _company_id + "'", []).then((data) => {
      console.log("records from getAreasForCompany", _company_id);
      console.log(data);
      let areas = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          areas.push({ area_id: data.rows.item(i).area_id, area_name: data.rows.item(i).area_name, company_id: data.rows.item(i).company_id });
        }
        console.log("areas===", areas);
        return areas;
      }
    })
      .catch(e => { console.error(e); return []; });
  }

  public getAreaForID(_area_id) {
    return this.cableDatabase.executeSql("SELECT * FROM area WHERE area_id=?", [_area_id]).then((data) => {
      console.log("Records from getAreaForID", _area_id);
      console.log(data);
      let areas = [];

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          areas.push({ area_id: data.rows.item(i).area_id, area_name: data.rows.item(i).area_name, company_id: data.rows.item(i).company_id });
        }
        console.log("areas===", areas);
        return areas;
      }
    })
      .catch(e => {
        console.error(e); return [];
      });
  }

  //method to get data for selected area and due dates
  getSubscriberPaymentsForAreaAndMonthYear(_area_id, _dueMonth, _dueYear) {
    return this.cableDatabase.executeSql("SELECT * FROM subscriber_details s INNER JOIN payment_history ph ON s.subscriber_id = ph.subscriber_id WHERE area_id in(?) AND strftime('%m', datetime(payment_due_date))=? AND strftime('%Y', datetime(payment_due_date))=?", [_area_id, _dueMonth, _dueYear]).then((data) => {
      console.log("records from getSubscriberPaymentsForAreaAndMonthYear");
      console.log("data.rows.length=", data.rows.length);

      let subscribersAndPaymentDetails = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          subscribersAndPaymentDetails.push({
            sort_oder: data.rows.item(i).sort_oder
            , subscriber_id: data.rows.item(i).subscriber_id
            , subscriber_name: data.rows.item(i).subscriber_name
            , set_top_box_num: data.rows.item(i).set_top_box_num
            , payment_history_id: data.rows.item(i).payment_history_id
            , payment_due_date: data.rows.item(i).payment_due_date
            , balance_amount: data.rows.item(i).balance_amount
            , payment_date: data.rows.item(i).payment_date
            , paid_amount: data.rows.item(i).paid_amount
            , other_action: data.rows.item(i).other_action
          });
        }
        console.log("data:", data);
        console.log("subscribersAndPaymentDetails:", subscribersAndPaymentDetails);
        return subscribersAndPaymentDetails;
      }
    })
      .catch(e => { console.error("Errorrrrr", e); return []; });
  }
}
