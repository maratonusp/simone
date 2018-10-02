import { getContests } from '../../../src/judges/codechef/getContests';
import { JSDOM } from 'jsdom';

JSDOM.fromURL = jest
  .fn()
  .mockReturnValue(JSDOM.fromFile('tests/resources/codechef.html'));

// For some reason if we mock the Date constructor jest does not work properly
const date = new Date(Date.UTC(2018, 4, 8, 10));
const old_now = Date.now;
beforeEach(() => (Date.now = () => new Date(date)));
afterEach(() => (Date.now = old_now));

test('retrieve all contests', () => {
  return expect(getContests()).resolves.toMatchSnapshot();
});