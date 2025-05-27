Para correr el servidor:
1) En vsc dentro de la carpeta raíz del servidor hacer el comando en consola "npm install", para instalar las dependencias.
2) Crear la base de datos local en su sql, el script esta en la carpeta raíz.
3) Cambiar el nombre del archivo "ejemploDeEnv" a ".env" y editarlo con sus variables de su sql.
4) Para que arranque usar el comando "node server.js".

Para probar si sirve, una vez corriendo pueden ir al navegador o con postman y probar los endpoints y ver si devuelve el json, 
Ejemplo: "http://localhost:5000/api/products/" . Si devuelve un "[ ]" está funcionando pero simplemente no tienen nada guardado en la base,
pueden guardar algo desde su sql y probar de nuevo deberian aparecer los productos.

De momento los endpoints de la API que sirven son las que están en la carpeta "routes". Por ejemplo si quieren agregar un producto al carrito (cart) hacen el post
usando el endpoint "/api/cart/add". Revisen cada archivo para ver como son los endpoints, la mayoria piden el token del usuario logeado en ese momento por lo que 
primero hay que logearse y guardar el token para luego usarlo en el header de la solicitud.

