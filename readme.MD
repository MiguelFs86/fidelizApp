# Fidelizapp: Fideliza a los clientes para tu negocio.

Este repositorio contiene el código fuente del proyecto de fin de estudios en la universidad UNIR.

Para ejecutar el proyecto de forma local, se pueden seguir los siguientes pasos

### Primer paso: Instalar MongoDB

Para ejecutar esta aplicación, el primer paso será instalar MongoDB

#### En Mac/OSX:

``` brew update ```

a continuación:

``` brew install mongodb ```


Una vez instalado, se crea el directorio para los datos:

``` mkdir -p /data/db ```

Y se ejecuta el servicio de mongoDB:

``` mongod ```

(Hay que asegurarse de que el usuario que ejecuta este comando tiene permisos de lectura/escritura sobre el directio de datos. Se pueden ejecutar ambos comandos como "root" para evitar errores)

Si todo fue bien, se verá el siguiente texto después de ejecutar el comando 'mongod':

``` [initandlisten] waiting for connections on port 27017 ```

Este será el puerto en el que se escucharán las peticiones a la base de datos...

#### En Windows:

Seguir las instrucciones de la documentación oficial de MongoDB: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#install-mdb-edition

#### On Linux:

Seguir las instrucciones de la documentación oficial de MongoDB: https://docs.mongodb.com/manual/administration/install-on-linux/

#

### Segundo paso: Instalar NodeJS

El siguiente paso es configurar el servidor de backend:

Ir al directorio 'backend' en el directorio raiz y ejecutar el siguiente comando:

``` npm install ```

Una vez termine, ejecutar lo siguiente:

``` npm start ```

#

### Tercer paso: Instalar Angular

El último paso será configurar el frontend.

Lo primero será instalar Angular CLI:

``` npm install -g @angular/cli ```

(Quizás haya que ejecutar este comando como 'root')

Después, tanto en el directorio 'frontend-admin-app' como 'frontend-client-app', ejecutar lo siguiente:

``` npm install ```

Una vez finalizado, se podrá ejecutar el frontend (cualquiera de los 2) con el siguiente comando:

``` ng serve ```

#


La base de datos estará escuchando en el puerto: 27017\
El backend estará escuchando en el puerto: 3000\
El frontend estará escuchando en el puerto: 4200
