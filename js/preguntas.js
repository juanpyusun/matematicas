let preguntas = [];
let areaSeleccionada = "";

async function cargarPreguntas() {
    try {
        const response = await fetch("data/preguntas.json");

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        preguntas = await response.json();

        construirFiltros();
        buscar();
    } catch (error) {
        document.getElementById("results").innerHTML =
            `<p>No se pudo cargar la base de preguntas.</p>`;
        console.error(error);
    }
}

function construirFiltros() {
    const areas = [...new Set(
        preguntas.flatMap(p => p.areas || [])
    )].sort();

    const container = document.getElementById("filters");
    container.innerHTML = "";

    for (const area of areas) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "filter-tag";
        button.textContent = area;

        button.addEventListener("click", () => {
            areaSeleccionada =
                areaSeleccionada === area ? "" : area;

            construirFiltros();
            buscar();
        });

        if (areaSeleccionada === area) {
            button.classList.add("active");
        }

        container.appendChild(button);
    }
}

function buscar() {
    const query = document
        .getElementById("search")
        .value
        .toLowerCase()
        .trim();

    const resultados = preguntas.filter(pregunta => {
        const texto = [
            pregunta.id,
            pregunta.titulo,
            pregunta.contenido,
            ...(pregunta.areas || []),
            pregunta.nivel,
            pregunta.tipo,
            ...(pregunta.keywords || [])
        ].join(" ").toLowerCase();

        const coincideTexto = !query || texto.includes(query);

        const coincideArea =
            !areaSeleccionada ||
            (pregunta.areas || []).includes(areaSeleccionada);

        return coincideTexto && coincideArea;
    });

    mostrarPreguntas(resultados);
}

function mostrarPreguntas(lista) {
    const results = document.getElementById("results");

    if (lista.length === 0) {
        results.innerHTML = "<p>No se encontraron preguntas.</p>";
        return;
    }

    results.innerHTML = "";

    for (const pregunta of lista) {
        const article = document.createElement("article");
        article.className = "question";

        const tags = (pregunta.areas || [])
            .map(area => `<span class="tag">${escapeHtml(area)}</span>`)
            .join("");

        const video = pregunta.video
            ? `<div class="video">
                 <a href="${escapeAttribute(pregunta.video)}"
                    target="_blank" rel="noopener">
                    Ver video
                 </a>
               </div>`
            : "";

        article.innerHTML = `
            <div class="question-id">${escapeHtml(pregunta.id)}</div>
            <h3>${escapeHtml(pregunta.titulo)}</h3>
            <div class="tags">${tags}</div>
            <div class="content">${renderMarkdownBasico(pregunta.contenido)}</div>
            ${video}
        `;

        results.appendChild(article);
    }

    if (window.MathJax) {
        MathJax.typesetPromise();
    }
}

function renderMarkdownBasico(texto) {
    // Se mantiene deliberadamente simple.
    // Para Markdown completo se puede añadir marked.js posteriormente.
    return escapeHtml(texto)
        .replace(/^### (.*)$/gm, "<h5>$1</h5>")
        .replace(/^## (.*)$/gm, "<h4>$1</h4>")
        .replace(/^# (.*)$/gm, "<h3>$1</h3>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n\n/g, "<br><br>")
        .replace(/\n/g, "<br>");
}

function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeAttribute(value = "") {
    return escapeHtml(value);
}

document.getElementById("search").addEventListener("input", buscar);

cargarPreguntas();
