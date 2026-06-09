# Bienestar Summa — Panel por proyecto

App estática (HTML + JS, sin backend propio) para detectar alertas de bienestar del equipo, **agrupadas por proyecto**.

- **`alertas_ejecutivo.html`** — la app: resumen ejecutivo (triage), deep-dive por proyecto y paneles Pulse / Pit Stop / Traslados / Vacaciones.
- **`mock_data.js`** — datos de ejemplo (ficticios), generados por `gen_mock.js`.
- Publicado con GitHub Pages → https://fkruuse.github.io/dashboard-bienestar-summa/

## Datos reales
**No viven en el repo.** La carpeta `data/` está en `.gitignore`. Hoy se cargan en el navegador; próximamente vía **Supabase** (login por magic-link + allowlist; la admin sube una vez y el equipo autorizado lo ve).

## Estructura esperada de los 5 archivos
La app lee solo la **hoja visible** de cada Excel y resuelve columnas por nombre/posición:
- Pulse Check / Pit Stop (Microsoft Forms): encabezados fila 1, posicional.
- Traslados (Uber): proyecto = `Código de gastos`.
- Vacaciones (BUK): detecta la fila de encabezado automáticamente.
- Staffing: hoja `Staffing` con `Persona · Cargo · Proyecto`.

## Backtrack (volver atrás)
- `git log --oneline` — ver checkpoints.
- `git tag` — puntos nombrados (ej. `v1-datos-reales` = funcionando con datos reales, antes de Supabase).
- Volver: `git checkout <tag>` (mirar) · `git revert <commit>` (deshacer manteniendo historia).
- Para cambios grandes (Supabase): trabajar en una rama `git switch -c supabase` y mergear cuando funcione.
