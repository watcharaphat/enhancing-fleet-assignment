import getJobList from '../utils/GetJobList';
import * as helper from '../utils/FleetAssignHelper';

export default function(schedule) {
  const jobs = getJobList(schedule);

  for (let i = 0; i < jobs.length; i++) {
    const paths = getAssignPath(jobs[i].schedule);
    const bestPath = helper.getBestPath(paths);

    helper.assignPathToSchedule(jobs[i].schedule, bestPath.path);

    // report
    console.log(`${jobs[i].equipmentName}, Squared Error: ${bestPath.squaredError}, Number of choices: ${paths.length}, Uniform choices: ${bestPath.numberOfUniformChoices}`);
  }
}

function getAssignPath(schedule) {
  const paths = [];
  const choices = [];

  for (let i = 0; i < schedule.length; i++) {
    choices[i] = helper.getOperatableList(schedule, i);
  }

  let bound = Infinity;
  let c = 1;

  const INF = (1 << 28);

  const pathAssign = (currentAircraft = 1, currentRow = 0, isNewAircraft = true, currentPath = []) => {
    // if (paths.length >= 16) return;

    if (currentAircraft > bound) return;

    c++;
    if (c >= INF && paths.length > 0) return;

    if (isPathComplete(schedule, currentPath)) {
      let numberOfAitcrafts = getNumberOfAircrafts(currentPath);
      if (bound > numberOfAitcrafts) {
        bound = numberOfAitcrafts;
        paths.length = 0; // clear all previous paths with previous bound.
      }
      // bound = bound <= numberOfAitcrafts ? bound : numberOfAitcrafts;
      paths.push(currentPath.slice());
      return true;
    }

    if (isNewAircraft) {
      for (let i = currentRow; i < schedule.length; i++) {
        if (!currentPath[i]) {
          currentPath[i] = currentAircraft;
          currentRow = i;
          break;
        }
      }
    }

    const pickableChoices = [];

    for (let j = 0; j < choices[currentRow].length; j++) {
      if (!currentPath[choices[currentRow][j]]) {
        pickableChoices.push(choices[currentRow][j]);
        break;
      }
    }
    pickableChoices.push(null);

    while (pickableChoices.length > 0) {
      const pickedChoice = pickableChoices.shift();
      if (!pickedChoice) {
        pathAssign(currentAircraft + 1, 0, true, currentPath.slice());
        return;
      }

      currentPath[pickedChoice] = currentAircraft;
      pathAssign(currentAircraft, pickedChoice, false, currentPath.slice());
      delete currentPath[pickedChoice];
    }
  };

  pathAssign();
  return paths;
}

function getNumberOfAircrafts(path) {
  let numberOfAitcrafts = -Infinity;
  for (let i = 0; i < path.length; i++) {
    numberOfAitcrafts = numberOfAitcrafts > path[i] ? numberOfAitcrafts : path[i];
  }

  return numberOfAitcrafts;
}

function isPathComplete(schedule, path) {
  for (let i = 0; i < schedule.length; i++) {
    if (!path[i]) {
      // console.log(`not Complete: ${i}`);
      return false;
    }
  }

  return true;
}
