import { getContests } from '../../../src/judges/codechef/getContests';
import { JSDOM } from 'jsdom';
import * as MockDate from 'mockdate';

MockDate.set('5/8/2018');

JSDOM.fromURL = jest
  .fn()
  .mockReturnValue(JSDOM.fromFile('test/resources/codechef.html'));

test('retrieve all contests', () => {
  const expectedReturn = [
    {
      name: 'May Challenge 2018',
      code: 'MAY18',
      judge: 'codechef',
      startTime: new Date('2018-05-04T09:30:00.000Z'),
      duration: 864000,
      state: 'RUNNING',
      url: 'https://www.codechef.com/MAY18',
    },
    {
      name: 'INOI Practice Contest',
      code: 'INOIPRAC',
      judge: 'codechef',
      startTime: new Date('2016-01-04T18:30:00.000Z'),
      duration: 126230400,
      state: 'RUNNING',
      url: 'https://www.codechef.com/INOIPRAC',
    },
    {
      name: 'May Cook-Off 2018',
      code: 'COOK94',
      judge: 'codechef',
      startTime: new Date('2018-05-20T16:00:00.000Z'),
      duration: 9000,
      state: 'UPCOMING',
      url: 'https://www.codechef.com/COOK94',
    },
    {
      name: 'May Lunchtime 2018',
      code: 'LTIME60',
      judge: 'codechef',
      startTime: new Date('2018-05-26T14:00:00.000Z'),
      duration: 10800,
      state: 'UPCOMING',
      url: 'https://www.codechef.com/LTIME60',
    },
    {
      name: 'LoC April 2018 (Rated for Division 2)',
      code: 'LOCAPR18',
      judge: 'codechef',
      startTime: new Date('2018-04-27T18:30:00.000Z'),
      duration: 172800,
      state: 'FINISHED',
      url: 'https://www.codechef.com/LOCAPR18',
    },
    {
      name: 'CODEX_X',
      code: 'COX2018',
      judge: 'codechef',
      startTime: new Date('2018-04-29T14:30:00.000Z'),
      duration: 10800,
      state: 'FINISHED',
      url: 'https://www.codechef.com/COX2018',
    },
  ];
  return expect(getContests()).resolves.toEqual(expectedReturn);
});

// This is necessary because it is the time jest uses
MockDate.reset();
