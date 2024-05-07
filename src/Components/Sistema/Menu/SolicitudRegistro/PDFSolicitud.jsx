import React from 'react';
import jsPDF from 'jspdf';
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import autoTable from 'jspdf-autotable';
import { fetchGet } from '../../../../api';

const PDFSolicitud = () => {
  const { solicitud } = useSelector((state) => state.solicitudDinero);



  let proyecto;
  let lugar;

  if(solicitud.nombreProyecto){
    fetchGet(`regProyecto/${solicitud?.nombreProyecto}`).then((res) => {
      proyecto = res.registroProyecto.nombreAbreviado
       
    })
  }

  if(solicitud.lugarComision){
    fetchGet(`comision/${solicitud?.lugarComision}`).then((res) => {
    
      lugar = res.lugarComision.descripcion
       
    })
  }


 

  const descarga = () => {
    const data = [];
    solicitud?.solicitud_productos.map((item, index) => {
      const data1 = [
        `${index + 1}`,
        `${item.descripcion}`,
        `${item.partidaPresupuestal}`,
        `${item.importe}`,
      ];
      data.push(data1);
    });

    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.setDrawColor(195, 195, 195);
    doc.rect(20, 15, 118, 12);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'bold');
    doc.text('SOLICITUD DE VIAJE EN COMISIÓN', 60, 20.6);
    doc.text('DE SERVICIOS.', 75, 25);

    doc.setFontSize(9);
    doc.rect(138, 15, 51, 12);
    doc.text(`FORMATO - ${solicitud.numeroSolicitud}`, 149, 22);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('INSTITUCIÓN: descocentro - 001', 140, 34);

    doc.rect(20, 37, 169, 6);
    doc.text(`Nombres y Apellidos:  ${solicitud.nombre}`, 25, 41);
    doc.rect(20, 43, 169, 6);
    doc.text('Cargo: PERSONAL ADMINISTRATIVO', 25, 47);
    doc.rect(20, 49, 169, 6);
    doc.text(`Proyecto: ${proyecto}`, 25, 53);
    doc.rect(20, 55, 169, 6);
    doc.text(`Lugar de comisión: ${lugar}`, 25, 59);
    doc.rect(20, 61, 169, 6);
    doc.text(
      `Itinerario de transporte: ${solicitud.itinerarioTransporte}`,
      25,
      65
    );
    doc.rect(20, 67, 169, 6);
    doc.text(`Objeto de la comisión: ${solicitud.objetoComision}`, 25, 71);
    doc.rect(20, 73, 169, 6);
    doc.text(`Fecha de inicio: ${solicitud.fechaInicio}`, 25, 77);
    doc.text(`Fecha de fin: ${solicitud.fechaFin}`, 130, 77);
    doc.rect(20, 79, 169, 6);
    doc.text('Detalle de gastos de viaje', 25, 83);

    doc.setFontSize(8);

    autoTable(doc, {
      styles: { fontSize: 8, width: 50 },
      columnStyles: {
        0: { halign: 'center', cellWidth: 13.6 },
        1: { halign: 'center', cellWidth: 92.5 },
        2: { halign: 'center', cellWidth: 37.9 },
        3: { halign: 'center', cellWidth: 25.1 },
      },
      body: data,
      startY: 96,
      margin: 20,
    });

    doc.setFontSize(8);
    doc.text('Id', 25, 94);
    doc.rect(20, 90, 13.5, 6);
    doc.text('Descripción', 72, 94);
    doc.rect(33.5, 90, 92.5, 6);
    doc.text('Partida Presupuestal', 132, 94);
    doc.rect(126, 90, 38, 6);
    doc.text('Importe', 171, 94);
    doc.rect(164, 90, 25, 6);
    //
    doc.text(
      'En caso de no cumplir con la rendición de cuentas dentro',
      25,
      229
    );
    doc.text('de los plazos definidos en la Directiva de Viáticos,', 25, 233);
    doc.text('AUTORIZO a la Institución, a retener el pago de mi', 25, 237);
    doc.text('remuneración u honorario, según corresponda , el monto', 25, 241);
    doc.text('del viático otorgado asumiendo adicionalmente los', 25, 245);
    doc.text(
      'intereses respectivos a que hubiere lugar, renunciando a',
      25,
      248.5
    );
    doc.text('cualquier reclamo posterior.', 25, 252.5);

    doc.rect(20, 224, 82, 30);

    doc.text('_________________________', 128, 245);
    doc.text('Rocio Edith Laurente Soriano', 130, 249);
    doc.text('DNI N°', 145, 252.5);
    doc.rect(102, 224, 82, 30);

    doc.text('_________________________', 40, 278);
    doc.text('FIRMA DE ADMINISTRACIÓN', 42, 282);
    doc.rect(20, 254, 82, 30);

    doc.text('_________________________', 128, 278);
    doc.text('FIRMA DE JEFE DE PROYECTO', 126, 282);
    doc.rect(102, 254, 83, 30);

    doc.save('a4.pdf');
  };
  return (
    <>
      <Button onClick={descarga}>Descargar PDF</Button>
    </>
  );
};

export default PDFSolicitud;
