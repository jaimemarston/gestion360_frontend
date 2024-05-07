import { LugarComision } from './LugarComision/LugarComision';
import InformeRegistroActividad from './RegistroActividad/InformeRegistroActividad';
import RegistroActividad from './RegistroActividad/RegistroActividad';
import { RegistroCargos } from './RegistroCargos/RegistroCargos';
import { RegistroCodigoReferencia } from './RegistroCodigoReferencia/RegistroCodigoReferencia';
import { RegistroDocumentos } from './RegistroDocumentos/RegistroDocumentos';
import { RegistroEmpleado } from './registroEmpleado/RegistroEmpleado';
import { RegistroPresupuesto } from './RegistroPresupuesto/RegistroPresupuesto';
import { RegistroProyecto } from './RegistroProyecto/RegistroProyecto';
import { RegistroUsuario } from './registroUsuario/RegistroUsuario';
import RegistroRendicionGastos from './RendicionGastos/RegistroRendicionGastos';
import { RendicionGastos } from './RendicionGastos/RendicionGastos';
import { RegistroDinero } from './SolicitudRegistro/RegistroDinero';
import { SolicitudDinero } from './SolicitudRegistro/SolicitudDinero';
import RepositorioDocumentos from './RepositorioDocumentos/index';
import {MisDatos} from './MisDatos/index';
import {VisorDocumento} from './VisorDocumento/index';
import PermisoLaboral from "./Pdf/permisolaboral"
import PermisoVacaciones from "./Pdf/permisovacaciones"
import { Pdf } from "./Pdf/Pdf";

export {
  InformeRegistroActividad,
  RegistroActividad,
  RegistroRendicionGastos,
  RegistroUsuario,
  RegistroEmpleado,
  SolicitudDinero,
  RegistroDinero,
  RendicionGastos,
  RegistroProyecto,
  RegistroPresupuesto,
  RegistroCodigoReferencia,
  RegistroCargos,
  RegistroDocumentos,
  LugarComision,
  RepositorioDocumentos,
  Pdf,
  MisDatos,
  VisorDocumento,
  PermisoLaboral,
  PermisoVacaciones
};
