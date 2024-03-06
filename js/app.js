
//VARIABLES
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
let presupuesto;



//EVENTOS
cargarEventListener();


function cargarEventListener(){

    document.addEventListener('DOMContentLoaded', askPres);
    formulario.addEventListener('submit', agregarGasto);
}

//CLASES
class UI {
    insertarPresupuesto(cantidad) {
        //Extraes valores
        const {presupuesto, restante} = cantidad;
        //Creas HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;

    }

    imprimirAlerta(msg, tipo) {
        //crear div mensaje.
        const divmsg = document.createElement('div');
        divmsg.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divmsg.classList.add('alert-danger');
        } else {
            divmsg.classList.add('alert-success');
        }
        //añadir mensaje texto.

        divmsg.textContent = msg;

        document.querySelector('.primario').insertBefore(divmsg, formulario);

        setTimeout(() => {
            divmsg.remove();
        }, 3000)

    }

    imprimirListaGastos(gastos) {
        //Elimina HTML previo

        this.limpiarHTML();

        //Iterar

        gastos.forEach(gasto => {
            const {cantidad, nombre, id} = gasto;

            const newGasto = document.createElement('li');
            newGasto.classNames = 'list-group-item d-flex justify-content-between align-items-center';

            //newGasto.setAttribute('data-id','id'); version antigua
            newGasto.dataset.id = id; //nueva version

            //Agregar HTML del gasto
            newGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill ">$ ${cantidad} </span>`;

            //Boton que borra:
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.onclick = () =>{
                eliminarGasto(id);
            }
            newGasto.appendChild(btnBorrar);

            //Agregar al HTML.
            gastoListado.appendChild(newGasto);
        });
    }

    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const{presupuesto, restante} = presupuestoObj;
        const restantediv = document.querySelector('.restante');
        if((presupuesto/4 )> restante ){
                restantediv.classList.remove('alert-success', 'alert-warning');
                restantediv.classList.add('alert-danger');
        }else if((presupuesto/2 )> restante ){
                restantediv.classList.remove('alert-success');
                restantediv.classList.add('alert-warning');
        }else{
            restantediv.classList.remove('alert-warning','alert-danger');
            restantediv.classList.add('alert-success');
        }
        //Total 0 o menor
        if(restante<=0){
            ui.imprimirAlerta('Presupuesto terminado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }


}

class Presupuesto{
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto){
    this.gastos = [...this.gastos , gasto];
    this.calcularRestante();
    }
    calcularRestante(){
        const gastado = this.gastos.reduce((total,gasto)=> total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}
const ui = new UI();


//FUNCIONES


function askPres(){
    const presupuestoUser = prompt('¿Cúal es tu presupuesto inicial?'); //Ventana inicial preguntando preuspuesto.
    if(presupuestoUser === '' || presupuestoUser === null || isNaN(presupuestoUser) || presupuestoUser === 0){

        window.location.reload();
    }
    presupuesto = new Presupuesto(presupuestoUser);

    ui.insertarPresupuesto(presupuesto)
}
function agregarGasto (e){
    e.preventDefault()

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //Validar.

    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios.','error');
        return;
    }else if ((cantidad <= 0 )|| isNaN(cantidad)){
        ui.imprimirAlerta('Dato introducido no valido', 'error');
        return;
    }

    //Objeto Gasto
    const gasto = {nombre, cantidad, id: Date.now()};

    presupuesto.nuevoGasto(gasto);

    ui.imprimirAlerta('Gasto agregado');

    const {gastos, restante} = presupuesto
    ui.imprimirListaGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
    formulario.reset();
}

function eliminarGasto(id){

    //Elimina de clase
    presupuesto.eliminarGasto(id);

    //Elimina de HTML
    const {gastos, restante} = presupuesto;
    ui.imprimirListaGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}


