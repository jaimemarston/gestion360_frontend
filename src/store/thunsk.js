import { stateMenu, stateMenuMain } from './slices/solicitud/MenuRRHHSlice';
import {
  enableBoleanRegActividad,
  oneRegActividad,
} from './slices/solicitud/registroActividadSlice';
import {
  oneIdSolicitud,
  startEditSolicitud,
} from './slices/solicitud/solicitudStile';

const getSolicitudDinero = (data) => {
  return (dispatch) => {
    dispatch(startEditSolicitud());
    dispatch(oneIdSolicitud(data));
  };
};

const getRegActividad = (data) => {
  return (dispatch) => {
    dispatch(enableBoleanRegActividad());
    dispatch(oneRegActividad(data));
  };
};

const getMenuSlice = () => {
  return (dispatch) => {
    dispatch(stateMenu());
    dispatch(stateMenuMain);
  };
};

export { getSolicitudDinero, getRegActividad, getMenuSlice };
