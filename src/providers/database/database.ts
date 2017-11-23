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

  private databaseReady: BehaviorSubject<boolean>;

  constructor(public sqlitePorter: SQLitePorter, private storage: Storage,
    public plt: Platform, private sqlite: SQLite, private http: Http) {
    this.plt.ready().then(() => {
      this.sqlite.create({
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
    });

  }

  fillDatabase(){
    this.http.get('assets/dummyDump.sql')
    .map(res => res.text())
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
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
