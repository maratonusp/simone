jest.mock('request');
const request = require('request');
import { getContests } from './../../../src/judges/codeforces/getContests';

function testContests(...contests) {
  request.mockReturnValueOnce(new Promise(function(resolve) {
    setTimeout(() => resolve(JSON.stringify({
      status: 'OK',
      result: contests
    })), 10);
  }));
  return expect(getContests()).resolves.toMatchObject(contests.map(contest => ({
    name: contest.name,
    code: contest.id,
    judge: 'codeforces',
    duration: contest.durationSeconds,
    state: 'UPCOMING'
  })));
}

test('simple contest', () => {
  let contest = {
    name: 'Oi',
    id: '123',
    durationSeconds: 321,
    phase: 'BEFORE'
  };
  return testContests(contest);
});

test('multiple contests', () => {
  let cs = [];
  for(let i = 1; i <= 10; i++)
    cs.push({
      name: 'Contest' + i,
      id: '' + i,
      durationSeconds: i * 60 * 60,
      phase: 'BEFORE'
    });
  return testContests(...cs);
});
