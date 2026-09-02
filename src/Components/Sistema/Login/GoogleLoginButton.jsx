import React from "react";
import { useGoogleLogin } from '@react-oauth/google';

// Aislado en su propio componente para que `useGoogleLogin` solo se ejecute
// cuando hay un VITE_GOOGLE_CLIENT_ID configurado. Con el clientId vacio la
// libreria de Google lanza dentro de su efecto y, al no haber ErrorBoundary,
// React desmonta toda la app dejando la pagina en blanco.
export default function GoogleLoginButton({ onToken }) {
  const handleLogin = useGoogleLogin({
    onSuccess: (response) => {
      onToken(response.access_token);
    },
    onError: (error) => alert(`Error with Google Login: ${error}`),
  });

  return (
    <button onClick={() => handleLogin()}
    type="button" className="login-with-google-btn mt-5">
      Sign in with Google
    </button>
  );
}
