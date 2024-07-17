import React, { useEffect, useState } from 'react';

import './styles.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { notEditSolicitud } from '../../../../../store/slices/solicitud/solicitudStile';
import { notEditRendicion } from '../../../../../store/slices/rendicionGastos';
import { getUser } from "../../../../../utils/getUser";
export default function AppMenu({ isOpen }) {
  const navigate = useNavigate();


  const [dataUser, setDataUser] = useState({});
  const [dataUserRol, setDataUserRol] = useState({});
  useEffect(() => {
    console.log(isOpen)

    async function doIt() {

      const userData = await getUser();



      setDataUser(userData);



      setDataUserRol(userData?.rol)


    }

    doIt()


  }, [])

  const { estado } = useSelector((state) => {
    return state.menuRRHH;
  });

  const dispatch = useDispatch();

  let menu = [
    {
      label: 'Base de Información',
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-fw pi-chart-bar',
          to: '/Dashboard',
          command: () => {
            navigate('/Dashboard');
          },
        },

        {
          label: 'Mis Datos',
          icon: 'pi pi-fw pi-chart-bar',
          to: '/mis-datos',
          command: () => {
            navigate('/mis-datos');
          },
        },

        {
          label: 'Visor Documentos',
          icon: 'pi pi-eye',
          to: '/visor-documento',
          command: () => {
            navigate('/visor-documento');
          },
        },
/*         {
          label: 'Formato permiso laboral',
          icon: 'pi pi-eye',
          to: '/permiso-laboral',
          command: () => {
            navigate('/permiso-laboral');
          },
        }, */
/*         {
          label: 'Formato permiso vacacional',
          icon: 'pi pi-eye',
          to: '/permiso-vacacional',
          command: () => {
            navigate('/permiso-vacacional');
          },
        }, */
        {
          label: 'Gestor de archivos',
          icon: 'pi pi-folder me-2',
          to: '/file-manager',
          command: () => {
            navigate('/file-manager');
          },
        },
        {
          label: 'Crear grupos de usuarios',
          icon: 'pi pi-users me-2',
          to: '/user-group-registration',
          command: () => {
            navigate('/user-group-registration');
          },
        },
      ],
    },
    /*     {
          label: 'Personal',
          items: [
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
        }, */
    /*     {
          label: 'Solicitudes',
          items: [
            {
              label: 'Solicitud de dinero',
              icon: 'pi pi-fw pi-eye',
              to: '/solicitud-dinero',
              command: () => {
                dispatch(notEditSolicitud());
                navigate('/solicitud-dinero');
              },
            },
            {
              label: 'Rendición de Gastos',
              icon: 'pi pi-fw pi-eye',
              to: '/rendicion-gastos',
              command: () => {
                dispatch(notEditRendicion());
                navigate('/rendicion-gastos');
              },
            },
          ],
        },
        {
          label: 'Informes',
          items: [
            {
              label: 'Registro de Actividades',
              icon: 'pi pi-fw pi-eye',
              to: '/registro-actividad',
              command: () => {
                navigate('/informe-actividad');
              },
            },
          ],
        }, */
    {
      label: `Movimientos`,
      items: [
        /*        {
                 label: 'Registro de Proyectos',
                 icon: 'pi pi-fw pi-eye',
                 to: '/registro-proyecto',
                 command: () => {
                   navigate('/registro-proyecto');
                 },
               },
               {
                 label: 'Registro de Presupuestos',
                 icon: 'pi pi-fw pi-eye',
                 to: '/registro-presupuesto',
                 command: () => {
                   navigate('/registro-presupuesto');
                 },
               },
               {
                 label: 'Registro de Presupuestos Financiador',
                 icon: 'pi pi-fw pi-eye',
                 to: '/Visor',
                 command: () => {
                   navigate('/registro-presupuesto-financiero');
                 },
               },
               {
                 label: 'Registro de Codigos de Referencia',
                 icon: 'pi pi-fw pi-save',
                 to: '/registro-referencia',
                 command: () => {
                   navigate('/registro-referencia');
                 },
               },
               {
                 label: 'Registro de Cargos',
                 icon: 'pi pi-fw pi-save',
                 to: '/registro-cargos',
                 command: () => {
                   navigate('/registro-cargos');
                 },
               }, */
        /*         {
                  label: 'Registro de Documento',
                  icon: 'pi pi-fw pi-save',
                  to: '/registro-documentos',
                  command: () => {
                    navigate('/registro-documentos');
                  },
                }, */
        /*         {
                  label: 'Lugares Comisión',
                  icon: 'pi pi-fw pi-save',
                  to: '/lugar-comision',
                  command: () => {
                    navigate('/lugar-comision');
                  },
                },
                {
                  label: `Movimientos`,
                  icon: 'pi pi-fw pi-search',
                  items: [
                    {
                      label: 'Repositorio de documentos',
                      icon: 'pi pi-fw pi-bookmark',
                      to: '/repositorio-documentos',
                      command: () => {
                        navigate('/repositorio-documentos');
                      },
                    },
                  ],
                }, */
        {
          label: 'Repositorio de documentos',
          icon: 'pi pi-fw pi-bookmark',
          to: '/repositorio-documentos',
          command: () => {
            navigate('/repositorio-documentos');
          },
        },
      ],
    },
  ];

  const menuFyA = [
    {
      label: 'Base de Información',
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-fw pi-chart-bar',
          to: '/Dashboard',
          command: () => {
            navigate('/Dashboard');
          },
        },
      ],
    },
    {
      label: `Movimientos`,
      icon: 'pi pi-fw pi-search',
      items: [
        {
          label: 'Repositorio de documentos',
          icon: 'pi pi-fw pi-bookmark',
          to: '/repositorio-documentos',
          command: () => {
            navigate('/repositorio-documentos');
          },
        },

      ],
    },
  ];
  const main = () => {
    return menu
      ? menu.map((item, index) => {
        if (dataUser?.rol !== 'ADMIN_ROLE' && dataUser?.rol !== 'RESPONSABLE_ROLE' && item.label == 'Movimientos') {
          return
        }

        if (dataUser?.rol !== 'ADMIN_ROLE' && dataUser?.rol !== 'RESPONSABLE_ROLE' && item.label == 'Solicitudes') {
          return
        }

        if (dataUser?.rol !== 'ADMIN_ROLE' && dataUser?.rol !== 'RESPONSABLE_ROLE' && item.label == 'Informes') {
          return
        }
        return (
          <div key={index}>
            <li>

              <p>{item.label}</p>
            </li>
            <ul>
              {item.items
                ? item.items.map((item2, index2) => {
                  if (dataUser?.rol == 'ADMIN_ROLE' && item2.label == 'Mis Datos' | item2.label == 'Visor Documentos' | item2.label == 'Formato permiso laboral' | item2.label == 'Formato permiso vacacional') {
                    return
                  }

                  if (dataUser?.rol == 'RESPONSABLE_ROLE' && item2.label == 'Mis Datos' | item2.label == 'Visor Documentos' | item2.label == 'Formato permiso laboral' | item2.label == 'Formato permiso vacacional') {
                    return
                  }

                  return (
                    <li
                      key={index2}
                      className={'li'}
                      onClick={() => item2.command()}
                    >
                      <p key={index2}>
                        <i className={item2.icon}></i>
                        <span>{item2.label}</span>
                      </p>
                    </li>
                  );
                })
                : null}
            </ul>
          </div>
        );
      })
      : null;
  };

  const fyaMain = () => {
    return menuFyA
      ? menuFyA.map((item, index) => {
        if (dataUser?.rol !== 'ADMIN_ROLE' && item.label == 'Movimientos') {
          return
        }
        return (
          <div key={index}>
            <li>
              <p>{item.label}</p>
            </li>
            <ul>
              {item.items
                ? item.items.map((item2, index2) => {
                  return (
                    <li
                      key={index2}
                      className={'li'}
                      onClick={() => item2.command()}
                    >
                      <p key={index2}>
                        <i className={item2.icon}></i>
                        <span>{item2.label}</span>
                      </p>
                    </li>
                  );
                })
                : null}
            </ul>
          </div>
        );
      })
      : null;
  };
  return (
    <div className='layout-menu-container eliminar-li '>
      <ul className='layout-menu'>{main()}</ul>
      {/* <ul className='layout-menu'>{!estado ? main() : fyaMain()}</ul> */}
    </div>
  );
}
