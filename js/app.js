
//VARIABLES
const form = document.querySelector('#agregar-expense');
const expenseList = document.querySelector('#expenses ul');
let tbudget;



//EVENTOS
cargarEventListener();


function cargarEventListener(){

    document.addEventListener('DOMContentLoaded', askPres);
    form.addEventListener('submit', addExpense);
}

//CLASES
class UI {
    insertarbudget(amount) {
        //Extraes valores
        const {budget, remaining} = amount;
        //Creas HTML
        document.querySelector('#total').textContent = budget;
        document.querySelector('#remaining').textContent = remaining;

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

        document.querySelector('.primario').insertBefore(divmsg, form);

        setTimeout(() => {
            divmsg.remove();
        }, 3000)

    }

    imprimirListaExpenses(expenses) {
        //Elimina HTML previo

        this.limpiarHTML();

        //Iterar

        expenses.forEach(expense => {
            const {amount, name, id} = expense;

            const newExpense = document.createElement('li');
            newExpense.classNames = 'list-group-item d-flex justify-content-between align-items-center';

            //newExpense.setAttribute('data-id','id'); version antigua
            newExpense.dataset.id = id; //nueva version

            //Agregar HTML del expense
            newExpense.innerHTML = `${name} <span class="badge badge-primary badge-pill ">$ ${amount} </span>`;

            //Boton que borra:
            const btnDelete = document.createElement('button');
            btnDelete.classList.add('btn', 'btn-danger', 'borrar-expense');
            btnDelete.innerHTML = 'Borrar &times;'
            btnDelete.onclick = () =>{
                deleteExpense(id);
            }
            newExpense.appendChild(btnDelete);

            //Agregar al HTML.
            expenseList.appendChild(newExpense);
        });
    }

    limpiarHTML() {
        while (expenseList.firstChild) {
            expenseList.removeChild(expenseList.firstChild);
        }
    }

    actualizarremaining(remaining) {
        document.querySelector('#remaining').textContent = remaining;
    }

    comprobarbudget(budgetObj){
        const{budget, remaining} = budgetObj;
        const remainingdiv = document.querySelector('.remaining');
        if((budget/4 )> remaining ){
                remainingdiv.classList.remove('alert-success', 'alert-warning');
                remainingdiv.classList.add('alert-danger');
        }else if((budget/2 )> remaining ){
                remainingdiv.classList.remove('alert-success');
                remainingdiv.classList.add('alert-warning');
        }else{
            remainingdiv.classList.remove('alert-warning','alert-danger');
            remainingdiv.classList.add('alert-success');
        }
        //Total 0 o menor
        if(remaining<=0){
            ui.imprimirAlerta('budget ended', 'error');
            form.querySelector('button[type="submit"]').disabled = true;
        }
    }


}

class budget{
    constructor(tbudget) {
        this.budget = Number(tbudget);
        this.remaining = Number(tbudget);
        this.expenses = [];
    }
    nuevoExpense(expense){
    this.expenses = [...this.expenses , expense];
    this.calcularremaining();
    }
    calcularremaining(){
        const spend = this.expenses.reduce((total,expense)=> total + expense.amount, 0);
        this.remaining = this.budget - spend;
    }

    deleteExpense(id){
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.calcularremaining();
    }
}
const ui = new UI();


//FUNCIONES


function askPres(){
    const budgetUser = prompt('¿Cúal es tu budget inicial?'); //Ventana inicial preguntando preuspuesto.
    if(budgetUser === '' || budgetUser === null || isNaN(budgetUser) || budgetUser === 0){

        window.location.reload();
    }
    budget = new budget(budgetUser);

    ui.insertarbudget(budget)
}
function addExpense (e){
    e.preventDefault()

    const name = document.querySelector('#expense').value;
    const amount = Number(document.querySelector('#amount').value);

    //Validar.

    if(name === '' || amount === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios.','error');
        return;
    }else if ((amount <= 0 )|| isNaN(amount)){
        ui.imprimirAlerta('Dato introducido no valido', 'error');
        return;
    }

    //Objeto Expense
    const expense = {name, amount, id: Date.now()};

    budget.nuevoExpense(expense);

    ui.imprimirAlerta('Expense agregado');

    const {expenses, remaining} = budget
    ui.imprimirListaExpenses(expenses);
    ui.actualizarremaining(remaining);
    ui.comprobarbudget(budget);
    form.reset();
}

function deleteExpense(id){

    //Elimina de clase
    budget.deleteExpense(id);

    //Elimina de HTML
    const {expenses, remaining} = budget;
    ui.imprimirListaExpenses(expenses);
    ui.actualizarremaining(remaining);
    ui.comprobarbudget(budget);
}


