import { createContext, useContext } from 'react';

/** { theme, stage, settings, wifi, logos: { company } } for the widgets */
const ViewContext = createContext(null);

export const useView = () => useContext(ViewContext);

export default ViewContext;
