El uso de la **Terminal** y la **Línea de comandos** es muy útil para automatizar procesos que realizamos muy a menudo. Por lo tanto nos interesa poder crear nuestros propios comandos que agrupen esas tareas, para poder ejecutarlas en cualquier momento sin necesidad de tener que reescribir código.

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

Ejecutamos el siguiente comando:


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

Podríamos simplemente modificar el nombre del fichero que queremos crear mirando cuántos ficheros tenemos ya y añadiéndole un número más. Pero esta tarea la podemos automatizar para poder ejecutarla de manera más rápida y cómoda.

Aquí es donde empezaremos a crear nuestro primer comando personalizado. Generaremos un fichero de script bash.

```
vim comprimido.sh
```

Esto nos abre el editor de texto por consola, donde podremos editar nuestro comando.

Lo primero que haremos es pulsar la tecla "i" para entrar en el modo de edición.

La primera línea que escribimos es obligatoriamente la del interprete que ha de ejecutar el comando. En este caso es un script de bash escribiremos `#!/bin/bash` seguido del comando que estábamos ejecutando anteriormente.

```
#!/bin/bash

tar --exclude=comprimido.tar.gz -czf comprimido.tar.gz *
```


Para salir del modo edición de vim y guardar el fichero pulsaremos la tecla ESC, seguidos de doble punto (:), tecla w (write), tecla q (quit) y pulsaremos ENTER. Nos aseguraremos de que estas últimas letras se escriben en la parte inferior izquierda de la pantalla de la consola.


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

Lo que nos interesa saber ahora es cuántos ficheros comprimidos tenemos creados para saber el número que le tendríamos que añadir al nombre del siguiente fichero. Esto lo conseguimos listando `ls` los ficheros que coincidan con el patrón `comprimido*.tar.gz` y mandamos ese resultado a través de un pipe `|` al comando `wc` (word count) con el flag `-l` (lines).

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

El resultado que nos muestra la consola es `3`.

Si metemos ese resultado dentro de una variable podremos utilizarla para generar el nombre del nuevo fichero comprimido.

```
count=$(ls comprimido*.tar.gz | wc -l)
tar --exclude=comprimido*.tar.gz -czf comprimido-$((count+1)).tar.gz *
```

En este punto nuestro script bash podría estar así:

```
#!/bin/bash

file="comprimido.tar.gz"

if [ -f $file ]; then
        count=$(ls comprimido*.tar.gz | wc -l)
        file="comprimido-$((count+1)).tar.gz"
fi

tar --exclude=comprimido*.tar.gz -czf "$file" *
```

> Hemos añadido in condicional IF ya que sólo en el caso de que el fichero `comprimido.tar.gz` ya exista nos interesa implementar el nombre con el incremento numérico.


Si ejecutamos varias veces el script veremos que los archivos comprimidos se van incrementando.

```
./
../
comprimido.tar.gz
comprimido_2.tar.gz
comprimido_3.tar.gz
comprimido_4.tar.gz
comprimido_5.tar.gz
...
```
  
Ahora que ya tenemos un script que nos funciona según lo deseado lo transformaremos a un comando que podamos utilizar en cualquier momento y en cualquier carpeta.

> Este script no es óptimo ya que si eliminamos unos de los ficheros al ejecutar posteriormente el script la suma de los ficheros restantes y el número que debería llevar el siguiente fichero no coincidirá y nos puede generar un error. Pero la finalidad de este tutorial no es generar un script perfecto sino practicar con la línea de comandos.  


Necesitamos un lugar en el que almacenar nuestros comandos personalizados. Por lo tanto crearemos una carpeta **/bin** dentro de nuestra carpeta de usuario (en el caso de no tenerla creada previamente):

```
mkdir -p ~/bin/ 
```

Y moveremos el fichero del script bash dentro de esa carpeta. Le eliminaremos la extensión del fichero para facilitar el uso del comando.

```
mv comprimido.sh ~/bin/comprimido
```

Para poder ejecutar este comando debemos incluir nuestra carpeta /bin dentro de las rutas donde el sistema busca los comandos ejecutables disponibles. Es decir, debemos incluir nuestra carpeta /bin al `PATH`. Podemos comprobar cuales son esas rutas actualmente imprimiendo el contenido de esa variable.

```
echo $PATH
```

Podemos concatenar la ruta de nuestra carpeta /bin a las rutas que contiene el PATH, con el siguiente comando:

```
export PATH="$PATH:~/bin"
```

El problema sería que esta acción sólo sería efectiva en la consola en la que estamos actualmente y se perdería al cerrarla. Para no tener que añadir nuestra ruta al PATH cada vez que abramos de nuevo la consola modificaremos fichero de sistema que encontramos dentro de nuestra carpeta de usuario. Este fichero se ejecuta cada vez que se inicia la consola con lo que hará ese proceso por nosotros.

```
vim ~/.bashrc
```

> Dependiendo del sistema en el que estemos este fichero podría ser `.bash_profile` o `.profile`.

Editaremos este fichero añadiendo al final de todo el mismo comando visto anteriormente:

```
...
export PATH="$PATH:~/bin"
```

Una vez modificado haremos ese cambio efectivo ejecutando el fichero .bashrc o simplemente cerrando la consola y volviéndola a abrir.

```
source ~/.bashrc
```

Ahora ya sí que podremos ejecutar el comando desde cualquier carpeta.

```
comprimido
```

Aplicaremos algunas mejoras al comando. Por ejemplo, podemos hacer que el nombre del fichero comprimido no sea siempre el mismo sino que sea el nombre de la carpeta que contiene los ficheros a comprimir.

Para obtener el nombre de la carpeta en la que nos encontramos en la consola podemos ejecutar este comando:

```
pwd | awk -F/ '{print $NF}'
```

> El comando `pwd` nos da la ruta completa de donde nos encontramos, y la respuesta de ese comando se la pasamos a través de un **pipe** al comando `awk` con el que dividimos esa cadena de texto a partir del símbolo de barra `-F/` e imprimimos el último valor obtenido `'{print $NF}'`.


> Este mismo resultado lo podemos conseguir mas sencillo con `echo ${PWD##*/}`, pero en el comando anterior hemos probado el comando `awk` que nos enseñó el curso.

Editaremos de nuevo el fichero del comando.

```
vim ~/bin/comprimido
```

Y modificaremos la líneas donde se hace referencia al nombre del fichero.

```
#!/bin/bash

name=$(pwd | awk -F/ '{print $NF}')
file="$name.tar.gz"
files="$name*.tar.gz"

if [ -f $file ]; then
	count=$( eval "ls $files | wc -l")
	file="$name-$((count+1)).tar.gz"
fi

tar --exclude=$files -czf $file *

echo $(pwd)/$file
```

También hemos añadido una respuesta con la ruta completa al fichero comprimido, con lo que podemos concatenar esa respuesta con cualquier otro comando.

```
comprimido | xargs -I {} mv {} ../backups/
```

A partir de aquí podemos crearnos todos los comandos que contengan acciones que queramos reutilizar o ir optimizando las que ya tenemos, de manera que tengamos una librería de comandos que nos agilicen el tareas diarias.
