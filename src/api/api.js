import { json } from 'react-router-dom';
import { getEnvVariables } from '../helpers';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const { VITE_API_URL }  = import.meta.env;

function handle401(status) {
  if(status === 401 && window.location.pathname  !== "/") {
    fetchUserLogout();
  }
} 

const token = localStorage.getItem('token')

const fetchGet = async (url = '', method = 'GET') => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${VITE_API_URL}/${url}`, { method, headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    
  } });
  handle401(response.status);

  const result = response.json();
  return result;
};


const firmarDoc = async (data) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${VITE_API_URL}/firmar_doc`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      
    }, 
    body: JSON.stringify(data),
  });

  handle401(response.status);
  return response
  
}


const postUser = async (user) => {

  const response = await fetch(`${VITE_API_URL}/usuario`, { method: 'POST', body: JSON.stringify(user), headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
      
  } });
  handle401(response.status);

  const result = response.json();
  return result;
};


const fetchGetproject = async (id, method = 'GET') => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${VITE_API_URL}/regProyecto/${id}`, { method, headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    
  } });
  handle401(response.status);
  const result = response.json();
  return result;
}





const fetchDelete = async (url = '', method = 'DELETE') => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${VITE_API_URL}/${url}`, { method,  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    
  }  });

  handle401(response.status);
  const result = response.json();
  return result;
};

const fetchPost = async (url = '', method = '', data) => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${VITE_API_URL}/${url}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      
    }, 
    body: JSON.stringify(data),
  });

  handle401(response.status);
  const result = response.json();
  return result;
};

const fetchPut = async (url = '', method = '', data) => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${VITE_API_URL}/${url}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  handle401(response.status);

  const result = await response.json();

     return result;
};

const createFormData = async  (url = '', method = '', data) =>  {
  
  const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${VITE_API_URL}/${url}`, {
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,

        }
      });
        const jsonData = await response.json();

        handle401(response.status);

        return jsonData;
    } catch (error) {
        console.error("CREATE FORMDATA ERROR ", error)
        console.log(error)
    }
  }



const fetchLogin = async (url = '', method = '', data)=> {
  const res = await fetch(`${VITE_API_URL}/${url}`, {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .catch(error => console.error(error));
  handle401(res.status);

     const result = await res.json();

     return result;

}


const fetchSearchUser = async (url = '', method = '', id)=> {
  const token = localStorage.getItem('token')
  const res = await fetch(`${VITE_API_URL}/${url}/${id}`, {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      
    }
  })

  console.log(res.status)
     handle401(res.status);
    
     const result = await res.json();

     return result;

}


const fetchUserLogout=  ()=> {
  

  localStorage.removeItem('token');
  window.location.replace('/');


}

export const getGoogleInfo = (access_token) => {
  try {
    const data = axios(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${access_token}`
      },
    })
    return data;
  } catch (error) {
    if (import.meta.env.MODE === 'development') {
      console.log(error);
    }
    throw error;
  }
}




export { fetchGet, fetchDelete, fetchPost, fetchPut, fetchLogin, fetchSearchUser, fetchUserLogout, createFormData, fetchGetproject, postUser,firmarDoc };
