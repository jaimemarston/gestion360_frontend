import { Button } from 'primereact/button';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useSelector } from 'react-redux';
import { fetchGet } from '../../../../api';
import { useEffect, useState } from 'react';



const PDFRendicionGastos = (countRendido) => {
  const [data3, setData] = useState();
  const [rendido, setRendido] = useState();
  const { rendicionGastos } = useSelector((state) => state.rendicionGastos);
 

  let proyecto;
  let lugar;
  let recibido; 
  fetchGet(`regProyecto/${rendicionGastos.proyecto}`).then((res) => {
    proyecto = res.registroProyecto.nombreAbreviado
     
  })
  fetchGet(`comision/${rendicionGastos?.lugarComision}`).then((res) => {

    lugar = rendicionGastos.lugarComision
  } )

  if(isNaN(Number(rendicionGastos.recibido ))){
    console.log('si')
    recibido = Number(0).toFixed(2);
  }else {
    console.log('no')
    recibido = Number(rendicionGastos.recibido).toFixed(2);
  }

  useEffect(() => {


   

    async function doIt(){

      const data = await fetchGet(`rendGastosProduct/${rendicionGastos?.id}`)


   

    const newData =  data?.rendicionGastosProduct?.map(async (arr) => {

     const tipo =  await fetchGet(`tipo-documento/${arr.tipo}`)

        const array = {
          
          id: arr.id,
          tipo: tipo.result.nombre,
          fecha: arr.fecha,
          numero: arr.numero,
          descripcion: arr.descripcion,
          actividad: arr.partidaPresupuestal,
          importe: arr.importe
        }

        return array
      })




      Promise.all(newData).then((data) => {
        setData(data);
      });

      const totalImporte = newData.reduce((total, item) => total + Number(item.importe), 0);
      setRendido(Number(totalImporte).toFixed(2))
      console.log(totalImporte,'pidpjd')
    
    }

    doIt();



  }, [rendicionGastos])

  

  
  const descarga = () => {

    const data = [];
   
    const arr = [rendicionGastos]
    arr.map((item, index) => {
      const data1 = [
        `${index + 1}`,
        `${item.tipo}`,
        `${item.serie}`,
        `${item.numero}`,
        // `${item.ruc}`,
        `${item.descripcion}`,
        `${item.partidaPresupuestal}`,
        `${item.importe}`,
      ];
      data.push(data1);
    });

    const suma = arr
      .map((item) => {
        let variable = Number(item.importe);
        return variable;
      })
      .reduce((prev, curr) => prev + curr, 0);

    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.setDrawColor(195, 195, 195);
    doc.rect(20, 15, 118, 10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'bold');
    doc.text('RENDICIÓN DE GASTOS', 70, 21.5);

    doc.setFontSize(9);
    doc.rect(138, 15, 51, 10);
    doc.text(`FORMATO - ${rendicionGastos.numeroRendicion}`, 149, 21.5);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('INSTITUCIÓN: descocentro', 140, 32);

    doc.rect(20, 36, 169, 6);
    doc.text(`Nombres y Apellidos: ${rendicionGastos.nombreApellido}`, 25, 40);

    doc.rect(20, 42, 169, 6);
    doc.text(`Proyecto: ${proyecto}`, 25, 46);

    doc.rect(20, 47.95, 169, 6);
    doc.text(`Lugar de comisión: ${lugar} `, 25, 52);

    doc.rect(20, 53.9, 169, 6);
    doc.text(
      `Objeto de la comisión: ${rendicionGastos.objetoComision}`,
      25,
      58
    );

    doc.rect(20, 60, 169, 6);
    doc.text(
      `Fecha  Inicio: ${rendicionGastos.fechaInicio.split('T')[0]}`,
      25,
      64
    );
    doc.text(`Termino: ${rendicionGastos.fechaFin.split('T')[0]}`, 120, 64);

    doc.rect(20, 66, 169, 11);
    doc.text('Resumen de la rendición de cuentas', 25, 70);
    doc.text(`RECIBIDO: $/ ${recibido}`, 25, 75);
    doc.text(`RENDIDO: $/ ${countRendido.rendidoCount.toFixed(2)}`, 90, 75);
    doc.text(
      `SALDO: $/ ${( Number(recibido) + Number(countRendido.rendidoCount)).toFixed(2)}`,
      150,
      75
    );

    doc.rect(20, 77, 169, 11);
    doc.text(
      'RELACIÓN DETALLADA DE LOS DOCUMENTOS RENDIDOS (Detallar por separado cada gasto de hospedaje, alimentación,',
      25,
      81
    );
    doc.text('movilidad local, pasajes y gastos de transporte, otros)', 25, 85);
    //

    doc.text('Id', 25, 97);
    doc.rect(20, 90, 13, 12);

    doc.text('Documento', 52, 94);
    doc.rect(33, 90, 53, 6);

    doc.text('Tipo', 37, 100);
    doc.rect(33, 96, 18, 6);

    doc.text('Fecha', 57, 100);
    doc.rect(51, 96, 18, 6);

    doc.text('Numero', 72, 100);
    doc.rect(69, 96, 17, 6);

    doc.text('Descripción', 106, 97);
    doc.rect(86, 90, 53, 12);

    doc.text('Actividad', 146, 97);
    doc.rect(139, 90, 25, 12);

    doc.text('Importe', 171, 97);
    doc.rect(164, 90, 25, 12);
    //
    autoTable(doc, {
      styles: { fontSize: 8, width: 50 },
      columnStyles: {
        0: { halign: 'center', cellWidth: 13 },
        1: { halign: 'center', cellWidth: 18 },
        2: { halign: 'center', cellWidth: 18 },
        3: { halign: 'center', cellWidth: 17 },
        4: { halign: 'center', cellWidth: 53 },
        5: { halign: 'center', cellWidth: 25.1 },
        6: { halign: 'center', cellWidth: 25.1 },
      },
      body: data3,
      startY: 102,
      margin: 20,
    });
    //

    doc.text('_________________________', 40, 278);
    doc.text('FIRMA DE COMISIONADO/A', 42, 282);
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

export default PDFRendicionGastos;
