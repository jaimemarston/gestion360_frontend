import React from 'react';
import PDF from '../../../../assets/formatosolicitudvacaiones.pdf';

const PermisoVacaciones = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <object
        aria-label="alt-text"
        data={PDF}
        type='application/pdf'
        width='100%'
        height='100%'
      ></object>
    </div>
  );
};

export default PermisoVacaciones;