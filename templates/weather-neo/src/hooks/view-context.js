import { createContext, useContext } from 'react';

/** { theme, stage, settings, locale, weather, logos: { company } } for the widgets */
const ViewContext = createContext(null);

export const useView = () => useContext(ViewContext);

export default ViewContext;
