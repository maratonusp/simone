// @flow

import type { Contest } from '../types';

export function filterStartDate(
  contests: Array<Contest>,
  from?: Date,
  to?: Date,
): Array<Contest> {
  contests = contests.filter(contest => {
    if (from != null)
      if (contest.startTime != null) return contest.startTime >= from;
      else return false;
    else return true;
  });
  contests = contests.filter(contest => {
    if (to != null)
      if (contest.startTime != null) return contest.startTime <= to;
      else return false;
    else return true;
  });
  return contests;
}
