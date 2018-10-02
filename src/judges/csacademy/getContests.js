// @flow
import request from 'request-promise-native';
import type { Contest } from '../../types';

type CSContest = {|
  longName: string,
  name: string,
  id: string,
  startTime: ?string,
  endTime: ?string,
|};

export async function getContests(): Promise<Array<Contest>> {
  var options = {
    url: 'http://csacademy.com/contests/',
    headers: {
      'x-requested-with': 'XMLHttpRequest',
    },
  };
  const body = await request(options);
  const contests: Array<Contest> = [];

  const data: Object = JSON.parse(body).state.Contest;
  for (const info: CSContest of data) {
    if (
      info.longName === 'Archive' ||
      info.longName.startsWith('Virtual') || // Virtual contest for contestId=40468
      info.longName.startsWith('Contest') || // Contest for eval task 190 (Tree From Leaves)
      info.longName.match(/^\d\d:\d\d/) // 14:00, 28 September 2018 - algorithms
    )
      continue;
    // setting required fields
    const contest: Contest = {
      name: 'CSAcademy ' + info.longName,
      code: info.id,
      judge: 'csacademy',
      url: 'http://csacademy.com/contest/' + info.name,
    };

    // setting fields that may be absent
    if ('startTime' in info && info.startTime != null)
      contest.startTime = new Date(parseInt(info.startTime) * 1000);
    if (contest.startTime != null) {
      const startTime: Date = contest.startTime;
      const currentTime = Date.now();
      if ('endTime' in info && info.endTime != null) {
        const endTime: Date = new Date(parseInt(info.endTime) * 1000);
        contest.duration = Math.max(endTime - startTime, 0);
      }

      contest.state = currentTime < startTime ? 'UPCOMING' : 'RUNNING';
      if (
        contest.duration != null &&
        currentTime > new Date(startTime.getTime() + contest.duration)
      )
        contest.state = 'FINISHED';
    }

    contests.push(contest);
  }
  return contests;
}
