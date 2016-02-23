function Comentarios() {

    var comenGeneralesCreado = false;
    var comenGeneralesAbierto = false;
    var debateBox;
    this.iniciarWidgetComentariosGenerales = function () {

        $("#debateGeneral").click(function (e) {
            debateBox = e.target;
            if (comenGeneralesCreado) {
                if (comenGeneralesAbierto) //La ventana está creada y mostrándose
                    deSeleccionarWidgetGenerales(e.target);
                else   //La ventana está creada y oculta
                    seleccionarWidgetGenerales(e.target);
            }
            else //No se creó la ventana general
                crearDebateGeneral(e.target);
        });

    }

    this.cerrarBox = function () {
        if (comenGeneralesAbierto) {
            deSeleccionarWidgetGenerales(debateBox);
            $("#comentariosGenerales").hide();
            $("#textoComentarioGeneral").val("");
        }
    }

    function crearDebateGeneral(unWidget) {
        $("body").append(crearCommentBoxGenerales());
        $('#listaComentariosGenerales').scrollTop($('#listaComentariosGenerales')[0].scrollHeight);
        //debate.attr("style", "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;");
        unWidget.style.cssText = "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;";
        $("#cerrarBoxGenerales").on("click", function (event) {
            deSeleccionarWidgetGenerales(debateBox);
            $("#comentariosGenerales").hide();
            $("#textoComentarioGeneral").val("");
        });
        comenGeneralesCreado = true;
        comenGeneralesAbierto = true;
        var usuarioComentario = localStorage['username'];
        $("#agregarComentarioGeneral").on('click', function () {
            if ($("#textoComentarioGeneral").val() != "") {
                var url = window.location.href;
                //Creo los objetos
                $.ajax({
                    url: "http://127.0.0.1:8000/widgetRest/comments/", // the endpoint
                    type: "POST", // http method
                    data: {
                        comment_text: $("#textoComentarioGeneral").val(),
                        comment_url: url,
                    }, // data sent with the post request

                    // handle a successful response
                    success: function (username) {
                        var parrafo = document.createElement('p');
                        var span = document.createElement('span');
                        span.setAttribute('class', 'date sub-text');
                        var d = new Date();
                        var hs = d.getHours();
                        var mins = d.getMinutes();
                        var secs = d.getSeconds();
                        span.innerHTML = username + " dijo el " + $.datepicker.formatDate('dd-mm-yy', d) + " " + hs + ":" + mins + ":" + secs;
                        parrafo.innerHTML = $("#textoComentarioGeneral").val();
                        var divComentario = document.createElement('div');
                        divComentario.setAttribute('class', 'commentText');
                        var lineaComentario = document.createElement('li');
                        //Uno los objetos
                        divComentario.appendChild(span);
                        divComentario.appendChild(parrafo);
                        lineaComentario.appendChild(divComentario);
                        $("#listaComentariosGenerales").append(lineaComentario);
                        $("#textoComentarioGeneral").val("");
                        $('#listaComentariosGenerales').animate({scrollTop: $('#listaComentariosGenerales')[0].scrollHeight});

                    },

                    // handle a non-successful response
                    error: function (xhr, errmsg, err) {
                        alert("Error al enviar el comentario");
                    }
                });

            }

            return false;
        });

    }

    function seleccionarWidgetGenerales(unWidget) {
        unWidget.style.cssText = "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;";
        $("#comentariosGenerales").show();
        comenGeneralesAbierto = true;
    }


    function deSeleccionarWidgetGenerales(unWidget) {
        unWidget.style.cssText = "";
        $("#comentariosGenerales").hide();
        comenGeneralesAbierto = false;
        $("#textoComentarioGeneral").val("");
    }

    function crearCommentBoxGenerales() {
        var url = window.location.href;
        var commentBox = "<div class='detailBox socialEye' id='comentariosGenerales'>";
        commentBox += "<div class='titleBox socialEye'>";
        commentBox += "<label class='socialEye'>Comentarios Generales</label>";
        commentBox += "<button type='button' class='close socialEye' id='cerrarBoxGenerales' aria-hidden='true'>&times;</button>";
        commentBox += "</div>";
        commentBox += "<div class='actionBox socialEye'>";
        commentBox += "<ul id='listaComentariosGenerales' class='commentList socialEye'>";
        //Creo los objetos
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/comments/?comment_url=" + url, // the endpoint
            type: "GET", // http method
            dataType: 'json',
            async: false,
            // data : {'comment_url' : url,}, // data sent with the post request

// handle a successful response
            success: function (data) {
                $.each(data, function (i, item) {
                    commentBox += "<li class='socialEye'><div class='commentText socialEye'>";
                    commentBox += "<span class='date sub-text socialEye'>" + item.comment_user__username + " dijo el " + item.comment_date + "</span>";
                    commentBox += "<p class='socialEye'>" + item.comment_text + "</p>";
                    commentBox += "</div>";
                    commentBox += "</li>";
                });

            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {
                alert("Error al cargar los comentarios");

            }
        });


        commentBox += "</ul>";
        commentBox += "<form class='form-inline socialEye' role='form'>";
        commentBox += "<textarea class='form-control socialEye' id='textoComentarioGeneral' type='text' placeholder='Escribe un comentario' ></textarea>";
        commentBox += "<button id='agregarComentarioGeneral' class='btn btn-primary socialEye'>Agregar</button>";
        commentBox += "</form>";
        commentBox += "</div>";
        commentBox += "</div>";
        return commentBox;

    }
}

function comentariosEspecificos() {
    var mapeador = new MapComentarios();
    var comenEspecificoActivo = false;
    var numeroComentario = 0;
    var indexActual = 99999999;
    var debateBox;
    this.iniciarWidgetComentariosEspecificos = function () {
        //Evento de cuando se apreta click en el widget comentarios especificos
        $("#comentarios").click(function (e) {
            debateBox = e.target;
            if (comenEspecificoActivo)
                deSeleccionarWidget(debateBox);
            else {
                seleccionarWidget(e.target);
                changeClickListeners();
            }

        });

    }

    this.cerrarBox = function () {
        if (comenEspecificoActivo) {
            deSeleccionarWidget(debateBox);
        }
    }


    function seleccionarWidget(unWidget) {
        unWidget.style.cssText = "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;";
        comenEspecificoActivo = true;
    }

    function deSeleccionarWidget(unWidget) {
        unWidget.style.cssText = "";
        var all = document.getElementsByTagName("*");
        var appElements = ["icono", "debateGeneral", "comentarios"];
        var actual;
        for (var i = 0, max = all.length; i < max; i++) {
            // Seteo el onClick que tenia antes del Widget
            if (($.inArray(all[i].id, appElements)) == -1)
                all[i].onclick = all[i]._onclick;
        }
        comenEspecificoActivo = false;
        for (var i = 0, max = numeroComentario; i < max; i++) {
            $("#comentario" + i).hide();
        }
    }

    function deSeleccionarUnSoloBox(unWidget) {
        var res = unWidget.id.split("cerrarComentario");
        $("#comentario" + res[1]).hide();
    }


    function crearCommentBoxEspicifico(textoComentario, tag) {
        var url = window.location.href;
        var commentBox = "<div class='detailBox' id='comentario" + numeroComentario + "'>";
        commentBox += "<div class='titleBox'>";
        commentBox += "<label>" + textoComentario + "</label>";
        commentBox += "<button type='button' class='close' id='cerrarComentario" + numeroComentario + "' aria-hidden='true'>&times;</button>";
        commentBox += "</div>";
        commentBox += "<div class='actionBox'>";
        commentBox += "<ul id='listaComentario" + numeroComentario + "' class='commentList'>";

        //Creo los objetos
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/specific_comments/?comment_url=" + url + "&url_tag=" + tag, // the endpoint
            type: "GET", // http method
            dataType: 'json',
            async: false,
            // data : {'comment_url' : url,}, // data sent with the post request

// handle a successful response
            success: function (data) {
                $.each(data, function (i, item) {
                    commentBox += "<li><div class='commentText'>";
                    commentBox += "<span class='date sub-text'>" + item.comment_user__username + " dijo el " + item.comment_date + "</span>";
                    commentBox += "<p>" + item.comment_text + "</p>";
                    commentBox += "</div>";
                    commentBox += "</li>";
                });

            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {
                alert("Error al cargar los comentarios");

            }
        });


        commentBox += "<li>";
        commentBox += "</li>";
        commentBox += "</ul>";
        commentBox += "<form class='form-inline' role='form'>";
        commentBox += "<textarea class='form-control' id='textoComentario" + numeroComentario + "' type='text' placeholder='Escribe un comentario' ></textarea>";
        commentBox += "<button type = 'button' id='agregarComentario" + numeroComentario + "' class='btn btn-primary'>Agregar</button>";
        commentBox += "</form>";
        commentBox += "</div>";
        commentBox += "</div>";
        numeroComentario++;
        return commentBox;

    }

    function toArray(arraylike) {
        var array = new Array(arraylike.length);
        for (var i = 0, n = arraylike.length; i < n; i++)
            array[i] = arraylike[i];
        return array;
    }

    function changeClickListeners() {
        var all = toArray(document.getElementsByTagName('a')).concat(toArray(document.getElementsByTagName('div')));
        var appElements = ["icono", "debateGeneral", "comentarios", "socialEyeBar", "contactos"];
        var actual;
        for (var i = 0, max = all.length; i < max; i++) {
            if (($.inArray(all[i].id, appElements)) == -1) {
                // me guardo el estado actual que tiene el onClick
                all[i]._onclick = all[i].onclick;
                all[i].onclick = function (e) {
                    if (!(fromApp(e.target))) {
                        e.stopPropagation();
                        e.preventDefault();
                        var idComentario = mapeador.getComentarioFromTag(getXPath(this));
                        if (idComentario == null)
                            crearDebateEspecifico(e, getXPath(this));
                        else {
                            mostrarDebateEspecifico(idComentario, e);
                        }
                    }
                }
            }

        }
    }

    function fromApp(element) {
        return (" " + element.className + " ").replace(/[\n\t]/g, " ").indexOf(" socialEye ") > -1;
    }

    function mostrarDebateEspecifico(idComentario, elemento) {
        if ($("#" + idComentario).is(":visible")) {
            $("#" + idComentario).offset({left: elemento.pageX, top: elemento.pageY});
            $("#" + idComentario).show({left: elemento.pageX, top: elemento.pageY});
        }
        else {
            $("#" + idComentario).show();
            $("#" + idComentario).offset({left: elemento.pageX, top: elemento.pageY});
        }

    }

    function crearDebateEspecifico(elemento, tag) {
        var host = window.location.hostname;
        var textoComentario = null;
        var posicion = 4;
        if (host.charAt(0) != "w") {
            posicion = 0;
        }
        if (elemento.target.tagName == "A") {
            if (elemento.target.innerHTML == "") {
                textoComentario = "Comentarios de ".concat(host.substr(posicion, host.split(".", 2).join(".").length - posicion));
            }
            else {
                var contenido = elemento.target.textContent;
                if (contenido.length < 125) { //SOLUCIÓN PROVISORIA. Ver como identificar si el textContent tiene una imagen.
                    textoComentario = "Comentarios sobre ".concat(contenido);
                }
                else {
                    textoComentario = "Comentarios de ".concat(host.substr(posicion, host.split(".", 2).join(".").length - posicion));
                }
            }
        }
        else {
            textoComentario = "Comentarios de ".concat(host.substr(posicion, host.split(".", 2).join(".").length - posicion));
        }
        $("body").append(crearCommentBoxEspicifico(textoComentario, tag));
        $('#listaComentario' + (numeroComentario - 1)).scrollTop( $('#listaComentario' + (numeroComentario - 1))[0].scrollHeight);
        mapeador.agregarComentario(tag, "comentario" + (numeroComentario - 1));
        //Le seteo la posicion donde se hizo el click
        $("#comentario" + (numeroComentario - 1)).css('position', 'absolute');
        $("#comentario" + (numeroComentario - 1)).offset({left: elemento.pageX, top: elemento.pageY});
        indexActual++;
        $("#comentario" + (numeroComentario - 1)).css('zIndex', indexActual);

        $("#cerrarComentario" + (numeroComentario - 1)).on('click', function (e) {
            deSeleccionarUnSoloBox(e.target);
        });

        $("#comentario" + (numeroComentario - 1)).on('click', function (e) {
            indexActual++;
            this.style.zIndex = indexActual;
        });
        $("#agregarComentario" + (numeroComentario - 1)).on('click',function (e) {
            //Ahora tomo el numero, para formar el id del textarea
            var idSeleccionado = this.id;
            var numComen = idSeleccionado.split("agregarComentario")[1];
            var usuarioComentario = localStorage['username'];
            if ($("#textoComentario" + numComen).val() != "") {
                var url = window.location.href;
                //Creo los objetos
                $.ajax({
                    url: "http://127.0.0.1:8000/widgetRest/specific_comments/", // the endpoint
                    type: "POST", // http method
                    data: {
                        comment_text: $("#textoComentario" + numComen).val(),
                        comment_url: url,
                        url_tag: tag
                    }, // data sent with the post request

                    // handle a successful response
                    success: function (username) {
                        //Creo los objetos
                        var parrafo = document.createElement('p');
                        parrafo.innerHTML = $("#textoComentario" + numComen).val();
                        var span = document.createElement('span');
                        span.setAttribute('class', 'date sub-text');
                        var d = new Date();
                        var hs = d.getHours();
                        var mins = d.getMinutes();
                        var secs = d.getSeconds();
                        span.innerHTML = username + " dijo el " + $.datepicker.formatDate('dd-mm-yy', d) + " " + hs + ":" + mins + ":" + secs;
                        var divComentario = document.createElement('div');
                        divComentario.setAttribute('class', 'commentText');
                        var lineaComentario = document.createElement('li');
                        //Uno los objetos
                        divComentario.appendChild(span);
                        divComentario.appendChild(parrafo);
                        lineaComentario.appendChild(divComentario);
                        $("#listaComentario" + numComen).append(lineaComentario);
                        $("#textoComentario" + numComen).val("");
                        $('#listaComentario' + numComen).animate({scrollTop: $('#listaComentario' + numComen)[0].scrollHeight});

                    },

                    // handle a non-successful response
                    error: function (xhr, errmsg, err) {
                        alert("Error al enviar el comentario");
                    }
                });

            }

            return false;
        });

    }

    //Esta objeto va a almacenar los tags agregados junto con el id de comentario, para que no se abra un nuevo box dentro del mismo
    function MapComentarios() {
        var map = new Object(); // or var map = {};

        this.agregarComentario = function (tag, idComentario) {
            map[idComentario] = tag;
        }

        this.getComentarioFromTag = function (tag) {
            var idComentario = null;
            $.each(map, function (key, value) {
                if (value == tag) {
                    idComentario = key;
                    return key;
                }

            });
            return idComentario;
        }

    }

    function getXPath(element) {
        var val = element.value;
        var xpath = '';
        for (; element && element.nodeType == 1; element = element.parentNode) {
            var id = $(element.parentNode).children(element.tagName).index(element) + 1;
            id > 1 ? (id = '[' + id + ']') : (id = '');
            xpath = '/' + element.tagName.toLowerCase() + id + xpath;
        }
        return xpath;
    }


}