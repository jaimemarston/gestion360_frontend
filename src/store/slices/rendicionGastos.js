import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rendicionGastos: {},
  isEditRendicion: true,
  isNotEditRendicion: false,
};

export const rendicionSlice = createSlice({
  name: 'solicitudDinero',
  initialState,
  reducers: {
    oneIdRendicion: (state, action) => {
      state.rendicionGastos = action.payload;
    },
    startEditRendicion: (state) => {
      state.isEditRendicion = true;
    },
    notEditRendicion: (state) => {
      state.isNotEditRendicion = false;
      state.isEditRendicion = false;
      state.rendicionGastos = {};
    },
  },
});

export const { oneIdRendicion, startEditRendicion, notEditRendicion } =
  rendicionSlice.actions;
