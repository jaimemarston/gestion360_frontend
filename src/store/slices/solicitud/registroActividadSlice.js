import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  regActividad: {},
  isBolean: false,
};

export const regActividadSlice = createSlice({
  name: 'registroActividad',
  initialState,
  reducers: {
    oneRegActividad: (state, action) => {
      state.regActividad = action.payload;
    },
    enableBoleanRegActividad: (state) => {
      state.isBolean = !isBolean;
    },
  },
});

export const { oneRegActividad, enableBoleanRegActividad } =
  regActividadSlice.actions;
