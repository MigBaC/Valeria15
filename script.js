const URL_WEB_APP = "https://script.google.com/macros/s/AKfycbw0l0C4ofK5Otk09Jg0I2jt17iuoQbBFVZBJ5Jcb4JMVjYDlwUvdASkMnbljUUpcn_F0A/exec"; 

function abrirInvitacion() {
    const videoPortada = document.getElementById('video-portada');
    if (videoPortada) { videoPortada.muted = false; videoPortada.volume = 0.8; }
    document.getElementById('overlay-invitacion').classList.add('overlay-hidden');
    document.getElementById('contenido-invitacion').classList.remove('hidden');
    document.body.classList.remove('no-scroll');
    const videoSegunda = document.getElementById('video-detalles');
    if (videoSegunda) videoSegunda.play();
}

function iniciarReloj() {
    const evento = new Date('April 4, 2026 19:00:00').getTime();
    setInterval(() => {
        const ahora = new Date().getTime();
        const diff = evento - ahora;
        if (diff > 0) {
            document.getElementById("days").innerText = Math.floor(diff / 86400000).toString().padStart(2, '0');
            document.getElementById("hours").innerText = Math.floor((diff % 86400000) / 3600000).toString().padStart(2, '0');
            document.getElementById("minutes").innerText = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        }
    }, 1000);
}

async function buscarInvitado() {
    const nIn = document.getElementById('nIn');
    const msg = document.getElementById('msg');
    const btn = document.querySelector('#step1 .btn-confirm');
    if (nIn.value.trim().length < 3) return msg.innerText = "Escribe tu nombre completo";
    msg.innerText = "Buscando..."; btn.disabled = true;
    try {
        const res = await fetch(`${URL_WEB_APP}?action=buscar&nombre=${encodeURIComponent(nIn.value.trim())}`);
        const data = await res.json();
        if (data.status === "ya_confirmado") {
            document.getElementById('confirm-area').innerHTML = `<h3 class="cursive">¡Hola ${data.nombre}!</h3><p>Ya confirmaste tu asistencia. ¡Te esperamos!</p>`;
        } else if (data.status === "ok") {
            window.datosInvitado = data;
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'block';
            document.getElementById('welcome-txt').innerHTML = `Hola <strong>${data.nombre}</strong>`;
            
            // MENSAJE DE CUPO MÁXIMO
            document.getElementById('max-pases-hint').innerText = `Tienes un máximo de ${data.cupos} ${data.cupos == 1 ? 'pase' : 'pases'} disponibles.`;
            
            const sel = document.getElementById('cSel');
            sel.innerHTML = '<option value="" disabled selected>¿Cuántos asisten?</option>';
            for (let i = 1; i <= data.cupos; i++) {
                let opt = document.createElement('option');
                opt.value = i; opt.text = i === 1 ? "👤 1 Persona" : `👥 ${i} Personas`;
                sel.add(opt);
            }
            msg.innerText = "";
        } else { msg.innerText = "No encontrado en la lista."; }
    } catch (e) { msg.innerText = "Error de conexión."; } finally { btn.disabled = false; }
}

async function confirmarFinal() {
    const sel = document.getElementById('cSel');
    if (!sel.value) return alert("Selecciona la cantidad de personas");
    const btn = document.querySelector('#step2 .btn-confirm');
    btn.disabled = true; btn.innerText = "CONFIRMANDO...";
    try {
        await fetch(`${URL_WEB_APP}?action=confirmar&fila=${window.datosInvitado.fila}&confirmados=${sel.value}`, { mode: 'no-cors' });
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#d4af37', '#ffffff', '#4b2c6d'] });
        document.getElementById('confirm-area').innerHTML = `<h3 class='cursive'>¡Listo!</h3><p>Asistencia confirmada para ${sel.value} personas.</p>`;
    } catch (e) { btn.disabled = false; alert("Error."); }
}

function agregarACalendario() {
    /*window.open("https://www.google.com/calendar/render?action=TEMPLATE&text=Mis+XV+Valeria+Unda&dates=20260402T190000/20260403T020000&details=Vestimenta:+Formal&location=Club+Biblos,+Guayaquil");*/
     window.open("https://www.google.com/calendar/render?action=TEMPLATE&text=Mis+XV+Valeria+Unda&dates=20260404T190000/20260405T020000&details=Vestimenta:+Gala.+Favor+llegar+temprano.&location=Club+Biblos,+Guayaquil");
}

window.onload = iniciarReloj;
