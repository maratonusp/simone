// @flow

import type { Contest } from '../types/contest';
import judges from '../judges';

function getContests(): Promise<Array<Contest>> {
  let ans: Array<Contest> = [];
  let promises: Array<Promise<Array<Contest>>> = [];
  Object.keys(judges).forEach(judge => {
    promises.push(judges[judge].getContests().catch(
      () => { console.error(judge + ' failed to getContests.'); return []; }
    ));
  });
  return Promise.all(promises).then(
    results => {
      for(let contests of results)
        ans.push(...contests);
      return ans;
    }
  );
}

export default {
  getContests: getContests
};
