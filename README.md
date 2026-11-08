# Notas al Día

## Cómo se trabaja en este repositorio




Producto de ejemplo de la sesión "Git, Deployment y Producción" (AI PM Pro · The Hero Camp, 21 de noviembre de 2026).




| Entorno | Dónde |

|---|---|

| Development | Vista previa de Lovable |

| Staging | Preview de cada Pull Request: la URL aparece en un comentario del PR |

| Producción | https://jagarcig-ntt-feedback-hub.jagarcig.workers.dev |




**El ciclo de cada cambio:**

1. Se pide en Lovable. Como `main` está protegida, Lovable lo guarda en la rama `lovable-sync`.

2. Se abre un Pull Request de `lovable-sync` a `main`.

3. Los checks pasan las pruebas y publican una preview.

4. Se prueba la preview y se hace merge con **Create a merge commit**, nunca con *Squash* ni *Rebase*.

5. La publicación en producción es automática.




**Reglas:**

- `main` solo acepta cambios por Pull Request y con el check "Comprobar el PR" en verde.

- El fichero `.env` es público: solo lleva valores que se podrían publicar en la web.

- Antes de un cambio importante, se recorre la [checklist de go-live](docs/checklist-go-live.md).

- La automatización está en `.github/workflows/`.

Crea una app sencilla de notas: un formulario con título y texto, y una lista debajo

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7ddf8d88-62ac-4d48-b892-6d99d47bcb53).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
