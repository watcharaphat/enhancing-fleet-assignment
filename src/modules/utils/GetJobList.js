import getAircraftList from './GetAircraftList';
import filter from './Filter';

export default function(schedule) {
  const jobs = [];
  const aircraftList = getAircraftList(schedule);

  aircraftList.forEach((aircraft) => {
    jobs.push({
      'equipmentName': aircraft,
      'flightTable': filter(schedule, `equipmentName=${aircraft}`),
    });
  });

  return jobs;
}
