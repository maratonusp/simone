// @flow

import { getContests } from '../../../src/judges/csacademy/getContests';
import fs from 'fs';
import request from 'request-promise-native';

// For some reason if we mock the Date constructor jest does not work properly
// We should create the date in UTC since the default Date constructor takes
// timezone into account, so the tests may break in different machines
const date = new Date(Date.UTC(2018, 4, 9, 15, 10));
const old_now = Date.now;
const old_request = request;
beforeEach(() => {
  global.request = jest.fn(
    () =>
      new Promise(resolve =>
        fs.readFile('tests/resources/csacademy.html', resolve),
      ),
  );
  (Date: any).now = () => new Date(date);
});
afterEach(() => {
  global.request = old_request;
  (Date: any).now = old_now;
});

test('retrieve all contests', async () => {
  const result = await getContests({});
  expect(result).toMatchSnapshot();
});

test('filtering', () => {
  return expect(
    getContests({
      startFrom: new Date(date.getTime() - 1000 * 60 * 60 * 24 * 30),
      startTo: new Date(date.getTime() + 1000 * 60 * 60 * 24 * 5),
    }),
  ).resolves.toMatchSnapshot();
});
