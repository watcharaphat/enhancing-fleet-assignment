import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { convertTime, convertTimePlusTurnTime } from './ConvertTime';

const moment = extendMoment(Moment);

export default function parseSchedule(req, res, next) {
  const turnTime = 30;

  req.schedule.forEach((row) => {
    let tmp = row.arrTime;

    row.depTime = convertTime(row.depTime);
    row.arrTime = convertTime(row.arrTime);

    tmp = convertTimePlusTurnTime(tmp, turnTime);

    const date = moment().format('YYYY-MM-DD');
    const depMoment = moment(`${date} ${row.depTime}`);
    const arrMoment = moment(`${date} ${tmp}`);

    row.momentRange = moment.range(depMoment, arrMoment);
  });

  // sort by depTime: start
  // sort by arrTime: end
  req.schedule.sort((row1, row2) => {
    if (row1.momentRange.start < row2.momentRange.start) {
      return -1;
    } else {
      return 1;
    }
  });

  next();
}
