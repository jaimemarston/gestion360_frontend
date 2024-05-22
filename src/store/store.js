import { configureStore } from '@reduxjs/toolkit';
import { rendicionSlice } from './slices/rendicionGastos';
import { MenuSlice } from './slices/solicitud/MenuRRHHSlice';

import { solicitudSlice } from './slices/solicitud/solicitudStile';
import { FileManagerSlice } from './slices/fileManager/fileManagerSlice';


const store = configureStore({
  reducer: {
    solicitudDinero: solicitudSlice.reducer,
    rendicionGastos: rendicionSlice.reducer,
    menuRRHH: MenuSlice.reducer,
    FileManager: FileManagerSlice.reducer,
  },
});
export { store };
