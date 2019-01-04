import {Entity, Column, ObjectIdColumn, ObjectID} from "typeorm";
import * as hash                                  from "object-hash";
import {Moment}                                   from "moment";
import moment = require("moment");

@Entity()
export class ForecastRating {
  @ObjectIdColumn()
  id: ObjectID;
  @Column()
  day: string;
  @Column()
  summary: string;
  @Column()
  rating: string;
}

@Entity()
export class ForecastHash {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  date: string;

  @Column()
  created: string;

  @Column()
  hash: string;

  @Column()
  type: string;

  constructor(type: string, hash: string, date: Date){
    this.type = type;
    this.hash = hash;
    this.date = moment(date).format(moment.HTML5_FMT.DATE);
    this.created = moment(date, moment.HTML5_FMT.DATETIME_LOCAL).toISOString();
  }
}

@Entity()
export class Forecast {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  summary: string;

  @Column(type => ForecastRating)
  forecasts: ForecastRating[];

  @Column()
  images?: string[];

  constructor(values?: Partial<Forecast>){
    Object.assign(this, values);
  }

  toHash(): string {
    return hash(this);
  }
}

