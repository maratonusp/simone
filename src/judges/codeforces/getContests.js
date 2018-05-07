// @flow
import request from 'request-promise-native';
import type { Contest } from '../../types';

export async function getContests(): Promise<Array<Contest>> {
  const body = await request('http://codeforces.com/api/contest.list');
  const contests: Array<Contest> = [];

  const data: Object = JSON.parse(body).result;
  for (let index: string in data) {
    const info: Object = data[index];

    // setting required fields
    const contest: Contest = {
      name: info.name,
      code: info.id,
      judge: 'codeforces',
      duration: info.durationSeconds,
      url: 'http://codeforces.com/contests/' + info.id
    };

    // setting fields that may be absent
    if ('startTimeSeconds' in info)
      contest.startTime = new Date(parseInt(info.startTimeSeconds) * 1000);
    if ('description' in info)
      contest.description = info.description;

    // setting contest state
    if (info.phase === 'BEFORE')
      contest.state = 'UPCOMING';
    else if (['CODING', 'PENDING_SYSTEM_TEST', 'SYSTEM_TEST'].includes(info.phase))
      contest.state = 'RUNNING';
    else if (info.phase === 'FINISHED')
      contest.state = 'FINISHED';

    contests.push(contest);
  }
  return contests;
}
