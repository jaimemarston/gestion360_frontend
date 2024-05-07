import React, {useState, useEffect, useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MegaMenu } from 'primereact/megamenu';
import {  useSelector } from 'react-redux';
import {
  stateMenu,
  stateMenuMain,
  
} from '../../../../../store/slices/solicitud/MenuRRHHSlice';
import { getUser } from "../../../../../utils/getUser";
import { InputSwitch } from 'primereact/inputswitch';
import { useDispatch } from 'react-redux'
export default function AppTopbar({isOpen, setMenuIsOpen, setIsDarkMode}) {
  const dispatch = useDispatch();
   const navigate = useNavigate();
  const { estado } = useSelector((state) => {
    return state.menuRRHH;
  });


  const [dataUser, setDataUser] = useState();
  const [menuState, setMenuState] = useState(false);
  const [value, setValue] = useState(false);

  useEffect( () =>  {
    async function doIt(){

      const userData = await getUser();
      
      setDataUser(userData);

    
    }

    doIt();

  }, [])


  const switchFondo = () => {
     setIsDarkMode(!value)
    setValue( !value);
   
    console.log(value)
  };

  const handleClick = () => {
    dispatch(stateMenu());
    // navigate('/FyA');
  };
  const handleClickMain = () => {
    dispatch(stateMenuMain());
  };


  const megaMenuaddUser = [
    {
      label: <i className='pi pi-cog' />,
      items: [
        [
          {
            label: 'Solicitud rendiciones',
            items:[
              {
                label: 'Registro de Usuarios',
                icon: 'pi pi-fw pi-user',
                to: '/Dashboard',
                command: () => {
                  navigate('/registro-usuario');
                },
              },
              {
                label: 'Registro de Empleados',
                icon: 'pi pi-fw pi-user',
                to: '/Dashboard',
                command: () => {
                  navigate('/registro-empleado');
                },
              },
            ],
          },
        ],
      ],
    },
  ];

  const megaMenulogout = [
    {
      label: <i className='pi pi-user' />,
      items: [
        [
          {
            label: '',
            items:[
              {
                label: 'Cerrar sesion',
                icon: 'pi pi-sign-out',
                to: '/Dashboard',
                command: () => {
                  localStorage.removeItem('token');
                  navigate('/')
                },
              },
            ],
          },
        ],
      ],
      
      
    },
    
  ];


  const megamenuItems = [
    {
      label: 'Solicitudes',
      items: [
        [
          {
            label: 'Solicitudes',
            items: [
              {
                label: 'RR.HH',
                className: 'disabled',
                command: () => {
                  handleClick();
                },
              },
            ],
          },
        ],
      ],
    },
  ];
  

  const megaMenuMain = [
    {
      label: 'RR.HH',
      items: [
        [
          {
            label: 'RR.HH ',
            items: [
              {
                label: 'Solicitudes',
                command: () => {
                  handleClickMain();
                },
              },
            ],
          },
        ],
      ],
    },
  ];

  const handleMenu = ()=> (
    setMenuIsOpen(!isOpen)
  )


  return (
    <div   className={value ?  'dark-mode layout-topbar ' : 'layout-topbar'  }  >
      
      <Link to='/Dashboard' className='layout-topbar-logo'>
        <img style={{height: 40}} src="../../../../../public/logo.png" alt="logo" />
      </Link>
      
      <button 
        onClick={handleMenu}
        type='button'
        className='p-link layout-menu-button layout-topbar-button'
      >
        <i className='pi pi-bars' />
      </button>
      
      <button
        type='button'
        className='p-link layout-topbar-menu-button layout-topbar-button'
      >
        <i className='pi pi-ellipsis-v' />
      </button>
      
      <ul className='layout-topbar-menu lg:flex origin-top'>
        <li className='mr-5'>
        <InputSwitch checked={value} onChange={(e) => switchFondo()} />
        </li>
{/*       <li className='mr-5'>
    
        {dataUser?.rol == "ADMIN_ROLE"  ? (
            !estado ? (
            
              <MegaMenu className={value ?  'dark-mode-button' : ''  } model={megamenuItems} />
            ) : (
              <MegaMenu className={value ?  'dark-mode-button' : ''  } model={megaMenuMain} />
            )
          ) : (
            ''
          )}
       
 
        </li> */}

        <li className='mr-5'>  
        {dataUser?.rol == "ADMIN_ROLE"  ? (
            <MegaMenu className={value ?  'dark-mode-button' : ''  } model={megaMenuaddUser} /> 
          ) : (
            ''
          )}
         
            
        </li>
      
        <li className='mr-5'>     
            <MegaMenu className={value ?  'dark-mode-button' : ''  } model={megaMenulogout} /> 
        </li>
      </ul>
    </div>
  );
}
