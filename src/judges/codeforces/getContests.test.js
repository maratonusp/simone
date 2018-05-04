import { getContests } from './getContests';

test('there should be at least one contest in codeforces', async () => {
  let cl = await getContests();
  expect(cl.length).toBeGreaterThan(0);
});
