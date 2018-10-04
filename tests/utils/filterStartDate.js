// @flow

import { filterStartDate } from '../../src/utils';

test('filter contests', () => {
  const cs = [];
  for (let i = 1; i <= 10; i++)
    cs.push({
      code: '1',
      name: 'name',
      judge: 'codeforces',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      startTime: new Date(i * 1000),
    });
  expect(filterStartDate(cs, new Date(1000), new Date(7000))).toMatchSnapshot();
});
