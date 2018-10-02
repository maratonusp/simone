import { getContests } from '../../../src/judges/csacademy/getContests';
import * as fs from 'fs';
import request from 'request-promise-native';

// For some reason if we mock the Date constructor jest does not work properly
const date = new Date('5/9/2018 12:10');
const old_now = Date.now;
const old_request = request;
beforeEach(() => {
  global.request = jest.fn(() => fs.readFile('tests/resources/csacademy.html'));
  Date.now = () => new Date(date);
});
afterEach(() => {
  global.request = old_request;
  Date.now = old_now;
});

test('retrieve all contests', async () => {
  const result = await getContests();
  expect(result).toMatchSnapshot();
});
