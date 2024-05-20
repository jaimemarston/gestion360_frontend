import { fetchSearchUser } from "../api/api";
import { useNavigate } from 'react-router-dom';

function handle401(status) {
    if(status === 401 && window.location.pathname  !== "/") {
      fetchUserLogout();
    }
  } 


  export const getUser = async () => {

    const token =  localStorage.getItem('token');
  
    if(token) {
        const [header, payload, signature] = token.split('.');
            
    const decodedPayload = JSON.parse(atob(payload));
     
    const res = await fetchSearchUser('usuario', 'GET', decodedPayload.id);

    if(res.usuario.rol !== undefined){
      localStorage.setItem('rol', res.usuario.rol)
    }
    
    handle401(res.status);
    return res.usuario;
    }
    
    return null

   

    }


    const fetchUserLogout=  ()=> {
        const navigate = useNavigate();
        localStorage.removeItem('token');
        navigate('/')
      
      
      }