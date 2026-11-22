import React from 'react';

/**
 * @typedef {object} LoaderContextValue
 * @property {unknown[]} [tasksResults] - Resolved values of the extra `tasks` passed to `Loader`, in
 * order; a rejected task settles as `undefined` here instead of leaving `Loader` stuck forever
 * @property {unknown[]} [tasksErrors] - Rejection reason for each `tasks` entry, in the same order as
 * `tasksResults`; `undefined` at an index whose task fulfilled
 * @property {boolean} [ready] - Reveal mode only: `true` once the fonts and images have loaded and
 * the template is visible; use it to start JS-driven entrance animations
 */

/** @type {React.Context<LoaderContextValue>} */
const LoaderContext = React.createContext({});

export default LoaderContext;
