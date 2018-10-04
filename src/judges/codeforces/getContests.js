// @flow

import request from 'request-promise-native';
import type { Contest } from '../../types';
import type { GetContestsOptions } from '../../types/api';
import { filterStartDate } from '../../utils';

type CFContest = {
  name: string,
  id: string,
  startTimeSeconds?: number,
  durationSeconds?: number,
  description?: string,
  phase: string,
};

export async function getContests(
  options: GetContestsOptions,
): Promise<Array<Contest>> {
  const request_options = {
    url: 'https://codeforces.com/api/contest.list',
    timeout: options.timeout || 8000,
  };
  const cfData: { result: Array<CFContest> } = JSON.parse(
    await request(request_options),
  );

  return filterStartDate(
    cfData.result.map((contestData: CFContest) => {
      // setting required fields
      const contest: Contest = {
        name: contestData.name,
        code: contestData.id,
        judge: 'codeforces',
        url: 'https://codeforces.com/contests/' + contestData.id,
      };

      // setting fields that may be absent
      if (contestData.startTimeSeconds != null)
        contest.startTime = new Date(contestData.startTimeSeconds * 1000);
      if (contestData.durationSeconds != null)
        contest.duration = contestData.durationSeconds;
      if (contestData.description != null)
        contest.description = contestData.description;

      // setting contest state
      if (contestData.phase === 'BEFORE') contest.state = 'UPCOMING';
      else if (
        ['CODING', 'PENDING_SYSTEM_TEST', 'SYSTEM_TEST'].includes(
          contestData.phase,
        )
      )
        contest.state = 'RUNNING';
      else if (contestData.phase === 'FINISHED') contest.state = 'FINISHED';

      return contest;
    }),
    options.startFrom,
    options.startTo,
  );
}
