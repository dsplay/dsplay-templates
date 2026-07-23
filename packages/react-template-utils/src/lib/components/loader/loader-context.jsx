import React from 'react';

/**
 * @typedef {object} LoaderContextValue
 * @property {unknown[]} [tasksResults] - Resolved values of the extra `tasks` passed to `Loader`, in order
 */

/** @type {React.Context<LoaderContextValue>} */
const LoaderContext = React.createContext({});

export default LoaderContext;
