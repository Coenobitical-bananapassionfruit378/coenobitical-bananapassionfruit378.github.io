# gilda fitnes — soluciones ópticas

Web estática, sin dependencias. Se publica tal cual en GitHub Pages.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Portada. «gilda fitnes» rebota tipo DVD dentro del área del boceto. |
| `portfolio.html` | Cualquier portfolio. Sin parámetro muestra el principal; con `?p=id`, el que sea. |
| `admin.html` | Panel: crear portfolios, subir piezas, elegir dónde aparece cada una y eliminarlas. |
| `data.json` | Los portfolios y su contenido. |
| `gafas.svg` | El dibujo de las gafas, vectorizado del boceto. |
| `rainbow.js` | Arcoíris y ola de letras al pasar por encima. |
| `bounce.js` | El rebote tipo DVD. |
| `marquee.js` | La tira en movimiento, el arrastre y el popup. |
| `reels.html` | Atajo antiguo: redirige a `portfolio.html?p=reels`. |
| `media/` | Los archivos. |

## Publicar

1. Sube todo el contenido de esta carpeta a la raíz de un repositorio.
2. Settings → Pages → Source: **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. Queda en `https://TUUSUARIO.github.io/NOMBREREPO/`, o en `https://TUUSUARIO.github.io/` si el repositorio se llama `TUUSUARIO.github.io`.

## Portfolios

El principal es `portfolio.html` y es el único enlazado desde la portada. Todos los demás son secretos: no hay ningún enlace hacia ellos y llevan `noindex`, así que sólo entra quien tenga la dirección.

La dirección de un portfolio secreto es `portfolio.html?p=su-id`. El botón **Copiar enlace** del panel te la da hecha.

Cada portfolio guarda sus propias medidas y la web adapta la proporción y el tamaño de las piezas: 1080×1350 para portadas, 1080×1920 para vertical, 1080×1080 para cuadrado, o lo que pongas.

Una misma pieza puede estar en varios portfolios a la vez. Se sube una sola vez y se marca desde la biblioteca.

## Panel

1. Crea un token: Settings → Developer settings → Personal access tokens → **Fine-grained tokens**. Acceso sólo a este repositorio, permiso **Contents: Read and write**.
2. Abre `admin.html`, rellena los datos y pulsa **Conectar**.
3. **Portfolios**: crear uno nuevo con su nombre, dirección y medidas; copiar su enlace; borrarlo.
4. **Subir piezas**: marcas los portfolios de destino y eliges los archivos. Se suben y se guardan solos.
5. **Biblioteca**: cada pieza con casillas de en qué portfolios aparece. Desmarcar la quita de ahí; **Eliminar** la borra del repositorio y de todas partes.
6. Los cambios de casillas y de portfolios se aplican con **Guardar cambios**.

Los cambios tardan alrededor de un minuto en verse en la web publicada.

## Ajustes rápidos

- Velocidad de la tira: `speed` en la llamada a `marquee(...)` de `portfolio.html`.
- Vuelta a la velocidad normal tras un arrastre: `tau` en `marquee.js`.
- Tamaño y separación de las piezas: la fórmula de `applySize` en `marquee.js`.
- Velocidad y área del rebote: la llamada a `bounce(...)` y las reglas `.area` y `.band`. Las medidas salen del recuadro de los bocetos.
- Arcoíris: `AMP`, `SPEED` y `STAGGER` al principio de `rainbow.js`.
- Color: `--azul`.

Todas las posiciones y tamaños de texto están medidos sobre los bocetos, así que el encuadre coincide en escritorio y en móvil.
