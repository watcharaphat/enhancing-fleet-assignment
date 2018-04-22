import getJobList from '../utils/GetJobList';

export default function(schedule) {
  console.log('ts');
  const jobs = getJobList(schedule);
}
