import mongoose from 'mongoose';
import databaseEnv from '../env';
import flightModel from '../models/flight.model';
import fs from 'fs';
import util from 'util';
import Papa from 'papaparse';
import moment from 'moment';

const readFileAsync = util.promisify(fs.readFile);

const filePath = '/Users/watcharaphat/Documents/CPEY4/ProjectRelate/code/enhancing-fleet-assignment/data/2017-thai-airasia-2.csv';

mongoose.Promise = global.Promise;

let dateKey;

async function connectDatabase() {
  const username = databaseEnv.username;
  const password = databaseEnv.password;
  const host = databaseEnv.host;
  const port = databaseEnv.port;
  const database = databaseEnv.database;

  try {
    const mongoDb = `mongodb://${username}:${password}@${host}:${port}/${database}`;
    await mongoose.connect(mongoDb);
  } catch (error) {
    console.error('Error on connecting database', error);
  }
}

async function getData() {
  try {
    const dataText = await readFileAsync(filePath, { encoding: 'utf8' });

    return dataText;
  } catch(error) {
    console.error(error);
  }
}

function getDocument(row) {
  let date = row[dateKey].replace(/,/g, '');
  let kilometers = Number(row['Kilometers'].replace(/,/g, ''));

  try {
    date = moment(date, 'MMM DD YYYY').toDate();
  } catch (error) {
    console.error('Error converting date');
  }

  if (date == "Invalid Date") return;

  return {
    'date': date,
    'airline': row['Op Al'],
    'originCode': row['Orig'],
    'destinationCode': row['Dest'],
    'kilometers': kilometers,
    'flight': row['Flight'],
    'stops': row['Stops'],
    'equiptmentName': row['Equip'],
    'depTime': row['Dep Time'],
    'arrTime': row['Arr Time'],
    'blockMins': row['Block Mins'],
  }
}

async function main() {
  console.log('Connecting Database');
  await connectDatabase();

  const dataText = await getData();
  let data;

  try {
    data = await Papa.parse(dataText, {
      header: true,
      dynamTyping: false,
    }).data;
  } catch (error) {
    console.error('Error on papaparse', error);
  }

  for (let key in data[0]) {
    dateKey = key;
    break;
  }

  console.log('Writing data');

  const promiseArray = [];
  for (let i = 0; i < data.length; i++) {
    const document = getDocument(data[i]);

    try {
      if (document) promiseArray.push(flightModel.create(document));
    } catch (error) {
      console.error('Error on create document', error);                 
    }
  }

  console.log('Waiting for promises');

  await Promise.all(promiseArray);

  console.log('Done writing database');
}

main();
