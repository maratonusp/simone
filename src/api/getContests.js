// @flow

import type { Contest } from '../types/contest';
import type { GetContestsOptions } from '../types/api';
import judges from '../judges';

const default_options = Object.freeze({});

export async function getContests(
  options?: GetContestsOptions = default_options,
): Promise<Array<Contest>> {
  const contests: Array<Contest> = [];
  const promises: Array<Promise<Array<Contest>>> = [];
  Object.keys(judges).forEach(judge => {
    promises.push(
      judges[judge].getContests(options).catch(() => {
        console.error(judge + ' failed to getContests.');
        return [];
      }),
    );
  });
  const results = await Promise.all(promises);
  for (const contestList of results) contests.push(...contestList);
  return contests;
}
