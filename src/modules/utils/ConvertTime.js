function convertToMin(timeString) {
  if (timeString.length < 4) {
    timeString = '0'.repeat(4 - timeString.length).concat(timeString);
  }
  const hour = timeString[0].concat(timeString[1]);
  const minute = timeString[2].concat(timeString[3]);

  const hourMin = parseInt(hour) * 60;
  const minMin = parseInt(minute)

  const totalMin = hourMin + minMin;
  return totalMin;
}

function convertToTimeString(minTime) {
  let hour = Math.floor(minTime/60);
  if (hour < 10) {
    hour = '0'.concat(hour.toString());
  }

  let minute = minTime%60;

  if (minute < 10) {
    minute = '0'.concat(minute.toString());
  }

  const time = `${hour.toString()}:${minute.toString()}`;
  return time;
}

export function convertTime(timeString) {
  return convertToTimeString(convertToMin(timeString));
}

export function convertTimePlusTurnTime(timeString, turnTime) {
  return convertToTimeString(convertToMin(timeString) + turnTime);
}
