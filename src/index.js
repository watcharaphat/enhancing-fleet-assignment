const util = require('util');
const fs = require('fs');
const Papa = require('papaparse');

const readFileAsync = util.promisify(fs.readFile);

const filePath = '/Users/watcharaphat/Documents/CPEY4/ProjectRelate/code/enhancing-fleet-assignment/data/PlannerBkkAirways.csv';

async function getData() {
  try {
    const dataText = await readFileAsync(filePath, { encoding: 'utf8' });

    return dataText;
  } catch(error) {
    console.error(error);
  }
}

function convertToMin(timeString) {
  if (timeString.length === 3) {
    timeString = '0'.concat(timeString);
  }
  const hour = timeString[0].concat(timeString[1]);
  const minute = timeString[2].concat(timeString[3]);

  const hourMin = parseInt(hour) * 60;
  const minMin = parseInt(minute);

  const totalMin = hourMin + minMin;
  return totalMin;
}

function convertToTimeString(minTime) {
  let hour = Math.floor(minTime/60);

  let minute = minTime%60;

  if (minute < 10) {
    minute = '0'.concat(minute.toString());
  }

  const time = `${hour.toString()}:${minute.toString()}`;
  return time;
}

function convertTime(timeString) {
  return convertToTimeString(convertToMin(timeString));
}

async function main() {
  const dataText = await getData();
  const data = Papa.parse(dataText, {
    header: true,
    dynamicTyping: false,
  }).data;

  data.forEach((row) => {
    for (let key in row) {
      row[key] = row[key].replace(/\s\s+/g, ' ');
    }

    row.depTime = convertTime(row.depTime);
    row.arrTime = convertTime(row.arrTime);

    // console.log(row);
  });

  console.log(data);

  // const t = convertToTimeString(convertToMin('600'));
  // console.log(t);
}

main();
