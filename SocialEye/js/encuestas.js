var encuestas = new Widget();

var elementosEncuestas = [];

var numPreguntaEncuesta;
var questions;
var votos;
var votosResultados;
var idEncuestaActual;
var numeroActualResultado;
var votosAGuardar;
var porcentajes;

encuestas.loadWidget = function () {
    var listaEncuestas = "<div class='detailBox' id='divEncuestas'>";
    listaEncuestas += "<div class='titleBox socialEye' id='tituloListaEncuestas'>";
    listaEncuestas += "<label class=> Encuestas activas en: " + window.location.hostname + "</label>";
    listaEncuestas += "<a id='crearEncuesta' title='Crear Encuesta'><span  class='fa fa-plus fa-stack-1x'></span></a>";
    listaEncuestas += "<button class='close botonCerrar' id='cerrarEncuestas' aria-hidden='true'>&times;</button>";
    listaEncuestas += "</div>";
    listaEncuestas += "<div class='actionBox'>";
    listaEncuestas += "<ul id='listaEncuestas' class='commentList socialEye'>";
    //Creo los objetos
    params = {};
    params['tipo'] = "encuesta";
    data = encuestas.getObjects(params);
    $.each(data, function (i, item) {
        elementosEncuestas[item.id]=item.element;
        listaEncuestas += "<li><button type='button' id='"+item.id+ "' class='list-group-item socialEye filaEncuesta'> <div class='tituloEncuesta'>" + item.element.description + "</div>  <div class='subtituloEncuesta'> creada por " + item.username + " el "+ item.date+ "  </div> </button></li>";
    });
    listaEncuestas += "</div>";
    listaEncuestas += "</div>";
    return listaEncuestas;
};

//encuestas.onCloseWidget = function (){
//}

encuestas.onReady = function () {
    $(document.body).on('click', '.filaEncuesta' ,function(){
        idEncuestaActual=this.id;
        //data = encuestas.getObjects();
        encuestas.inyectHTML(modalVotacion());
        votosResultados = {} ;
        $("#votar").prop( "disabled", false );
        votosAGuardar = [];
        votos={};
        $("#resultados").hide();
        numeroActualResultado=1;
        numPreguntaEncuesta=0;
        questions = elementosEncuestas[idEncuestaActual].preguntas;
        $('#vote').modal('show');
        siguientePregunta();

    });

    $(document.body).on('click', '#verResultados' ,function(){
        $("#resultados").show();
    });

    $(document.body).on('click', '.cerrarCrear' ,function(){
        //$("#modalCrearEncuesta").empty();
        $("#encueste").remove();
        $("#modalCrearEncuesta").remove();

        $("#tituloPregunta").val("");
    });

    $(document.body).on('click', '#crearEncuesta' ,function(){
        crearModalEncuesta();
    });

    $(document.body).on('click', '#votar' ,function(){
        if ($("#listaOpciones").find('input:radio').is(":checked")) {
            votosAGuardar.push($('#listaOpciones input:checked').attr('id'));
        }
        else {
            bootbox.alert("Debe seleccionar una opcion");
            return false;
        }
        siguientePregunta();
    });

    $(document.body).on('click', '#cerrarEncuestas' ,function(){
        encuestas.close();
    });



    var panels = $('.vote-results');
    var panelsButton = $('.dropdown-results');
    panels.hide();

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

function siguientePregunta(){
    numPreguntaEncuesta++;
    if (numPreguntaEncuesta<=Object.keys(questions).length){
        $("#tituloPregunta").html(questions[numPreguntaEncuesta].pregunta);
        $("#listaOpciones").empty();
        $.each(questions[numPreguntaEncuesta]['options'], function (index, option) {
            opciones="<li class='list-group-item opcion'>";
            opciones+="<div class='radio'>";
            opciones+="<label>";
            opciones+="<input id='"+option['id']+"' class='"+option['id']+"' type='radio' name='optionsRadios'/>";
            opciones+=option['opcion'];
            opciones+="</label>";
            opciones+="</div>";
            opciones+="</li>";
            $("#listaOpciones").append(opciones);
        });
    }
    else {
        $.each(votosAGuardar,function (index,option){
            var voto = {};
            voto.idEncuesta = idEncuestaActual;
            voto.idOpcion = option;
            voto.tipo = 'voto';
            encuestas.saveObject(voto);
        });
        params = {};
        params['tipo'] = 'voto';
        params['idEncuesta'] = idEncuestaActual;
        //Creo los objetos
        votosResultados=encuestas.getObjects(params);
        $("#resultados").show();
        siguienteResultado();
    }
}

function siguienteResultado(){
    var cantVotosPregunta=0;
         $("#tituloPregunta").html(questions[numeroActualResultado]['pregunta']);
         $("#listaOpciones").empty();
         $.each(questions[numeroActualResultado]['options'], function (index, option) {
             $.each(votosResultados, function (index, val) {
                 if (val.element.idOpcion == option['id'])
                     cantVotosPregunta++;
             });
             opciones = "<li class='list-group-item opcion'>";
             opciones += "<div class='radio'>";
             opciones += "<label>";
             opciones += "<input id='" + option['id'] + "'  type='radio' name='optionsRadios'/>";
             opciones += option['opcion'];
             opciones += "</label>";
             opciones += "</div>";
             opciones += "</li>";
             $("#listaOpciones").append(opciones);
         });


         $("#barraResultados").empty();
         $.each(questions[numeroActualResultado]['options'], function (index, option) {
             var cantVotosOpcion = 0;
             $.each(votosResultados, function (index, voto) {

                 if (voto.element.idOpcion == option['id']) {
                     cantVotosOpcion++;
                 }
             });
             var porcentajeOpcion = cantVotosOpcion * 100;
             if (porcentajeOpcion == 0)
                 porcentajeOpcion = 0;
             else
                 porcentajeOpcion = porcentajeOpcion / cantVotosPregunta;
             barra = option['opcion'];
             barra += "<div class='progress'>";
             barra += "<div class='progress-bar progress-bar-success' role='progressbar' aria-valuenow='20' aria-valuemin='0' aria-valuemax='100' style='width:" + porcentajeOpcion.toFixed(2) + "%'>";
             barra += "<span>" + porcentajeOpcion.toFixed(2) + "%</span>";
             barra += "</div>";
             barra += "</div>";
             $("#barraResultados").append(barra);
         });

}

function enviarEncuesta(preguntas) {
    var inputs = $('#divPreguntas').find('input');
    $.each(inputs, function (index, value) {
        preguntas[index+1].pregunta = $(value).val();
    });
    var encues = {};
    encues.description = $("#titEncuesta").val();
    encues.preguntas = preguntas;
    encues.tipo = "encuesta";
    encuestas.saveObject(encues);
}



function crearModalEncuesta() {
    var preguntas={};
    var numPregunta = 1;
    var numOpcion = 1;
    var encuestaPropia = [];
    var opciones = [];
    var idOpcion = 0;
    modal = "<div id='modalCrearEncuesta' class='container'>";
    modal+="<div class='row'>";
    modal+="<div class='modal fade' id='encueste' tabindex='-1' role='dialog' aria-labelledby='voteLabel' aria-hidden='true'>";
    modal+="<div class='modal-dialog'>";
    modal+="<div class='panel panel-primary'>";
    modal+="<div class='panel-heading' id='divNuevaEncuesta'>";
    modal+="<button type='button' class='close botonCerrar cerrarCrear' data-dismiss='modal'>x</button>";
    modal+="<h3>Nueva encuesta</h3>";
    modal+="</div>";
    modal+="<br>";
    modal+="<div  class='modal-body'>";
    modal+="<form  id='formEncuesta'>";
    modal+="<input type='text'  id='titEncuesta' class='form-control inputEncuesta' placeholder='Ingrese el título de la encuesta'/>";
    modal+= "<a id='agregarPregunta' title='Nueva pregunta'><i class='fa fa-question-circle fa-stack-1x' id='iconoPregunta'> </i></a>";
    modal+= "</div>";
    modal+= "<div id='divPreguntas' class='form-group'>";
    modal+="<br><br><br><br>";
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

    encuestas.inyectHTML(modal);
    $('#encueste').modal('show');
    $("#agregarPregunta").on('click', function (e) {
        numPregunta++;
        $("#divPreguntas").append("<br><br><br><div><input type='text' id='pregunta" + numPregunta + "' class='form-control inputPregunta' placeholder='Ingrese una pregunta'/>");
        $("#divPreguntas").append("<a id='" + numPregunta + "' title='Nueva opción' class='agregarOpcion'><i class='fa fa-plus fa-stack-1x' id='iconoMas'> </i></a></div>");
    });
    $(document.body).on('click', '.agregarOpcion' ,function(){
        var id = this.id;
        bootbox.prompt("Ingrese la opción de la pregunta", function (result) {
            if (result) {
                if (typeof(preguntas[id]) === "undefined") {
                    preguntas[id] = {};
                    preguntas[id].options = [];
                }
                var opcion = {};
                opcion.opcion = result;
                opcion.id = idOpcion;
                idOpcion++;
                preguntas[id].options.push(opcion);
                //opciones.push(opcion);
                //preguntas[id].push(opcion);

            }
            else {
                if (result !== null) {
                    bootbox.alert("Usted no ha ingresado ninguna opcion");
                    return false;
                }
            }
        });
    });

    $(document.body).on('click','#agregarEncuesta', function (e) {
        if ($("#titEncuesta").val() != '') {
            enviarEncuesta(preguntas);
            $('.modal-backdrop').remove();
            $('#modalEncuesta').remove();

        } else {
            bootbox.alert('Usted debe escribir el titulo de la encuesta');
        }
    });


}

$(document.body).on('click', '#siguiente' ,function(){
    numeroActualResultado++;
    if (numeroActualResultado<=Object.keys(questions).length)
        siguienteResultado();
    else {
        $('#vote').modal('toggle');
        bootbox.alert("Gracias por hacer esta encuesta");
    }
});












