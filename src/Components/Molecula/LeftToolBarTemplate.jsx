import React from 'react';
import { Button } from 'primereact/button';

const LeftToolBarTemplate = ({
  openNew,
  nameBtn,
  ventana = true,
  ventanaAdd = true,
}) => {
  // let bool = false;
  // if (ventana === false && ventanaAdd === false) {
  //   bool = true;
  // }
  return (
    <div>
      <Button label={nameBtn} onClick={openNew} />
    </div>
  );
};

export { LeftToolBarTemplate };
