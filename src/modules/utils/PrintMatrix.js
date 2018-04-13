export function printMatrix(matrix) {
  const printed = [];

  for (let i = 0; i < matrix.length; i++) {
    let toPrint = '';
    for (let j = 0; j < matrix[i].length; j++) {
      toPrint =  toPrint.concat(matrix[i][j].toString());
      if (j !== matrix[i].length - 1) toPrint = toPrint.concat(', ');
    }

    if (printed.indexOf(toPrint === -1)) console.log(toPrint);
    else console.log('DUPLICATE');
    // console.log(toPrint);
    printed.push(toPrint);
  }
}
