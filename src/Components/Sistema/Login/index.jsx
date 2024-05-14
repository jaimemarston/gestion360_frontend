import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// PrimeReact
import sd from "./descocentro.jpg";
import logo from "./predes.png";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

import { fetchLogin } from "../../../api/api";
import Swal from "sweetalert2";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import "./login.scss";

export default function Login() {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await fetchLogin("login", "POST", login);

    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate(`/Dashboard`);
    }

    if (data.message) {
      Swal.fire({
        title: "Error!",
        text: "Correo o contraseña invalida",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };
  return (
    <section id="login">
      <div className={`containerLogin`}>
        <div className={`imgLogin`}>
          <div class="img-login"></div>
        </div>
        <div className={`formLogin`}>
          <form onSubmit={handleSubmit} className="p-fluid">
            <center>
              <img src={logo} alt="hyper" class="mb-1 img-logo" />
            </center>

            <div className="field">
              <label htmlFor="Correo electronico">Correo</label>
              <InputText
                placeholder="Correo"
                className="inputs"
                value={login.email}
                type="email"
                onChange={(e) => setLogin({ ...login, email: e.target.value })}
              />
            </div>

            <div className="field">
              <label htmlFor="Contraseña">Contraseña</label>
              <Password
                placeholder="Contraseña"
                className="inputs"
                toggleMask
                value={login.password}
                onChange={(e) =>
                  setLogin({ ...login, password: e.target.value })
                }
                feedback={false}
              />
            </div>
            <Button type="submit" label={"Ingreso"} className="inputs" />

            <button type="button" class="login-with-google-btn mt-3">
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
