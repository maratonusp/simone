import api from '../../src/api';
import judges from '../../src/judges';
jest.mock('../../src/judges');

function blocked_object() {
  const { blocked, revoke } = Proxy.revocable({}, {});
  revoke();
  return blocked;
}

test('concatenates contest lists correctly', () => {
  // The blocked object has revoked access, that means none of its fields may be acessed.
  // This is to make sure getContests doesn't even look at any of its fields.
  const blocked = blocked_object();
  let countJudges = 0;
  for (const judge of Object.values(judges)) {
    countJudges++;
    judge.getContests.mockImplementation(() => Promise.resolve([blocked]));
  }
  return expect(api.getContests()).resolves.toEqual(
    new Array(countJudges).fill(blocked),
  );
});

test('ignores if codeforces fails', () => {
  const blocked = blocked_object();
  let countJudges = 0;
  for (const judge of Object.values(judges)) {
    countJudges++;
    judge.getContests.mockImplementation(() => Promise.resolve([blocked]));
  }
  // cf fails
  judges.codeforces.getContests.mockImplementation(() =>
    Promise.reject('error'),
  );
  return expect(api.getContests()).resolves.toEqual(
    new Array(countJudges - 1).fill(blocked),
  );
});

test('ignores if all judges fails', () => {
  for (const judge of Object.values(judges))
    judge.getContests = jest.fn(() => Promise.reject('error'));
  return expect(api.getContests()).resolves.toEqual([]);
});

test('filtering is correctly passed to judges', async () => {
  const from = new Date(Date.UTC(2017, 10, 10));
  const to = new Date(Date.UTC(2018, 10, 10));
  Object.keys(judges).forEach(
    judge => (judges[judge].getContests = jest.fn(() => Promise.resolve([]))),
  );
  expect(await api.getContests(from, to)).toEqual([]);
  // each judge is called once with expected arguments
  for (const judge of Object.values(judges))
    expect(judge.getContests.mock.calls).toEqual([[from, to]]);
});
