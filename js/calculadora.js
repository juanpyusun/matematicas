const expression = document.getElementById("expression");
const result = document.getElementById("result");

document.querySelectorAll("[data-symbol]").forEach(button => {
    button.addEventListener("click", () => {
        const symbol = button.dataset.symbol;
        const start = expression.selectionStart;
        const end = expression.selectionEnd;

        expression.value =
            expression.value.slice(0, start) +
            symbol +
            expression.value.slice(end);

        expression.focus();

        const position = start + symbol.length;
        expression.setSelectionRange(position, position);
    });
});

document.getElementById("execute").addEventListener("click", () => {
    const value = expression.value.trim();

    if (!value) {
        result.innerHTML = "<p>Introduce una expresión.</p>";
        return;
    }

    result.innerHTML = `
        <p><strong>Entrada:</strong></p>
        <p>\\(${escapeHtml(value)}\\)</p>
        <p>El motor matemático todavía no está implementado.</p>
    `;

    if (window.MathJax) {
        MathJax.typesetPromise();
    }
});

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}
