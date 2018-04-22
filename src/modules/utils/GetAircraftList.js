export default function(schedule) {
  const aircraftList = [];
  schedule.forEach((row) => {
    if (aircraftList.indexOf(row.equipmentName) === -1) aircraftList.push(row.equipmentName);
  });

  return aircraftList;
}
