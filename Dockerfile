FROM node
 
# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json a la imagen de contenedor
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN yarn

# Copia el resto de los archivos del proyecto al contenedor
COPY ["./", "./"]
RUN rm -f ./yarn.lock
RUN rm -f ./package-json.lock
# Construye la aplicación React
RUN npm run build

# Expone el puerto 5173 para la aplicación
EXPOSE 3000

# Establece el comando que se ejecutará cuando se inicie el contenedor
CMD ["npm","run", "dev"]
