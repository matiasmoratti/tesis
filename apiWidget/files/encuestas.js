var encuestas = new Widget();

var elementosEncuestas = [];

var numPreguntaEncuesta;
var questions;
var votos;
var votosResultados;
var idEncuestaActual;
var numeroActualResultado;
var votosAGuardar;
var preguntas;
var numPregunta;
var opciones;
var idOpcion;
var idOpcionActual;

encuestas.loadWidget = function () {

    var encuestasBox = encuestas.getPrincipalBox('divEncuestas',"Encuestas activas en: " + window.location.hostname);
    divCrearEncuesta = encuestas.getDiv('divCrearEncuesta');
    divCrearEncuesta.classList.add('divCrearEncuesta');
    anchor = encuestas.getA('iconAddEncuesta');
    anchor.tittle = 'Crear Encuesta';
    span = encuestas.getSpan();
    iCrearEncuesta = encuestas.getI('crearEncuesta'); 
    iCrearEncuesta.classList.add('addEncuesta','fa', 'fa-plus','fa-stack-1x');
    span.appendChild(iCrearEncuesta);
    anchor.appendChild(span);
    divCrearEncuesta.appendChild(anchor);

    $(encuestasBox).find('#titulo'+encuestas.idWidget).append(divCrearEncuesta);
    var encuestasBody = encuestas.getPrincipalBody();
    var listaEncuestas = encuestas.getPrincipalList('listaEncuestas');
    //Creo los objetos
    params = {};
    params['tipo'] = "encuesta";
    data = encuestas.getObjects(params);
    $.each(data, function (i, item) {
        elementosEncuestas[item.id]=item.element;
        listaEncuestas.appendChild(agregarFilaAEncuesta(item));
    });
    encuestasBody.appendChild(listaEncuestas);
    encuestasBox.appendChild(encuestasBody);
    return encuestasBox;


    //var listaEncuestas = "<div class='detailBox' id='divEncuestas'>";
    //listaEncuestas += "<div class='titleBox socialEye' id='tituloListaEncuestas'>";
    //listaEncuestas += "<label class=> Encuestas activas en: " + window.location.hostname + "</label>";
    //listaEncuestas += "<a id='crearEncuesta' title='Crear Encuesta'><span  class='fa fa-plus fa-stack-1x'></span></a>";
    //listaEncuestas += "<button class='close botonCerrar' id='cerrarEncuestas' aria-hidden='true'>&times;</button>";
    //listaEncuestas += "</div>";
    //listaEncuestas += "<div class='actionBox'>";
    //listaEncuestas += "<ul id='listaEncuestas' class='commentList socialEye'>";
    ////Creo los objetos
    //params = {};
    //params['tipo'] = "encuesta";
    //data = encuestas.getObjects(params);
    //$.each(data, function (i, item) {
    //    elementosEncuestas[item.id]=item.element;
    //    listaEncuestas += "<li><button type='button' id='"+item.id+ "' class='list-group-item socialEye filaEncuesta'> <div class='tituloEncuesta'>" + item.element.description + "</div>  <div class='subtituloEncuesta'> creada por " + item.username + " el "+ item.date+ "  </div> </button></li>";
    //});
    //listaEncuestas += "</div>";
    //listaEncuestas += "</div>";
    //return listaEncuestas;
};

//encuestas.onCloseWidget = function (){
//}

encuestas.onReady = function () {
    $(document.body).on('click', '.filaEncuesta' ,function(){
        idEncuestaActual=getOriginalId(encuestas.idWidget,this.id);
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

    $(document.body).on('click','#agregarEncuesta', function (e) {
        if ($("#titEncuesta").val() != '') {
            var seGuardo=enviarEncuesta(preguntas);
            if (seGuardo==true) {
                bootbox.alert('La encuesta ha sido guardado');
                $("#encueste").modal('hide');
            }
            //$("#tituloPregunta").val("");
            //$( "#modalCrearEncuesta").empty();

        } else {
            bootbox.alert('Usted debe escribir el titulo de la encuesta');
        }
    });


    $(document.body).on('click', '#'+encuestas.idWidget+'crearEncuesta' ,function(){
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

    $(document.body).on('click', '.eliminarPregunta' ,function(){
        id=this.id.split("eliminar")[1];
        $("#divPregunta"+id).remove();
        delete preguntas[id];
        debugger;
        //$(document.body).remove($("#pregunta"+id));
    });

    $(document.body).on('hidden.bs.modal', "#encueste", function () {
        $("#encueste").remove();
    });

    $(document.body).on('hidden.bs.modal',"#modalOpcion", function () {
        $("#modalOpcion").remove();
    });

    $(document.body).on('hidden.bs.modal',".botonCerrarOpcion", function () {
        $("#modalOpcion").remove();
    });

    $(document.body).on('hidden.bs.modal',"#vote", function () {
        $("#vote").remove();
    });

    $(document.body).on('click',"#guardarOpcion",function(e){
        var num = 0;
        $(".inputOpcion").each(function(index, element) {
            cortado = $.trim($(element).val());
            $(element).val(cortado);
            if($(element).val()!="")
                num++;
        });
        if (num >=2){
            preguntas[idOpcionActual] = {};
            preguntas[idOpcionActual].options = [];
            $(".inputOpcion").each(function(index, element) {
            cortado = $.trim($(element).val());
            $(element).val(cortado);
            if($(element).val()!="") {
                var opcion = {};
                opcion.opcion = $(element).val();
                opcion.id = idOpcion;
                idOpcion++;
                preguntas[idOpcionActual].options.push(opcion);
            }
         });
            $("#modalOpcion").modal('hide');
        }
        else
            bootbox.alert("Usted debe ingresar al menos dos opciones ");
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
    var modal="<div class='modal fade' id='vote' tabindex='-1' role='dialog' aria-labelledby='voteLabel' aria-hidden='true'>";
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
    return modal;
}

function modalAgregarOpcion(idPreguntaSeleccionada){
    var modal="<div class='modal fade' id='modalOpcion' tabindex='-1' role='dialog' aria-hidden='true'>";
    modal+="<div class='modal-dialog'>";
    modal+="<div class='panel panel-primary'>";
    modal+="<div class='panel-heading'>";
    modal+="<button type='button' class='close botonCerrarOpcion' data-dismiss='modal' aria-hidden='true'>*</button>";
    modal+="</div>";
    modal+="<div class='modal-body'>";
    modal+="<div class='container'>";
    modal+="<div class='row'>"
    modal+="<input type='hidden' name='count' value='1' />";
    modal+="<div class='control-group tituloOpciones' id='fields'>";
    modal+="<h4 class='control-label' for='field1'>Ingrese las posibles opciones de respuesta</h4>";
    modal+="<div class='controls' id='profs'>";
    if (typeof preguntas[idPreguntaSeleccionada] === "undefined") {
        modal += "<form class='input-append'>";
        modal += "<div id='field'><input autocomplete='off' class='input form-control inputOpcion' id='field1' name='prof1' type='text' placeholder='Escriba la opcion' data-items='8'/><button id='b1' class='btn add-more' type='button'>+</button></div>";
        modal += "</form>";
        modal += "<br>";
        modal += "<small>Presione + para agregar otra opcion </small>";
        modal += "</div>";
    }
    else {
        var next = 0;
       $.each(preguntas[idPreguntaSeleccionada].options, function (index, option) {
           next += 1;
           if (next ==1){
               modal += "<form class='input-append'>";
            modal += "<div id='field'><input autocomplete='off' value='"+option.opcion+"' class='input form-control inputOpcion' id='field1' name='prof1' type='text' placeholder='Escriba la opcion' data-items='8'/><button id='b1' class='btn add-more' type='button'>+</button>";
            modal+="</div>";
            modal += "</form>";
           }
           else {
               modal += "<form class='input-append'>";
            modal += "<div id='field"+next+"'><input autocomplete='off' value='"+option.opcion+"' class='input form-control inputOpcion' id='field' name='prof1' type='text' placeholder='Escriba la opcion' data-items='8'/><button id='b1' class='btn add-more' type='button'>+</button>";
            modal += "<button id='remove" + next + "' class='btn btn-danger remove-me' >-</button></div><div id='field'>";
            modal+="</div>";
            modal += "</form>";
           }
       });
         modal += "<br>";
            modal += "<small>Presione + para agregar otra opcion </small>";
            modal += "</div>";
    }
    modal+="</div>";
    modal+="<div class='modal-footer footerOpcion'>";
    modal+="<button id='guardarOpcion' type='button' class='btn btn-success btn-vote'>Guardar opciones</button>";
    modal+="<button type='button' class='btn btn-default btn-close botonCerrarOpcion' data-dismiss='modal'>Cerrar</button>";
    modal+="</div>";
    modal+="</div>";
    modal+="</div>";
    modal+="</div>";
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
    var hayAlMenosUna = false;
    var inputs = $('#divPreguntas').find('input');
    var pasoValidacion = true;
    $.each(inputs, function (index, value) {
        var cortado = $.trim($(value).val());
        if (cortado ==""){
            if (!(typeof preguntas[index+1]==="undefined") && !(typeof preguntas[index+1].options==="undefined")) {
                if (preguntas[index+1].options.length > 1) {
                    bootbox.alert("El titulo de la pregunta esta vacio pero contiene al menos dos opciones como respuesta");
                    pasoValidacion = false;
                }
            }

        }
        else {
            if ((typeof preguntas[index+1]==="undefined") || (typeof preguntas[index+1].options==="undefined")) {
                bootbox.alert("La pregunta no posee opciones de respuesta");
                pasoValidacion = false;
            }
            else{
                if (preguntas[index+1].options.length<2) {
                    bootbox.alert("La pregunta debe poseer al menos opciones de respuesta");
                    pasoValidacion = false;
                }
                else {
                    preguntas[index + 1].pregunta = $(value).val();
                    hayAlMenosUna = true;
                    pasoValidacion = true;
                }
            }
        }
    });
    if (hayAlMenosUna==false) {
        if (pasoValidacion==true)
            bootbox.alert("La encuesta debe tener al menos una pregunta");
        return false;
    }
    var encues = {};
    encues.description = $("#titEncuesta").val();
    encues.preguntas = preguntas;
    encues.tipo = "encuesta";
    idAgregado=encuestas.saveObject(encues);
    var item = {};
    item.username = localStorage['username'];
    var d = new Date();
    var hs = d.getHours();
    var mins = d.getMinutes();
    var secs = d.getSeconds();
    item.date = $.datepicker.formatDate('dd-mm-yy', d) + " " + hs + ":" + mins + ":" + secs;
    item.id = idAgregado;
    item.element = {};
    item.element.description = $("#titEncuesta").val();
    item.element.preguntas = preguntas;
    lista=encuestas.getWidgetElement('listaEncuestas');
    elementosEncuestas[item.id]=item.element;
    lista.appendChild(agregarFilaAEncuesta(item));
    return true;
}



function crearModalEncuesta() {
    preguntas={};
    numPregunta = 1;
    opciones = [];
    idOpcion = 0;
    //modal = "<div id='modalCrearEncuesta' class='container'>";
    //modal+="<div class='row'>";
    modal="<div class='modal fade' id='encueste' tabindex='-1' role='dialog' aria-labelledby='voteLabel' aria-hidden='true'>";
    modal+="<div class='modal-dialog'>";
    modal+="<div class='panel panel-primary'>";
    modal+="<div class='panel-heading' id='divNuevaEncuesta'>";
    modal+="<button type='button' class='close cerrarCrear'>x</button>";
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
    //modal+="</div>";
    //modal+="</div>";

    encuestas.inyectHTML(modal);
    $('#encueste').modal('show');
    $("#agregarPregunta").on('click', function (e) {
        numPregunta++;
        div = "<div id='divPregunta"+numPregunta+"'><br><br><br><input type='text' id='pregunta" + numPregunta + "' class='form-control inputPregunta' placeholder='Ingrese una pregunta'/>";
        div+= "<a id='" + numPregunta + "' title='Nueva opción' class='agregarOpcion'><i class='fa fa-plus fa-stack-1x' id='iconoMas'> </i></a>";
        div+="<br>";
        div+="<a id='eliminar" + numPregunta + "' title='Eliminar Opcion' class='eliminarPregunta'><i class='fa fa-remove fa-stack-1x' id='iconoMenos'> </i></a></div>";
        $("#divPreguntas").append(div);
        //$("#divPreguntas").append("<br><br><br><div id='divPregunta"+numPregunta+"'><input type='text' id='pregunta" + numPregunta + "' class='form-control inputPregunta' placeholder='Ingrese una pregunta'/>");
        //$("#divPreguntas").append("<a id='" + numPregunta + "' title='Nueva opción' class='agregarOpcion'><i class='fa fa-plus fa-stack-1x' id='iconoMas'> </i></a>");
        //$("#divPreguntas").append("<br>");
        //$("#divPreguntas").append("<a id='eliminar" + numPregunta + "' title='Eliminar Opcion' class='eliminarPregunta'><i class='fa fa-remove fa-stack-1x' id='iconoMenos'> </i></a></div>");
    });
    $(document.body).on('click', '.agregarOpcion' ,function(){

        encuestas.inyectHTML(modalAgregarOpcion(this.id));
        $("#modalOpcion").modal("show");
        // Para el modal de agregar opcion
    idOpcionActual = this.id;
    var next = 1;
    $(".add-more").click(function(e){
        e.preventDefault();
        var addto = "#field" + next;
        var addRemove = "#field" + (next);
        next = next + 1;
        var newIn = '<input autocomplete="off" class="input form-control inputOpcion" placeholder="Escriba la opcion" id="field' + next + '" name="field' + next + '" type="text">';
        var newInput = $(newIn);
        var removeBtn = '<button id="remove' + (next - 1) + '" class="btn btn-danger remove-me" >-</button></div><div id="field">';
        var removeButton = $(removeBtn);
        $(addto).after(newInput);
        $(addRemove).after(removeButton);
        $("#field" + next).attr('data-source',$(addto).attr('data-source'));
        $("#count").val(next);

            //$('.remove-me').click(function(e){
            //    debugger;
            //    e.preventDefault();
            //    debugger;
            //    var fieldNum = this.id.charAt(this.id.length-1);
            //    var fieldID = "#field" + fieldNum;
            //    debugger;
            //    $(this).remove();
            //    debugger;
            //    $(fieldID).remove();
            //});
    });
    });

    $(document.body).on('click','.remove-me',function(e){
                e.preventDefault();
                var fieldNum = this.id.charAt(this.id.length-1);
                var fieldID = "#field" + fieldNum;
                $(this).remove();
                $(fieldID).remove();
            });

    $(document.body).on('click', '.cerrarCrear' ,function(){
        $("#tituloPregunta").val("");
        $("#encueste").modal('hide');
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

function getOriginalId(idWidget,id){
    sNumber = id.toString();
    return sNumber.split(idWidget)[1];

}

function agregarFilaAEncuesta(item){
    var li = encuestas.getLi();
    var btnn = encuestas.getButtonWithoutStyle(item.id);
    btnn.classList.add('list-group-item', 'filaEncuesta');
    var div = encuestas.getDiv();
    div.classList.add('tituloEncuesta');
    div.innerHTML=item.element.description;
    var divSubtitulo = encuestas.getDiv();
    divSubtitulo.classList.add('subtituloEncuesta');
    divSubtitulo.innerHTML="creada por " + item.username + " el "+ item.date;
    btnn.appendChild(div);
    btnn.appendChild(divSubtitulo);
    li.appendChild(btnn);
    return li;
}