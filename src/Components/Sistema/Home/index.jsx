import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// import AppFooter from './Menu/AppFooter';
import AppMenu from './Menu/AppMenu';
import AppTopbar from './Menu/AppTopbar';
import { CSSTransition } from 'react-transition-group';
import './styles.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
export default function Home({setDarkMode}) {

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if(!token){

    Swal.fire({
      title: 'Error!',
      text: 'Necesitas Iniciar Session',
      icon: 'error',
      confirmButtonText: 'Ok'
    })

    
    navigate('/')
  }


  
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [openMenuActive, setOpenMenuActive] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState();

  setDarkMode(isDarkMode)

  return (
    <div>
      <AppTopbar isOpen={openMenuActive} setMenuIsOpen={setOpenMenuActive} setIsDarkMode={setIsDarkMode}/>
    { openMenuActive && <div className={isDarkMode ?  'dark-mode layout-sidebar' : 'layout-sidebar'  } >
        <AppMenu />
      </div>}

      { !openMenuActive && <div  className={isDarkMode ?  'dark-mode layout-sidebar layout-expand' : 'layout-sidebar layout-expand'  } >
        <AppMenu />
      </div>}

   { openMenuActive &&  <div className='layout-main-container'>
        <div className='layout-main'>
          <Outlet />
        </div>
        {/* <AppFooter /> */}
      </div>}
      { !openMenuActive &&  <div className='layout-main-container expand-menu'>
        <div className='layout-main'>
          <Outlet />
        </div>
        {/* <AppFooter /> */}
      </div>}
      <CSSTransition
        classNames='layout-mask'
        timeout={{ enter: 200, exit: 200 }}
        in={mobileMenuActive}
        unmountOnExit
      >
        <div className='layout-mask p-component-overlay'></div>
      </CSSTransition>
    </div>
  );
}
