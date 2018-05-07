// @flow

import type { Contest } from '../types/contest';
import judges from '../judges';

async function getContests(): Promise<Array<Contest>> {
  const ans: Array<Contest> = [];
  const promises: Array<Promise<Array<Contest>>> = [];
  Object.keys(judges).forEach(judge => {
    promises.push(judges[judge].getContests().catch(
      () => { console.error(judge + ' failed to getContests.'); return []; }
    ));
  });
  const results = await Promise.all(promises);
  for(const contests of results)
    ans.push(...contests);
  return ans;
}

export default {
  getContests: getContests
};
