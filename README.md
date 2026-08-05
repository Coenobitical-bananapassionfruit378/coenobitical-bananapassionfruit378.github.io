# gilda fitnes — soluciones ópticas

Web estática, sin dependencias. Se publica tal cual en GitHub Pages.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Portada. «gilda fitnes» rebota tipo DVD dentro del área del boceto. |
| `portfolio.html` | Una tira de portadas en movimiento, formato 1080×1350. |
| `reels.html` | Portfolio secreto (no enlazado, `noindex`), formato 1080×1920 para vídeo y gif. |
| `gafas.svg` | El dibujo de las gafas, vectorizado del boceto original. |
| `bounce.js` | El rebote tipo DVD. |
| `marquee.js` | La tira en movimiento, el arrastre y el popup. |
| `admin.html` | Panel para subir y borrar piezas con un token de GitHub. |
| `data.json` | Lista de piezas de cada sección. |
| `media/` | Los archivos. |

## Publicar

1. Crea un repositorio y sube todo el contenido de esta carpeta a la raíz.
2. Settings → Pages → Source: **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. La web queda en `https://TUUSUARIO.github.io/NOMBREREPO/`.
   Si el repositorio se llama `TUUSUARIO.github.io`, queda en `https://TUUSUARIO.github.io/`.

El portfolio secreto es `…/reels.html`. No hay ningún enlace hacia él y lleva `noindex`, así que sólo entra quien tenga la dirección.

## Subir contenido

1. Crea un token en GitHub: Settings → Developer settings → Personal access tokens → **Fine-grained tokens**.
   Repository access: sólo este repositorio. Permissions → Repository permissions → **Contents: Read and write**.
2. Abre `admin.html` (desde la web publicada o abriendo el archivo en el navegador).
3. Rellena usuario, repositorio, rama y token, y pulsa **Conectar**.
4. Elige sección, elige los archivos y pulsa **Subir**.

Los cambios tardan alrededor de un minuto en aparecer en la web publicada.

Medidas: portfolio 1080×1350, reels 1080×1920. Se recortan a esa proporción si no coinciden.

## Ajustes rápidos

- Velocidad de la tira: `baseSpeeds` al final de `portfolio.html` y `reels.html` (px por segundo; el signo marca la dirección).
- Cuánto tarda en volver a su velocidad tras un arrastre: `tau`.
- Tamaño de las piezas y separación: `--ih` y `--gap` en el CSS.
- Velocidad del rebote: el número que se pasa a `bounce(...)` en cada página.
- Área de rebote: `.area` en `index.html` y `.band` en `portfolio.html` y `reels.html`. Las medidas salen del recuadro del boceto.
- Color: `--azul`.

Todas las posiciones y tamaños de texto están sacados midiendo los bocetos, así que el encuadre coincide en escritorio y en móvil.
