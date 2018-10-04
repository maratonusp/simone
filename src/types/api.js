// @flow

export type GetContestsOptions = {|
  // Only consider contests starting after this Date.
  startFrom?: Date,
  // Only consider contests starting up until this Date.
  startTo?: Date,
  // Timeout in milliseconds. Default: 8000 ms
  timeout?: number,
|};
