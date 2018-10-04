[![Build Status](https://travis-ci.org/maratonime/simone.svg?branch=master)](https://travis-ci.org/maratonime/simone)

# simone

simone is a standardized online judge API (for ICPC-like competitions).
That means it provides the same API for all judges, and should be used when you need to obtain info about different online judges and don't want to deal with how differently they are stored in each of them.

simone stands for "Simone Integrates Most ONline judgEs", or something like that. Acronyms don't mean much these days.

## Which judges does it support?

For now: [Codeforces](https://codeforces.com/), [CSAcademy](https://csacademy.com/) and [CodeChef](https://www.codechef.com/).

## What can it do?

For now, it supports getting contest lists.

## How do I use it?

Pretty easy. The following code will print the name and judges of all upcoming contests.

```js
const simone = require('simone');
simone.getContests({ startFrom: new Date() }).then(list =>
  list.forEach(contest => {
    console.log(
      'Contest named ' + contest.name + ' from judge ' + contest.judge + '.',
    );
  }),
);
```

## Documentation?

None so far. Check [getContests](src/api/getContests.js), flow types should help understanding the return values.

## Can I help?

Sure. Send a pull request.
