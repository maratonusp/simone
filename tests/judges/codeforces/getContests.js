// @flow

import { getContests } from './../../../src/judges/codeforces/getContests';
import nock from 'nock';

function mapToAPIReturn(...contests) {
  return {
    status: 'OK',
    result: contests,
  };
}

function testContests(...contests) {
  nock('https://codeforces.com')
    .get('/api/contest.list')
    .reply(200, mapToAPIReturn(...contests));
  return expect(getContests({})).resolves.toMatchSnapshot();
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
  nock('https://codeforces.com')
    .get('/api/contest.list')
    .reply(200, mapToAPIReturn(...inside, ...outside));
  return expect(
    getContests({ startFrom: new Date(231000), startTo: new Date(235000) }),
  ).resolves.toMatchSnapshot();
});

test('timeout', async () => {
  const contest = {
    name: '1',
    id: '123',
    durationSeconds: 10,
    phase: 'BEFORE',
    startTimeSeconds: 1,
  };
  nock('https://codeforces.com')
    .get('/api/contest.list')
    .twice()
    .delay(200)
    .reply(200, mapToAPIReturn(contest));
  expect(await getContests({ timeout: 2000 })).toMatchSnapshot();
  // should timeout
  expect(
    await getContests({ timeout: 100 }).then(() => false, () => true),
  ).toBeTruthy();
});
