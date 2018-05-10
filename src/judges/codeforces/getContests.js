// @flow
import request from 'request-promise-native';
import type { Contest } from '../../types';

export async function getContests(): Promise<Array<Contest>> {
  const responseBody = await request('http://codeforces.com/api/contest.list');
  const contests: Array<Contest> = [];

  for(let contestData: Object of JSON.parse(responseBody).result) {

    // setting required fields
    const contest: Contest = {
      name: contestData.name,
      code: contestData.id,
      judge: 'codeforces',
      url: 'http://codeforces.com/contests/' + contestData.id
    };

    // setting fields that may be absent
    if ('startTimeSeconds' in contestData)
      contest.startTime = new Date(parseInt(contestData.startTimeSeconds) * 1000);
    if ('durationSeconds' in contestData)
      contest.duration = contestData.durationSeconds;
    if ('description' in contestData)
      contest.description = contestData.description;

    // setting contest state
    if (contestData.phase === 'BEFORE')
      contest.state = 'UPCOMING';
    else if (['CODING', 'PENDING_SYSTEM_TEST', 'SYSTEM_TEST'].includes(contestData.phase))
      contest.state = 'RUNNING';
    else if (contestData.phase === 'FINISHED')
      contest.state = 'FINISHED';

    contests.push(contest);
  }
  return contests;
}
