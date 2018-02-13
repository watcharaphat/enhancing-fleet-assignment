'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getData = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var dataText;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return readFileAsync(filePath, { encoding: 'utf8' });

          case 3:
            dataText = _context.sent;
            return _context.abrupt('return', dataText);

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](0);

            console.error(_context.t0);

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 7]]);
  }));

  return function getData() {
    return _ref.apply(this, arguments);
  };
}();

var dynamicAssign = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(aircraftList, flightTable) {
    var aList, bList, cList, a, b, c;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log('Fleet Assigning.');

            // sort by arrTime
            flightTable.sort(compareFlight);

            aList = [];
            bList = [];
            cList = [];


            flightTable.forEach(function (row) {
              switch (row.equipmentName) {
                case '(PG) 319':
                  aList.push(row);
                  break;
                case '(PG) 320':
                  bList.push(row);
                  break;
                case '(PG) AT7':
                  cList.push(row);
                  break;
              }
            });

            // await optimum(aList);

            // aList.forEach((row) => {
            //   if (row.aircraftNo) {
            //     console.log(row.flight);
            //   }
            // });

            a = countOverlaps(flightTable, aircraftList[0]);
            b = countOverlaps(flightTable, aircraftList[1]);
            c = countOverlaps(flightTable, aircraftList[2]);


            console.log('a: ' + a);
            console.log('b: ' + b);
            console.log('c: ' + c);

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function dynamicAssign(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

var optimum = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(schedule) {
    var i, row;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (isDone(schedule)) {
              _context3.next = 15;
              break;
            }

            i = 0;

          case 2:
            if (!(i < schedule.length)) {
              _context3.next = 11;
              break;
            }

            row = schedule[i];

            if (isConflict(row, latestRow)) {
              _context3.next = 8;
              break;
            }

            row.aircraftNo = currentAircraft;
            latestRow = row;
            return _context3.abrupt('continue', 8);

          case 8:
            i++;
            _context3.next = 2;
            break;

          case 11:

            latestRow = null;
            currentAircraft += 1;
            _context3.next = 0;
            break;

          case 15:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function optimum(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var main = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var turnTime, aircraftList, dataText, data;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            turnTime = 30;
            aircraftList = ['(PG) 319', '(PG) 320', '(PG) AT7'];

            // ****************************** 

            _context4.next = 4;
            return getData();

          case 4:
            dataText = _context4.sent;
            data = Papa.parse(dataText, {
              header: true,
              dynamicTyping: false
            }).data;


            data.forEach(function (row) {
              for (var key in row) {
                row[key] = row[key].replace(/\s\s+/g, ' ');
              }

              var tmp = row.arrTime;

              row.depTime = convertTime(row.depTime);
              row.arrTime = convertTime(row.arrTime);

              tmp = convertTimePlusTurnTime(tmp, turnTime);

              var date = moment().format('YYYY-MM-DD');
              var depMoment = moment(date + ' ' + row.depTime);
              var arrMoment = moment(date + ' ' + tmp);

              var range = moment.range(depMoment, arrMoment);
              row['momentRange'] = range;

              row.revenue = Number(row.revenue);
            });

            _context4.next = 9;
            return dynamicAssign(aircraftList, data);

          case 9:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function main() {
    return _ref4.apply(this, arguments);
  };
}();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _momentRange = require('moment-range');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moment = (0, _momentRange.extendMoment)(_moment2.default);

var util = require('util');
var fs = require('fs');
var Papa = require('papaparse');

var readFileAsync = util.promisify(fs.readFile);

var filePath = '/Users/watcharaphat/Documents/CPEY4/ProjectRelate/code/enhancing-fleet-assignment/data/PlannerBkkAirways.csv';

function convertToMin(timeString) {
  if (timeString.length === 3) {
    timeString = '0'.concat(timeString);
  }
  var hour = timeString[0].concat(timeString[1]);
  var minute = timeString[2].concat(timeString[3]);

  var hourMin = parseInt(hour) * 60;
  var minMin = parseInt(minute);

  var totalMin = hourMin + minMin;
  return totalMin;
}

function convertToTimeString(minTime) {
  var hour = Math.floor(minTime / 60);
  if (hour < 10) {
    hour = '0'.concat(hour.toString());
  }

  var minute = minTime % 60;

  if (minute < 10) {
    minute = '0'.concat(minute.toString());
  }

  var time = hour.toString() + ':' + minute.toString();
  return time;
}

function convertTime(timeString) {
  return convertToTimeString(convertToMin(timeString));
}

function convertTimePlusTurnTime(timeString, turnTime) {
  return convertToTimeString(convertToMin(timeString) + turnTime);
}

function countOverlaps(flightTable, aircraft) {
  var maxOverlaps = 0;

  for (var i = 0; i < flightTable.length; i++) {
    var overlapsCount = 0;
    for (var j = 0; j < flightTable.length; j++) {
      if (i === j) continue;

      if (flightTable[i].equipmentName === aircraft && flightTable[j].equipmentName === aircraft) {
        var range1 = flightTable[i].momentRange;
        var range2 = flightTable[j].momentRange;

        if (range1.overlaps(range2)) {
          overlapsCount += 1;
          maxOverlaps = Math.max(maxOverlaps, overlapsCount);
        }
      }
    }
  }

  return maxOverlaps;
}

var currentAircraft = 1;
var latestRow = null;

function isConflict(row1, row2) {
  if (!row2) {
    console.log('not conflict');
    return false;
  }

  console.log('isConflict: ' + row1.momentRange.overlaps(row2.momentRange));

  return row1.momentRange.overlaps(row2.momentRange);
}

function isDone(schedule) {
  for (var i = 0; i < schedule.length; i++) {
    var row = schedule[i];

    if (!row.aircraftNo) {
      console.log('not done');
      return false;
    }
  }

  console.log('done');

  // all row in schedule assigned
  return true;
}

function compareFlight(row1, row2) {
  if (row1.momentRange.end < row2.momentRange.end) {
    return -1;
  } else {
    return 1;
  }
}

main();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJyZWFkRmlsZUFzeW5jIiwiZmlsZVBhdGgiLCJlbmNvZGluZyIsImRhdGFUZXh0IiwiY29uc29sZSIsImVycm9yIiwiZ2V0RGF0YSIsImFpcmNyYWZ0TGlzdCIsImZsaWdodFRhYmxlIiwibG9nIiwic29ydCIsImNvbXBhcmVGbGlnaHQiLCJhTGlzdCIsImJMaXN0IiwiY0xpc3QiLCJmb3JFYWNoIiwicm93IiwiZXF1aXBtZW50TmFtZSIsInB1c2giLCJhIiwiY291bnRPdmVybGFwcyIsImIiLCJjIiwiZHluYW1pY0Fzc2lnbiIsInNjaGVkdWxlIiwiaXNEb25lIiwiaSIsImxlbmd0aCIsImlzQ29uZmxpY3QiLCJsYXRlc3RSb3ciLCJhaXJjcmFmdE5vIiwiY3VycmVudEFpcmNyYWZ0Iiwib3B0aW11bSIsInR1cm5UaW1lIiwiZGF0YSIsIlBhcGEiLCJwYXJzZSIsImhlYWRlciIsImR5bmFtaWNUeXBpbmciLCJrZXkiLCJyZXBsYWNlIiwidG1wIiwiYXJyVGltZSIsImRlcFRpbWUiLCJjb252ZXJ0VGltZSIsImNvbnZlcnRUaW1lUGx1c1R1cm5UaW1lIiwiZGF0ZSIsIm1vbWVudCIsImZvcm1hdCIsImRlcE1vbWVudCIsImFyck1vbWVudCIsInJhbmdlIiwicmV2ZW51ZSIsIk51bWJlciIsIm1haW4iLCJ1dGlsIiwicmVxdWlyZSIsImZzIiwicHJvbWlzaWZ5IiwicmVhZEZpbGUiLCJjb252ZXJ0VG9NaW4iLCJ0aW1lU3RyaW5nIiwiY29uY2F0IiwiaG91ciIsIm1pbnV0ZSIsImhvdXJNaW4iLCJwYXJzZUludCIsIm1pbk1pbiIsInRvdGFsTWluIiwiY29udmVydFRvVGltZVN0cmluZyIsIm1pblRpbWUiLCJNYXRoIiwiZmxvb3IiLCJ0b1N0cmluZyIsInRpbWUiLCJhaXJjcmFmdCIsIm1heE92ZXJsYXBzIiwib3ZlcmxhcHNDb3VudCIsImoiLCJyYW5nZTEiLCJtb21lbnRSYW5nZSIsInJhbmdlMiIsIm92ZXJsYXBzIiwibWF4Iiwicm93MSIsInJvdzIiLCJlbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O3NGQWFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFFMkJBLGNBQWNDLFFBQWQsRUFBd0IsRUFBRUMsVUFBVSxNQUFaLEVBQXhCLENBRjNCOztBQUFBO0FBRVVDLG9CQUZWO0FBQUEsNkNBSVdBLFFBSlg7O0FBQUE7QUFBQTtBQUFBOztBQU1JQyxvQkFBUUMsS0FBUjs7QUFOSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOztrQkFBZUMsTzs7Ozs7O3VGQXVFZixrQkFBNkJDLFlBQTdCLEVBQTJDQyxXQUEzQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRUosb0JBQVFLLEdBQVIsQ0FBWSxrQkFBWjs7QUFFQTtBQUNBRCx3QkFBWUUsSUFBWixDQUFpQkMsYUFBakI7O0FBRUlDLGlCQU5OLEdBTWMsRUFOZDtBQU9NQyxpQkFQTixHQU9jLEVBUGQ7QUFRTUMsaUJBUk4sR0FRYyxFQVJkOzs7QUFVRU4sd0JBQVlPLE9BQVosQ0FBb0IsVUFBQ0MsR0FBRCxFQUFTO0FBQzNCLHNCQUFPQSxJQUFJQyxhQUFYO0FBQ0UscUJBQUssVUFBTDtBQUNFTCx3QkFBTU0sSUFBTixDQUFXRixHQUFYO0FBQ0E7QUFDRixxQkFBSyxVQUFMO0FBQ0VILHdCQUFNSyxJQUFOLENBQVdGLEdBQVg7QUFDQTtBQUNGLHFCQUFLLFVBQUw7QUFDRUYsd0JBQU1JLElBQU4sQ0FBV0YsR0FBWDtBQUNBO0FBVEo7QUFXRCxhQVpEOztBQWNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU1HLGFBaENSLEdBZ0NZQyxjQUFjWixXQUFkLEVBQTJCRCxhQUFhLENBQWIsQ0FBM0IsQ0FoQ1o7QUFpQ1FjLGFBakNSLEdBaUNZRCxjQUFjWixXQUFkLEVBQTJCRCxhQUFhLENBQWIsQ0FBM0IsQ0FqQ1o7QUFrQ1FlLGFBbENSLEdBa0NZRixjQUFjWixXQUFkLEVBQTJCRCxhQUFhLENBQWIsQ0FBM0IsQ0FsQ1o7OztBQW9DRUgsb0JBQVFLLEdBQVIsU0FBa0JVLENBQWxCO0FBQ0FmLG9CQUFRSyxHQUFSLFNBQWtCWSxDQUFsQjtBQUNBakIsb0JBQVFLLEdBQVIsU0FBa0JhLENBQWxCOztBQXRDRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHOztrQkFBZUMsYTs7Ozs7O3VGQTRDZixrQkFBdUJDLFFBQXZCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGdCQUNVQyxPQUFPRCxRQUFQLENBRFY7QUFBQTtBQUFBO0FBQUE7O0FBRWFFLGFBRmIsR0FFaUIsQ0FGakI7O0FBQUE7QUFBQSxrQkFFb0JBLElBQUlGLFNBQVNHLE1BRmpDO0FBQUE7QUFBQTtBQUFBOztBQUdZWCxlQUhaLEdBR2tCUSxTQUFTRSxDQUFULENBSGxCOztBQUFBLGdCQUtXRSxXQUFXWixHQUFYLEVBQWdCYSxTQUFoQixDQUxYO0FBQUE7QUFBQTtBQUFBOztBQU1RYixnQkFBSWMsVUFBSixHQUFpQkMsZUFBakI7QUFDQUYsd0JBQVliLEdBQVo7QUFQUjs7QUFBQTtBQUV5Q1UsZUFGekM7QUFBQTtBQUFBOztBQUFBOztBQVlJRyx3QkFBWSxJQUFaO0FBQ0FFLCtCQUFtQixDQUFuQjtBQWJKO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRzs7a0JBQWVDLE87Ozs7Ozt1RkFvRGY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ1FDLG9CQURSLEdBQ21CLEVBRG5CO0FBR1ExQix3QkFIUixHQUd1QixDQUFDLFVBQUQsRUFBYSxVQUFiLEVBQXlCLFVBQXpCLENBSHZCOztBQUtFOztBQUxGO0FBQUEsbUJBT3lCRCxTQVB6Qjs7QUFBQTtBQU9RSCxvQkFQUjtBQVFRK0IsZ0JBUlIsR0FRZUMsS0FBS0MsS0FBTCxDQUFXakMsUUFBWCxFQUFxQjtBQUNoQ2tDLHNCQUFRLElBRHdCO0FBRWhDQyw2QkFBZTtBQUZpQixhQUFyQixFQUdWSixJQVhMOzs7QUFhRUEsaUJBQUtuQixPQUFMLENBQWEsVUFBQ0MsR0FBRCxFQUFTO0FBQ3BCLG1CQUFLLElBQUl1QixHQUFULElBQWdCdkIsR0FBaEIsRUFBcUI7QUFDbkJBLG9CQUFJdUIsR0FBSixJQUFXdkIsSUFBSXVCLEdBQUosRUFBU0MsT0FBVCxDQUFpQixRQUFqQixFQUEyQixHQUEzQixDQUFYO0FBQ0Q7O0FBRUQsa0JBQUlDLE1BQU16QixJQUFJMEIsT0FBZDs7QUFFQTFCLGtCQUFJMkIsT0FBSixHQUFjQyxZQUFZNUIsSUFBSTJCLE9BQWhCLENBQWQ7QUFDQTNCLGtCQUFJMEIsT0FBSixHQUFjRSxZQUFZNUIsSUFBSTBCLE9BQWhCLENBQWQ7O0FBRUFELG9CQUFNSSx3QkFBd0JKLEdBQXhCLEVBQTZCUixRQUE3QixDQUFOOztBQUVBLGtCQUFNYSxPQUFPQyxTQUFTQyxNQUFULENBQWdCLFlBQWhCLENBQWI7QUFDQSxrQkFBTUMsWUFBWUYsT0FBVUQsSUFBVixTQUFrQjlCLElBQUkyQixPQUF0QixDQUFsQjtBQUNBLGtCQUFNTyxZQUFZSCxPQUFVRCxJQUFWLFNBQWtCTCxHQUFsQixDQUFsQjs7QUFFQSxrQkFBTVUsUUFBUUosT0FBT0ksS0FBUCxDQUFhRixTQUFiLEVBQXdCQyxTQUF4QixDQUFkO0FBQ0FsQyxrQkFBSSxhQUFKLElBQXFCbUMsS0FBckI7O0FBRUFuQyxrQkFBSW9DLE9BQUosR0FBY0MsT0FBT3JDLElBQUlvQyxPQUFYLENBQWQ7QUFDRCxhQXBCRDs7QUFiRjtBQUFBLG1CQW1DUTdCLGNBQWNoQixZQUFkLEVBQTRCMkIsSUFBNUIsQ0FuQ1I7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRzs7a0JBQWVvQixJOzs7OztBQXBMZjs7OztBQUNBOzs7O0FBRUEsSUFBTVAsU0FBUyxnREFBZjs7QUFFQSxJQUFNUSxPQUFPQyxRQUFRLE1BQVIsQ0FBYjtBQUNBLElBQU1DLEtBQUtELFFBQVEsSUFBUixDQUFYO0FBQ0EsSUFBTXJCLE9BQU9xQixRQUFRLFdBQVIsQ0FBYjs7QUFFQSxJQUFNeEQsZ0JBQWdCdUQsS0FBS0csU0FBTCxDQUFlRCxHQUFHRSxRQUFsQixDQUF0Qjs7QUFFQSxJQUFNMUQsV0FBVyw4R0FBakI7O0FBWUEsU0FBUzJELFlBQVQsQ0FBc0JDLFVBQXRCLEVBQWtDO0FBQ2hDLE1BQUlBLFdBQVdsQyxNQUFYLEtBQXNCLENBQTFCLEVBQTZCO0FBQzNCa0MsaUJBQWEsSUFBSUMsTUFBSixDQUFXRCxVQUFYLENBQWI7QUFDRDtBQUNELE1BQU1FLE9BQU9GLFdBQVcsQ0FBWCxFQUFjQyxNQUFkLENBQXFCRCxXQUFXLENBQVgsQ0FBckIsQ0FBYjtBQUNBLE1BQU1HLFNBQVNILFdBQVcsQ0FBWCxFQUFjQyxNQUFkLENBQXFCRCxXQUFXLENBQVgsQ0FBckIsQ0FBZjs7QUFFQSxNQUFNSSxVQUFVQyxTQUFTSCxJQUFULElBQWlCLEVBQWpDO0FBQ0EsTUFBTUksU0FBU0QsU0FBU0YsTUFBVCxDQUFmOztBQUVBLE1BQU1JLFdBQVdILFVBQVVFLE1BQTNCO0FBQ0EsU0FBT0MsUUFBUDtBQUNEOztBQUVELFNBQVNDLG1CQUFULENBQTZCQyxPQUE3QixFQUFzQztBQUNwQyxNQUFJUCxPQUFPUSxLQUFLQyxLQUFMLENBQVdGLFVBQVEsRUFBbkIsQ0FBWDtBQUNBLE1BQUlQLE9BQU8sRUFBWCxFQUFlO0FBQ2JBLFdBQU8sSUFBSUQsTUFBSixDQUFXQyxLQUFLVSxRQUFMLEVBQVgsQ0FBUDtBQUNEOztBQUVELE1BQUlULFNBQVNNLFVBQVEsRUFBckI7O0FBRUEsTUFBSU4sU0FBUyxFQUFiLEVBQWlCO0FBQ2ZBLGFBQVMsSUFBSUYsTUFBSixDQUFXRSxPQUFPUyxRQUFQLEVBQVgsQ0FBVDtBQUNEOztBQUVELE1BQU1DLE9BQVVYLEtBQUtVLFFBQUwsRUFBVixTQUE2QlQsT0FBT1MsUUFBUCxFQUFuQztBQUNBLFNBQU9DLElBQVA7QUFDRDs7QUFFRCxTQUFTOUIsV0FBVCxDQUFxQmlCLFVBQXJCLEVBQWlDO0FBQy9CLFNBQU9RLG9CQUFvQlQsYUFBYUMsVUFBYixDQUFwQixDQUFQO0FBQ0Q7O0FBRUQsU0FBU2hCLHVCQUFULENBQWlDZ0IsVUFBakMsRUFBNkM1QixRQUE3QyxFQUF1RDtBQUNyRCxTQUFPb0Msb0JBQW9CVCxhQUFhQyxVQUFiLElBQTJCNUIsUUFBL0MsQ0FBUDtBQUNEOztBQUVELFNBQVNiLGFBQVQsQ0FBdUJaLFdBQXZCLEVBQW9DbUUsUUFBcEMsRUFBOEM7QUFDNUMsTUFBSUMsY0FBYyxDQUFsQjs7QUFFQSxPQUFLLElBQUlsRCxJQUFJLENBQWIsRUFBZ0JBLElBQUlsQixZQUFZbUIsTUFBaEMsRUFBd0NELEdBQXhDLEVBQTZDO0FBQzNDLFFBQUltRCxnQkFBZ0IsQ0FBcEI7QUFDQSxTQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSXRFLFlBQVltQixNQUFoQyxFQUF3Q21ELEdBQXhDLEVBQTZDO0FBQzNDLFVBQUlwRCxNQUFNb0QsQ0FBVixFQUFhOztBQUViLFVBQUl0RSxZQUFZa0IsQ0FBWixFQUFlVCxhQUFmLEtBQWlDMEQsUUFBakMsSUFBNkNuRSxZQUFZc0UsQ0FBWixFQUFlN0QsYUFBZixLQUFpQzBELFFBQWxGLEVBQTRGO0FBQzFGLFlBQU1JLFNBQVN2RSxZQUFZa0IsQ0FBWixFQUFlc0QsV0FBOUI7QUFDQSxZQUFNQyxTQUFTekUsWUFBWXNFLENBQVosRUFBZUUsV0FBOUI7O0FBRUEsWUFBSUQsT0FBT0csUUFBUCxDQUFnQkQsTUFBaEIsQ0FBSixFQUE2QjtBQUMzQkosMkJBQWlCLENBQWpCO0FBQ0FELHdCQUFjTCxLQUFLWSxHQUFMLENBQVNQLFdBQVQsRUFBc0JDLGFBQXRCLENBQWQ7QUFDRDtBQUNGO0FBQ0Y7QUFDRjs7QUFFRCxTQUFPRCxXQUFQO0FBQ0Q7O0FBMkNELElBQUk3QyxrQkFBa0IsQ0FBdEI7QUFDQSxJQUFJRixZQUFZLElBQWhCOztBQW1CQSxTQUFTRCxVQUFULENBQW9Cd0QsSUFBcEIsRUFBMEJDLElBQTFCLEVBQWdDO0FBQzlCLE1BQUksQ0FBQ0EsSUFBTCxFQUFXO0FBQ1RqRixZQUFRSyxHQUFSLENBQVksY0FBWjtBQUNBLFdBQU8sS0FBUDtBQUNEOztBQUVETCxVQUFRSyxHQUFSLGtCQUEyQjJFLEtBQUtKLFdBQUwsQ0FBaUJFLFFBQWpCLENBQTBCRyxLQUFLTCxXQUEvQixDQUEzQjs7QUFFQSxTQUFPSSxLQUFLSixXQUFMLENBQWlCRSxRQUFqQixDQUEwQkcsS0FBS0wsV0FBL0IsQ0FBUDtBQUNEOztBQUVELFNBQVN2RCxNQUFULENBQWdCRCxRQUFoQixFQUEwQjtBQUN4QixPQUFLLElBQUlFLElBQUksQ0FBYixFQUFnQkEsSUFBSUYsU0FBU0csTUFBN0IsRUFBcUNELEdBQXJDLEVBQTBDO0FBQ3hDLFFBQU1WLE1BQU1RLFNBQVNFLENBQVQsQ0FBWjs7QUFFQSxRQUFJLENBQUNWLElBQUljLFVBQVQsRUFBcUI7QUFDbkIxQixjQUFRSyxHQUFSLENBQVksVUFBWjtBQUNBLGFBQU8sS0FBUDtBQUNEO0FBQ0Y7O0FBRURMLFVBQVFLLEdBQVIsQ0FBWSxNQUFaOztBQUVBO0FBQ0EsU0FBTyxJQUFQO0FBQ0Q7O0FBRUQsU0FBU0UsYUFBVCxDQUF1QnlFLElBQXZCLEVBQTZCQyxJQUE3QixFQUFtQztBQUNqQyxNQUFJRCxLQUFLSixXQUFMLENBQWlCTSxHQUFqQixHQUF1QkQsS0FBS0wsV0FBTCxDQUFpQk0sR0FBNUMsRUFBaUQ7QUFDL0MsV0FBTyxDQUFDLENBQVI7QUFDRCxHQUZELE1BRU87QUFDTCxXQUFPLENBQVA7QUFDRDtBQUNGOztBQXdDRGhDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHsgZXh0ZW5kTW9tZW50IH0gZnJvbSAnbW9tZW50LXJhbmdlJztcblxuY29uc3QgbW9tZW50ID0gZXh0ZW5kTW9tZW50KE1vbWVudCk7XG5cbmNvbnN0IHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5jb25zdCBQYXBhID0gcmVxdWlyZSgncGFwYXBhcnNlJyk7XG5cbmNvbnN0IHJlYWRGaWxlQXN5bmMgPSB1dGlsLnByb21pc2lmeShmcy5yZWFkRmlsZSk7XG5cbmNvbnN0IGZpbGVQYXRoID0gJy9Vc2Vycy93YXRjaGFyYXBoYXQvRG9jdW1lbnRzL0NQRVk0L1Byb2plY3RSZWxhdGUvY29kZS9lbmhhbmNpbmctZmxlZXQtYXNzaWdubWVudC9kYXRhL1BsYW5uZXJCa2tBaXJ3YXlzLmNzdic7XG5cbmFzeW5jIGZ1bmN0aW9uIGdldERhdGEoKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZGF0YVRleHQgPSBhd2FpdCByZWFkRmlsZUFzeW5jKGZpbGVQYXRoLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG5cbiAgICByZXR1cm4gZGF0YVRleHQ7XG4gIH0gY2F0Y2goZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb252ZXJ0VG9NaW4odGltZVN0cmluZykge1xuICBpZiAodGltZVN0cmluZy5sZW5ndGggPT09IDMpIHtcbiAgICB0aW1lU3RyaW5nID0gJzAnLmNvbmNhdCh0aW1lU3RyaW5nKTtcbiAgfVxuICBjb25zdCBob3VyID0gdGltZVN0cmluZ1swXS5jb25jYXQodGltZVN0cmluZ1sxXSk7XG4gIGNvbnN0IG1pbnV0ZSA9IHRpbWVTdHJpbmdbMl0uY29uY2F0KHRpbWVTdHJpbmdbM10pO1xuXG4gIGNvbnN0IGhvdXJNaW4gPSBwYXJzZUludChob3VyKSAqIDYwO1xuICBjb25zdCBtaW5NaW4gPSBwYXJzZUludChtaW51dGUpO1xuXG4gIGNvbnN0IHRvdGFsTWluID0gaG91ck1pbiArIG1pbk1pbjtcbiAgcmV0dXJuIHRvdGFsTWluO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VG9UaW1lU3RyaW5nKG1pblRpbWUpIHtcbiAgbGV0IGhvdXIgPSBNYXRoLmZsb29yKG1pblRpbWUvNjApO1xuICBpZiAoaG91ciA8IDEwKSB7XG4gICAgaG91ciA9ICcwJy5jb25jYXQoaG91ci50b1N0cmluZygpKTtcbiAgfVxuXG4gIGxldCBtaW51dGUgPSBtaW5UaW1lJTYwO1xuXG4gIGlmIChtaW51dGUgPCAxMCkge1xuICAgIG1pbnV0ZSA9ICcwJy5jb25jYXQobWludXRlLnRvU3RyaW5nKCkpO1xuICB9XG5cbiAgY29uc3QgdGltZSA9IGAke2hvdXIudG9TdHJpbmcoKX06JHttaW51dGUudG9TdHJpbmcoKX1gO1xuICByZXR1cm4gdGltZTtcbn1cblxuZnVuY3Rpb24gY29udmVydFRpbWUodGltZVN0cmluZykge1xuICByZXR1cm4gY29udmVydFRvVGltZVN0cmluZyhjb252ZXJ0VG9NaW4odGltZVN0cmluZykpO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VGltZVBsdXNUdXJuVGltZSh0aW1lU3RyaW5nLCB0dXJuVGltZSkge1xuICByZXR1cm4gY29udmVydFRvVGltZVN0cmluZyhjb252ZXJ0VG9NaW4odGltZVN0cmluZykgKyB0dXJuVGltZSk7XG59XG5cbmZ1bmN0aW9uIGNvdW50T3ZlcmxhcHMoZmxpZ2h0VGFibGUsIGFpcmNyYWZ0KSB7XG4gIGxldCBtYXhPdmVybGFwcyA9IDA7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBmbGlnaHRUYWJsZS5sZW5ndGg7IGkrKykge1xuICAgIGxldCBvdmVybGFwc0NvdW50ID0gMDtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGZsaWdodFRhYmxlLmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAoaSA9PT0gaikgY29udGludWU7XG5cbiAgICAgIGlmIChmbGlnaHRUYWJsZVtpXS5lcXVpcG1lbnROYW1lID09PSBhaXJjcmFmdCAmJiBmbGlnaHRUYWJsZVtqXS5lcXVpcG1lbnROYW1lID09PSBhaXJjcmFmdCkge1xuICAgICAgICBjb25zdCByYW5nZTEgPSBmbGlnaHRUYWJsZVtpXS5tb21lbnRSYW5nZTtcbiAgICAgICAgY29uc3QgcmFuZ2UyID0gZmxpZ2h0VGFibGVbal0ubW9tZW50UmFuZ2U7XG5cbiAgICAgICAgaWYgKHJhbmdlMS5vdmVybGFwcyhyYW5nZTIpKSB7XG4gICAgICAgICAgb3ZlcmxhcHNDb3VudCArPSAxO1xuICAgICAgICAgIG1heE92ZXJsYXBzID0gTWF0aC5tYXgobWF4T3ZlcmxhcHMsIG92ZXJsYXBzQ291bnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1heE92ZXJsYXBzO1xufVxuXG5hc3luYyBmdW5jdGlvbiBkeW5hbWljQXNzaWduKGFpcmNyYWZ0TGlzdCwgZmxpZ2h0VGFibGUpIHtcbiAgY29uc29sZS5sb2coJ0ZsZWV0IEFzc2lnbmluZy4nKTtcblxuICAvLyBzb3J0IGJ5IGFyclRpbWVcbiAgZmxpZ2h0VGFibGUuc29ydChjb21wYXJlRmxpZ2h0KTtcblxuICBsZXQgYUxpc3QgPSBbXTtcbiAgbGV0IGJMaXN0ID0gW107XG4gIGxldCBjTGlzdCA9IFtdO1xuXG4gIGZsaWdodFRhYmxlLmZvckVhY2goKHJvdykgPT4ge1xuICAgIHN3aXRjaChyb3cuZXF1aXBtZW50TmFtZSkge1xuICAgICAgY2FzZSAnKFBHKSAzMTknOlxuICAgICAgICBhTGlzdC5wdXNoKHJvdyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnKFBHKSAzMjAnOlxuICAgICAgICBiTGlzdC5wdXNoKHJvdyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnKFBHKSBBVDcnOlxuICAgICAgICBjTGlzdC5wdXNoKHJvdyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gYXdhaXQgb3B0aW11bShhTGlzdCk7XG5cbiAgLy8gYUxpc3QuZm9yRWFjaCgocm93KSA9PiB7XG4gIC8vICAgaWYgKHJvdy5haXJjcmFmdE5vKSB7XG4gIC8vICAgICBjb25zb2xlLmxvZyhyb3cuZmxpZ2h0KTtcbiAgLy8gICB9XG4gIC8vIH0pO1xuXG4gIGNvbnN0IGEgPSBjb3VudE92ZXJsYXBzKGZsaWdodFRhYmxlLCBhaXJjcmFmdExpc3RbMF0pO1xuICBjb25zdCBiID0gY291bnRPdmVybGFwcyhmbGlnaHRUYWJsZSwgYWlyY3JhZnRMaXN0WzFdKTtcbiAgY29uc3QgYyA9IGNvdW50T3ZlcmxhcHMoZmxpZ2h0VGFibGUsIGFpcmNyYWZ0TGlzdFsyXSk7XG5cbiAgY29uc29sZS5sb2coYGE6ICR7YX1gKTtcbiAgY29uc29sZS5sb2coYGI6ICR7Yn1gKTtcbiAgY29uc29sZS5sb2coYGM6ICR7Y31gKTtcbn1cblxubGV0IGN1cnJlbnRBaXJjcmFmdCA9IDE7XG5sZXQgbGF0ZXN0Um93ID0gbnVsbDtcblxuYXN5bmMgZnVuY3Rpb24gb3B0aW11bShzY2hlZHVsZSkge1xuICB3aGlsZSAoIWlzRG9uZShzY2hlZHVsZSkpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjaGVkdWxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCByb3cgPSBzY2hlZHVsZVtpXTtcbiAgXG4gICAgICBpZiAoIWlzQ29uZmxpY3Qocm93LCBsYXRlc3RSb3cpKSB7XG4gICAgICAgIHJvdy5haXJjcmFmdE5vID0gY3VycmVudEFpcmNyYWZ0O1xuICAgICAgICBsYXRlc3RSb3cgPSByb3c7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cbiAgXG4gICAgbGF0ZXN0Um93ID0gbnVsbDtcbiAgICBjdXJyZW50QWlyY3JhZnQgKz0gMTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0NvbmZsaWN0KHJvdzEsIHJvdzIpIHtcbiAgaWYgKCFyb3cyKSB7XG4gICAgY29uc29sZS5sb2coJ25vdCBjb25mbGljdCcpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnNvbGUubG9nKGBpc0NvbmZsaWN0OiAke3JvdzEubW9tZW50UmFuZ2Uub3ZlcmxhcHMocm93Mi5tb21lbnRSYW5nZSl9YCk7XG5cbiAgcmV0dXJuIHJvdzEubW9tZW50UmFuZ2Uub3ZlcmxhcHMocm93Mi5tb21lbnRSYW5nZSk7XG59XG5cbmZ1bmN0aW9uIGlzRG9uZShzY2hlZHVsZSkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNjaGVkdWxlLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgcm93ID0gc2NoZWR1bGVbaV07XG5cbiAgICBpZiAoIXJvdy5haXJjcmFmdE5vKSB7XG4gICAgICBjb25zb2xlLmxvZygnbm90IGRvbmUnKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnNvbGUubG9nKCdkb25lJyk7XG5cbiAgLy8gYWxsIHJvdyBpbiBzY2hlZHVsZSBhc3NpZ25lZFxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY29tcGFyZUZsaWdodChyb3cxLCByb3cyKSB7XG4gIGlmIChyb3cxLm1vbWVudFJhbmdlLmVuZCA8IHJvdzIubW9tZW50UmFuZ2UuZW5kKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAxO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gIGNvbnN0IHR1cm5UaW1lID0gMzA7XG5cbiAgY29uc3QgYWlyY3JhZnRMaXN0ID0gWycoUEcpIDMxOScsICcoUEcpIDMyMCcsICcoUEcpIEFUNyddO1xuXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBcblxuICBjb25zdCBkYXRhVGV4dCA9IGF3YWl0IGdldERhdGEoKTtcbiAgY29uc3QgZGF0YSA9IFBhcGEucGFyc2UoZGF0YVRleHQsIHtcbiAgICBoZWFkZXI6IHRydWUsXG4gICAgZHluYW1pY1R5cGluZzogZmFsc2UsXG4gIH0pLmRhdGE7XG5cbiAgZGF0YS5mb3JFYWNoKChyb3cpID0+IHtcbiAgICBmb3IgKGxldCBrZXkgaW4gcm93KSB7XG4gICAgICByb3dba2V5XSA9IHJvd1trZXldLnJlcGxhY2UoL1xcc1xccysvZywgJyAnKTtcbiAgICB9XG5cbiAgICBsZXQgdG1wID0gcm93LmFyclRpbWU7XG5cbiAgICByb3cuZGVwVGltZSA9IGNvbnZlcnRUaW1lKHJvdy5kZXBUaW1lKTtcbiAgICByb3cuYXJyVGltZSA9IGNvbnZlcnRUaW1lKHJvdy5hcnJUaW1lKTtcblxuICAgIHRtcCA9IGNvbnZlcnRUaW1lUGx1c1R1cm5UaW1lKHRtcCwgdHVyblRpbWUpO1xuXG4gICAgY29uc3QgZGF0ZSA9IG1vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICAgIGNvbnN0IGRlcE1vbWVudCA9IG1vbWVudChgJHtkYXRlfSAke3Jvdy5kZXBUaW1lfWApO1xuICAgIGNvbnN0IGFyck1vbWVudCA9IG1vbWVudChgJHtkYXRlfSAke3RtcH1gKTtcblxuICAgIGNvbnN0IHJhbmdlID0gbW9tZW50LnJhbmdlKGRlcE1vbWVudCwgYXJyTW9tZW50KTtcbiAgICByb3dbJ21vbWVudFJhbmdlJ10gPSByYW5nZTtcblxuICAgIHJvdy5yZXZlbnVlID0gTnVtYmVyKHJvdy5yZXZlbnVlKTtcbiAgfSk7XG5cbiAgYXdhaXQgZHluYW1pY0Fzc2lnbihhaXJjcmFmdExpc3QsIGRhdGEpO1xufVxuXG5tYWluKCk7XG4iXX0=