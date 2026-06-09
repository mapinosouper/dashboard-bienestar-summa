# Backlog — Dashboard Bienestar

Recibido. Marcamos `[x]` a medida que se cierra.

## Decisiones / defaults asumidos (corregir si aplica)
- **Pit Stop escala 1–5** (no 1–10): colores **≤2 rojo · 3 ámbar · ≥4 verde**; "señal de riesgo" (crítico) cuando el promedio de una numérica **< 3.5**.
- **Pulse colores** (1–10, según indicaste): **≤4 rojo · 5–7 ámbar · ≥8 verde**. La lógica de alerta de Pulse (nota <4) se mantiene salvo que indiques lo contrario.
- **Vacaciones futuras editable + guardado**: se guarda en **Supabase** (tabla nueva), editable **solo por admin**, por persona.
- **Orden tabla Pulse (vista proyecto)**: ahora **antiguo → reciente** (revierte el cambio anterior reciente→antiguo).

---

## Vista proyecto (deep-dive)

### General
- [ ] Menú/outline a la izquierda para navegar por secciones.

### Pulse Check
- [ ] Toggle tipo pill: **"Mes actual"** (tabla de respuestas del mes por dimensión, estilo deep-dive) vs **"Línea de tiempo"** (la tabla actual), en la misma sección.
- [ ] Ordenar la tabla **antiguo → reciente**.
- [ ] La "Variación" = diferencia entre los **últimos 2 registros**.

### Pit Stop
- [ ] Corregir escala a **1–5** (no 1–10).
- [ ] Vista comparativa: seleccionar **hasta los 3 últimos Pit Stop**, mostrando el **promedio de cada respuesta** para ver el movimiento entre ciclos (solo numéricas).
- [ ] La tabla de detalle (numéricas + binarias) solo para el **último Pit Stop**.
- [ ] Lista de comentarios **colapsable**.

### Trasnoches
- [ ] Por default **no mostrar proyectos OK**; toggle para activarlos.
- [ ] Vista resumen: **% de personas** del proyecto en trasnoche / en tardío, **n° de trasnoches**, y **gráfico** del n° total de trasnoches del equipo agrupado **por semana**.

### Vacaciones
- [ ] Columna **futuras editable y persistida** (Supabase, admin).
- [ ] **Eliminar columna "Estado"**.

---

## Panel Pulse Check
- [ ] Colores: **≤4 rojo · 5–7 ámbar · ≥8 verde**.
- [ ] **Dar vuelta los ejes** (proyecto ↔ dimensión).
- [ ] Tabla de **promedio general Summa con apertura por cargo** (general, Analista, Asociado/a).

## Panel Pit Stop
- [ ] Destacar distinto los proyectos con **+14 días sin Pit Stop (o nunca)** → **pill de alerta junto al nombre**.
- [ ] **Sacar la fila OTB** (ese "proyecto" nunca debe tener Pit Stop).

## Panel Trasnoche
- [ ] En el selector de semanas, texto **grisáceo a la derecha con las fechas** que abarca la semana (solo al elegir; el `WXX` se queda en el selector).
