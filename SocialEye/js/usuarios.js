function Usuarios(){

  var widgetUsuariosCreado=false;
  var widgetUsuariosAbierto=false;
  var debateBox;
  this.iniciarWidgetUsuarios = function(){

        $("#widgetUsuarios").click(function(e) {
             debateBox = e.target;
             if(widgetUsuariosCreado){
                 if(widgetUsuariosAbierto) //La ventana está creada y mostrándose
                     deSeleccionarWidgetUsuarios(debateBox);
                 else   //La ventana está creada y oculta
                    seleccionarWidgetUsuarios(e.target);
             }
              else //No se creó la ventana general
                 crearWidgetUsuarios(e.target);
          });

   }

  
   this.cerrarBox = function(){
      if(widgetUsuariosAbierto){
          deSeleccionarWidgetUsuarios(debateBox);
      }
   }

function crearWidgetUsuarios(unWidget){
            $("body").append(crearListaDeUsuarios());
            //debate.attr("style", "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;");
            unWidget.style.cssText =  "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;";
            $("#cerrarListaUsuarios").on("click", function(event){
                deSeleccionarWidgetUsuarios(unWidget);
                $("#listaUsuarios").hide();
            });
            widgetUsuariosCreado=true;
            widgetUsuariosAbierto=true;

            return false;

   }

   function seleccionarWidgetUsuarios(unWidget){
        unWidget.style.cssText =  "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;";
        $("#listaUsuarios").show();
        widgetUsuariosAbierto=true;
   }


   function deSeleccionarWidgetUsuarios(unWidget){
        unWidget.style.cssText = "";
        $("#listaUsuarios").hide();
        widgetUsuariosAbierto=false;
   }

function crearListaDeUsuarios(){
     var dominio=window.location.hostname;
     var listaUsuarios="<div class='list-group' id='listaUsuarios'>";
     listaUsuarios+="<div class='titleBox' id='tituloListaUsuarios'>";
     listaUsuarios+="<label>Usuarios activos en: " + dominio + "</label>";
     listaUsuarios+="<button type='button' class='close' id='cerrarListaUsuarios' aria-hidden='true'>&times;</button>";
     listaUsuarios+="</div>";
       //Creo los objetos
       $.ajax({
           url : "http://127.0.0.1:8000/widgetRest/usuariosActivos/?dominio="+dominio, // the endpoint
             type : "GET", // http method
             dataType: 'json',
             async: false,
            // data : {'comment_url' : url,}, // data sent with the post request

// handle a successful response
         success : function(data) {
           $.each(data, function(i, item){
             listaUsuarios+="<a href='#' class='list-group-item'><span class='fa-stack fa-lg'><i class='fa fa-user fa-stack-1x '></i></span>"+ item.fields.activeUser_user +"</a>";
           });

         },

             // handle a non-successful response
             error : function(xhr,errmsg,err) {

             }
             });

       listaUsuarios+="</div>";
       return listaUsuarios;

   }
}