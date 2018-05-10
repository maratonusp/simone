import api from '../../src/api';
import judges from '../../src/judges';
jest.mock('../../src/judges');

// I need more than one judge working to make better tests.
test('concatenates contest lists correctly', () => {
  const {blocked, revoke} = Proxy.revocable({}, {});
  revoke();
  // The blocked object has revoked access, that means none of its fields may be acessed.
  // This is to make sure getContests doesn't even look at any of its fields.
  judges.codeforces.getContests.mockImplementation(() => Promise.resolve([blocked, blocked, blocked]));
  return expect(api.getContests()).resolves.toEqual([blocked, blocked, blocked]);
});

test('ignores judges with errors', () => {
  judges.codeforces.getContests.mockImplementation(() => Promise.reject('error'));
  return expect(api.getContests()).resolves.toEqual([]);
});
