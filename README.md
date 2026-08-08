# Proyecto matemático

Sitio estático para GitHub Pages + editor local Flask.

## Estructura

- `website/`: sitio público estático.
- `editor/`: editor local para administrar `website/data/preguntas.json`.

## Ejecutar localmente

```bash
python -m venv .venv
```

Linux/macOS:

```bash
source .venv/bin/activate
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Instalar:

```bash
pip install -r requirements.txt
```

Ejecutar:

```bash
python editor/app.py
```

Abrir:

- Editor: http://127.0.0.1:5000/editor
- Sitio público local: http://127.0.0.1:5000/

El editor modifica directamente `website/data/preguntas.json`.

## Publicar en GitHub Pages

La carpeta `website/` es el sitio estático. Puedes publicar el repositorio completo mediante GitHub Pages configurando la carpeta raíz como origen, o usar `/website` mediante una rama/flujo de despliegue apropiado.

Una alternativa sencilla es colocar el contenido de `website/` en la raíz de un repositorio dedicado a Pages.

## Importante

El editor Flask es solo local. No lo publiques en GitHub Pages.
