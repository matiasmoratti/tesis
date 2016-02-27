function Usuarios() {

    var widgetUsuariosCreado = false;
    var widgetUsuariosAbierto = false;
    var chatAbierto = false;
    var chatCreado = false;
    var callAbierto = false;
    var callCreado = false;
    var usuarioChatActual = null;
    var usuarioCallActual = null;
    var interval = null;
    var debateBox;
    var listaUsuarios;
    this.iniciarWidgetUsuarios = function () {

        $("#widgetUsuarios").click(function (e) {
            debateBox = e.target;
            if (widgetUsuariosCreado) {
                if (widgetUsuariosAbierto) //La ventana está creada y mostrándose
                    deSeleccionarWidgetUsuarios(debateBox);
                else   //La ventana está creada y oculta
                    seleccionarWidgetUsuarios(e.target);
            }
            else //No se creó la ventana general
                crearWidgetUsuarios(e.target);
        });

    }


    this.cerrarBox = function () {
        if (widgetUsuariosAbierto) {
            deSeleccionarWidgetUsuarios(debateBox);
        }
        if (chatAbierto){
        	$("#chatBox").hide();
	        chatAbierto = false;
        }
    }

    function chatClick(e){
    	var usuarioClick = e.target.id.substr(4, e.target.id.length);
    	if((!(chatCreado)) || (usuarioChatActual!=usuarioClick)){
    		if(chatCreado){
    			$("#chatBox").remove();
    			chatCreado = false;
    		}
    		chatAbierto = true;
    		chatCreado = true;
    		usuarioChatActual = usuarioClick;
            var conversacion = "<div class='detailBox socialEye' id='chatBox'>";
	        conversacion += "<div class='titleBox socialEye'>";
	        conversacion += "<label class='socialEye'>Conversación con "+ $("#chat" +usuarioChatActual).attr('name') +" </label>";
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

    function callClick(e){
    	var usuarioClick = e.target.id.substr(3, e.target.id.length);
    	if((!(callCreado)) || (usuarioCallActual!=usuarioClick)){
    		if(callCreado){
    			$("#chatBox").remove();
    			callCreado = false;
            }
	    	callCreado = true;
	    	callAbierto = true;
	    	usuarioCallActual = usuarioClick;
	        var llamada = "<div class='detailBox socialEye' id='callBox'>";
	        llamada += "<video id='videoCall'></video>";
	        llamada += "</div>";


			
    	}

    }

    function crearWidgetUsuarios(unWidget) {
        $("body").append(crearListaDeUsuarios());
        //debate.attr("style", "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;");
        unWidget.style.cssText = "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;";
        $("#cerrarListaUsuarios").on("click", function (event) {
            deSeleccionarWidgetUsuarios(unWidget);
            $("#listaUsuarios").hide();
        });

      	$(".usuarioChat").each(function () {
      		this.onclick = chatClick;
      	});

      	$(".usuarioCall").each(function () {
      		this.onclick = callClick;
      	});

        widgetUsuariosCreado = true;
        widgetUsuariosAbierto = true;
        var dominio = window.location.hostname;
        interval = setInterval(function () {
            jQuery.ajax({
                type: "POST",
                url: "http://127.0.0.1:8000/widgetRest/user_ping/",
                dataType: 'json',
                data: {url: dominio},
                success: function (data) {
                    $('.divUsuario').remove();
                    $.each(data, function (i, item) {
                        if (item.user__pk!=localStorage['user']){
                            $('#listaUsuarios').append("<div class='list-group-item socialEye divUsuario'><span class='fa-stack fa-lg socialEye'><i class='fa fa-user socialEye'></i></span>" + item.user__username + "&nbsp;&nbsp; <span class='iconsSpan'><i id=chat"+ item.user__pk +" name="+item.user__username+" class='fa fa-weixin usuarioChat'> </i> </span><span class='iconsSpan'> <i id=call"+ item.user__pk +" class='fa fa-video-camera usuarioCall'> </i> </span></div>");
                       		$("#chat"+item.user__pk).on('click', chatClick);
                       		$("#call"+item.user__pk).on('click', callClick);

                        }
                    })
                }
            });
        }, 30000);

        return false;

    }

    function seleccionarWidgetUsuarios(unWidget) {
        unWidget.style.cssText = "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;";
        $("#listaUsuarios").show();
        widgetUsuariosAbierto = true;
        var dominio = window.location.hostname;
        interval = setInterval(function () {
            jQuery.ajax({
                type: "POST",
                url: "http://127.0.0.1:8000/widgetRest/user_ping/",
                dataType: 'json',
                data: {url: dominio},
                success: function (data) {
                    $('.divUsuario').remove();
                    $.each(data, function (i, item) {
                        if (item.user__pk!=localStorage['user'])
                            $('#listaUsuarios').append("<div class='list-group-item socialEye divUsuario'><span class='fa-stack fa-lg socialEye'><i class='fa fa-user socialEye'></i></span>" + item.user__username + "&nbsp;&nbsp; <span class='iconsSpan'><i id=chat"+ item.user__pk +" name="+item.user__username+" class='fa fa-weixin usuarioChat'> </i> </span><span class='iconsSpan'> <i id=call"+ item.user__pk +" class='fa fa-video-camera usuarioCall'> </i> </span></div>");
                    });
                }

            });
        }, 30000);
    }


    function deSeleccionarWidgetUsuarios(unWidget) {
        unWidget.style.cssText = "";
        $("#listaUsuarios").hide();
        widgetUsuariosAbierto = false;
        clearInterval(interval);
    }

    function crearListaDeUsuarios() {
    	var dominio = window.location.hostname;
        listaUsuarios = "<div class='list-group socialEye' id='listaUsuarios'>";
        listaUsuarios += "<div class='titleBox socialEye' id='tituloListaUsuarios'>";
        listaUsuarios += "<label class='socialEye'>Usuarios activos en: " + dominio + "</label>";
        listaUsuarios += "<button type='button' class='close botonCerrar socialEye' id='cerrarListaUsuarios' aria-hidden='true'>&times;</button>";
        listaUsuarios += "</div>";
        //Creo los objetos
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/user_ping/", // the endpoint
            type: "POST", // http method
            data: { url: dominio},
            dataType: 'json',
            async: false,
            // data : {'comment_url' : url,}, // data sent with the post request

// handle a successful response
            success: function (data) {
                $.each(data, function (i, item) {
                    if (item.user__pk!=localStorage['user'])
                        listaUsuarios += "<div class='list-group-item socialEye divUsuario'><span class='fa-stack fa-lg socialEye'><i class='fa fa-user socialEye'></i></span>" + item.user__username + "&nbsp;&nbsp; <span class='iconsSpan'><i id=chat"+ item.user__pk +" name="+item.user__username+" class='fa fa-weixin usuarioChat'> </i> </span><span class='iconsSpan'> <i id=call"+ item.user__pk +" class='fa fa-video-camera usuarioCall'> </i> </span></div>";
                });

            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {

            }
        });

        
        listaUsuarios += "</div>";
        return listaUsuarios;

    }
}