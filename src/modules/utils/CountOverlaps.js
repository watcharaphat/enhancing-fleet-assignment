export function countOverlaps(flightTable, aircraft) {
  let maxOverlaps = 0;

  for (let i = 0; i < flightTable.length; i++) {
    let overlapsCount = 0;
    for (let j = 0; j < flightTable.length; j++) {
      if (i === j) continue;

      if (flightTable[i].equipmentName === aircraft && flightTable[j].equipmentName === aircraft) {
        const range1 = flightTable[i].momentRange;
        const range2 = flightTable[j].momentRange;

        let s = 'is ';
        if (!isOperatable(flightTable[i], flightTable[j])) {
          s = s.concat('not ');
        }

        // console.log(`${flightTable[i].flight} -> ${flightTable[j].flight} ${s} operatable`);

        if (range1.overlaps(range2)) {
          overlapsCount += 1;
          maxOverlaps = Math.max(maxOverlaps, overlapsCount);
        }
      }
    }
  }

  return maxOverlaps;
}
