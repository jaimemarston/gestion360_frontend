import React from "react";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Components/Sistema/Login";
import Dashboard from "./Components/Sistema/Menu/Dashboard";

import Home from "./Components/Sistema/Home";
// PrimeReact
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";

// Css
// import 'primereact/resources/primereact.css';
// import 'primeicons/primeicons.css';
// import 'primeflex/primeflex.css';
import "./assets/demo/flags/flags.css";
import "./assets/demo/Demos.scss";
import "./assets/layout/layout.scss";

import {
  InformeRegistroActividad,
  LugarComision,
  RegistroActividad,
  RegistroCargos,
  RegistroCodigoReferencia,
  RegistroDinero,
  RegistroDocumentos,
  RegistroEmpleado,
  RegistroPresupuesto,
  RegistroProyecto,
  RegistroRendicionGastos,
  RegistroUsuario,
  RendicionGastos,
  SolicitudDinero,
  RepositorioDocumentos,
  Pdf,
  MisDatos,
  VisorDocumento,
  PermisoLaboral,
  PermisoVacaciones,
} from "./Components/Sistema/Menu";
import { RegistroPresupuestoFinanciero } from "./Components/Sistema/Menu/RegistroPresupuestoFinanciero";
import FileManager from "./Components/Sistema/Menu/FileManager";

function App() {
  const [isDarkMode, setDarkMode] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
    }
  }, [localStorage.getItem("token")]);

  console.log(isDarkMode);

  return (
    <div className={isDarkMode ? "body-dark " : ""}>
      <Routes>
        <Route exact path={"/"} element={<Login />} />

        <Route exact path={"/"} element={<Home setDarkMode={setDarkMode} />}>
          <Route exact path={"Dashboard"} element={<Dashboard />} />
          <Route path={"viewpdf"} element={<Pdf />} />
          <Route
            exact
            path={"repositorio-documentos"}
            element={<RepositorioDocumentos isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"registro-usuario"}
            element={<RegistroUsuario isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"registro-empleado"}
            element={<RegistroEmpleado isDarkMode={isDarkMode} />}
          />

          <Route
            exact
            path={"solicitud-dinero"}
            element={<SolicitudDinero isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"rendicion-gastos"}
            element={<RendicionGastos isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"RegistroRendicionGastos"}
            element={<RegistroRendicionGastos isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"RegistroSolicitudDinero"}
            element={<RegistroDinero isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"informe-actividad"}
            element={<RegistroActividad isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"mis-datos"}
            element={<MisDatos isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"visor-documento"}
            element={<VisorDocumento isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"permiso-laboral"}
            element={<PermisoLaboral isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"permiso-vacacional"}
            element={<PermisoVacaciones isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"registro-actividad"}
            element={<InformeRegistroActividad isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"registro-proyecto"}
            element={<RegistroProyecto isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"registro-presupuesto"}
            element={<RegistroPresupuesto isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"registro-presupuesto-financiero"}
            element={<RegistroPresupuestoFinanciero isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"registro-referencia"}
            element={<RegistroCodigoReferencia isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"registro-cargos"}
            element={<RegistroCargos isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"registro-documentos"}
            element={<RegistroDocumentos isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"lugar-comision"}
            element={<LugarComision isDarkMode={isDarkMode} />}
          />
          <Route
            exact
            path={"file-manager"}
            element={<FileManager isDarkMode={isDarkMode} />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
