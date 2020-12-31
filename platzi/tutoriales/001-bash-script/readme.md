El uso de la **Terminal** y la **Línea de comandos** es muy útil para automatizar procesos que realizamos muy amenudo. Por lo tanto nos interesa poder crear nuestros propios comandos que agrupen esas tareas, para poder ejecutarlas en cualquier momento sin necesidad de tener que reescribir código.

En este tutorial mostraré como generar nuestra propia librería de comandos. Para ello utilizaremos varios de los **comandos básicos que se explican en este curso**.

Como ejemplo haremos un comando que genere un fichero comprimido con los ficheros que contiene la carpeta en las que estamos.

Tal como hemos visto en este curso, para comprimir ficheros utilizaremos el comando **tar**.

Para empezar abrimos la consola y nos movemos a la ruta de una carpeta donde tenemos una serie de ficheros.


```
./
../
file1.jpg
file2.jpg
file3.jpg
...
```

Ejecutamos el siguietne comando:


```
tar -czf comprimido.tar.gz *
```

Esto nos creará un fichero comprimido que contiene todos los ficheros que tenemos en la carpeta.

```
./
../
comprimido.tar.gz
file1.jpg
file2.jpg
file3.jpg
...
```

Si volvemos a ejecutar este comando nos aparecerá un error en la consola `: Can't add archive to itself`. Ya que al querer comprimir todos los ficheros de la carpeta ahora también incluye el fichero comprimido, y tar no puede comprimir un fichero que se contiene a si mismo. Lo solucionaremos excluyendo el fichero a la hora de seleccionar todos los ficheros de la carpeta.

```
tar --exclude=comprimido.tar.gz -czf comprimido.tar.gz *
```

Ahora cada vez que ejecutemos este comando se sobreescibirá el fichero comprimido con todos los ficheros de la carpeta, pero quizás nos interese que cada vez se genere un fichero nuevo y mantener el anterior, ya que podríamos tener archivos nuevos o haber hecho modificaciones en ellos.

```
./
../
comprimido.tar.gz
comprimido_2.tar.gz
comprimido_3.tar.gz
file1.jpg
file2.jpg
file3.jpg
...
```

Podríamos simplemente modificar el nombre del fichero que queremos crear mirando cuantos ficheros tenemos ya y añadiéndole un número más. Pero esta tarea la pademos automatizar para poder ejecutarla de manera más rápida y comoda.

Aquí es donde empezaremos a crear nuestro primer comando personalizado. Generarenos un fichero de script bash.

```
vim comprimido.sh
```

Esto nos abre el editor de texto por consola, donde podremos editar nuestro comando.

![](https://zguillez.github.io/platzi/tutoriales/001-bash-script/001.png)

Lo primero que haremos es pulsar la tecla "i" para entrar en el modo de edición.

![](https://zguillez.github.io/platzi/tutoriales/001-bash-script/002.png)


La primera línea que escribimos es obligatoriamente la del interprete que ha de ejecutar el comando. En este caso es un script de bash escribiremos `#!/bin/bash` seguido del comando que estabamos ejecutando anteriormente.

```
#!/bin/bash

tar --exclude=comprimido.tar.gz -czf comprimido.tar.gz *
```


Para salir del modo edición de vim y guardar el fichero pulsaremos la tecla ESC, seguidos de doble punto (:), tecla w (write), tecla q (quit) y pulsaremos ENTER. Nos aseguraremos de que estas últmas letras se escriben en la parte inferior izquierda de la pantalla de la consola.


![](https://zguillez.github.io/platzi/tutoriales/001-bash-script/003.png)


Ahora ya tenemos el fichero incluido en nuestra carpeta. Lo intentaremos ejecutar con:

```
./comprimido.sh
```

Pero nos devolverá un error:

```
-bash: ./comprimido.sh: Permission denied
```

Deberemos darle permisos de ejecución a este fichero.

```
chmod 0755 comprimido.sh
```

Ahora sí que lo podremos ejecutar sin problema, y nos generará el fichero comprimido.

De momento no estamos añadiendo ninguna funcionalidad diferente a la que estábamos ejecutando anteriormente, pero esto es sólo el principio.

Lo que nos interesa saber ahora es cuantos ficheros comprimidos tenemos creados para saber el número que le tendríamos que añadir al nombre del siguiente fichero. Esto lo conseguimos listando `ls` los ficheros que coincidad con el patrón `comprimido*.tar.gz` y mandamos ese resultado a través de un pipe `|` al comando `wc` (word count) con el flag `-l` (lines).

Por ejemplo, si nuestra carpeta contiene ahora estos ficheros:

```
./
../
comprimido.tar.gz
comprimido_2.tar.gz
comprimido_3.tar.gz
file1.jpg
...
```

Si ejecutamos:

```
ls comprimido*.tar.gz | wc -l
```

El resultado que nos muestra la cónsola es `3`.

Si metemos ese resultado dentro de una variable podremos utilizarla para generar el nombre del nuevo fichero comprimido.

```
count=$(ls comprimido*.tar.gz | wc -l)
tar --exclude=comprimido*.tar.gz -czf comprimido-$((count+1)).tar.gz *
```





El primer paso será crear nuestra carpeta en la que almacenar nuestros comandos personalizados. Crearemos una carpeta **/bin** dentro de nuestra carpeta de usuario:

```
mkdir ~/bin/ 
```

Y nos moveremos dentro de esa carpeta:

```
cd ~/bin
```

> Podemos unificar esos dos comandos escribiendo:
> ```mkdir -p ~/bin/ &6 cd $_```.
> El flag -p evitará que salte un error si el directorio que queremos crear ya existe. Y el parámetro "$_" es un puntero a la ruta del directorio que hemos introducido.

Dentro de esta carpeta crearemos un comando nuevo
