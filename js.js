
const QUIZ = {
  titulo: "Quiz: conociendo Tauramena, Casanare",
  descripcion: "qué tanto conoces Tauramena: ubicación, economía, historia, naturaleza y cultura llanera.",
  tiempoPorPregunta: 60,
  preguntas: [
    {pregunta:"¿En qué departamento de Colombia está ubicado Tauramena?",opciones:["Meta","Casanare","Arauca","Boyacá"],correcta:1},
    {pregunta:"¿Cuál es la capital del departamento de Casanare?",opciones:["Yopal","Aguazul","Villavicencio","Paz de Ariporo"],correcta:0},
    {pregunta:"¿A qué región natural de Colombia pertenece Tauramena?",opciones:["Región Andina","Región Caribe","Región Pacífica","Orinoquía (Llanos Orientales)"],correcta:3},
    {pregunta:"Según el Censo 2018, ¿cuántos habitantes tiene Tauramena aproximadamente?",opciones:["5.000","21.700","80.000","150.000"],correcta:1},
    {pregunta:"¿Cómo se llama el campo petrolero que marcó la historia económica de Tauramena en los años 90?",opciones:["Caño Limón","Rubiales","Cusiana","Chuchupa"],correcta:2},
    {pregunta:"En 2013, Tauramena hizo una consulta popular en la que los ciudadanos dijeron «No» a...",opciones:["La ganadería extensiva","La explotación petrolera","El turismo de naturaleza","La música llanera"],correcta:1},
    {pregunta:"¿Qué animal, llamado «lobo de río», fue registrado de nuevo en Tauramena en una publicación científica reciente?",opciones:["Nutria gigante","Oso de anteojos","Jaguar","Chigüiro"],correcta:0},
    {pregunta:"¿Qué género musical llanero, con arpa, cuatro y maracas, se asocia con la cultura de Tauramena?",opciones:["Vallenato","Joropo","Bambuco","Cumbia"],correcta:1}
  ]
};

let idx = 0, score = 0, resultados = [], restante = 0, intervalo = null, respondida = false;
const app = document.getElementById("app");

function el(html){ app.innerHTML = html; }
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

function inicio(){
  idx = 0; score = 0; resultados = [];
  el(`<div class="card">
    <h1>${esc(QUIZ.titulo)}</h1>
    <p>${esc(QUIZ.descripcion)}</p>
    <ul class="info">
      <li>${QUIZ.preguntas.length} preguntas de opción múltiple</li>
      <li>Retroalimentación inmediata tras cada respuesta</li>
      <li>${QUIZ.tiempoPorPregunta} segundos por pregunta: si se acaba el tiempo, pasa a la siguiente y pierdes 1 punto</li>
    </ul>
    <button class="btn" id="start">Comenzar</button>
  </div>`);
  document.getElementById("start").onclick = mostrarPregunta;
}

function mostrarPregunta(){
  const q = QUIZ.preguntas[idx];
  respondida = false;
  restante = QUIZ.tiempoPorPregunta;
  el(`<div class="card">
    <div class="top"><span>Pregunta ${idx+1} de ${QUIZ.preguntas.length}</span><span>Puntaje: <b id="sc">${score}</b></span><span class="timer" id="tm">⏱ ${restante}s</span></div>
    <div class="bar"><i style="width:${(idx/QUIZ.preguntas.length)*100}%"></i></div>
    <h2>${esc(q.pregunta)}</h2>
    <div id="opts">${q.opciones.map((o,i)=>`<button class="opt" data-i="${i}">${esc(o)}</button>`).join("")}</div>
    <div class="msg" id="msg"></div>
    <button class="btn" id="next" hidden>${idx+1===QUIZ.preguntas.length?"Ver resultados":"Siguiente"}</button>
  </div>`);
  document.querySelectorAll(".opt").forEach(b => b.onclick = () => responder(+b.dataset.i));
  document.getElementById("next").onclick = siguiente;
  clearInterval(intervalo);
  intervalo = setInterval(tick, 1000);
}

function tick(){
  restante--;
  const t = document.getElementById("tm");
  t.textContent = "⏱ " + restante + "s";
  t.classList.toggle("low", restante <= 10);
  if (restante <= 0) tiempoAgotado();
}

function marcar(sel){
  const q = QUIZ.preguntas[idx];
  document.querySelectorAll(".opt").forEach((b,i) => {
    b.disabled = true;
    if (i === q.correcta) b.classList.add("ok");
    else if (i === sel) b.classList.add("ko");
  });
}

function responder(sel){
  if (respondida) return;
  respondida = true; clearInterval(intervalo);
  const q = QUIZ.preguntas[idx], ok = sel === q.correcta;
  if (ok) score++;
  resultados.push({q:q.pregunta, elegida:q.opciones[sel], correcta:q.opciones[q.correcta], estado: ok?"ok":"ko"});
  marcar(sel);
  const m = document.getElementById("msg");
  m.className = "msg " + (ok?"ok":"ko");
  m.textContent = ok ? "¡Correcto! +1 punto" : "Incorrecto. La respuesta correcta está en verde.";
  document.getElementById("sc").textContent = score;
  document.getElementById("next").hidden = false;
}

function tiempoAgotado(){
  if (respondida) return;
  respondida = true; clearInterval(intervalo);
  const q = QUIZ.preguntas[idx];
  score--;
  resultados.push({q:q.pregunta, elegida:null, correcta:q.opciones[q.correcta], estado:"to"});
  marcar(-1);
  const m = document.getElementById("msg");
  m.className = "msg ko";
  m.textContent = "Se acabó el tiempo. −1 punto. Pasando a la siguiente…";
  document.getElementById("sc").textContent = score;
  setTimeout(siguiente, 2000);
}

function siguiente(){
  idx++;
  idx < QUIZ.preguntas.length ? mostrarPregunta() : final();
}

function final(){
  clearInterval(intervalo);
  const total = QUIZ.preguntas.length;
  const lista = resultados.map((r,n) => `<div class="res">
    <b class="${r.estado==="ok"?"ok":"ko"}">${r.estado==="ok"?"✔ Correcta":r.estado==="to"?"⏱ Sin responder (−1)":"✘ Incorrecta"}</b> · ${n+1}. ${esc(r.q)}
    <small>${r.elegida!==null?"Tu respuesta: "+esc(r.elegida)+" · ":""}Correcta: ${esc(r.correcta)}</small></div>`).join("");
  el(`<div class="card">
    <h1>Resultado final</h1>
    <div class="final">${score} / ${total}</div>
    <p>Aciertos: ${resultados.filter(r=>r.estado==="ok").length} · Errores: ${resultados.filter(r=>r.estado==="ko").length} · Sin responder: ${resultados.filter(r=>r.estado==="to").length}</p>
    ${lista}
    <button class="btn" id="again">Reintentar</button>
  </div>`);
  document.getElementById("again").onclick = inicio;
}

inicio();
