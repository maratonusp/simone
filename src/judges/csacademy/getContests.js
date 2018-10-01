// @flow
import request from 'request';
import type { Contest } from '../../types';

export function getContests(): Promise<Array<Contest>> {
  return new Promise((resolve, reject) => {
    // making request to csacademy website
    var options = {
      url: 'http://csacademy.com/contests/',
      headers: {
        'x-requested-with': 'XMLHttpRequest',
      },
    };
    request(options, (error: Object, response: Object, body: string) => {
      if (response && response.statusCode == 200) {
        const contests: Array<Contest> = [];

        const data: Object = JSON.parse(body).state.Contest;
        for (const index: string in data) {
          const info: Object = data[index];

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
            const currentTime: Date = new Date();
            if ('endTime' in info && info.endTime != null) {
              const endTime: Date = new Date(parseInt(info.endTime) * 1000);
              contest.duration = Math.max(endTime - startTime, 0);
            }

            contest.state = currentTime < startTime ? 'UPCOMING' : 'RUNNING';
            if (
              contest.duration != null &&
              currentTime > new Date(startTime + contest.duration)
            )
              contest.state = 'FINISHED';
          }

          contests.push(contest);
        }

        resolve(contests);
      } else reject(error);
    });
  });
}
