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

var main = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var dataText, data;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getData();

          case 2:
            dataText = _context2.sent;
            data = Papa.parse(dataText, {
              header: true,
              dynamicTyping: false
            }).data;


            data.forEach(function (row) {
              for (var key in row) {
                row[key] = row[key].replace(/\s\s+/g, ' ');
              }

              row.depTime = convertTime(row.depTime);
              row.arrTime = convertTime(row.arrTime);

              // console.log(row);
            });

            console.log(data);

            // const t = convertToTimeString(convertToMin('600'));
            // console.log(t);

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function main() {
    return _ref2.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

main();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJyZWFkRmlsZUFzeW5jIiwiZmlsZVBhdGgiLCJlbmNvZGluZyIsImRhdGFUZXh0IiwiY29uc29sZSIsImVycm9yIiwiZ2V0RGF0YSIsImRhdGEiLCJQYXBhIiwicGFyc2UiLCJoZWFkZXIiLCJkeW5hbWljVHlwaW5nIiwiZm9yRWFjaCIsInJvdyIsImtleSIsInJlcGxhY2UiLCJkZXBUaW1lIiwiY29udmVydFRpbWUiLCJhcnJUaW1lIiwibG9nIiwibWFpbiIsInV0aWwiLCJyZXF1aXJlIiwiZnMiLCJwcm9taXNpZnkiLCJyZWFkRmlsZSIsImNvbnZlcnRUb01pbiIsInRpbWVTdHJpbmciLCJsZW5ndGgiLCJjb25jYXQiLCJob3VyIiwibWludXRlIiwiaG91ck1pbiIsInBhcnNlSW50IiwibWluTWluIiwidG90YWxNaW4iLCJjb252ZXJ0VG9UaW1lU3RyaW5nIiwibWluVGltZSIsIk1hdGgiLCJmbG9vciIsInRvU3RyaW5nIiwidGltZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7c0ZBUUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUUyQkEsY0FBY0MsUUFBZCxFQUF3QixFQUFFQyxVQUFVLE1BQVosRUFBeEIsQ0FGM0I7O0FBQUE7QUFFVUMsb0JBRlY7QUFBQSw2Q0FJV0EsUUFKWDs7QUFBQTtBQUFBO0FBQUE7O0FBTUlDLG9CQUFRQyxLQUFSOztBQU5KO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEc7O2tCQUFlQyxPOzs7Ozs7dUZBeUNmO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBQ3lCQSxTQUR6Qjs7QUFBQTtBQUNRSCxvQkFEUjtBQUVRSSxnQkFGUixHQUVlQyxLQUFLQyxLQUFMLENBQVdOLFFBQVgsRUFBcUI7QUFDaENPLHNCQUFRLElBRHdCO0FBRWhDQyw2QkFBZTtBQUZpQixhQUFyQixFQUdWSixJQUxMOzs7QUFPRUEsaUJBQUtLLE9BQUwsQ0FBYSxVQUFDQyxHQUFELEVBQVM7QUFDcEIsbUJBQUssSUFBSUMsR0FBVCxJQUFnQkQsR0FBaEIsRUFBcUI7QUFDbkJBLG9CQUFJQyxHQUFKLElBQVdELElBQUlDLEdBQUosRUFBU0MsT0FBVCxDQUFpQixRQUFqQixFQUEyQixHQUEzQixDQUFYO0FBQ0Q7O0FBRURGLGtCQUFJRyxPQUFKLEdBQWNDLFlBQVlKLElBQUlHLE9BQWhCLENBQWQ7QUFDQUgsa0JBQUlLLE9BQUosR0FBY0QsWUFBWUosSUFBSUssT0FBaEIsQ0FBZDs7QUFFQTtBQUNELGFBVEQ7O0FBV0FkLG9CQUFRZSxHQUFSLENBQVlaLElBQVo7O0FBRUE7QUFDQTs7QUFyQkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRzs7a0JBQWVhLEk7Ozs7Ozs7QUFqRGYsSUFBTUMsT0FBT0MsUUFBUSxNQUFSLENBQWI7QUFDQSxJQUFNQyxLQUFLRCxRQUFRLElBQVIsQ0FBWDtBQUNBLElBQU1kLE9BQU9jLFFBQVEsV0FBUixDQUFiOztBQUVBLElBQU10QixnQkFBZ0JxQixLQUFLRyxTQUFMLENBQWVELEdBQUdFLFFBQWxCLENBQXRCOztBQUVBLElBQU14QixXQUFXLDhHQUFqQjs7QUFZQSxTQUFTeUIsWUFBVCxDQUFzQkMsVUFBdEIsRUFBa0M7QUFDaEMsTUFBSUEsV0FBV0MsTUFBWCxLQUFzQixDQUExQixFQUE2QjtBQUMzQkQsaUJBQWEsSUFBSUUsTUFBSixDQUFXRixVQUFYLENBQWI7QUFDRDtBQUNELE1BQU1HLE9BQU9ILFdBQVcsQ0FBWCxFQUFjRSxNQUFkLENBQXFCRixXQUFXLENBQVgsQ0FBckIsQ0FBYjtBQUNBLE1BQU1JLFNBQVNKLFdBQVcsQ0FBWCxFQUFjRSxNQUFkLENBQXFCRixXQUFXLENBQVgsQ0FBckIsQ0FBZjs7QUFFQSxNQUFNSyxVQUFVQyxTQUFTSCxJQUFULElBQWlCLEVBQWpDO0FBQ0EsTUFBTUksU0FBU0QsU0FBU0YsTUFBVCxDQUFmOztBQUVBLE1BQU1JLFdBQVdILFVBQVVFLE1BQTNCO0FBQ0EsU0FBT0MsUUFBUDtBQUNEOztBQUVELFNBQVNDLG1CQUFULENBQTZCQyxPQUE3QixFQUFzQztBQUNwQyxNQUFJUCxPQUFPUSxLQUFLQyxLQUFMLENBQVdGLFVBQVEsRUFBbkIsQ0FBWDs7QUFFQSxNQUFJTixTQUFTTSxVQUFRLEVBQXJCOztBQUVBLE1BQUlOLFNBQVMsRUFBYixFQUFpQjtBQUNmQSxhQUFTLElBQUlGLE1BQUosQ0FBV0UsT0FBT1MsUUFBUCxFQUFYLENBQVQ7QUFDRDs7QUFFRCxNQUFNQyxPQUFVWCxLQUFLVSxRQUFMLEVBQVYsU0FBNkJULE9BQU9TLFFBQVAsRUFBbkM7QUFDQSxTQUFPQyxJQUFQO0FBQ0Q7O0FBRUQsU0FBU3hCLFdBQVQsQ0FBcUJVLFVBQXJCLEVBQWlDO0FBQy9CLFNBQU9TLG9CQUFvQlYsYUFBYUMsVUFBYixDQUFwQixDQUFQO0FBQ0Q7O0FBMEJEUCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5jb25zdCBQYXBhID0gcmVxdWlyZSgncGFwYXBhcnNlJyk7XG5cbmNvbnN0IHJlYWRGaWxlQXN5bmMgPSB1dGlsLnByb21pc2lmeShmcy5yZWFkRmlsZSk7XG5cbmNvbnN0IGZpbGVQYXRoID0gJy9Vc2Vycy93YXRjaGFyYXBoYXQvRG9jdW1lbnRzL0NQRVk0L1Byb2plY3RSZWxhdGUvY29kZS9lbmhhbmNpbmctZmxlZXQtYXNzaWdubWVudC9kYXRhL1BsYW5uZXJCa2tBaXJ3YXlzLmNzdic7XG5cbmFzeW5jIGZ1bmN0aW9uIGdldERhdGEoKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZGF0YVRleHQgPSBhd2FpdCByZWFkRmlsZUFzeW5jKGZpbGVQYXRoLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG5cbiAgICByZXR1cm4gZGF0YVRleHQ7XG4gIH0gY2F0Y2goZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb252ZXJ0VG9NaW4odGltZVN0cmluZykge1xuICBpZiAodGltZVN0cmluZy5sZW5ndGggPT09IDMpIHtcbiAgICB0aW1lU3RyaW5nID0gJzAnLmNvbmNhdCh0aW1lU3RyaW5nKTtcbiAgfVxuICBjb25zdCBob3VyID0gdGltZVN0cmluZ1swXS5jb25jYXQodGltZVN0cmluZ1sxXSk7XG4gIGNvbnN0IG1pbnV0ZSA9IHRpbWVTdHJpbmdbMl0uY29uY2F0KHRpbWVTdHJpbmdbM10pO1xuXG4gIGNvbnN0IGhvdXJNaW4gPSBwYXJzZUludChob3VyKSAqIDYwO1xuICBjb25zdCBtaW5NaW4gPSBwYXJzZUludChtaW51dGUpO1xuXG4gIGNvbnN0IHRvdGFsTWluID0gaG91ck1pbiArIG1pbk1pbjtcbiAgcmV0dXJuIHRvdGFsTWluO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VG9UaW1lU3RyaW5nKG1pblRpbWUpIHtcbiAgbGV0IGhvdXIgPSBNYXRoLmZsb29yKG1pblRpbWUvNjApO1xuXG4gIGxldCBtaW51dGUgPSBtaW5UaW1lJTYwO1xuXG4gIGlmIChtaW51dGUgPCAxMCkge1xuICAgIG1pbnV0ZSA9ICcwJy5jb25jYXQobWludXRlLnRvU3RyaW5nKCkpO1xuICB9XG5cbiAgY29uc3QgdGltZSA9IGAke2hvdXIudG9TdHJpbmcoKX06JHttaW51dGUudG9TdHJpbmcoKX1gO1xuICByZXR1cm4gdGltZTtcbn1cblxuZnVuY3Rpb24gY29udmVydFRpbWUodGltZVN0cmluZykge1xuICByZXR1cm4gY29udmVydFRvVGltZVN0cmluZyhjb252ZXJ0VG9NaW4odGltZVN0cmluZykpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICBjb25zdCBkYXRhVGV4dCA9IGF3YWl0IGdldERhdGEoKTtcbiAgY29uc3QgZGF0YSA9IFBhcGEucGFyc2UoZGF0YVRleHQsIHtcbiAgICBoZWFkZXI6IHRydWUsXG4gICAgZHluYW1pY1R5cGluZzogZmFsc2UsXG4gIH0pLmRhdGE7XG5cbiAgZGF0YS5mb3JFYWNoKChyb3cpID0+IHtcbiAgICBmb3IgKGxldCBrZXkgaW4gcm93KSB7XG4gICAgICByb3dba2V5XSA9IHJvd1trZXldLnJlcGxhY2UoL1xcc1xccysvZywgJyAnKTtcbiAgICB9XG5cbiAgICByb3cuZGVwVGltZSA9IGNvbnZlcnRUaW1lKHJvdy5kZXBUaW1lKTtcbiAgICByb3cuYXJyVGltZSA9IGNvbnZlcnRUaW1lKHJvdy5hcnJUaW1lKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKHJvdyk7XG4gIH0pO1xuXG4gIGNvbnNvbGUubG9nKGRhdGEpO1xuXG4gIC8vIGNvbnN0IHQgPSBjb252ZXJ0VG9UaW1lU3RyaW5nKGNvbnZlcnRUb01pbignNjAwJykpO1xuICAvLyBjb25zb2xlLmxvZyh0KTtcbn1cblxubWFpbigpO1xuIl19