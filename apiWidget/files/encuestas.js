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
    params = {};
    params['tipo'] = "encuesta";
    items = encuestas.getObjectsInUrl(window.location.href, params);
    $.each(items, function (i, item) {
        elementosEncuestas[item.id]=item.element;
    });


    var data = {idWidget: encuestas.idWidget,
              title : encuestas.tittle,
              items : items,
              file: 'encuestas.html'};
    encuestas.createTemplate('principal', 'Encuestas', 'encuestas.html', data);
    encuestas.injectInTemplate('principal', 'encuestas_header.html','.titleBox');
    encuestas.onCloseTemplate('principal', function(){
          encuestas.close();
     });
};

encuestas.onReady = function () {
    $(document.body).on('click', '.filaEncuesta' ,function(){
        idEncuestaActual=getOriginalId(encuestas.idWidget,this.id);
        encuestas.injectInTemplate('principal', 'encuestas_votacion.html','#listaEncuestas');
        votosResultados = {};
        $("#votar").prop( "disabled", false );
        votosAGuardar = [];
        votos={};
        $("#resultados").hide();
        numeroActualResultado=1;
        numPreguntaEncuesta=0;
        questions = elementosEncuestas[idEncuestaActual].preguntas;
        $("#vote").modal('show');
        siguientePregunta();

    });

    $(document.body).on('click','#agregarEncuesta', function (e) {
        if ($("#titEncuesta").val() != '') {
            var seGuardo=enviarEncuesta(preguntas);
            if (seGuardo==true) {
                bootbox.alert('La encuesta ha sido creada');
                $("#encueste").modal('hide');
            }

        } else {
            bootbox.alert('Usted debe escribir el titulo de la encuesta');
        }
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

    $(document.body).on('click', '.eliminarPregunta' ,function(){
        id=this.id.split("eliminar")[1];
        $("#divPregunta"+id).remove();
        delete preguntas[id];
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

function siguientePregunta(){
    numPreguntaEncuesta++;
    if (numPreguntaEncuesta<=Object.keys(questions).length){
        $("#tituloPregunta").html(questions[numPreguntaEncuesta].pregunta);
        $("#listaOpciones").empty();
        var data = {questions : questions,numPreguntaEncuesta:numPreguntaEncuesta};
        encuestas.injectInTemplate('principal', 'encuestas_lista_opciones.html',data,'#listaOpciones');
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
        $("#votar").prop( "disabled", true );
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
    var data = {questions:questions,numeroActualResultado:numeroActualResultado};
    encuestas.injectInTemplate('principal', 'encuestas_lista_resultados.html',data,'#listaOpciones');
    $.each(questions[numeroActualResultado]['options'], function (index, option) {
         $.each(votosResultados, function (index, val) {
             if (val.element.idOpcion == option['id'])
                 cantVotosPregunta++;
         });
     });

    $("#barraResultados").empty();
    $.each(questions[numeroActualResultado]['options'], function (index, option) {
      debugger;
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
    lista=$('#listaEncuestas');
    elementosEncuestas[item.id]=item.element;
    lista[0].appendChild(agregarFilaAEncuesta(item));
    return true;
}



function crearModalEncuesta() {
    preguntas={};
    numPregunta = 1;
    opciones = [];
    idOpcion = 0;
    var data = {numPregunta : numPregunta};
    encuestas.injectInTemplate('principal', 'modal_agregar_encuesta.html',data,'#listaEncuestas');
    $('#encueste').modal('show');
    $("#agregarPregunta").on('click', function (e) {
        numPregunta++;
        div = "<div id='divPregunta"+numPregunta+"'><br><br><input type='text' id='pregunta" + numPregunta + "' class='form-control inputPregunta' placeholder='Ingrese una pregunta'/>";
        div+= "<a id='" + numPregunta + "' title='Nueva opción' class='agregarOpcion'><i class='fa fa-plus fa-stack-1x' id='iconoMas'> </i></a>";
        div+="<br>";
        div+="<a id='eliminar" + numPregunta + "' title='Eliminar Opcion' class='eliminarPregunta'><i class='fa fa-remove fa-stack-1x' id='iconoMenos'> </i></a></div>";
        $("#divPreguntas").append(div);
    });
    $(document.body).on('click', '.agregarOpcion' ,function(){
      data = {idPreguntaSeleccionada: this.id,
        preguntas : preguntas};
        encuestas.injectInTemplate('principal', 'agregar_opcion_encuesta.html',data,'#listaEncuestas');
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
    return sNumber.split("encuesta")[1];

}

function agregarFilaAEncuesta(item){
    var li = encuestas.getLi();
    var btnn = encuestas.getListButton("encuesta"+item.id);
    btnn.classList.add('filaEncuesta');
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
