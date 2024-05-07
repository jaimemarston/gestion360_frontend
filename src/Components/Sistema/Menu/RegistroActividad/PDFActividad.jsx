import { Button } from 'primereact/button';

import jsPDF from 'jspdf';
import { useEffect, useState } from 'react';

const PDFActividad = (edit, data) => {

  const [datas, setDatas] = useState()

  useEffect(() =>{

console.log(edit,'EDIT')
  if(edit.edit !== undefined){
    setDatas(edit.edit)
  }

  if (data.data !== undefined){
    setDatas(data.data)
  }

    console.log(edit.edit, 'editPDF')

  },[])




  const descarga = () => {
    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.setDrawColor(195, 195, 195);
    doc.rect(20, 15, 118, 10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'bold');
    doc.text(' INFORME DE ACTIVIDADES', 70, 21.5);

    doc.setFontSize(9);
    doc.rect(138, 15, 51, 10);
    doc.text('FORMATO - 001', 149, 21.5);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('INSTITUCIÓN: descocentro', 140, 32);

    doc.rect(20, 36, 169, 6);
    
    doc.text(`Nombres y Apellidos:  ${datas?.nombreApellido}`, 25, 40);

    doc.rect(20, 42, 169, 6);
    doc.text('Fecha  Inicio:__/__/20__', 25, 46);
    doc.text('Termino: __/__/20__', 120, 46);

    doc.rect(20, 47.95, 169, 6);
    doc.text('Destino: ', 25, 52);

    doc.rect(20, 53.9, 169, 6);
    doc.text(`Objeto de la comisión: ${datas?.objetoComision}`, 25, 58);
    doc.rect(20, 60, 169, 20);

    doc.rect(20, 80, 169, 6);
    doc.text(`Detalle de la actividad realizada: ${datas?.detalleActividad}`, 25, 84);
    doc.rect(20, 86, 169, 25);

    doc.rect(20, 111, 169, 6);
    doc.text(
      `Otros aspectos administrativos relevantes que afecten su rendición de cuentas: ${datas?.otros}`,
      25,
      115
    );
    doc.rect(20, 111, 169, 25);

    doc.rect(20, 136, 169, 6);
    doc.text('Lugar:', 25, 140);
    doc.text('Fecha: 11/01/202', 110, 140);

    doc.text('_________________________', 90, 240);
    doc.text('Nombres y apellidos', 97, 244);
    doc.text('DNI', 107, 248);

    doc.save('a4.pdf');
  };
  return (
    <>
      <Button onClick={descarga}>Descargar PDF</Button>
    </>
  );
};

export default PDFActividad;
