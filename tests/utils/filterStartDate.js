import { filterStartDate } from '../../src/utils';

function testFilter(contests, from, to) {
  const filteredContests = contests.filter(contest => {
    return contest.startTime >= from && contest.startTime <= to;
  });
  contests = filterStartDate(contests, from, to);
  return expect(contests).toMatchObject(filteredContests);
}

test('filter contests', () => {
  const cs = [];
  for (let i = 1; i <= 10; i++)
    cs.push({
      startTime: new Date(i * 1000),
    });
  return testFilter(cs, new Date(1000), new Date(7000));
});
