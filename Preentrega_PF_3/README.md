# Tercera pre-entrega del PF ⚡️

Se profundizará sobre los roles de los usuarios, las autorizaciones y sobre la lógica de compra.

- Modificar nuestra capa de persistencia para aplicar los conceptos de Factory (opcional), DAO y DTO.
- El DAO seleccionado (por un parámetro en línea de comandos como lo hicimos anteriormente) será devuelto por una Factory para que la capa de negocio opere con él. (Factory puede ser opcional)
- Implementar el patrón Repository para trabajar con el DAO en la lógica de negocio.
- Modificar la ruta  /current Para evitar enviar información sensible, enviar un DTO del usuario sólo con la información necesaria.
- Realizar un middleware que pueda trabajar en conjunto con la estrategia “current” para hacer un sistema de autorización y delimitar el acceso a dichos endpoints:
  - Sólo el administrador puede crear, actualizar y eliminar productos.
  - Sólo el usuario puede enviar mensajes al chat.
  - Sólo el usuario puede agregar productos a su carrito.
- Crear un modelo Ticket el cual contará con todas las formalizaciones de la compra. Éste contará con los campos
  - Id (autogenerado por mongo)
  - code: String debe autogenerarse y ser único
  - purchase_datetime: Deberá guardar la fecha y hora exacta en la cual se formalizó la compra (básicamente es un created_at)
  - amount: Number, total de la compra.
  - purchaser: String, contendrá el correo del usuario asociado al carrito.
- Implementar, en el router de carts, la ruta /:cid/purchase, la cual permitirá finalizar el proceso de compra de dicho carrito.
- La compra debe corroborar el stock del producto al momento de finalizarse
  - Si el producto tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces restarlo del stock del producto y continuar.
  - Si el producto no tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces no agregar el producto al proceso de compra.
- Al final, utilizar el servicio de Tickets para poder generar un ticket con los datos de la compra.
- En caso de existir una compra no completada, devolver el arreglo con los ids de los productos que no pudieron procesarse.

Una vez finalizada la compra, el carrito asociado al usuario que compró deberá contener sólo los productos que no pudieron comprarse. Es decir, se filtran los que sí se compraron y se quedan aquellos que no tenían disponibilidad.

## Inicio  de sesión
- `ADMIN`:
```
  email: admin@gmail.com
  password: 123
```
- `USUARIO`:
```
  email: aldair@gmail.com
  password: 123
```

## Estructura del Proyecto

Dentro del proyecto encontrarás la siguiente estructura de directorios:

```
├── src/
    ├── config/
    │   └── ...
    └── controllers/
    │   └── ...
    └── dao/
        └── db/
        │   └── ...
        └── memory/
        │   └── ...
        └── models/
        │   └── ...
        └── mongo/
        │   └── ...
        └── patterns/
        │   └── ...
        └── services/
            └── repository/
                └── ...
  │└── middlewares/
        └── ...
    └── public/
    │   └── ...
    └── routes/
    │   └── ...
    └── utils/
    │   └── ...
    └── views/
        └── layouts/
        │   └── ...
        └── partials/
            └── ...
```

- `src/config`: Archivos de configuración
- `src/controllers`: Controladores de las rutas
- `src/dao`: Todo lo relacionado con datos (MEMORY, MONGO)
- `src/dao/memory`: Métodos para guardar los datos en memoria (archivo.json)
- `src/dao/models`: Estructura de los datos de MONGODB
- `src/dao/mongo`: Métodos para guardar los datos en una base de datos mongo
- `src/dao/patterns`: Diseño de los datos de la aplicación
- `src/dao/services`: Servicios
- `src/dao/services/repository`: Selección del dao a utilizar en el proyecto
- `src/middlewares`: Middleware del inicio de sesión
- `src/public`: Carpeta publica para las vistas
- `src/routes`: Rutas de la API
- `src/utils`: Archivos que se reutilizarán a lo largo del proyecto
- `src/views`: Vistas de handlebars para renderizar la interfaz del usuario
- `src/views/layouts`: Plantillas de handlebars
- `src/views/partials`: Componentes de handlebars

## Instalación

```shell
$ npm install # or `pnpm install` or `yarn install`
```

## Configuración del Proyecto con Standard.js
Colocamos la siguiente configuración en el archivo `package.json`

```JSON
{  
  "eslintConfig": {
    "extends": "./node_modules/standard/eslintrc.json"
  }
}
```

Después hubicarse dentro del siguiente directorio

```
├── node_modules/
    ├── standard/
        └── ...
```

En el archivo `eslintrc.json` pegar la siguiente configuración

```JSON
{
  "extends": ["standard", "standard-jsx"],
  "rules": {
    "camelcase": "off"
  }
}
```

## Desarrollo

```shell
$ npm start # or `pnpm start` or `yarn start`
```

### Parámetros por linea de comando

#### Modo de desarrollo

```shell
$ npm start --mode
```

- `DEVELOPMENT`: Se conecta a la base de datos de desarrollo y el puerto de ejecución del servidor es el 8080 por defecto
- `PRODUCTION`: Se conecta a la base de datos de producción y el puerto de ejecución del servidor es el 3000 por defecto

Por defecto se usa `DEVELOPMENT`

#### Puerto de ejecución del servidor

```shell
$ npm start --port
```

Por defecto se usa el puerto designado por el modo de desarrollo

#### Persistencia de los datos

```shell
$ npm start --persistence
```

- `MONGO`: Los datos se almacenan en una base de datos mongo
- `MEMORY`: Los datos se almacenan en un archivo .json

Por defecto se usa `MONGO`

## Producción

```shell
$ npm build # or `pnpm build` or `yarn build`
```