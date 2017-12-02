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
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'cable.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.cableDatabase = db;
          this.fillDatabaseFromJSON();
        })
        .catch(e => console.log(e));
      console.log('Hello Cable DB');
    });
  }

  fillDatabaseFromJSON() {
    this.http.get('assets/StorageJSON.json')
      .map(res => res.text())
      .subscribe(sql => {
        console.log('values:', sql);
        this.sqlitePorter.importJsonToDb(this.cableDatabase, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
          })
          .catch(e => console.error(e));
      });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

  //method to save payments collected
  updatePaymentHistory(data) {
    this.cableDatabase.executeSql('UPDATE payment_history SET paid_amount=?,paid_date=? WHERE rowid=?', [data.paid_amount, data.paid_date, data.rowid])
      .then(res => {
        console.log(res);
      })
      .catch(e => {
        console.log(e);
      });
  }

  getAllCompanies() {
    this.cableDatabase.executeSql("SELECT * FROM company", []).then((data) => {
      console.log("records from company");
      console.log(data);

      let company = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          company.push({ company_id: data.rows.item(i).company_id, name: data.rows.item(i).name });
        }
        console.log(company);
      }
    })
      .catch(e => console.error(e));
  }

  getAreasForCompany(_company_id) {
    this.cableDatabase.executeSql("SELECT * FROM area WHERE company_id=?", _company_id).then((data) => {
      console.log("records from area");
      console.log(data);

      let areas = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          areas.push({ area_id: data.rows.item(i).area_id, name: data.rows.item(i).name });
        }
        console.log(areas);
      }
    })
      .catch(e => console.error(e));
  }

  //method to get data for selected area and due dates
  getSubscriberPaymentsForAreaAndMonthYear(_area_id, _dueMonth, _dueYear) {

    return this.cableDatabase.executeSql("SELECT * FROM subscribers s INNER JOIN payment_history ph ON s.subscriber_id = ph.subscriber_id WHERE area_id=? AND strftime('%m', datetime(payment_due_date))=? AND strftime('%Y', datetime(payment_due_date))=?", [_area_id, _dueMonth, _dueYear]).then((data) => {
      console.log("records from area");
      console.log(data);

      let subscribersAndPaymentDetails = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          subscribersAndPaymentDetails.push({ area_id: data.rows.item(i).area_id, subscriber_name: data.rows.item(i).subscriber_name });
        }
        console.log("data:", data);
        console.log("subscribersAndPaymentDetails:", subscribersAndPaymentDetails);
      }
    })
      .catch(e => console.error(e));
  }

  testFill() {

    var json = {
      "structure": {
        "tables": {
          "Artist": "([Id] PRIMARY KEY, [Title])"
        },
        "otherSQL": [
          "CREATE UNIQUE INDEX Artist_ID ON Artist(Id)"
        ]
      },
      "data": {
        "inserts": {
          "Artist": [
            { "Id": "1", "Title": "Fred" },
            { "Id": "2", "Title": "Bob" },
            { "Id": "3", "Title": "Jack" },
            { "Id": "4", "Title": "John" }
          ]
        }
      }
    };
    console.log("data!!", json)
    this.sqlitePorter.importJsonToDb(this.cableDatabase, json)
      .then(data => {
        this.databaseReady.next(true);
        console.log("Success!!", data)
      })
      .catch(e => console.error(e));


    this.cableDatabase.executeSql("SELECT * FROM Artist", []).then((data) => {
      console.log("records from artist");
      console.log(data);

      let developers = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          developers.push({ Id: data.rows.item(i).Id, Title: data.rows.item(i).Title });
        }
        console.log(developers);

      }
    })
      .catch(e => console.error(e));
  }

}
