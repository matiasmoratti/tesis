function Chats() {

    var widgetChatsCreado = false;
    var widgetChatsAbierto = false;
    var debateBox;
    var chatAbierto = false;
    var chatCreado = false;
    var usuarioChatActual = null;
    this.iniciarWidgetChats = function () {

        $("#chats").click(function (e) {
            debateBox = e.target;
            if (widgetChatsCreado) {
                if (widgetChatsAbierto) //La ventana está creada y mostrándose
                    deSeleccionarWidgetChats(e.target);
                else   //La ventana está creada y oculta
                    seleccionarWidgetChats(e.target);
            }
            else //No se creó la ventana general
                crearWidgetChats(e.target);
        });

    }

    this.cerrarBox = function () {
        if (widgetChatsAbierto) {
            deSeleccionarWidgetChats(debateBox);
            $("#chatsBox").hide();
        }
        if (chatAbierto){
            $("#chatBox").hide();
            chatAbierto = false;
        }
    }

    function crearWidgetChats(unWidget) {
        $("body").append(crearChatsBox());
        $(".usuarioChat").each(function () {
            $("#"+ this.id).on('click', chatClick);
        });
        //debate.attr("style", "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;");
        unWidget.style.cssText = "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;";
        $("#cerrarChatsBox").on("click", function (event) {
            deSeleccionarWidgetChats(debateBox);
            $("#chatsBox").hide();
        });
        widgetChatsCreado = true;
        widgetChatsAbierto = true;
    }

    function seleccionarWidgetChats(unWidget) {
        unWidget.style.cssText = "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;";
        $("#chatsBox").show();
        widgetChatsAbierto = true;
    }


    function deSeleccionarWidgetChats(unWidget) {
        unWidget.style.cssText = "";
        $("#chatsBox").hide();
        widgetChatsAbierto = false;
    }

    function chatClick(e){
        if((!(chatCreado)) || (usuarioChatActual!=e.target.id)){
            if(chatCreado){
                $("#chatBox").remove();
                chatCreado = false;
            }
            chatAbierto = true;
            chatCreado = true;
            usuarioChatActual = e.target.id;
            var conversacion = "<div class='detailBox socialEye' id='chatBox'>";
            conversacion += "<div class='titleBox socialEye'>";
            conversacion += "<label class='socialEye'>Conversación con "+ $("#" +usuarioChatActual).attr('name') +" </label>";
            conversacion += "<button type='button' class='close botonCerrar socialEye' id='cerrarChatBox' aria-hidden='true'>&times;</button>";
            conversacion += "</div>";
            conversacion += "<div class='actionBox socialEye'>";
            conversacion += "<ul id='listaComentarios' class='commentList socialEye'>";
            var chatId;
            $.ajax({
                url: "http://127.0.0.1:8000/widgetRest/getChat/", // the endpoint
                type: "POST", // http method
                data: {
                    usuario2: usuarioChatActual,
                },
                dataType: 'json',
                async: false,
                success: function (data) {
                    $.each(data, function (i, item) {
                        conversacion += "<li class='socialEye'><div class='commentText socialEye'>";
                        conversacion += "<span class='date sub-text socialEye'>" + item.fields.userName + " dijo: </span>";
                        conversacion += "<p class='socialEye'>" + item.fields.text+ "</p>";
                        conversacion += "</div>";
                        conversacion += "</li>";
                    });

                },

                // handle a non-successful response
                error: function (xhr, errmsg, err) {

                }

            });

            conversacion += "</ul>";
            conversacion += "<form class='form-inline socialEye' role='form'>";
            conversacion += "<textarea class='form-control socialEye' id='textoComentarioChat' type='text' placeholder='Escribe un comentario' ></textarea>";
            conversacion += "</form>";
            conversacion += "</div>";
            conversacion += "</div>";
            $("body").append(conversacion);
            $('#listaComentarios').scrollTop( $('#listaComentarios')[0].scrollHeight);


            window.chat = {};
            //Instantiate a websocket client connected to our server
            chat.ws = $.gracefulWebSocket("ws://127.0.0.1:1025/ws");
             
            //Basic message send
            chat.send = function (message) {
              chat.ws.send(message);
            }
             
            //Basic message receive
            chat.ws.onmessage = function (event) {
                if(usuarioChatActual == e.target.id){
                        var messageFromServer = event.data;
                        $("#listaComentarios").append(messageFromServer);
                        $('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});
                }
            };

            var textoComentarioChat = document.getElementById("textoComentarioChat");
            textoComentarioChat.addEventListener("keydown", function(e) {
              if (!e) { var e = window.event; }
         
              //keyCode 13 is the enter/return button keyCode
              if (e.keyCode == 13) {
                // enter/return probably starts a new line by default
                e.preventDefault();
                if(textoComentarioChat.value != ""){
                    var userName = localStorage['userName'];
                    var mensaje = "<li class='socialEye'><div class='commentText socialEye'>";
                    mensaje += "<span class='date sub-text socialEye'>" + userName + " dijo: </span>";
                    mensaje += "<p class='socialEye'>" + textoComentarioChat.value + "</p>";
                    mensaje += "</div>";
                    mensaje += "</li>";
                    chat.send(mensaje);

                    $.ajax({
                        url: "http://127.0.0.1:8000/widgetRest/saveMessage/", // the endpoint
                        type: "POST", // http method
                        data: {
                            usuario2: usuarioChatActual,
                            message: textoComentarioChat.value,
                        },
                        dataType: 'json',
                        async: false,
                        success: function (data) {

                        },

                        // handle a non-successful response
                        error: function (xhr, errmsg, err) {

                        }

                    });

                    textoComentarioChat.value="";
                }

              }
            }, false); 

            $("#cerrarChatBox").on("click", function (event) {
                $("#chatBox").hide();
                chatAbierto = false;
            }); 
        }
        else{
            $("#chatBox").show();
            chatAbierto = true;
        }


    }

    function crearChatsBox() {
        var url = window.location.href;
        var listaChats = "<div class='list-group socialEye' id='chatsBox'>";
        listaChats += "<div class='titleBox socialEye' id='tituloListaChats'>";
        listaChats += "<label class='socialEye'>Chats: </label>";
        listaChats += "<button type='button' class='close botonCerrar socialEye' id='cerrarChatsBox' aria-hidden='true'>&times;</button>";
        listaChats += "</div>";
        var otroUsuarioName;
        var otroUsuarioPk;
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/chats/", // the endpoint
            type: "GET", // http method
            dataType: 'json',
            async: false,

            // handle a successful response
            success: function (data) {
                $.each(data, function (i, item) {
                    if(item.user1__pk == localStorage['user']){
                        otroUsuarioName = item.user2__username;
                        otroUsuarioPk = item.user2__pk;
                    }
                    else{
                        otroUsuarioName = item.user1__username;
                        otroUsuarioPk = item.user1__pk;
                    }
                    listaChats += "<button type='button' id="+ otroUsuarioPk +" name="+ otroUsuarioName +" class='list-group-item usuarioChat socialEye'><span class='fa-stack fa-lg socialEye'><i class='fa fa-user fa-stack-1x socialEye'></i></span>" + otroUsuarioName + "</button>";
                });
            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {
                alert("Error al cargar los chats");
            }
        });


        listaChats += "</div>";
        return listaChats;

    }

    function mostrarChat(){
        var chatBox = "<div class='detailBox socialEye' id='chatBox'>";
        chatBox += "<div class='titleBox socialEye'>";
        chatBox += "<label class='socialEye'>Conversación</label>";
        chatBox += "<button type='button' class='close botonCerrar socialEye' id='cerrarChatBox' aria-hidden='true'>&times;</button>";
        chatBox += "</div>";
        chatBox += "<div class='actionBox socialEye'>";
        chatBox += "<ul id='listaComentarios' class='commentList socialEye'>";
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
        commentBox += "<textarea class='form-control socialEye' id='textoComentarioChat' type='text' placeholder='Escribe un comentario' ></textarea>";
        commentBox += "<button id='botonComentarioChat' class='btn btn-primary socialEye'>Agregar</button>";
        commentBox += "</form>";
        commentBox += "</div>";
        commentBox += "</div>";
        return commentBox;
    }
}