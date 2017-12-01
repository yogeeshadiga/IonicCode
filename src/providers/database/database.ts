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
  database: SQLiteObject;
  cableDatabase: SQLiteObject;

  private databaseReady: BehaviorSubject<boolean>;

  constructor(public sqlitePorter: SQLitePorter, private storage: Storage,
    public plt: Platform, private sqlite: SQLite, private http: Http) {
    this.plt.ready().then(() => {

      /*this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          db.executeSql('create table danceMoves(name VARCHAR(32))', {})
            .then(() => console.log('Executed SQL'))
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));

      console.log('Hello DatabaseProvider Provider');
*/
      this.sqlite.create({
        name: 'cable.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.cableDatabase = db;
          db.executeSql('drop table if exists company; create table company(company_id INTEGER, name VARCHAR(100))', {})
            .then(() => console.log('Droppped and Created Company Table'))
            .catch(e => console.log(e));
          db.executeSql('drop table if exists area; create table area(area_id INTEGER, name VARCHAR(100), company_id INTEGER, sort_oder INTEGER)', {})
            .then(() => {console.log('Droppped and Created area Table');
            this.fillDatabaseFromJSON();})
            .catch(e => console.log(e));
          db.executeSql('drop table if exists subscriber; create table subscriber(subscriber_id INTEGER, subscriber_name TEXT(100), nick_name TEXT(100), company_id INTEGER, area_id INTEGER, status TEXT(50))', {})
            .then(() => console.log('Droppped and Created subscriber Table'))
            .catch(e => console.log(e));
          db.executeSql('drop table if exists payment_history; create table payment_history(payment_history_id INTEGER, subscriber_id INTEGER, payment_due_date DATE, balance_amount INTEGER, payment_date DATE, paid_amount INTEGER, other_action TEXT)', {})
            .then(() => console.log('Droppped and Created payment_history Table'))
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));

      console.log('Hello Cable DB');

    });
  }

  fillDatabase(){
    this.http.get('assets/StorageJSON.sql')
    .map(res => res.text())
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(data => {
          this.databaseReady.next(true);
          this.storage.set('database_filled', true);
        })
        .catch(e => console.error(e));
    });

    //from localhost/getAllCompany, getallArea, getAllSubscriber, getPaymentHistories - get json
    //importJsonToDb(Company)
    //importJsonToDb(Area)
    //importJsonToDb(Subscriber)
    //importJsonToDb(PaymentHistory)
  }

  //use this to export edits made in the mobile
  exportChanges()
  {
//exportDbToJson(db)

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

      fillDatabaseFromJSON() {
        this.http.get('assets/DummyJSON.json')
          .map(res => res.text())
          .subscribe(sql => {
            console.log('values:', sql);
            this.sqlitePorter.importJsonToDb(this.cableDatabase, sql)
              .then(data => {
                this.databaseReady.next(true);
                this.storage.set('database_filled', true);
              })
              .catch(e => console.error(e));


            this.cableDatabase.executeSql("SELECT * FROM area", []).then((data) => {
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
          });
      }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

  //use this to save records added/updated through mobile
  addDeveloper(name, skill, years) {
    let data = [name, skill, years]
    return this.database.executeSql("INSERT INTO developer (name, skill, yearsOfExperience) VALUES (?, ?, ?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  getAllDevelopers() {
    return this.database.executeSql("SELECT * FROM developer", []).then((data) => {
      let developers = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          developers.push({ name: data.rows.item(i).name, skill: data.rows.item(i).skill, yearsOfExperience: data.rows.item(i).yearsOfExperience });
        }
      }
      return developers;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }
}
