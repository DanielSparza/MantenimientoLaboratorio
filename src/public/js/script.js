//CODIGO PARA RETRAER Y DESPLEGAR EL MENU LATERAL
document.getElementById("btn_menu").addEventListener("click", desplegar_menu);

var menu_side = document.getElementById("menu_side");
var btn_menu = document.getElementById("btn_menu");
var body = document.getElementById("body");

function desplegar_menu(){
    body.classList.toggle("body_move");
    menu_side.classList.toggle("menu_side_move");
}

//OCULTA EL MENU LATERAL SI EL ANCHO DE LA PAGINA ES MENOR A 760px
if(window.innerWidth < 760){
    body.classList.add("body_move");
    menu_side.classList.add("menu_side_move");
}

//HACE QUE EL MENU REACCIONE CUANDO EL TAMAÑO DE LA PAGINA CAMBIA
window.addEventListener("resize", function(){
    if(this.window.innerWidth > 760)
    {
        body.classList.remove("body_move");
        menu_side.classList.remove("menu_side_move");
    }
    if(this.window.innerWidth < 760)
    {
        body.classList.add("body_move");
        menu_side.classList.add("menu_side_move");
    }
});

