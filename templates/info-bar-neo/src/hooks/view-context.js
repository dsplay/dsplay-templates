import { createContext, useContext } from 'react';

/** { theme, stage, settings, locale, logos: { company, feed } } for the widgets */
const ViewContext = createContext(null);

export const useView = () => useContext(ViewContext);

export default ViewContext;
