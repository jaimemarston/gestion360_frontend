import React from 'react';
import { Button } from 'primereact/button';

const RightToolBarTemplate = ({ openNew, nameBtn }) => {
  return (
    <div>
      <Button label={nameBtn} onClick={openNew} />
    </div>
  );
};

export { RightToolBarTemplate };
