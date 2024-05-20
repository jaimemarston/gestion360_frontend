/* import React, { useState, useEffect, useRef } from "react";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { fetchSearchUser } from "../../../../api/api";
import { getUser } from "../../../../utils/getUser";




const lineData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "First Dataset",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: "#2f4860",
      borderColor: "#2f4860",
      tension: 0.4,
    },
    {
      label: "Second Dataset",
      data: [28, 48, 40, 19, 86, 27, 90],
      fill: false,
      backgroundColor: "#00bb7e",
      borderColor: "#00bb7e",
      tension: 0.4,
    },
  ],
};

export default function Dashboard() {

  const [dataUser, setDataUser] = useState();

  useEffect( () =>  {
    async function doIt(){

      const userData = await getUser();
      
      setDataUser(userData);

    
    }

    doIt();

  }, [])
 
  

  const menu2 = useRef(null);
  const [lineOptions, setLineOptions] = useState(null);

  const applyLightTheme = () => {
    const lineOptions = {
      plugins: {
        legend: {
          labels: {
            color: "#495057",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
      },
    };

    setLineOptions(lineOptions);
  };

  const applyDarkTheme = () => {
    const lineOptions = {
      plugins: {
        legend: {
          labels: {
            color: "#ebedef",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#ebedef",
          },
          grid: {
            color: "rgba(160, 167, 181, .3)",
          },
        },
        y: {
          ticks: {
            color: "#ebedef",
          },
          grid: {
            color: "rgba(160, 167, 181, .3)",
          },
        },
      },
    };

    setLineOptions(lineOptions);
  };


  return (
    <div className="grid  crud-demo">
      <div className="col-12 lg:col-6 xl:col-3">
        <div name="bienvenida" className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3 ah">
                  Bienvenido
              </span>
              <div className="d-flex">
              <div className="text-900 font-medium text-xl mr-2">{dataUser?.nombre}</div>
              <div className="text-900 font-medium text-xl">{dataUser?.apellido}</div>
              </div>
              <span className="text-500 ">{dataUser?.email}</span>

            </div>
            <div
              className="flex align-items-center justify-content-center bg-red-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-user text-red-500 text-xl" />
            </div>
          </div>
        </div>
        <div  className="card mb-0 mt-5">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                Avalúos Aprobados
              </span>
              <div className="text-900 font-medium text-xl">152</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-blue-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-shopping-cart text-blue-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">24 new </span>
          <span className="text-500">since last visit</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                Avalúos Pendientes{" "}
              </span>
              <div className="text-900 font-medium text-xl">30</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-orange-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-map-marker text-orange-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">%52+ </span>
          <span className="text-500">since last week</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                Avalúos Registrados
              </span>
              <div className="text-900 font-medium text-xl">28441</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-cyan-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-inbox text-cyan-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">520 </span>
          <span className="text-500">newly registered</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                Informes en Total registrados
              </span>
              <div className="text-900 font-medium text-xl">152 Unread</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-purple-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-comment text-purple-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">85 </span>
          <span className="text-500">responded</span>
        </div>
      </div>

      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>Avalúos Aprobados vs Pendientes</h5>
          <Chart type="bar" data={lineData} options={lineOptions} />
        </div>
      </div>
      <div className="col-12 xl:col-6">
        <div className="card">
          <div className="flex align-items-center justify-content-between mb-4">
            <h5>Mensajes  </h5>
            <div>
              <Button
                type="button"
                icon="pi pi-ellipsis-v"
                className="p-button-rounded p-button-text p-button-plain"
                onClick={(event) => menu2.current.toggle(event)}
              />
              <Menu
                ref={menu2}
                popup
                model={[
                  { label: "Add New", icon: "pi pi-fw pi-plus" },
                  { label: "Remove", icon: "pi pi-fw pi-minus" },
                ]}
              />
            </div>
          </div>

          <span className="block text-600 font-medium mb-3">Hoy</span>
          <ul className="p-0 mx-0 mt-0 mb-4 list-none">
            <li className="flex align-items-center py-2 border-bottom-1 surface-border">
              <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                <i className="pi pi-dollar text-xl text-blue-500" />
              </div>
              <span className="text-900 line-height-3">
                Experto
                <span className="text-700"> Aprobo Avalúo N° :23465</span>
              </span>
            </li>
            <li className="flex align-items-center py-2">
              <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                <i className="pi pi-download text-xl text-orange-500" />
              </div>
              <span className="text-700 line-height-3">
                Your request for withdrawal of{" "}
                <span className="text-blue-500 font-medium">2500$</span> has
                been initiated.
              </span>
            </li>
          </ul>

          <span className="block text-600 font-medium mb-3">Ayer</span>
          <ul className="p-0 m-0 list-none">
            <li className="flex align-items-center py-2 border-bottom-1 surface-border">
              <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                <i className="pi pi-dollar text-xl text-blue-500" />
              </div>
              <span className="text-900 line-height-3">
                Keyser Wick
                <span className="text-700">
                  {" "}
                  has purchased a black jacket for{" "}
                  <span className="text-blue-500">59$</span>
                </span>
              </span>
            </li>
            <li className="flex align-items-center py-2 border-bottom-1 surface-border">
              <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0">
                <i className="pi pi-question text-xl text-pink-500" />
              </div>
              <span className="text-900 line-height-3">
                Jane Davis
                <span className="text-700">
                  {" "}
                  has posted a new questions about your product.
                </span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} */

import React, { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';

import { getUser } from "../../../../utils/getUser";
import { Toast } from 'primereact/toast';
import { Image } from 'primereact/image';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { fetchPut } from '../../../../api';


const MisDatos = ({isDarkMode}) => {
/*   let empty = {
    codigo: '',
    nombre: null,
    email: '',
    ndocumento: '',
    rol: '',
    estado: 'ACTIVO',
  }; */

/*   const Urluploading = mainUrl + '/uploadimg'; */

const { VITE_API_URL }  = import.meta.env;

const mainUrlmin = VITE_API_URL.slice(0, -4);
const [dataUser, setDataUser] = useState();
console.log(mainUrlmin, 'firma')

  async function doIt(){

    const userData = await getUser();
    
    setDataUser(userData);

  
  }
useEffect( () =>  {

  doIt();

}, [])



  const toast = useRef(null);
  const [viewImage, setViewImage] = useState(null);
  const [viewFoto, setViewFoto] = useState(null);
  const [value3, setValue3] = useState('');

/*   const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...products };
    _product[`${name}`] = val;

    setProducts(_product);
  }; */
  const fileUploadRef = useRef(null);
  const onUpload = async  ({ files }) => {

  

    const fileExtension = files[0].name.split('.').pop().toLowerCase();
    if (fileExtension === 'jpg') {
      console.log('Archivo válido, se puede subir:', files[0].name);
      // Lógica adicional para onUpload...
     
    } else {
      console.log('Formato de archivo no válido. Se requiere una imagen .jpg.');
      // Lógica adicional para el caso de archivo no válido...
    }


        const userData = await getUser();

       console.log(userData)
        
        setDataUser(userData);
    
      
      
/*     setViewImage(files[0].objectURL);
    viewPerfil(); */
  };

  var usuario_nombre = localStorage.getItem('nombre');
  var usuario_codigo = localStorage.getItem('codigo');
  var usuario_correo = localStorage.getItem('correo');
  var usuario_ndocumento = localStorage.getItem('ndocumento');
  /* const firma = `firma_${usuario_codigo}.jpg`; */

/*   const str = mainUrl;
  const mainUrlmin = str.slice(0, -4);
 */
  const viewPerfil = async () => {
/*     const response = await axios.get(
      `${mainUrlmin}/api/imagePerson/firma_${usuario_ndocumento}`
    ); */

   /*  const result = await response.data; */

   
  };
  // console.log(viewFoto);
  const handleUpdatePassword = async () => {
    const data = {
      id: dataUser?.id,
      correo: dataUser?.email,
      password: value3,
    };

    if (data.password.length === 0) {
      toast.current.show({
        severity: 'warn',
        summary: 'Hubo un error',
        detail: 'El campo no debe estar vació',
        life: 3000,
      });
    } else {

      const res = await fetchPut('updatePassword', 'PUT', data)
     /*  const res = await axios.put(`${mainUrl}/updatePassword`, data); */
     
        toast.current.show({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'La contraseña se ha cambiado',
          life: 3000,
        });
      
    }
  };
  useEffect(() => {
    viewPerfil();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [firmaUrl, setFirmaUrl] = useState(null);

  const getFirmaUrl = async () => {
    console.log('GETTING FIRMA URL')
    const res = await fetch(`${mainUrlmin}/api/minio/get-file-url/firmas/${dataUser?.imgfirma}.jpg`)
    const { url } = await res.json()
    console.log(url, 'url - ELVIS')
    setFirmaUrl(url);

    // const response = await fetch(url); // reemplaza con la ruta correcta
    // const arraybuffer = await response.arraybuffer();
    // const blob = new blob([arraybuffer], { type: 'application/pdf' });
    // const urlpdf = url.createobjecturl(blob);
  }

  useEffect(() => {
    console.log('ELVIS FIRST USE EFFECT');
    getFirmaUrl()
  },[dataUser])

  return (
    <div className={isDarkMode ?  'dark-mode card p-fluid' : 'card p-fluid'  } >
      <Toast ref={toast}></Toast>
      <h5>Mis Datos</h5>

      <div className='field'>
        <label htmlFor='ndocumento'>DNI</label>
        <InputText disabled id='ndocumento' value={dataUser?.dni}  />
      </div>
      <div className='field'>
        <label htmlFor='nombre'>Nombre</label>
        <InputText disabled id='nombre' value={dataUser?.nombre} />
      </div>
      <div className='field'>
        <label htmlFor='email'>Correo</label>
        <InputText disabled id='email' value={dataUser?.email} />
      </div>
      {/* <div className='field'>
        <label>Repetir contraseña</label>
        <Password
          value={value3}
          onChange={(e) => setValue3(e.target.value)}
          toggleMask
        />
      </div> */}
      <div className='field'>
        <label>Nueva contraseña</label>
        <Password
          value={value3}
          onChange={(e) => setValue3(e.target.value)}
         
          required
        />
        <Button
          label='Cambiar contraseña'
          onClick={handleUpdatePassword}
          style={{
            width: '200px',
            margin: ' 10px 0px',
            // display: 'block',
            // left: '80%',
            // alignItems: 'flex-end',
            // justifyContent: 'flex-end',
          }}
        />
      </div>
      <div className={isDarkMode ?  'dark-mode card ' : 'card '  }>
        <h5>
          Seleccionar Firma{' '}
          <span
            style={{ fontSize: '13px', color: '#939393', fontWeight: '300' }}
          >
            (Formato *.jpg / Tamaño maximo 500px)
          </span>
        </h5>
        <FileUpload
        ref={fileUploadRef}
          name='image'
           url={`${mainUrlmin}/api/subir_firma/${dataUser?.dni}`} 
          accept='.jpg'
          onUpload={onUpload}
          maxFileSize={1000000}
        />
        <br />
        <center>
          {dataUser?.imgfirma === null ? (
            ''
          ) : dataUser?.imgfirma  === null ? (
            <Image
               width='80px'
               height='100px'
               src={firmaUrl} 

            ></Image>
          ) : (
            <Image src={firmaUrl}></Image>
          )}
        </center>
      </div>
    </div>
  );
};

export  {MisDatos};
