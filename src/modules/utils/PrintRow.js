export function printRow(row, filterAircraftNo) {
  if (filterAircraftNo) {
    if (row.aircraftNo !== filterAircraftNo) return;
  }
  console.log(`${row.flight}, ${row.equipmentName}, ${row.originCode} -> ${row.destinationCode}, depTime: ${row.depTime}, arrTime: ${row.arrTime}, aircraftNo. ${row.aircraftNo}`);
}
