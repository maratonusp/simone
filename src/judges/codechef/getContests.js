// @flow
import { JSDOM } from 'jsdom';
import type { Contest } from '../../types';
import type { State } from '../../types';

// TODO: row should be an HTMLTableRowElement, however flow has an issue
// concerning that. See https://github.com/facebook/flow/issues/6264
function contestDataFrom(row: any): Contest {
  const cells: HTMLCollection<HTMLTableCellElement> = row.cells;

  let code: string = cells[0].textContent;
  let name: string = cells[1].children[0].textContent;
  let url: string = 'https://www.codechef.com/' + code;
  let startTime: Date = new Date(cells[2].dataset['starttime']);
  let endTime: Date = new Date(cells[3].dataset['endtime']);
  let duration: number = (endTime.getTime() - startTime.getTime()) / 1000;

  let state: State;
  let now = new Date();
  if(startTime > now) state = 'UPCOMING';
  else if(endTime <= now) state = 'FINISHED';
  else state = 'RUNNING';

  return {
    name: name,
    code: code,
    judge: 'codechef',
    startTime: startTime,
    duration: duration,
    state: state,
    url: url
  };
}

export function getContests(): Promise<Array<Contest>> {
  return new Promise((resolve: Function, reject: Function) => {
    // dom is a JSDOM, which is a third-party library that was not built with Flow
    JSDOM.fromURL('https://www.codechef.com/contests').then((dom: any): void => {
      try {
        const document: Document = dom.window.document;

        // This should be a NodeList<HTMLTableElement>, but querySelectorAll returns a
        // NodeList<HTMLElement>, which does not have the property tBodies, used below.
        const contestsTables: NodeList<any> = document.querySelectorAll('table.dataTable');

        let contests: Array<Contest> = [];

        contestsTables.forEach(table => {
          const rows: HTMLCollection<HTMLTableRowElement> = table.tBodies[0].rows;
          for(let i: number = 0; i < rows.length; i++)
            contests.push(contestDataFrom(rows[i]));
        });

        resolve(contests);

      } catch(err) {
        reject(err);
      }
    }, reject);
  });
}
