import { createContext, useContext } from 'react';

/** { theme, stage, settings, remPx } for the layouts */
const ViewContext = createContext(null);

export const useView = () => useContext(ViewContext);

export default ViewContext;
