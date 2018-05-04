'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContests = getContests;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getContests() {
  return new Promise(function (resolve, reject) {
    // making request to the codeforces api
    (0, _request2.default)('http://codeforces.com/api/contest.list', function (error, response, body) {
      if (response && response.statusCode == 200) {
        var contests = [];

        var data = JSON.parse(body).result;
        for (var index in data) {
          var info = data[index];

          // setting required fields
          var contest = {
            name: info.name,
            code: info.id,
            judge: 'codeforces',
            duration: info.durationSeconds,
            url: 'http://codeforces.com/contests/' + info.id
          };

          // setting fields that may be absent
          if ('startTimeSeconds' in info) contest.startTime = new Date(parseInt(info.startTimeSeconds) * 1000);
          if ('description' in info) contest.description = info.description;

          // setting contest state
          if (info.phase === 'BEFORE') contest.state = 'UPCOMING';else if (['CODING', 'PENDING_SYSTEM_TEST', 'SYSTEM_TEST'].includes(info.phase)) contest.state = 'RUNNING';else if (info.phase === 'FINISHED') contest.state = 'FINISHED';

          contests.push(contest);
        }
        resolve(contests);
      } else reject(error);
    });
  });
}