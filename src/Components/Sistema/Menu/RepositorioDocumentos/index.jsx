
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { fetchDelete, fetchGet, createFormData, VITE_API_URL, fetchPut } from '../../../../api';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import "./style.scss";
import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { parse, isValid, startOfDay, endOfDay } from 'date-fns';
import JSZip from 'jszip';

const RegistroDocumentos = ({ isDarkMode }) => {

  const mainUrlmin = VITE_API_URL;
  const toast = useRef(null);
  const [spinner, setSpinner] = useState(false)
  const [products, setProducts] = useState([]);
  const [view] = useState(false);
  const [expandedRows, setExpandedRows] = useState(null);
  const [list, setList] = useState({ download: '', href: '' });
  const [, setPosition] = useState('center');
  const [displayBasic, setDisplayBasic] = useState(false);
  const [product, setProduct] = useState({});
  const [selectedDocuments, setSelectedDocuments] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [globalFilter1] = useState(null);
  const [isCloseModal, setIsCloseModal] = useState(false);
  const [lista, setLista] = useState(null);

  const [viewFirmados, setViewFirmados] = useState(false);

  const [selectedCity1, setSelectedCity1] = useState({ name: 'activo' });

  const [ballotFilterStatus, setBallotFilterStatus] = useState('todos');
  const [deleteId, setDeleteId] = useState([]);
  const dt = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Rangos de fecha para acotar los documentos listados.
  const [envioDesde, setEnvioDesde] = useState(null);
  const [envioHasta, setEnvioHasta] = useState(null);
  const [firmaDesde, setFirmaDesde] = useState(null);
  const [firmaHasta, setFirmaHasta] = useState(null);

  const hayFiltroFechas = Boolean(envioDesde || envioHasta || firmaDesde || firmaHasta);

  const [descargandoZip, setDescargandoZip] = useState(false);

  const limpiarRangos = () => {
    setEnvioDesde(null);
    setEnvioHasta(null);
    setFirmaDesde(null);
    setFirmaHasta(null);
  };

  // El API devuelve fechaenvio/fechafirma como texto 'dd-MM-yyyy' (fechafirma es
  // null mientras el documento no esta firmado).
  const parseFechaDoc = (valor) => {
    if (!valor) return null;
    const fecha = parse(valor, 'dd-MM-yyyy', new Date());
    return isValid(fecha) ? fecha : null;
  };

  const dentroDeRango = (valor, desde, hasta) => {
    if (!desde && !hasta) return true;
    const fecha = parseFechaDoc(valor);
    if (!fecha) return false;
    if (desde && fecha < startOfDay(desde)) return false;
    if (hasta && fecha > endOfDay(hasta)) return false;
    return true;
  };

  const listarDatosState = async () => {
    const documentSelected = ballotFilterStatus !== 'todos'? ballotFilterStatus.split('-')[0]  : ballotFilterStatus;
    const firmedStatus = ballotFilterStatus !== 'todos' ? ballotFilterStatus.split('-')[1]  : ballotFilterStatus;
    const response = await fetchGet(`empleadosState/${selectedCity1?.name}?documentsFilter=${documentSelected}&firmedStatus=${firmedStatus}`)
    setProducts(response.registroEmpleados);
  };

  const conditionNoContent = selectedCity1 !== "" ;

  useEffect(() => {
    listarDatosState();
  }, [conditionNoContent, selectedCity1, ballotFilterStatus]);

  const dialogFuncMap = {
    displayBasic: setDisplayBasic,
  };

  const rightToolbarTemplate = () => {
    const confirmImport = (name, position) => {
      dialogFuncMap[`${name}`](true);

      if (position) {
        setPosition(position);
      }
    };
    const onHide = (name) => {
      dialogFuncMap[`${name}`](false);
      setSelectedFiles([])
    };

    const renderFooter = (name) => {
      return (
        <div>
          <Button label="Cerrar" icon="pi pi-check" onClick={() => onHide(name)} className="p-button-text" />
        </div>
      );
    };

    const confirmImportFirmado = () => {
      setViewFirmados(true);
    };

    const customBase64Uploader = (e) => {
      setSpinner(true)
      let formData = new FormData();

      const formattedDate = selectedDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-');

      e.files.map((e) => formData.append('file', e));
      formData.append('date', formattedDate);

      createFormData(`regdocAddAll`,
        'POST',
        formData,
      ).then((res) => {
        setSelectedFiles([])
        setSpinner(false)
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Documento Subido',
          life: 3000,
        });

        listarDatos();
      })
        .catch((error) => {
          console.log(error);
        });
    };

    const customBaseUploader = (e) => {
      setSpinner(true)
      let formData = new FormData();

      const formattedDate = selectedDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-');

      e.files.map((e) => formData.append('file', e));

      formData.append('date', formattedDate);
      createFormData(`regdocfirmAddAll`,
        'POST',
        formData,
      ).then((res) => {
        setSpinner(false)
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Documento Subido',
          life: 3000,
        });
        listarDatos();
      })
        .catch((error) => {
          console.log(error);
        });
    };

    const onFileSelect = (e) => {
      const value = [...e.files];
      setSelectedFiles([...e.files]);
    };

    const onFileRemove = (e) => {
      setSelectedFiles((prevFiles) => prevFiles.filter(file => file !== e.file));
    };

    return (
      <div className={isDarkMode ? 'dark-mode-table grid crud-demo' : 'grid crud-demo'} >
        <Button
          label='Importar Documentos'
          icon='pi pi-upload'
          className='p-button-help'
          onClick={() => confirmImport('displayBasic')}
        />
        <Button
          label='Importar Documentos Firmados'
          icon='pi pi-upload'
          className='p-button-help'
          style={{ marginLeft: '10px' }}
          onClick={() => confirmImportFirmado()}
        />
        <Dialog
          header='Importacion de Documentos'
          visible={displayBasic}
          style={{ width: '50vw' }}
          footer={renderFooter('displayBasic')}
          onHide={() => onHide('displayBasic')}
        >
          <p>Seleccione el o los archivos a Importar en Formato PDF</p>
          <div className='card'>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
              label="Fecha del documento"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              format="dd/MM/yyyy"
            />
          </LocalizationProvider>
            <h5>Seleccionar Archivos</h5>
            <FileUpload
              multiple
              chooseLabel='Subir'
              uploadLabel='Cargar'
              cancelLabel='Cancelar'
              name='image'
              accept='pdf/*'
              customUpload
              uploadHandler={customBase64Uploader}
              maxFileSize={1000000}
              onSelect={onFileSelect}
              onRemove={onFileRemove}
            />
            <p className='mt-3'>Cantidad de archivos seleccionados: {selectedFiles ? selectedFiles.length : ""}</p>
          </div>
        </Dialog>

        <Dialog
          header='Importacion de Documentos Firmados'
          visible={viewFirmados}
          style={{ width: '50vw' }}
          onHide={() => { setViewFirmados(false), setSelectedFiles([]) }}
        >
          <p>Seleccione archivos a Importar en Formato PDF</p>
          <div className='card'>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Fecha del documento"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                format="dd/MM/yyyy"
              />
            </LocalizationProvider>
            <h5>Seleccionar Archivos</h5>
            <FileUpload
              multiple
              chooseLabel='Subir'
              uploadLabel='Cargar'
              cancelLabel='Cancelar'
              name='image'
              accept='pdf/*'
              customUpload

              uploadHandler={customBaseUploader}
              maxFileSize={1000000}
              onSelect={onFileSelect}
              onRemove={onFileRemove}
            />
            <p className='mt-3'>Cantidad de archivos seleccionados: {selectedFiles ? selectedFiles.length : ""}</p>
          </div>
        </Dialog>
      </div>
    );
  };

  const statusOrderBodyTemplate = (rowData) => {
    return (
      <span
        className={`order-badge order-${rowData.estado ? 'activo' : 'cesado'}`}
      >
        {rowData.estado ? 'Activo' : 'Inactivo'}
      </span>
    );
  };

  const statusOrderBody = (rowData) => {
    let status;
    let backgroundColor;
  
    if (rowData.tipodoc === 'Boleta' || rowData.tipodoc === 'Cts') {
      status = rowData.estado === true ? 'Firmado' : 'Pendiente';
      backgroundColor = rowData.estado === true ? '#8ff484' : '#f4d484';
    } else {
      status = rowData.certified === true ? 'Certificado' : 'Pendiente';
      backgroundColor = rowData.certified === true ? '#8ff484' : '#f4d484';
    }
  
    return (
      <span
        className={`order-badge`}
        style={{ backgroundColor: backgroundColor, fontWeight: '500' }}
      >
        {status}
      </span>
    );
  };

  const editProduct = (product) => {

    localStorage.setItem('pdfdetalle', JSON.stringify(product));
  };

  const certifyDocument = (element) => {
    fetchPut(`regDoc/certify/${element.id}`, 'PUT', {}).then(({ message, success }) => {
      if (!success) {
        toast.current.show({
          severity: 'warn',
          summary: 'No se pudo certificar el documento',
        });
      } else {
        toast.current.show({
          severity: 'success',
          summary: 'Certificado',
          detail: message,
        });
        listarDatosState();
      }
    });
  }

  const actionBodyTemplate = (rowData) => {
      return (
        <div className='actions'>
          <a
            icon='pi pi-user-edit'
            href='/viewpdf'
            target='_blank'
            onClick={() => editProduct(rowData)}
          >
            Ver
          </a>
        </div>
      );
  };

  const confirmDeleteDocuments = (product) => {
    setIsCloseModal(true);
    setProduct(product);
  };

  const deleteBodyTemplate = (rowData) => {
    return (
      <div className='actions'>
        <Button
          icon='pi pi-trash'
          onClick={() => confirmDeleteDocuments(rowData)}
        />
      </div>
    );
  };



  const obtenerId = (e) => {
    setSelectedDocuments(e.value);
    let data;
    data = e.value.map((item) => item.id);
    setDeleteId(data);
  };

  const deleteAll = () => {
    fetchDelete('DELETE', deleteId)
      .then((response) => {
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Documentos Eliminados',
          life: 3000,
        });
        setSelectedDocuments(null);
        setDeleteId([]);
        listarDatos();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchdownload = async (method = '', data) => {
    const response = await fetch(`${VITE_API_URL}/descargar-por-id`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  };

  const getAll = () => {
    fetchdownload('POST', deleteId)
      .then(async (response) => {
        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = blobUrl;
          a.download = 'documentos.zip'; // Nombre del archivo ZIP
          document.body.appendChild(a);

          a.click();
          URL.revokeObjectURL(blobUrl);

          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Documentos descargado',
            life: 3000,
          });
        } else {
          throw new Error('No se pudo descargar el archivo')
        }

      })
      .catch((error) => {
        toast.current.show({
          severity: 'error',
          summary: '',
          detail: 'Error al generar la descarga',
          life: 3000,
        });
        console.log(error);
      });
  };
  const rowExpansionTemplate = (data) => {
    localStorage.setItem('visor', JSON.stringify(data));

    return (
      <div className='orders-subtable'>
        <h5>Detalle de Documentos para: {data.nombre}</h5>
        <DataTable
          ref={dt}
          value={data.registroDocumentos}
          selection={selectedDocuments}
          onSelectionChange={(e, index) => obtenerId(e, index)}
          dataKey='id'
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          className='datatable-responsive'
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Mostrando {first} a {last} de {totalRecords}'
          globalFilter={globalFilter1}
          emptyMessage='No Data found.'
          responsiveLayout='scroll'
        >
          <Column
            selectionMode='multiple'
            headerStyle={{ width: '3rem' }}
          ></Column>
          <Column field='id' header='Id' sortable></Column>
          <Column
            field='tipodoc'
            header='TipoDocumento'
            filter
            filterPlaceholder='Buscar Por Tipo de Documento'
            sortable
          ></Column>
          <Column
            field='nombredoc'
            header='Documento'
            filter
            filterPlaceholder='Buscar Fecha de Firmado'
            sortable
          ></Column>
          <Column
            field='fechaenvio'
            header='Fecha Envio'
            filter
            filterPlaceholder='Buscar fecha de envio'
            sortable
          ></Column>
          <Column
            field='fechafirma'
            header='Fecha Firma'
            filter
            filterPlaceholder='Buscar Fecha de Firmado'
            sortable
          ></Column>
          <Column
            field='status'
            header='Status'
            body={statusOrderBody}
            sortable
          ></Column>
          <Column
            headerStyle={{ width: '2rem' }}
            body={actionBodyTemplate}
          ></Column>
          <Column
            headerStyle={{ width: '2rem' }}
            body={deleteBodyTemplate}
          ></Column>
        </DataTable>
      </div>
    );
  };

  const cities = [{ name: 'todos' }, { name: 'activo' }, { name: 'inactivo' }];
  const onCityChange = (e) => {
    setSelectedCity1(e.value);
  };
  const getDownload = () => {
    console.log('click');
  };

  const tickets = [
    { name: 'Boletas firmadas', value: 'Boleta-true' },
    { name: 'Boletas sin firmar', value: 'Boleta-false' },
    { name: 'Cts firmados', value: "Cts-true" },
    { name: 'Cts sin firmar', value: "Cts-false" },
    { name: 'Todos', value: "todos" }
  ];

  const onChange = (e) => {
    setBallotFilterStatus(e.target.value);
  };

  const productosFiltrados = useMemo(() => {
    if (!products) return products;
    if (!hayFiltroFechas) return products;

    return products
      .map((empleado) => ({
        ...empleado,
        registroDocumentos: (empleado.registroDocumentos || []).filter(
          (doc) =>
            dentroDeRango(doc.fechaenvio, envioDesde, envioHasta) &&
            dentroDeRango(doc.fechafirma, firmaDesde, firmaHasta)
        ),
      }))
      .filter((empleado) => empleado.registroDocumentos.length > 0);
  }, [products, hayFiltroFechas, envioDesde, envioHasta, firmaDesde, firmaHasta]);

  // Boleta y Cts se consideran firmadas por `estado`; el resto de tipos usa
  // `certified` y no tiene una version firmada en S3.
  const esFirmado = (doc) =>
    (doc.tipodoc === 'Boleta' || doc.tipodoc === 'Cts') && doc.estado === true;

  const documentosFirmadosVisibles = useMemo(
    () =>
      (productosFiltrados || []).flatMap((empleado) =>
        (empleado.registroDocumentos || []).filter(esFirmado)
      ),
    [productosFiltrados]
  );

  const descargarFirmadosZip = async () => {
    if (documentosFirmadosVisibles.length === 0) return;

    setDescargandoZip(true);
    const zip = new JSZip();
    const nombresUsados = new Set();
    let fallidos = 0;

    try {
      // En tandas para no abrir cientos de peticiones a S3 a la vez.
      const TAMANO_TANDA = 5;
      for (let i = 0; i < documentosFirmadosVisibles.length; i += TAMANO_TANDA) {
        const tanda = documentosFirmadosVisibles.slice(i, i + TAMANO_TANDA);

        await Promise.all(
          tanda.map(async (doc) => {
            try {
              const respuestaUrl = await fetch(
                `${mainUrlmin}/minio/get-file-url/documents/firmado_${doc.nombredoc}`
              );
              if (!respuestaUrl.ok) throw new Error('No se pudo obtener la URL del documento');

              const { url } = await respuestaUrl.json();
              const archivo = await fetch(url);
              if (!archivo.ok) throw new Error(`S3 respondio ${archivo.status}`);

              let nombre = `firmado_${doc.nombredoc}`;
              if (nombresUsados.has(nombre)) nombre = `${doc.id}_${nombre}`;
              nombresUsados.add(nombre);

              zip.file(nombre, await archivo.blob());
            } catch (error) {
              fallidos += 1;
              console.error(`Error al descargar el documento ${doc.id}:`, error);
            }
          })
        );
      }

      if (nombresUsados.size === 0) {
        toast.current.show({
          severity: 'error',
          summary: 'No se descargo ningun documento',
          detail: 'No se pudo obtener ninguno de los PDF firmados',
          life: 4000,
        });
        return;
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const blobUrl = URL.createObjectURL(blob);
      const enlace = document.createElement('a');
      enlace.style.display = 'none';
      enlace.href = blobUrl;
      enlace.download = 'documentos_firmados.zip';
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      URL.revokeObjectURL(blobUrl);

      toast.current.show({
        severity: fallidos > 0 ? 'warn' : 'success',
        summary: 'Descarga generada',
        detail:
          fallidos > 0
            ? `${nombresUsados.size} documentos descargados, ${fallidos} fallaron`
            : `${nombresUsados.size} documentos firmados descargados`,
        life: 4000,
      });
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: 'error',
        summary: '',
        detail: 'Error al generar la descarga',
        life: 3000,
      });
    } finally {
      setDescargandoZip(false);
    }
  };

  const propsRangoFecha = {
    format: 'dd/MM/yyyy',
    slotProps: {
      textField: { size: 'small', sx: { width: 150 } },
      field: { clearable: true },
    },
  };

  const header = (
   <div className='flex flex-column' style={{ gap: '10px' }}>
    <div className='flex flex-column flex-md-row justify-content-md-between align-items-md-center'>
      <span className='block mt-2 mt-md-0 p-input-icon-left'>
        <i className='pi pi-search' />
        <InputText
          type='search'
          onInput={(e) => buscador(e)}
          placeholder='Buscar...'
        />
      </span>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {deleteId.length > 0 ? (
          <>
            <button
              style={{
                marginLeft: '10px',
                backgroundColor: '#fff',
                border: '1px solid #CFD5DB',
                borderRadius: '5px',
                cursor: ' pointer',
                padding: '3px 5px',
              }}
              onClick={deleteAll}
            >
              <span
                style={{
                  color: 'rgb(130, 130, 130)',
                  fontSize: '10px',
                }}
              >
                Eliminar bloque
              </span>
            </button>
            {!view ? (
              <button
                style={{
                  marginLeft: '10px',
                  backgroundColor: '#fff',
                  border: '1px solid #CFD5DB',
                  borderRadius: '5px',
                  cursor: ' pointer',
                  padding: '3px 5px',
                }}
                onClick={getAll}
              >
                <span
                  style={{
                    color: 'rgb(130, 130, 130)',
                    fontSize: '10px',
                  }}
                >
                  Generar descarga
                </span>
              </button>
            ) : (
              <a
                href={list.href}
                download={list.download}
                style={{
                  marginLeft: '10px',
                  backgroundColor: '#fff',
                  border: '1px solid #CFD5DB',
                  borderRadius: '5px',
                  cursor: ' pointer',
                  padding: '7px 5px',
                  color: 'rgb(130, 130, 130)',
                  fontSize: '10px !important',
                }}
                onClick={getDownload}
              >
                Descargar
              </a>
            )}
          </>
        ) : (
          ''
        )}
        <Dropdown
          id='ticket'
          value={ballotFilterStatus}
          options={tickets}
          onChange={onChange}
          optionLabel='name'
          placeholder='Seleccionar'
          style={{
            marginLeft: '10px',
          }}
        />
        <Dropdown
          id='state'
          value={selectedCity1}
          options={cities}
          onChange={onCityChange}
          optionLabel='name'
          placeholder='Seleccionar'
          style={{
            marginLeft: '10px',
          }}
        />
      </div>
    </div>

    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <div
        className='flex flex-wrap align-items-center'
        style={{ gap: '8px', rowGap: '10px' }}
      >
        <span style={{ fontSize: '13px', fontWeight: 600 }}>Fecha Envio:</span>
        <DatePicker
          label='Desde'
          value={envioDesde}
          onChange={(valor) => setEnvioDesde(valor)}
          maxDate={envioHasta || undefined}
          {...propsRangoFecha}
        />
        <DatePicker
          label='Hasta'
          value={envioHasta}
          onChange={(valor) => setEnvioHasta(valor)}
          minDate={envioDesde || undefined}
          {...propsRangoFecha}
        />

        <span style={{ fontSize: '13px', fontWeight: 600, marginLeft: '12px' }}>
          Fecha Firma:
        </span>
        <DatePicker
          label='Desde'
          value={firmaDesde}
          onChange={(valor) => setFirmaDesde(valor)}
          maxDate={firmaHasta || undefined}
          {...propsRangoFecha}
        />
        <DatePicker
          label='Hasta'
          value={firmaHasta}
          onChange={(valor) => setFirmaHasta(valor)}
          minDate={firmaDesde || undefined}
          {...propsRangoFecha}
        />

        {hayFiltroFechas ? (
          <Button
            label='Limpiar fechas'
            icon='pi pi-filter-slash'
            className='p-button-text p-button-sm'
            onClick={limpiarRangos}
          />
        ) : null}

        <Button
          label={
            descargandoZip
              ? 'Generando ZIP...'
              : `Descargar documentos firmados (${documentosFirmadosVisibles.length})`
          }
          icon={descargandoZip ? 'pi pi-spin pi-spinner' : 'pi pi-download'}
          className='p-button-sm'
          style={{ marginLeft: 'auto' }}
          disabled={descargandoZip || documentosFirmadosVisibles.length === 0}
          onClick={descargarFirmadosZip}
        />
      </div>
    </LocalizationProvider>
   </div>
  );
  const buscador = (data) => {
    setGlobalFilter(data.target.value);
  };

  const closeModal = () => {
    setIsCloseModal(!isCloseModal);
  };
  const eliminarDocumentos = () => {
    setIsCloseModal(false);
    fetchDelete(`regdoc/${product.id}`).then((res) => {
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Documento eliminado',
        life: 3000,
      });

      listarDatos();
    })
      .catch((error) => {
        console.log(error)
        toast.current.show({
          severity: 'error',
          summary: 'Successful',
          detail: 'Error al eliminar documento',
          life: 3000,
        });
      });
  };

  return (
    <>
      {spinner ? <div className="overlay">

        <ProgressSpinner style={{ zIndex: 1 }} />

      </div> : null}
      <div className={isDarkMode ? 'dark-mode-table grid table-demo' : 'grid table-demo'}  >
        <Toast ref={toast} />
        <div className='col-12'>
          <div className={isDarkMode ? 'dark-mode card' : 'card'} >
            <h5>Relacion de Empleados por Documentos</h5>
            <Toolbar className='mb-4' right={rightToolbarTemplate}></Toolbar>

            <DataTable
              value={productosFiltrados}
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              responsiveLayout='scroll'
              rowExpansionTemplate={rowExpansionTemplate}
              paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
              currentPageReportTemplate='Mostrando {first} a {last} de {totalRecords}'
              dataKey='id'
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              globalFilter={globalFilter}
              emptyMessage='No Data found.'
              header={header}
            >
              <Column expander style={{ width: '3em' }} />
              <Column field='codigo' header='Codigo' sortable />
              <Column field='nombre' header='Nombre' sortable />
              <Column field='ndocumento' header='Documento' sortable />
              <Column field='email' header='Email' sortable />
              <Column field='cargo' header='Cargo' sortable />
              <Column
                field='activo'
                header='Status'
                body={statusOrderBodyTemplate}
                showFilterMatchModes={false}
                sortable
              ></Column>
            </DataTable>
          </div>
        </div>
      </div>
      {isCloseModal &&
        EliminarDocumento({
          isCloseModal,
          closeModal,
          eliminarDocumentos,
        })}
    </>
  );
};

const EliminarDocumento = ({
  isCloseModal,
  closeModal,
  eliminarDocumentos,
}) => {
  const deleteDialogFooter = (
    <>
      <Button
        label='No'
        icon='pi pi-times'
        className='p-button-text'
        onClick={closeModal}
      />
      <Button
        label='Si'
        icon='pi pi-check'
        className='p-button-text'
        onClick={() => eliminarDocumentos()}
      />
    </>
  );

  return (
    <Dialog
      visible={isCloseModal}
      style={{ width: '450px' }}
      header='Confirmar'
      modal
      footer={deleteDialogFooter}
      onHide={closeModal}
    >
      <div className='flex align-items-center justify-content-center'>
        <i
          className='pi pi-exclamation-triangle mr-3'
          style={{ fontSize: '2rem' }}
        />
        <span>Desea eliminar documento?</span>
      </div>
    </Dialog>
  );
};

export default RegistroDocumentos