## Despliegue

Todo el Backend esta `Dockerizado` al igual que la base de datos. Para desplegar usamos el plugin `compose` para los contenedores.

Para iniciar los servicios usamos el comando
```bash
docker compose up -d app
```
Es importante decir que para que funcione el dominio estos contenedores hace falta iniciarlos dentro de la misma red de un reverse proxy, asi el reverse proxy puede reconocer el dominio y redireccionar el trafico al contenedor de la app. Antes de iniciar la construccion de la imagen es importante añadir el archivo
`.env` para que sea reconocido por el frontend

### Environment

Para levantar el backend hace falta estas variables de entorno dentro de un archivo `.env`

```env
// URL DEL API 
VITE_API_URL=
```
