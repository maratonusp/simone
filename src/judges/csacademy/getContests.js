// @flow
import request from 'request';
import type { Contest } from '../../types';

export function getContests(): Promise<Array<Contest>> {
  return new Promise((resolve, reject) => {
    // making request to csacademy website
    var options = {
      url: 'http://csacademy.com/contests/',
      headers: {
        'x-requested-with': 'XMLHttpRequest'
      }
    };
    request(options, (error: Object, response: Object, body: string) => {
      if (response && response.statusCode == 200) {
        let contests: Array<Contest> = [];

        let data: Object = JSON.parse(body).state.Contest;
        for (let index: string in data) {
          let info: Object = data[index];

          // setting required fields
          let contest: Contest = {
            name: 'CSAcademy ' + info.longName,
            code: info.id,
            judge: 'csacademy',
            url: 'http://csacademy.com/contest/' + info.name
          };

          // setting fields that may be absent
          if ('startTime' in info && info.startTime != null)
            contest.startTime = new Date(parseInt(info.startTime) * 1000);
          if (contest.startTime != null) {
            let startTime: Date = contest.startTime;
            let currentTime: Date = new Date();
            if ('endTime' in info && info.endTime != null) {
              let endTime: Date = new Date(parseInt(info.endTime) * 1000);
              contest.duration = Math.max(endTime - startTime, 0);
            }

            contest.state = currentTime < startTime ? 'UPCOMING' : 'RUNNING';
            if (contest.duration != null && currentTime > new Date(startTime + contest.duration))
              contest.state = 'FINISHED';
          }

          contests.push(contest);
        }

        resolve(contests);
      } else
        reject(error);
    });
  });
}
