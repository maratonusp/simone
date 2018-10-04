// @flow

import { JSDOM } from 'jsdom';
import { filterStartDate } from '../../utils';
import request from 'request-promise-native';
import type { Contest } from '../../types';
import type { State } from '../../types';
import type { GetContestsOptions } from '../../types/api';

function parse(row: HTMLTableRowElement): Contest {
  // flow has an issue concerning the cells field.
  // See https://github.com/facebook/flow/issues/6264
  const cells: HTMLCollection<HTMLTableCellElement> = (row: any).cells;

  const code: string = cells[0].textContent;
  const name: string = cells[1].children[0].textContent;
  const url: string = 'https://www.codechef.com/' + code;
  const startTime: Date = new Date(cells[2].dataset['starttime']);
  const endTime: Date = new Date(cells[3].dataset['endtime']);
  const duration: number = (endTime.getTime() - startTime.getTime()) / 1000;

  let state: State;
  const now = Date.now();
  if (startTime > now) state = 'UPCOMING';
  else if (endTime <= now) state = 'FINISHED';
  else state = 'RUNNING';

  return {
    name,
    code,
    judge: 'codechef',
    startTime,
    duration,
    state,
    url,
  };
}

export async function getContests(
  options: GetContestsOptions,
): Promise<Array<Contest>> {
  const request_options = {
    url: 'https://www.codechef.com/contests',
    timeout: options.timeout || 8000,
    headers: {
      'User-Agent': 'node.js',
    },
  };
  const html = await request(request_options);
  // dom is a JSDOM, which is a third-party library that was not built with Flow
  const dom = new JSDOM(html);
  const document: Document = dom.window.document;

  const contestsTables: NodeList<HTMLElement> = document.querySelectorAll(
    'table.dataTable',
  );

  const contests: Array<Contest> = [];

  contestsTables.forEach(table => {
    const tab: HTMLTableElement = (table: any);
    const rows: HTMLCollection<HTMLTableRowElement> = tab.tBodies[0].rows;
    Array.from(rows).forEach(row => {
      contests.push(parse(row));
    });
  });

  return filterStartDate(contests, options.startFrom, options.startTo);
}
