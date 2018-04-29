import findMatching from 'bipartite-matching';
import findConnectedComponents from 'connected-components';
import getJobList from '../utils/GetJobList';
import * as helper from '../utils/FleetAssignHelper';

export default function(schedule) {
  const jobs = getJobList(schedule);

  for (let i = 0; i < jobs.length; i++) {
    mbpAssign(jobs[i].schedule);
  }
}

function mbpAssign(schedule) {
  const bpLinks = helper.getBpLinks(schedule);
  const maximumMatching = findMatching(schedule.length, schedule.length, bpLinks);

  const adjList = [];

  for (let i = 0; i < schedule.length; i++) {
    adjList[i] = [];
  }

  maximumMatching.forEach((link) => {
    adjList[link[0]].push(link[1]);
    adjList[link[1]].push(link[0]);
  });

  const connectedComponents = findConnectedComponents(adjList);

  let counter = [];
  connectedComponents.forEach((component, index) => {
    counter[index] = 0;
    component.forEach((vertex) => {
      schedule[vertex].aircraftNo = index + 1;
      counter[index]++;
    });
  });

  const testResult = helper.chiSquaredTest(counter);
  console.log(testResult);
}
