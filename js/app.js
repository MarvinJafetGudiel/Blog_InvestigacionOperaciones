
const lista = document.getElementById("listaMateriales");
const filtroFase = document.getElementById("filtroFase");
const filtroTipo = document.getElementById("filtroTipo");
const buscar = document.getElementById("buscar");
const contador = document.getElementById("contadorResultados");


document.getElementById("nombreEstudiante").textContent = DATOS.estudiante;
document.getElementById("nombreUniversidad").textContent = DATOS.universidad;
document.getElementById("totalMateriales").textContent = MATERIALES.length;


function nombreTipo(tipo) {
    if (tipo === "video") return "Video";
    if (tipo === "pdf") return "PDF";
    if (tipo === "presentacion") return "Presentación";
    if (tipo === "excel") return "Excel";
    return "Archivo";
}

function iconoTipo(tipo) {
    if (tipo === "video") return "▶";
    if (tipo === "pdf") return "PDF";
    if (tipo === "presentacion") return "PPT";
    if (tipo === "excel") return "XLS";
    return "DOC";
}


function crearTarjeta(material) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "material";

    const icono = document.createElement("div");
    icono.className = "material-icono";
    icono.textContent = iconoTipo(material.tipo);

    const etiqueta = document.createElement("span");
    etiqueta.className = "material-etiqueta";
    etiqueta.textContent = "FASE " + material.fase + " · " + nombreTipo(material.tipo);

    const titulo = document.createElement("h3");
    titulo.textContent = material.titulo;

    const descripcion = document.createElement("p");
    descripcion.textContent = material.descripcion;

    const enlace = document.createElement("a");
    enlace.href = material.url;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    enlace.textContent = material.tipo === "video" ? "Ver exposición →" : "Abrir material →";

    tarjeta.appendChild(icono);
    tarjeta.appendChild(etiqueta);
    tarjeta.appendChild(titulo);
    tarjeta.appendChild(descripcion);
 
    if (material.tipo === "video") {
        const botonVer = document.createElement("button");
        botonVer.className = "boton-ver-video";
        botonVer.textContent = "▶ Reproducir aquí";
        botonVer.addEventListener("click", function () {
            seleccionarVideo(material);
        });
        tarjeta.appendChild(botonVer);
    }

    tarjeta.appendChild(enlace);

    return tarjeta;
}


function mostrarMateriales() {
    lista.innerHTML = "";
    let encontrados = 0;

    for (let i = 0; i < MATERIALES.length; i++) {
        const material = MATERIALES[i];
        const faseCorrecta = filtroFase.value === "todas" ||
                             String(material.fase) === filtroFase.value;
        const tipoCorrecto = filtroTipo.value === "todos" ||
                             material.tipo === filtroTipo.value;

        const texto = (material.titulo + " " + material.descripcion).toLowerCase();
        const coincideBusqueda = texto.includes(buscar.value.toLowerCase().trim());

        if (faseCorrecta && tipoCorrecto && coincideBusqueda) {
            lista.appendChild(crearTarjeta(material));
            encontrados++;
        }
    }

    contador.textContent = encontrados + " material(es) encontrado(s)";

    if (encontrados === 0) {
        const mensaje = document.createElement("div");
        mensaje.className = "sin-resultados";

        const titulo = document.createElement("h3");
        titulo.textContent = MATERIALES.length === 0 ?
            "Aún no hay materiales publicados" : "No encontramos resultados";

        const detalle = document.createElement("p");
        detalle.textContent = MATERIALES.length === 0 ?
            "Agrega tus archivos en js/contenido.js siguiendo el manual." :
            "Prueba con otra fase, otro tipo o una búsqueda diferente.";

        mensaje.appendChild(titulo);
        mensaje.appendChild(detalle);
        lista.appendChild(mensaje);
    }
}


filtroFase.addEventListener("change", mostrarMateriales);
filtroTipo.addEventListener("change", mostrarMateriales);
buscar.addEventListener("input", mostrarMateriales);

const botonesFase = document.querySelectorAll(".enlace-fase");

for (let i = 0; i < botonesFase.length; i++) {
    botonesFase[i].addEventListener("click", function () {
        filtroFase.value = this.getAttribute("data-fase");
        filtroTipo.value = "todos";
        buscar.value = "";
        mostrarMateriales();
        document.getElementById("biblioteca").scrollIntoView();
    });
}


const botonMenu = document.getElementById("botonMenu");
const navegacion = document.getElementById("navegacion");

botonMenu.addEventListener("click", function () {
    navegacion.classList.toggle("abierta");
    botonMenu.setAttribute("aria-expanded", navegacion.classList.contains("abierta"));
});

const enlacesMenu = navegacion.querySelectorAll("a");

for (let i = 0; i < enlacesMenu.length; i++) {
    enlacesMenu[i].addEventListener("click", function () {
        navegacion.classList.remove("abierta");
        botonMenu.setAttribute("aria-expanded", "false");
    });
}


mostrarMateriales();



function direccionReproductor(url) {
    if (url.includes("drive.google.com/file/d/")) {
        const id = url.split("/d/")[1].split("/")[0];
        return "https://drive.google.com/file/d/" + id + "/preview";
    }

    if (url.includes("youtu.be/")) {
        const id = url.split("youtu.be/")[1].split("?")[0];
        return "https://www.youtube-nocookie.com/embed/" + id;
    }

    if (url.includes("youtube.com/watch?v=")) {
        const id = url.split("v=")[1].split("&")[0];
        return "https://www.youtube-nocookie.com/embed/" + id;
    }

    return "";
}


function seleccionarVideo(material) {
    const direccion = direccionReproductor(material.url);
    if (direccion === "") return;

    document.getElementById("tituloVideo").textContent = material.titulo;
    document.getElementById("detalleVideo").textContent = "Fase " + material.fase + " · " + material.descripcion;

    const enlace = document.getElementById("enlaceVideo");
    enlace.href = material.url;
    enlace.hidden = false;

    const pantalla = document.getElementById("pantallaVideo");
    pantalla.innerHTML = "";

    const video = document.createElement("iframe");
    video.src = direccion;
    video.title = material.titulo;
    video.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    video.allowFullscreen = true;
    pantalla.appendChild(video);

    document.getElementById("panelReproductor").scrollIntoView({ behavior: "smooth" });
}


function cargarSelectores() {
    for (let fase = 1; fase <= 3; fase++) {
        const selector = document.getElementById("temaFase" + fase);

        for (let i = 0; i < MATERIALES.length; i++) {
            const material = MATERIALES[i];
            if (material.fase === fase && material.tipo === "video") {
                const opcion = document.createElement("option");
                opcion.value = i;
                opcion.textContent = material.titulo;
                selector.appendChild(opcion);
            }
        }

        selector.addEventListener("change", function () {
            if (this.value !== "") {
                seleccionarVideo(MATERIALES[Number(this.value)]);
            }
        });
    }
}

cargarSelectores();
