import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  solicitud: {},
  isEditSolicitud: true,
  isNotEditSolicitud: false,
};

export const solicitudSlice = createSlice({
  name: 'solicitudDinero',
  initialState,
  reducers: {
    oneIdSolicitud: (state, action) => {
      // const {
      //   createdAt,
      //   estado,
      //   updatedAt,
      //   solicitud_productos,
      //   id,
      //   ...datos
      // } = action.payload;
      // console.log(action.payload);
      // state.solicitud = datos;
      state.solicitud = action.payload;
    },
    startEditSolicitud: (state) => {
      state.isEditSolicitud = true;
    },
    notEditSolicitud: (state) => {
      state.isNotEditSolicitud = false;
      state.isEditSolicitud = false;
      state.solicitud = {};
    },
  },
});

export const { oneIdSolicitud, startEditSolicitud, notEditSolicitud } =
  solicitudSlice.actions;
