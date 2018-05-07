import api from '../../src/api';
import judges from '../../src/judges';
jest.mock('../../src/judges');

// I need more than one judge working to make better tests.
test('concatenates correctly', () => {
  judges.codeforces.getContests.mockImplementation(() => Promise.resolve([1, 2, 3]));
  return expect(api.getContests()).resolves.toEqual([1, 2, 3]);
});

test('ignores promise errors', () => {
  judges.codeforces.getContests.mockImplementation(() => Promise.reject('error'));
  return expect(api.getContests()).resolves.toEqual([]);
});
