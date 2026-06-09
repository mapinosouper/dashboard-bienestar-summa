// Generador de datos mock para el Dashboard Bienestar.
// Reproduce la estructura EXACTA (orden de columnas e índices) de los 5 archivos
// reales, según la config del dashboard:
//   PC_IDX={mes:4,q0:5..q6:11,proyecto:13,recog:14,cargo:16}
//   PS={proyecto:5,fecha:6,nums:[7..10],alerts_si_good:[11,12,13,14,17],dec_si_bad:[15,16],texts:[18,19,20]}
//   Traslados: 0 Nombre,1 Apellido,12 Fecha llegada,13 Hora llegada,15 Programa
//   Vacaciones: headers por nombre; saldo total = legal+admin; coma decimal
//   Proyectos Activos: Código | Nombre(persona) | Cargo
//
// Casos sembrados a propósito:
//   AUR-24 Aurora   -> CRÍTICO  (Pulse combo Desafío+WLB + 1 nota <4 ; PS "No" energía ; traslados tardíos persistentes ; vac alto)
//   BOR-24 Borealis -> CRÍTICO  (PS carga <4 ; traslado trasnoche NUEVO)
//   CIT-24 Citrino  -> VIGILAR  (Pulse 1 dimensión baja ; traslados tardíos nuevos ; vac alto)
//   DEL-24 Delta    -> CEGUERA  (sin Pit Stop hace +14 días, sin otra señal)
//   EBA-24 Ébano    -> VIGILAR  (solo vacaciones >15)
//   FLO-24 Floral   -> OK
//   GEO-24 Geo      -> OK
//   (Paula Godoy: sin proyecto, saldo alto -> bucket "Transversal")

const fs = require('fs');

const projMeta = {
  'AUR-24': 'Aurora · Retail',
  'BOR-24': 'Borealis · Banca',
  'CIT-24': 'Citrino · Salud',
  'DEL-24': 'Delta · Energía',
  'EBA-24': 'Ébano · Telco',
  'FLO-24': 'Floral · Consumo',
  'GEO-24': 'Geo · Minería',
};

const DEF = [7, 7, 7, 8, 7, 6, 7]; // vector pulse "sano" por defecto (q0..q6)

// nombre, cargo, proyectos (el 1º = principal), vectores pulse abril/mayo (opcionales)
const people = [
  { n: 'Camila Rojas',      cargo: 'Asociada',    projs: ['AUR-24'],            abril: [8,7,7,8,7,6,7], mayo: [7,5,6,7,6,6,5] },
  { n: 'Diego Fuentes',     cargo: 'Analista',    projs: ['AUR-24','CIT-24'],   abril: [7,6,6,7,6,5,6], mayo: [6,4,5,6,5,5,4] },
  { n: 'Javiera Soto',      cargo: 'Practicante', projs: ['AUR-24'],            abril: [7,6,7,7,6,6,6], mayo: [6,5,3,6,5,6,5] },
  { n: 'Matías Vera',       cargo: 'Asociado',    projs: ['BOR-24'] },
  { n: 'Fernanda Lillo',    cargo: 'Analista',    projs: ['BOR-24'] },
  { n: 'Ignacio Reyes',     cargo: 'Analista',    projs: ['BOR-24'] },
  { n: 'Antonia Pérez',     cargo: 'Asociada',    projs: ['CIT-24'],            abril: [8,7,7,8,7,7,7], mayo: [8,7,6,8,7,7,7] },
  { n: 'Sebastián Díaz',    cargo: 'Analista',    projs: ['CIT-24'],            abril: [7,7,7,7,7,6,7], mayo: [7,7,6,7,7,6,7] },
  { n: 'Valentina Muñoz',   cargo: 'Practicante', projs: ['CIT-24'],            abril: [8,8,8,8,8,7,8], mayo: [8,8,7,8,8,7,8] },
  { n: 'Tomás Herrera',     cargo: 'Asociado',    projs: ['DEL-24'] },
  { n: 'Catalina Núñez',    cargo: 'Analista',    projs: ['DEL-24','EBA-24'] },
  { n: 'Rodrigo Castro',    cargo: 'Asociado',    projs: ['EBA-24'] },
  { n: 'Isidora Vargas',    cargo: 'Analista',    projs: ['EBA-24'] },
  { n: 'Benjamín Tapia',    cargo: 'Practicante', projs: ['EBA-24'] },
  { n: 'Francisca Morales', cargo: 'Asociada',    projs: ['FLO-24'] },
  { n: 'Martín Silva',      cargo: 'Analista',    projs: ['FLO-24'] },
  { n: 'Josefa Contreras',  cargo: 'Asociada',    projs: ['GEO-24'] },
  { n: 'Lucas Bravo',       cargo: 'Analista',    projs: ['GEO-24'] },
];

const apellidoDe = (full) => full.split(' ').slice(1).join(' ');
const nombreDe = (full) => full.split(' ')[0];

// ───────── PULSE CHECK ─────────
const meses = ['Marzo 2026', 'Abril 2026', 'Mayo 2026'];
const recogs = {
  'Camila Rojas': 'Diego se la jugó con el cliente esta semana, impecable.',
  'Antonia Pérez': 'Valentina aprende rapidísimo, gran aporte.',
};
const pc = [];
let pid = 1;
people.forEach((p) => {
  const abril = p.abril || DEF;
  const mayo = p.mayo || DEF;
  const marzo = abril; // mes más antiguo ≈ abril (la detección compara mayo vs abril)
  const porMes = { 'Marzo 2026': marzo, 'Abril 2026': abril, 'Mayo 2026': mayo };
  meses.forEach((mes) => {
    const v = porMes[mes];
    pc.push({
      'ID': pid++,
      'Hora de inicio': '',
      'Hora de finalización': '',
      'Correo electrónico': '',
      'Mes': mes,
      'Disfrute en Summa': v[0],
      'Desafío y desarrollo': v[1],
      'Feedback y apoyo': v[2],
      'Confianza para aportar': v[3],
      'Reconocimiento de líderes': v[4],
      'Rol en el desarrollo de la empresa': v[5],
      'Equilibrio vida/trabajo': v[6],
      'Comentario general': '',
      'Nombre del proyecto': p.projs[0],
      'Reconocimiento a un compañero': mes === 'Mayo 2026' ? (recogs[p.n] || '') : '',
      'Otro comentario': '',
      'Cargo': p.cargo,
    });
  });
});

// ───────── PROYECTOS ACTIVOS ─────────
const proj = [];
people.forEach((p) => {
  p.projs.forEach((code) => {
    proj.push({ 'Código': code, 'Nombre': p.n, 'Cargo': p.cargo });
  });
});

// ───────── PIT STOP ─────────
// base "sano": nums altos, señales Sí, por-discutir No
function psRow(id, nombre, code, fecha, ov) {
  ov = ov || {};
  return {
    'ID': id,
    'Hora de inicio': '',
    'Hora de finalización': '',
    'Correo': '',
    'Nombre': nombre,
    'Código de proyecto': code,
    'Fecha Pit Stop': fecha,
    'Carga de trabajo razonable (1-10)': ov.carga != null ? ov.carga : 7,
    'Claridad de objetivos (1-10)': 8,
    'Relación con el equipo (1-10)': 7,
    'Aprendizaje en el proyecto (1-10)': 8,
    '¿Cuentas con el apoyo del líder?': 'Sí',
    '¿Tienes la información para avanzar?': 'Sí',
    '¿El cliente colabora adecuadamente?': ov.clienteNo ? 'No' : 'Sí',
    '¿Te sientes con energía?': ov.energiaNo ? 'No' : 'Sí',
    '¿Has trabajado fines de semana?': ov.findeSi ? 'Sí' : 'No',
    '¿Sientes riesgo de burnout?': ov.burnoutSi ? 'Sí' : 'No',
    '¿Recomendarías seguir en este proyecto?': 'Sí',
    '¿Qué está funcionando bien?': ov.bien || 'El equipo está alineado.',
    '¿Qué mejorarías?': ov.mejora || 'Más claridad en prioridades.',
    'Comentarios adicionales': '',
  };
}
const pitstops = [
  { code: 'AUR-24', fecha: '2026-05-20', resp: { 'Camila Rojas': {}, 'Diego Fuentes': {}, 'Javiera Soto': {} } },
  { code: 'AUR-24', fecha: '2026-06-04', resp: {
      'Camila Rojas': { findeSi: true },
      'Diego Fuentes': { energiaNo: true, findeSi: true, burnoutSi: true, mejora: 'Carga muy alta las últimas semanas.' },
      'Javiera Soto': { energiaNo: true } } },
  { code: 'BOR-24', fecha: '2026-06-03', resp: {
      'Matías Vera': { carga: 2, findeSi: true },
      'Fernanda Lillo': { carga: 3 },
      'Ignacio Reyes': { carga: 3 } } },
  { code: 'DEL-24', fecha: '2026-05-10', resp: { 'Tomás Herrera': {}, 'Catalina Núñez': {} } }, // antiguo -> ceguera
  { code: 'CIT-24', fecha: '2026-06-02', resp: { 'Antonia Pérez': {}, 'Sebastián Díaz': {}, 'Valentina Muñoz': {} } },
  { code: 'EBA-24', fecha: '2026-06-05', resp: { 'Rodrigo Castro': {}, 'Isidora Vargas': {}, 'Benjamín Tapia': {} } },
  { code: 'FLO-24', fecha: '2026-06-01', resp: { 'Francisca Morales': {}, 'Martín Silva': {} } },
  { code: 'GEO-24', fecha: '2026-06-04', resp: { 'Josefa Contreras': {}, 'Lucas Bravo': {} } },
];
const ps = [];
let psid = 1;
pitstops.forEach((m) => {
  Object.keys(m.resp).forEach((nombre) => {
    ps.push(psRow(psid++, nombre, m.code, m.fecha, m.resp[nombre]));
  });
});

// ───────── TRASLADOS PM ─────────
function trRow(full, fecha, hora, code) {
  return {
    'Nombre': nombreDe(full),
    'Apellido': apellidoDe(full),
    'Email': '',
    'Servicio': 'UberX',
    'Ciudad': 'Santiago',
    'Fecha de solicitud (local)': fecha,
    'Hora de solicitud (local)': hora,
    'Fecha de inicio (local)': fecha,
    'Hora de inicio (local)': hora,
    'Origen': 'Oficina Summa',
    'Destino': 'Domicilio',
    'Distancia (km)': '8.4',
    'Fecha de llegada (local)': fecha,
    'Hora de llegada (local)': hora,
    'Monto': '7900',
    'Programa': code,
  };
}
const trips = [
  // Semana anterior (05/21) — base de comparación
  ['Diego Fuentes', '05/21/2026', '9:20PM', 'AUR-24'],   // AUR ya tardío antes -> persistente
  ['Matías Vera',   '05/21/2026', '7:40PM', 'BOR-24'],
  ['Sebastián Díaz','05/21/2026', '6:50PM', 'CIT-24'],
  // Semana más reciente (05/28-29) — donde se evalúan las alertas
  ['Diego Fuentes', '05/28/2026', '9:42PM', 'AUR-24'],   // tardío
  ['Javiera Soto',  '05/28/2026', '10:15PM','AUR-24'],   // tardío
  ['Camila Rojas',  '05/29/2026', '9:05PM', 'AUR-24'],   // tardío
  ['Fernanda Lillo','05/29/2026', '12:35AM','BOR-24'],   // TRASNOCHE (nuevo)
  ['Matías Vera',   '05/28/2026', '8:50PM', 'BOR-24'],   // no-alerta
  ['Sebastián Díaz','05/28/2026', '9:30PM', 'CIT-24'],   // tardío (nuevo)
  ['Antonia Pérez', '05/29/2026', '9:50PM', 'CIT-24'],   // tardío (nuevo)
  ['Martín Silva',  '05/28/2026', '7:10PM', 'FLO-24'],   // no-alerta
];
const tr = trips.map((t) => trRow(t[0], t[1], t[2], t[3]));

// ───────── VACACIONES ─────────
// saldo total = legal + admin ; >15 dispara alerta. Coma decimal como strings.
function vacRow(nombre, cargo, futL, salL, futA, salA) {
  return {
    'Empleado - Nombre Completo': nombre,
    'Empleado - Cargo': cargo,
    'Vacaciones - Vacaciones tomadas a futuro legales': futL,
    'Vacaciones - Saldo vacaciones tomadas a futuro legales': salL,
    'Vacaciones - Vacaciones tomadas a futuro administrativos': futA,
    'Vacaciones - Saldo vacaciones tomadas a futuro administrativos': salA,
  };
}
// saldos altos sembrados
const vacHigh = {
  'Antonia Pérez':  ['0,0', '9,5',  '0,0', '7,0'],  // 16,5 (sin futuras pedidas)
  'Rodrigo Castro': ['5,0', '12,0', '0,0', '6,5'],  // 18,5
  'Diego Fuentes':  ['0,0', '10,0', '0,0', '6,0'],  // 16,0 (en AUR-24 y CIT-24)
};
const vac = [];
const seenVac = new Set();
people.forEach((p) => {
  if (seenVac.has(p.n)) return;
  seenVac.add(p.n);
  if (vacHigh[p.n]) {
    const h = vacHigh[p.n];
    vac.push(vacRow(p.n, p.cargo, h[0], h[1], h[2], h[3]));
  } else {
    vac.push(vacRow(p.n, p.cargo, '3,0', '4,0', '0,0', '2,0')); // saldo bajo ~6
  }
});
// persona sin proyecto, saldo alto -> bucket transversal
vac.push(vacRow('Paula Godoy', 'Asociada', '0,0', '11,0', '0,0', '6,0')); // 17,0

// ───────── EMIT ─────────
const MOCK = { projMeta, refDate: '2026-06-08', pc, ps, tr, vac, proj };
const out =
  '// Datos mock generados por gen_mock.js — estructura idéntica a los 5 archivos reales.\n' +
  'var MOCK = ' + JSON.stringify(MOCK, null, 1) + ';\n' +
  "if(typeof window!=='undefined'){window.MOCK=MOCK;}\n";
fs.writeFileSync(__dirname + '/mock_data.js', out);
console.log('mock_data.js escrito.');
console.log('  pulse rows :', pc.length, '| pitstop rows:', ps.length, '| traslados:', tr.length, '| vacaciones:', vac.length, '| proyectos:', proj.length);
