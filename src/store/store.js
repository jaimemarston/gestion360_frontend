import { configureStore } from '@reduxjs/toolkit';
import { rendicionSlice } from './slices/rendicionGastos';
import { MenuSlice } from './slices/solicitud/MenuRRHHSlice';

import { solicitudSlice } from './slices/solicitud/solicitudStile';

const store = configureStore({
  reducer: {
    solicitudDinero: solicitudSlice.reducer,
    rendicionGastos: rendicionSlice.reducer,
    menuRRHH: MenuSlice.reducer,
  },
});
export { store };
