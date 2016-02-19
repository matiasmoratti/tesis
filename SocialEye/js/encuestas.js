function Encuestas() {

    var widgetEncuestasCreado = false;
    var widgetEncuestasAbierto = false;
    var debateBox;
    var listaEncuestas;

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
                    listaEncuestas += "<a id=item.pk class='list-group-item socialEye'><span class='fa-stack fa-lg socialEye'><i class='fa fa-question-circle fa-stack-1x socialEye'></i></span>" + item.description + ", creada por " + item.poll_user__username + "</a>";
                });

            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {

            }
        });

        listaEncuestas += "</div>";
        return listaEncuestas;

    }

    function crearModalEncuesta() {
        var numPregunta = 1;
        var numOpcion = 1;
        var encuestaPropia = [];
        var opciones = [];
        modal = "<div class='list-group ' id='modalEncuesta'>";
        modal += "<div class='titleBox' id='tituloEncuesta'>";
        modal += "<form class='form-horizontal' id='formEncuesta'>";
        modal += "<input type='text'  id='titEncuesta' class='form-control' placeholder='Ingrese el contenido de la encuesta'/>";
        modal += "<a id='agregarPregunta' title='Agregar Pregunta'><span  class='fa fa-plus fa-stack-1x'></span></a>";
        modal += "<button type='button' class='close socialEye'  aria-hidden='true'>&times;</button>";
        modal += "</div>";
        modal += "<div id='divPreguntas' class='form-group'>";
        modal += "<input type='text' id='pregunta" + numPregunta + "' class='form-control' placeholder='Ingrese el contenido de la pregunta'/>";
        modal += "<a id='" + numPregunta + "' class='agregarOpcion' title='Agregar opcion de respuesta'><span  class='fa fa-plus fa-stack-1x'></span></a>";
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
            $("#divPreguntas").append("<a id='" + numPregunta + "' class='agregarOpcion' title='Agregar opcion de respuesta'><span  class='fa fa-plus fa-stack-1x'></span></a></div>");
        });

        $(".agregarOpcion").on('click', function (e) {
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
}