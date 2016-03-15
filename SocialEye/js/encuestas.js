function Encuestas() {

    var widgetEncuestasCreado = false;
    var widgetEncuestasAbierto = false;
    var debateBox;
    var listaEncuestas;
    var numPreguntaEncuesta;
    var questions;
    var votos;
    var idEncuestaActual;
    var numeroActualResultado;
    var porcentajes;

    this.iniciarWidgetEncuestas = function () {
        $("#widgetEncuestas").click(function (e) {
            debateBox = e.target;
            if (widgetEncuestasCreado) {
                if (widgetEncuestasAbierto) //La ventana está creada y mostrándose
                    deSeleccionarWidgetEncuestas(debateBox);
                else   //La ventana está creada y oculta
                    seleccionarWidgetEncuestas(e.target);
            }
            else //No se creó la ventana general
                crearWidgetEncuestas(e.target);
        });

    }


    this.cerrarBox = function () {
        if (widgetEncuestasAbierto) {
            deSeleccionarWidgetEncuestas(debateBox);
        }
    }

    function crearWidgetEncuestas(unWidget) {
        $("body").append(crearMenuEncuestas());
        $("#crearEncuesta").on('click', function (e) {
            crearModalEncuesta();
        });
        //debate.attr("style", "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;");
        unWidget.style.cssText = "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;";
        $("#cerrarEncuestas").on("click", function (event) {
            deSeleccionarWidgetEncuestas(unWidget);
            $("#divEncuestas").hide();
        });
        widgetEncuestasCreado = true;
        widgetEncuestasAbierto = true;

    }

    function seleccionarWidgetEncuestas(unWidget) {
        unWidget.style.cssText = "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;";
        $("#divEncuestas").show();
        widgetEncuestasAbierto = true;
    }


    function deSeleccionarWidgetEncuestas(unWidget) {
        unWidget.style.cssText = "";
        $("#divEncuestas").hide();
        widgetEncuestasAbierto = false;
    }

    function crearMenuEncuestas() {
        var dominio = window.location.hostname;
        var listaEncuestas = "<div class='detailBox' id='divEncuestas'>";
        listaEncuestas += "<div class='titleBox socialEye' id='tituloListaEncuestas'>";
        listaEncuestas += "<label class=> Encuestas activas en: " + dominio + "</label>";
        listaEncuestas += "<a id='crearEncuesta' title='Crear Encuesta'><span  class='fa fa-plus fa-stack-1x'></span></a>";
        listaEncuestas += "<button class='close botonCerrar' id='cerrarEncuestas' aria-hidden='true'>&times;</button>";
        listaEncuestas += "</div>";
        listaEncuestas += "<div class='actionBox'>";
        listaEncuestas += "<ul id='listaEncuestas' class='commentList socialEye'>";
        //Creo los objetos
        $.ajax({
            url: "https://127.0.0.1:8000/widgetRest/poll_list/", // the endpoint
            type: "POST", // http method
            data: {url: dominio},
            dataType: 'json',
            async: false,
            success: function (data) {
                $.each(data, function (i, item) {
                    listaEncuestas += "<li><button type='button' id='"+item.pk+ "' class='list-group-item socialEye filaEncuesta'> <div class='tituloEncuesta'>" + item.description + "</div>  <div class='subtituloEncuesta'> creada por " + item.poll_user__username + " el "+ item.date+ "  </div> </button></li>";
                });
            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {

            }
        });


        listaEncuestas += "</div>";
        listaEncuestas += "</div>";
        return listaEncuestas;

    }
    $(document.body).on('click', '.filaEncuesta' ,function(){
            idEncuestaActual=this.id;
             $.ajax({
            url: "https://127.0.0.1:8000/widgetRest/poll_details/", // the endpoint
            type: "GET", // http method
            data: {idEncuesta: idEncuestaActual},
            dataType: 'json',
            async: false,
            success: function (data) {
                $("body").append(modalVotacion());
                $("#votar").prop( "disabled", false );
                votos={};
                $("#resultados").hide();
                numPreguntaEncuesta=0;
                questions=data[0]['questions'];
                $('#vote').modal('show');
                siguientePregunta();
            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {

            }
        });

        });

    function crearModalEncuesta() {
        var numPregunta = 1;
        var numOpcion = 1;
        var encuestaPropia = [];
        var opciones = [];
        modal = "<div id='modalEncuesta' class='container'>";
        modal+="<div class='row'>";
        modal+="<div class='modal fade' id='encueste' tabindex='-1' role='dialog' aria-labelledby='voteLabel' aria-hidden='true'>";
        modal+="<div class='modal-dialog'>";
        modal+="<div class='panel panel-primary'>";
        modal+="<div class='panel-heading' id='divNuevaEncuesta'>";
        modal+="<button type='button' class='close botonCerrar' data-dismiss='modal'>x</button>";
        modal+="<h3>Nueva encuesta</h3>";
        modal+="</div>";
        modal+="<br>";
        modal+="<div class='modal-body'>";
        modal+="<form  id='formEncuesta'>";
        modal+="<input type='text'  id='titEncuesta' class='form-control inputEncuesta' placeholder='Ingrese el título de la encuesta'/>";
        modal+= "<a id='agregarPregunta' title='Nueva pregunta'><i class='fa fa-question-circle fa-stack-1x' id='iconoPregunta'> </i></a>";
        modal+= "</div>";
        modal+="<br><br><br><br>";
        modal+= "<div id='divPreguntas' class='form-group'>";
        modal+= "<input type='text' id='pregunta" + numPregunta + "' class='form-control inputPregunta' placeholder='Ingrese una pregunta'/>";
        modal+= "<a id='" + numPregunta + "' title='Nueva opción' class='agregarOpcion'><i class='fa fa-plus fa-stack-1x' id='iconoMas'> </i></a>";
        modal+= "</div><br><br>";
        modal+= "<div id='divBotonNuevaEncuesta'><button id='agregarEncuesta' class='btn btn-primary'>Crear Encuesta</button><div>";
        modal+= "</form>";
        modal+="</div>";
        modal+="<div class='modal-body'>";
        modal+="<ul id='listaOpciones' class='list-group'>";
        modal+="</ul>";
        modal+="</div>";
        modal+="</div>";
        modal+="</div>";
        modal+="</div>";
        modal+="</div>";
        $('body').append(modal);
        $('#encueste').modal('show');
        //var input = document.createElement('input');
        //input.className="form-control";
        //input.type="text";
        //input.placeholder="Ingrese el contenido de la pregunta";
        $("#agregarPregunta").on('click', function (e) {
            numPregunta++;
            $("#divPreguntas").append("<br><br><br><div><input type='text' id='pregunta" + numPregunta + "' class='form-control inputPregunta' placeholder='Ingrese una pregunta'/>");
            $("#divPreguntas").append("<a id='" + numPregunta + "' title='Nueva opción' class='agregarOpcion'><i class='fa fa-plus fa-stack-1x' id='iconoMas'> </i></a></div>");
        });
        $(document.body).on('click', '.agregarOpcion' ,function(){
            var id = this.id;
            bootbox.prompt("Ingrese la opción de la pregunta", function (result) {
                if (result) {
                    var opcion={};
                    opcion[id]=result;
                    opciones.push(opcion);

                }
                else {
                    if (result !== null) {
                        bootbox.alert("Usted no ha ingresado ninguna opcion");
                        return false;
                    }
                }
            });
        });

        $("#agregarEncuesta").on('click', function (e) {
            if ($("#titEncuesta").val() != '') {
                enviarEncuesta(opciones);
                $('.modal-backdrop').remove();
                $('#modalEncuesta').remove();

            } else {
                bootbox.alert('Usted debe escribir el titulo de la encuesta');
            }
        });
    }


    function enviarEncuesta(opciones) {
        var preguntas = {};
        var inputs = $('#divPreguntas').find('input');
        $.each(inputs, function (index, value) {
            preguntas[index + 1] = $(value).val();
        });

        $.ajax({
            url: "https://127.0.0.1:8000/widgetRest/poll_add/", // the endpoint
            type: "POST", // http method
            data: {
                preguntas: JSON.stringify(preguntas),
                opciones: JSON.stringify(opciones),
                descripcion: $("#titEncuesta").val(),
                url:window.location.hostname
            },
            dataType: 'json',
            async: false,
            success: function (data) {

            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {

            }
        });
    }

    function modalVotacion(){
        var modal="<div id='modalVotacion' class='container'>";
        modal+="<div class='row'>";
        modal+="<br/><br/><br/>";
        //modal+="<a class='btn btn-primary btn-lg' data-toggle='modal' data-target='#vote' data-original-title> Vota Ahora!</a>";
        modal+="<div class='modal fade' id='vote' tabindex='-1' role='dialog' aria-labelledby='voteLabel' aria-hidden='true'>";
        modal+="<div class='modal-dialog'>";
        modal+="<div class='panel panel-primary'>";
        modal+="<div class='panel-heading'>";
        modal+="<button type='button' class='close botonCerrar' data-dismiss='modal' aria-hidden='true'>*</button>";
        modal+="<h4 id='tituloPregunta' class='panel-title' id='voteLabel'><span class='glyphicon glyphicon-arrow-right'></span></h4>";
        modal+="</div>";
        modal+="<div class='modal-body'>";
        modal+="<ul id='listaOpciones' class='list-group'>";
        modal+="</ul>";
        modal+="</div>";
        modal+="<div class='modal-footer'>";
        modal+="<button id='votar' type='button' class='btn btn-success btn-vote'>Votar</button>";
        modal+="<button type='button' class='btn btn-default btn-close' data-dismiss='modal'>Cerrar</button>";
        modal+="</div>";
        modal+="<div id='resultados' class='row vote-results results'>";
        modal+="<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' id='barraResultados' style='margin-left: 5px;'>";
        modal+="</div>";
        modal+="<button type='button' id='siguiente' class='btn btn-default' style='margin-left:20px'>Siguiente</button>";
        modal+="</div>";
        modal+="</div>";
        modal+="</div>";
        return modal;
    }

    var panels = $('.vote-results');
    var panelsButton = $('.dropdown-results');
    panels.hide();
     $(document.body).on('click', '#verResultados' ,function(){
        $("#resultados").show();
    });

    $(document.body).on('click', '#votar' ,function(){
        if ($("#listaOpciones").find('input:radio').is(":checked")) {
            votos[$('#listaOpciones input:checked').attr('class')] = $('#listaOpciones input:checked').attr('id');
        }
        else {
            bootbox.alert("Debe seleccionar una opcion");
            return false;
        }
        siguientePregunta();
    });
    //Click dropdown
    panelsButton.click(function() {
        //get data-for attribute
        var dataFor = $(this).attr('data-for');
        var idFor = $(dataFor);

        //current button
        var currentButton = $(this);
        idFor.slideToggle(400, function() {
            //Completed slidetoggle
            if(idFor.is(':visible'))
            {
                currentButton.html('Hide Results');
            }
            else
            {
                currentButton.html('View Results');
            }
        })
    });

    function siguientePregunta(){
        if (numPreguntaEncuesta<questions.length){
            $("#tituloPregunta").html(questions[numPreguntaEncuesta]['question']);
            $("#listaOpciones").empty();
            $.each(questions[numPreguntaEncuesta]['options'], function (index, option) {
                opciones="<li class='list-group-item opcion'>";
                opciones+="<div class='radio'>";
                opciones+="<label>";
                opciones+="<input id='"+option['pk']+"' class='"+questions[numPreguntaEncuesta]['pk']+"' type='radio' name='optionsRadios'/>";
                opciones+=option['option'];
                opciones+="</label>";
                opciones+="</div>";
                opciones+="</li>";
                $("#listaOpciones").append(opciones);
             });
        }
        else {
            $.ajax({
            url: "https://127.0.0.1:8000/widgetRest/poll_vote/", // the endpoint
            type: "POST", // http method
            data: {votos: JSON.stringify(votos),
                    idEncuestaActual:idEncuestaActual},
            async: false,
            success: function () {
                 //porcentajes=data;
                 numeroActualResultado=0;
                 $("#resultados").show();
                 $("#votar").prop( "disabled", true );
                 pedirResultado();
            },
            // handle a non-successful response
            error: function (xhr, errmsg, err) {

            }
        });
            //$("#resultados").show();
        }
        numPreguntaEncuesta++;
    }

    function siguienteResultado(votos,cantVotos){
             $("#tituloPregunta").html(questions[numeroActualResultado]['question']);
            $("#listaOpciones").empty();
            $.each(questions[numeroActualResultado]['options'], function (index, option) {
                opciones="<li class='list-group-item opcion'>";
                opciones+="<div class='radio'>";
                opciones+="<label>";
                opciones+="<input id='"+option['pk']+"' class='"+questions[numeroActualResultado]['pk']+"' type='radio' name='optionsRadios'/>";
                opciones+=option['option'];
                opciones+="</label>";
                opciones+="</div>";
                opciones+="</li>";
                $("#listaOpciones").append(opciones);
             });



             $("#barraResultados").empty();
             $.each(questions[numeroActualResultado]['options'], function (index, option) {
                 var cantVotosOpcion = 0;
                 $.each(votos, function (index, voto) {
                     if (voto['question_option__pk'] == option['pk'])
                        cantVotosOpcion++;
                 });
                 var porcentajeOpcion = cantVotosOpcion * 100;
                 if (porcentajeOpcion == 0)
                    porcentajeOpcion = 0;
                 else
                    porcentajeOpcion = porcentajeOpcion / cantVotos;
                 barra = option['option'];
                 barra += "<div class='progress'>";
                 barra += "<div class='progress-bar progress-bar-success' role='progressbar' aria-valuenow='20' aria-valuemin='0' aria-valuemax='100' style='width:" + porcentajeOpcion.toFixed(2) + "%'>";
                 barra += "<span>" + porcentajeOpcion.toFixed(2) + "%</span>";
                 barra += "</div>";
                 barra += "</div>";
                 $("#barraResultados").append(barra);
             });
 
 
     }
 
     $(document.body).on('click', '#siguiente' ,function(){
         numeroActualResultado++;
         if (numeroActualResultado<questions.length) {
             pedirResultado();
         }
         else {
             $('#vote').modal('toggle');
             bootbox.alert("Gracias por hacer esta encuesta");
         }
     });

    function pedirResultado(){
        $.ajax({
            url: "https://127.0.0.1:8000/widgetRest/get_votes/", // the endpoint
            type: "POST", // http method
            data: {id_question: questions[numeroActualResultado]['pk'],
            },
            dataType: 'json',
            async: false,
            success: function (votos) {
                 siguienteResultado(votos,votos.length);
            },
            // handle a non-successful response
            error: function (xhr, errmsg, err) {

            }
        });

    }
}