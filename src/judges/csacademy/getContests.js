// @flow
import request from 'request';
import type { Contest } from '../../types';

export function getContests(): Promise<Array<Contest> | Object> {
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
          if ('startTime' in info && info.startTime != null) {
            contest.startTime = new Date(parseInt(info.startTime) * 1000);
            if ('endTime' in info && info.endTime != null) {
              // seting contest duration
              let endTime: Date = new Date(parseInt(info.endTime) * 1000);
              contest.duration = Math.abs(endTime - contest.startTime) / 1000;

              // setting contest state
              if (Date.now() < contest.startTime)
                contest.state = 'UPCOMING';
              else if (Date.now() >= contest.startTime && Date.now() <= endTime)
                contest.state = 'RUNNING';
              else if (Date.now() > endTime)
                contest.state = 'FINISHED';
            }
          }

          contests.push(contest);
        }

        resolve(contests);
      } else
        reject(error);
    });
  });
}