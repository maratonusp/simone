jest.mock('request');
const request = require('request');
import { getContests } from './../../../src/judges/codeforces/getContests';

function mapToAPIReturn(...contests) {
  return JSON.stringify({
    status: 'OK',
    result: contests,
  });
}

function testContests(...contests) {
  request.mockReturnValueOnce(Promise.resolve(mapToAPIReturn(...contests)));
  return expect(getContests()).resolves.toMatchSnapshot();
}

test('simple contest', () => {
  const contest = {
    name: 'Oi',
    id: '123',
    durationSeconds: 321,
    phase: 'BEFORE',
  };
  return testContests(contest);
});

test('multiple contests', () => {
  const cs = [];
  for (let i = 1; i <= 10; i++)
    cs.push({
      name: 'Contest' + i,
      id: '' + i,
      durationSeconds: i * 60 * 60,
      phase: 'BEFORE',
    });
  return testContests(...cs);
});

test('filtering', () => {
  const baseContest = {
    name: '1',
    id: '123',
    durationSeconds: 111,
    phase: 'BEFORE',
  };
  const inside = [
    { ...baseContest, startTimeSeconds: 232 },
    { ...baseContest, startTimeSeconds: 234 },
  ];
  const outside = [
    { ...baseContest, startTimeSeconds: 230 },
    { ...baseContest, startTimeSeconds: 250 },
  ];
  request.mockReturnValueOnce(
    Promise.resolve(mapToAPIReturn(...inside, ...outside)),
  );
  return expect(
    getContests(new Date(231000), new Date(235000)),
  ).resolves.toMatchSnapshot();
});
