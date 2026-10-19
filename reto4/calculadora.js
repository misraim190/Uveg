const pantalla = document.getElementById("pantalla");
const botonesNumero = document.querySelectorAll(".numero");
const botonesOperador = document.querySelectorAll(".operador");
const botonLimpiar = document.getElementById("limpiar");
const botonIgual = document.getElementById("igual");

let numeroActual = ""; // Variable para almacenar el número actual ingresado
let numeroAnterior = ""; // Variable para almacenar el número anterior ingresado
let operacion = ""; // Variable para almacenar la operación seleccionada
let resultadoMostrado = false; // Variable para indicar si se ha mostrado un resultado

const simbolos = { "+": "+", "-": "-", "*": "×", "/": "÷" }; // simbolos para mostrar en la pantalla

// Función para actualizar la pantalla de la calculadora
function actualizarPantalla() {
    let texto = numeroAnterior;
    if (operacion !== "") {
        texto += " " + simbolos[operacion];
    }
    if (numeroActual !== "") {
        texto += " " + numeroActual;
    }
    pantalla.textContent = texto.trim() || "0"; // Mostrar 0 si no hay texto
}

function agregarNumero(valor) {
    if (resultadoMostrado) {
        numeroActual = "";
        resultadoMostrado = false;
    }
    numeroActual = numeroActual === "0" ? valor : numeroActual + valor; // Evitar que el número comience con 0
    actualizarPantalla();
}

function elegirOperador(op) {
    // si todavia no hay un numero, solo se puede cambiar la operacion ya elegida
    if (numeroActual === "") {
        if (numeroAnterior !== "") {
            operacion = op;
            actualizarPantalla();
        }
        return;
    }
    // si ya habia una operacion, se calcula el resultado antes de elegir la nueva operacion
    if (numeroAnterior !== "") {
        if (!calcular()) return; // si hubo un error en el calculo, no se cambia la operacion
    }
    resultadoMostrado = false;
    operacion = op;
    numeroAnterior = numeroActual;
    numeroActual = "";
    actualizarPantalla();
}

// devuelve true si pudo calcular, false si hubo un error (como dividir por cero)
function calcular() {
    if (numeroAnterior === "" || numeroActual === "" || operacion === "") {
        return false; // No hay suficientes datos para calcular
    }

    const a = Number(numeroAnterior);
    const b = Number(numeroActual);
    let resultado;

    switch (operacion) {
        case "+": resultado = a + b; break;
        case "-": resultado = a - b; break;
        case "*": resultado = a * b; break;
        case "/":
            if (b === 0) {
                pantalla.textContent = "Error: División por cero";
                return false; // Error: división por cero
            }
            resultado = a / b;
            break;
    }

    // toFixed(8) evita resultados con demasiados decimales, y parseFloat elimina ceros innecesarios al final
    numeroActual = String(parseFloat(resultado.toFixed(8)));
    numeroAnterior = "";
    operacion = "";
    return true;
}

function limpiar() {
    numeroActual = "";
    numeroAnterior = "";
    operacion = "";
    resultadoMostrado = false;
    actualizarPantalla();
}

// eventos (conectan los botones con las funciones)
botonesNumero.forEach(function (boton) {
    boton.addEventListener("click", function () {
        agregarNumero(boton.dataset.valor);
    });
});

botonesOperador.forEach(function (boton) {
    boton.addEventListener("click", function () {
        elegirOperador(boton.dataset.operador);
    });
});

botonIgual.addEventListener("click", function () {
    if (calcular()) {
        resultadoMostrado = true;
        actualizarPantalla();
    }
});

botonLimpiar.addEventListener("click", limpiar);