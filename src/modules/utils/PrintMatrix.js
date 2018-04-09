export function printMatrix(matrix) {
  for (let i = 0; i < matrix.length; i++) {
    let toPrint = '';
    for (let j = 0; j < matrix.length; j++) {
      toPrint =  toPrint.concat(matrix[i][j].toString());
      if (j !== matrix.length - 1) toPrint = toPrint.concat(', ');
    }

    console.log(toPrint);
  }
}
