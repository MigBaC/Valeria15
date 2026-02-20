const URL_WEB_APP = "https://script.google.com/macros/s/AKfycbw0l0C4ofK5Otk09Jg0I2jt17iuoQbBFVZBJ5Jcb4JMVjYDlwUvdASkMnbljUUpcn_F0A/exec"; 

function abrirInvitacion() {
    const overlay = document.getElementById('overlay-invitacion');
    const contenido = document.getElementById('contenido-invitacion');
    const audio = document.getElementById('musicaFondo');

    overlay.classList.add('overlay-hidden');
    contenido.classList.remove('hidden');
    document.body.classList.remove('no-scroll');

    if (audio.paused) {
        audio.play().catch(e => console.log("Audio esperando interacción"));
    }
}

function iniciarReloj() {
    const evento = new Date('April 2, 2026 19:00:00').getTime();
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
    if (nIn.value.length < 3) { msg.innerText = "Ingresa tu nombre completo"; return; }
    
    msg.innerText = "Buscando en la lista de gala...";
    btn.disabled = true;

    try {
        const res = await fetch(`${URL_WEB_APP}?action=buscar&nombre=${encodeURIComponent(nIn.value.trim())}`);
        const data = await res.json();
        
        if (data.status === "ya_confirmado") {
            document.getElementById('confirm-area').innerHTML = `
                <div style="border: 2px solid var(--gold); padding: 20px; border-radius: 15px;">
                    <h3 class="cursive">¡Hola ${data.nombre}!</h3>
                    <p>Tu asistencia ha sido confirmada para <b>${data.pases}</b> personas.</p>
                </div>`;
        } else if (data.status === "ok") {
            window.datosInvitado = data;
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'block';
            document.getElementById('welcome-txt').innerHTML = `Es un honor contar contigo <br><strong>${data.nombre}</strong>`;
            const sel = document.getElementById('cSel');
            sel.innerHTML = "";
            for (let i = 1; i <= data.cupos; i++) {
                let opt = document.createElement('option');
                opt.value = i; opt.text = i === 1 ? "1 Persona" : `${i} Personas`;
                sel.add(opt);
            }
        } else { msg.innerText = "No se encuentra en la lista oficial."; }
    } catch (e) { msg.innerText = "Error de conexión."; }
    finally { btn.disabled = false; }
}

async function confirmarFinal() {
    const cant = document.getElementById('cSel').value;
    const btn = document.querySelector('#step2 .btn-confirm');
    btn.disabled = true;
    try {
        await fetch(`${URL_WEB_APP}?action=confirmar&fila=${window.datosInvitado.fila}&confirmados=${cant}`, { mode: 'no-cors' });
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        document.getElementById('confirm-area').innerHTML = "<h3 class='cursive'>¡Confirmado!</h3><p>Te esperamos para celebrar esta noche inolvidable.</p>";
    } catch (e) { alert("Error"); btn.disabled = false; }
}

function agregarACalendario() {
    window.open("https://www.google.com/calendar/render?action=TEMPLATE&text=Mis+XV+Valeria+Unda&dates=20260402T190000/20260403T020000&details=Vestimenta:+Gala");
}

window.onload = iniciarReloj;
