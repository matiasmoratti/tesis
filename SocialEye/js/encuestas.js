function Encuestas() {

    var widgetEncuestasCreado = false;
    var widgetEncuestasAbierto = false;
    var debateBox;
    var listaEncuestas;
    var numPreguntaEncuesta;
    var questions;
    var votos;

    this.iniciarWidgetEncuestas = function () {
        crearModalEncuesta();
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
            $("#modalEncuesta").css('visibility', 'visible');
        });
        //debate.attr("style", "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;");
        unWidget.style.cssText = "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;";
        $("#cerrarMenuEncuestas").on("click", function (event) {
            deSeleccionarWidgetEncuestas(unWidget);
            $("#menuEncuestas").hide();
        });
        widgetEncuestasCreado = true;
        widgetEncuestasAbierto = true;

    }

    function seleccionarWidgetEncuestas(unWidget) {
        unWidget.style.cssText = "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;";
        $("#menuEncuestas").show();
        widgetEncuestasAbierto = true;
    }


    function deSeleccionarWidgetEncuestas(unWidget) {
        unWidget.style.cssText = "";
        $("#menuEncuestas").hide();
        widgetEncuestasAbierto = false;
    }

    function crearMenuEncuestas() {
        var dominio = window.location.hostname;
        var listaEncuestas = "<div class='detailBox' id='divEncuestas'>";
        listaEncuestas += "<div class='titleBox'>";
        listaEncuestas += "<label class=> Encuestas activas en: " + dominio + "</label>";
        listaEncuestas += "<a id='crearEncuesta' title='Crear Encuesta'><span  class='fa fa-plus fa-stack-1x'></span></a>";
        listaEncuestas += "<button type='button' class='close' id='cerrarEncuestas' aria-hidden='true'>&times;</button>";
        listaEncuestas += "</div>";
        listaEncuestas += "<div class='actionBox'>";
        listaEncuestas += "<ul id='listaEncuestas' class='commentList socialEye'>";
        //Creo los objetos
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/poll_list/", // the endpoint
            type: "POST", // http method
            data: {url: dominio},
            dataType: 'json',
            async: false,
            success: function (data) {
                $.each(data, function (i, item) {
                    listaEncuestas += "<li><input type='button' id='"+item.pk+ "' class='list-group-item socialEye filaEncuesta' value='"+ item.description + ", creada por " + item.poll_user__username + " el "+ item.date+"'/></li>";
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
            idEncuesta=this.id;
             $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/poll_details/", // the endpoint
            type: "GET", // http method
            data: {idEncuesta: idEncuesta},
            dataType: 'json',
            async: false,
            success: function (data) {
                $("body").append(modalVotacion());
                votos=[];
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
        modal = "<div class='list-group ' id='modalEncuesta'>";
        modal += "<div class='titleBox' id='tituloEncuesta'>";
        modal += "<form class='form-horizontal' id='formEncuesta'>";
        modal += "<input type='text'  id='titEncuesta' class='form-control' placeholder='Ingrese el contenido de la encuesta'/>";
        modal += "<span id='agregarPregunta' class='fa fa-plus fa-stack-1x'></span>";
        modal += "<button type='button' class='close socialEye'  aria-hidden='true'>&times;</button>";
        modal += "</div>";
        modal += "<div id='divPreguntas' class='form-group'>";
        modal += "<input type='text' id='pregunta" + numPregunta + "' class='form-control' placeholder='Ingrese el contenido de la pregunta'/>";
        modal += "<span  id='" + numPregunta + "' class='fa fa-plus fa-stack-1x agregarOpcion'></span>";
        modal += "</div>";
        modal += "<button  id='agregarEncuesta'>Agregar Encuesta</button>";
        modal += "</form>";
        $('body').append(modal);
        //var input = document.createElement('input');
        //input.className="form-control";
        //input.type="text";
        //input.placeholder="Ingrese el contenido de la pregunta";
        $("#agregarPregunta").on('click', function (e) {
            numPregunta++;
            $("#divPreguntas").append("<div><input type='text' id='pregunta" + numPregunta + "' class='form-control' placeholder='Ingrese el contenido de la pregunta'/>");
            $("#divPreguntas").append("<span id='" + numPregunta + "' class='fa fa-plus fa-stack-1x agregarOpcion'></span></div>");
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
            url: "http://127.0.0.1:8000/widgetRest/poll_add/", // the endpoint
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
        modal+="<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>*</button>";
        modal+="<h4 id='tituloPregunta' class='panel-title' id='voteLabel'><span class='glyphicon glyphicon-arrow-right'></span></h4>";
        modal+="</div>";
        modal+="<div class='modal-body'>";
        modal+="<ul id='listaOpciones' class='list-group'>";
        modal+="</ul>";
        modal+="</div>";
        modal+="<div class='modal-footer'>";
        modal+="<button id='votar' type='button' class='btn btn-success btn-vote'>Votar</button>";
        modal+="<span id='verResultados' class='btn btn-primary dropdown-results btn-results' data-for='.results'>Ver resultados</span>";
        modal+="<button type='button' class='btn btn-default btn-close' data-dismiss='modal'>Cerrar</button>";
        modal+="</div>";
        modal+="<div id='resultados' class='row vote-results results'>";
        modal+="<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12' style='margin-left: 5px;'>";
        modal+="Excellent";
        modal+="<div class='progress'>";
        modal+="<div class='progress-bar progress-bar-success' role='progressbar' aria-valuenow='20' aria-valuemin='0' aria-valuemax='100' style='width: 20%'>";
        modal+="<span class='sr-only'>40% Excellent (success)</span>";
        modal+="</div>";
        modal+="</div>";
        modal+="Good";
        modal+="<div class='progress'>";
        modal+="<div class='progress-bar progress-bar-primary' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: 40%'>";
        modal+="<span class='sr-only'>20% Good (primary)</span>";
        modal+="</div>";
        modal+="</div>";
        modal+="Can Be Improved";
        modal+="<div class='progress'>";
        modal+="<div class='progress-bar progress-bar-warning' role='progressbar' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100' style='width: 25%'>";
        modal+="<span class='sr-only'>60% Can Be Improved (warning)</span>";
        modal+="</div>";
        modal+="</div>";
        modal+="bad";
        modal+="<div class='progress'>";
        modal+="<div class='progress-bar progress-bar-danger' role='progressbar' aria-valuenow='10' aria-valuemin='0' aria-valuemax='100' style='width: 10%'>";
        modal+="<span class='sr-only'>80% Bad (danger)</span>";
        modal+="</div>";
        modal+="</div>";
        modal+="No Comment";
        modal+="<div class='progress'>";
        modal+="<div class='progress-bar progress-bar-info' role='progressbar' aria-valuenow='5' aria-valuemin='0' aria-valuemax='100' style='width: 5%'>";
        modal+="<span class='sr-only'>80% No Comment (info)</span>";
        modal+="</div>";
        modal+="</div>";
        modal+="Overall";
        modal+="<div class='progress'>";
        modal+="<div class='progress-bar progress-bar-success' style='width: 20%'>";
        modal+="<span class='sr-only'>35% Complete (success)</span>";
        modal+="</div>";
        modal+="<div class='progress-bar progress-bar-primary' style='width: 40%'>";
        modal+="<span class='sr-only'>20% Complete (primary)</span>";
        modal+="</div>";
        modal+="<div class='progress-bar progress-bar-warning' style='width: 25%'>";
        modal+="<span class='sr-only'>10% Complete (warning)</span>";
        modal+="</div>";
        modal+="<div class='progress-bar progress-bar-danger' style='width: 10%'>";
        modal+="<span class='sr-only'>10% Complete (danger)</span>";
        modal+="</div>";
        modal+="<div class='progress-bar progress-bar-info' style='width: 5%'>";
        modal+="<span class='sr-only'>10% Complete (info)</span>";
        modal+="</div>";
        modal+="</div>";
        modal+="</div>";
        modal+="</div>";
        modal+="</div>";
        modal+="</div>";
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
            votos.push($('#listaOpciones input:checked').attr('id'));
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
                opciones="<li class='list-group-item'>";
                opciones+="<div class='radio'>";
                opciones+="<label>";
                opciones+="<input id='"+option['pk']+"' type='radio' name='optionsRadios'>";
                opciones+=option['option'];
                opciones+="</label>";
                opciones+="</div>";
                opciones+="</li>";
                $("#listaOpciones").append(opciones);
             });
        }
        else {
            $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/poll_vote/", // the endpoint
            type: "POST", // http method
            data: {votos: JSON.stringify(votos)},
            async: false,
            success: function () {
                bootbox.alert("Gracias, usted ha finalizado la encuesta");
                $('#vote').modal('toggle');
            },
            // handle a non-successful response
            error: function (xhr, errmsg, err) {

            }
        });
            //$("#resultados").show();
        }
        numPreguntaEncuesta++;
    }
}