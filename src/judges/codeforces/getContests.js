// @flow
import request from 'request-promise-native';
import type { Contest } from '../../types';

type CFContest = {
  name: string,
  id: string,
  startTimeSeconds?: number,
  durationSeconds?: number,
  description?: string,
  phase: string,
};

export async function getContests(
  from?: Date,
  to?: Date,
): Promise<Array<Contest>> {
  const cfData: { result: Array<CFContest> } = JSON.parse(
    await request('http://codeforces.com/api/contest.list'),
  );

  let contests = cfData.result.map((contestData: CFContest) => {
    // setting required fields
    const contest: Contest = {
      name: contestData.name,
      code: contestData.id,
      judge: 'codeforces',
      url: 'http://codeforces.com/contests/' + contestData.id,
    };

    // setting fields that may be absent
    if (contestData.startTimeSeconds != null)
      contest.startTime = new Date(contestData.startTimeSeconds * 1000);
    if (contestData.durationSeconds != null)
      contest.duration = contestData.durationSeconds;
    if (contestData.description != null)
      contest.description = contestData.description;

    // setting contest state
    if (contestData.phase === 'BEFORE') contest.state = 'UPCOMING';
    else if (
      ['CODING', 'PENDING_SYSTEM_TEST', 'SYSTEM_TEST'].includes(
        contestData.phase,
      )
    )
      contest.state = 'RUNNING';
    else if (contestData.phase === 'FINISHED') contest.state = 'FINISHED';

    return contest;
  });

  if (from) {
    const localFrom = from;
    contests = contests.filter(
      contest => contest.startTime != null && contest.startTime >= localFrom,
    );
  }
  if (to) {
    const localTo = to;
    contests = contests.filter(
      contest => contest.startTime != null && contest.startTime <= localTo,
    );
  }
  return contests;
}
