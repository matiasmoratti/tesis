var usuarios = new Widget();
usuarios.descripcion = "Contacta con otros usuarios que naveguen las mismas páginas web.";
usuarios.icono = "users";
var userConnected = false;
var enGeneral = false;
var chatAbierto = false;
var streamingsAgregados = false;
var llamadaEstablecida = false;
var boxLlamadaCreado = false;
var llamando = false;
var userInChat = false;
var interval;

usuarios.loadWidget = function () {
	//var contador = 1;
	//$( "div" ).each(function() {
  	//	$(this).append("<a class='socialEye iconoComentarioEspecifico' title='Realizar videollamada'><span class='socialEye'><i id=comentarioBox"+contador+" class='fa fa-comments'></i></span></a>");
	//	contador++;
	//});
    var dominio = window.location.hostname;
    var listaUsuarios = "<div class='list-group socialEye' id='listaUsuarios'>";
    listaUsuarios += "<div class='titleBox socialEye' id='tituloListaUsuarios'>";
    listaUsuarios += "<label class='socialEye'>Usuarios activos en: " + dominio + "</label>";
    listaUsuarios += "<button type='button' class='close botonCerrar socialEye' id='cerrarListaUsuarios' aria-hidden='true'>&times;</button>";
    listaUsuarios += "</div>";

    enChat = usuarios.getUsersConnectedInWidget();
    $.each(enChat, function (i, item) {	
        if(item.userName != usuarios.getUser()){
          listaUsuarios += "<button type='button' id="+ item.userName +" name="+ item.userName +" class='list-group-item usuarioChat socialEye'><span class='fa-stack fa-lg socialEye'><i class='fa fa-user fa-stack-1x socialEye'></i></span>" + item.userName + " <label class='nuevoMensaje'> Nuevo mensaje </label></button>";
        }
    });     
    listaUsuarios += "</div>";
    return listaUsuarios;
}

usuarios.onReady = function(){
	$("#cerrarListaUsuarios").on("click", function (event) {
        usuarios.close();
    });
    $(".usuarioChat").each(function () {
        this.onclick = chatClick;
    });
    interval = setInterval(function () {
        $('.usuarioChat').remove();
        enChat = usuarios.getUsersConnectedInWidget();
        $.each(enChat, function (i, item) {
            if (item.userName != usuarios.getUser()){
                $('#listaUsuarios').append("<button type='button' id="+ item.userName +" name="+ item.userName +" class='list-group-item usuarioChat socialEye'><span class='fa-stack fa-lg socialEye'><i class='fa fa-user fa-stack-1x socialEye'></i></span>" + item.userName + " <label class='nuevoMensaje'> Nuevo mensaje </label></button>");
                $("#"+item.userName).on('click', chatClick);
            }
        });
    }, 15000);

    var webRTC;
    iniciarWebRTC();

}

usuarios.onCloseWidget = function(){
	clearInterval(interval);
    if($("#videoCall").is(":visible")){
        terminarLlamada();
    }
    webRTC.leaveRoom();
}

function chatClick(e){
	if(chatAbierto == false){
        mostrarChat(e.target.id);
	}
}

function mostrarChat(otroUsuario){
	userConnected = true;
	llamando = false;
    chatAbierto = true; 
    enGeneral = false;
    usuarioChatActual = otroUsuario;
    if($("#"+usuarioChatActual+ " label").is(":visible")){
        $("#"+usuarioChatActual+ " label").hide();
    }
    var conversacion = "<div class='detailBox socialEye' id='chatBox'>";
    conversacion += "<div class='titleBox socialEye'>";
    conversacion += "<label class='socialEye' id='labelConversacion'>Conversación con "+ usuarioChatActual +" </label>";
    conversacion += "<button type='button' class='close botonCerrar socialEye' id='cerrarChatBox' aria-hidden='true'>&times;</button>";
    conversacion += "</div>";
    conversacion += "<div id='conversacionBox' class='actionBox socialEye'>";
    conversacion += "<ul id='listaComentarios' class='commentList socialEye'>";
    params = {};
    if(usuarioChatActual > usuarios.getUser()){
        params['user1'] = usuarioChatActual;
        params['user2'] = usuarios.getUser();
    }
    else{
        params['user1'] = usuarios.getUser();
        params['user2'] = usuarioChatActual;
    }
    chat = usuarios.getObject(params);
    if(chat == null){
    	params.comentarios = [];
        usuarios.saveObject(params);
    }
    else{
        $.each(chat.element.comentarios, function (i, item) {
            conversacion += "<li class='socialEye'><div class='commentText socialEye'>";
            conversacion += "<span class='date sub-text socialEye'>" + item.userName + " dijo: </span>";
            conversacion += "<div class='contenidoComentario'>" + item.texto+ "</div>";
            conversacion += "</div>";
            conversacion += "</li>";
        });
    }
    conversacion += "</ul>";
    conversacion += "<form class='form-inline socialEye' role='form'>";
    conversacion += "<div>";
    conversacion += "<textarea class='form-control socialEye' id='textoComentarioChat' type='text' placeholder='Escribe un comentario' ></textarea>";
	conversacion += "</div>";
	conversacion += "</form>";
	conversacion += "</div>";
	if (window.location.protocol == "https:"){
	    conversacion += "<div id='divIconoLlamada'><a class='socialEye' title='Realizar videollamada'><span class='socialEye'><i id=call"+ usuarioChatActual +" class='fa fa-video-camera botonLlamada'></i></span></a></div>";
	    conversacion += "<div id='videoCall'>"
	    conversacion += "<div class='videoContainer'>";
	    conversacion += "<video id='localVideo' oncontextmenu='return false;'></video>";
	    conversacion += "</div>";
	    conversacion += "<div id='remotes'></div>";
	}
    conversacion += "</div>";
    conversacion += "</div>";
    $("body").append(conversacion);
    $('#listaComentarios').scrollTop( $('#listaComentarios')[0].scrollHeight);

    webRTC.leaveRoom();

    //ambos deben entrar al mismo room. Para definir el nombre del mismo hago que calculen cual es el id mayor,
    //ese va primero en el nombre
    if(usuarioChatActual > usuarios.getUser())
        roomEspecifico = 'chatSocialEye_' + usuarioChatActual + '_' + usuarios.getUser();
    else
        roomEspecifico = 'chatSocialEye_' + usuarios.getUser() + '_' + usuarioChatActual;

    //Modifico el comportamiento del onMessage ya que estoy dentro de un room específico
    webRTC.connection.on('message', function(data){
        if(!(enGeneral)){
            if(data.type === 'chat'){
                  $("#listaComentarios").append(data.payload.message);
                  $('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});
            }
            else{
                if(data.type === 'call'){
                	if(boxLlamadaCreado == false){
                		crearBoxLlamada(data, false);
                		boxLlamadaCreado = true;
                	}    
                }
                else{
                    if((data.type === 'offer') || (data.type === 'estoy')){
                        userInChat = true;
                        if(data.type === 'offer'){
                            webRTC.sendToAll('estoy', {});
                        }
                    }
                    else{
                        if((data.type === 'callAnswer') && (llamadaEstablecida == false)){
                        	llamando = false;
                            if(data.payload.answer == 'aceptada'){
                            	llamadaEstablecida = true;
                                $("#videoCall").show();
                                document.getElementById("chatBox").style.width = "650px";
                                document.getElementById("conversacionBox").style.width = "60%";
                                document.getElementById("divIconoLlamada").style.left = "59%";
                                $("#call"+ usuarioChatActual).prop('onclick',null).off('click');
                                $("#call"+ usuarioChatActual).on('click', colgarClick);
                                webRTC.startLocalVideo();
                                $("#remotes").show();
                            }
                            $("#listaComentarios").append(data.payload.respuesta);
                            $('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});
                        }
                        else{
                            if(data.type === 'colgar'){
                                if(llamadaEstablecida){
	                                terminarLlamada();
	                                $("#listaComentarios").append(data.payload.mensajeColgar);
	                            	$('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});
                            	}
                            }
                            else{
                                if(data.type === 'salir'){
                                    userInChat = false;
                                }
                            }
                        }
                    }
                }
            }
        }
    });

	if (window.location.protocol == "https:"){
    	cargarRTC();
    }

    webRTC.joinRoom(roomEspecifico);

    $("#call"+ usuarioChatActual).on('click', callClick);

    var textoComentarioChat = document.getElementById("textoComentarioChat");
    textoComentarioChat.addEventListener("keydown", function(e) {
      if (!e) { var e = window.event; }
 
      //keyCode 13 is the enter/return button keyCode
      if (e.keyCode == 13) {
        // enter/return probably starts a new line by default
        e.preventDefault();
        if(textoComentarioChat.value != ""){
            var mensaje = "<li class='socialEye'><div class='commentText socialEye'>";
            mensaje += "<span class='date sub-text socialEye'>" + usuarios.getUser() + " dijo: </span>";
            mensaje += "<div class='contenidoComentario'>" + textoComentarioChat.value + "</div>";
            mensaje += "</div>";
            mensaje += "</li>";
            $("#listaComentarios").append(mensaje);
            $('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});

            if(userInChat){
                webRTC.sendToAll('chat', {message: mensaje});
            }
            else{
                webRTC.leaveRoom();
                webRTC.joinRoom('socialEyeGeneral');
                enGeneral = true;
                setTimeout(function(){webRTC.sendToAll('chat', {idMensajeado: usuarioChatActual, idMensajero: usuarios.getUser()});}, 1000);



                var roomName;
                if(usuarioChatActual > usuarios.getUser())
                    roomName = 'chatSocialEye_' + usuarioChatActual + '_' + usuarios.getUser();
                else
                    roomName = 'chatSocialEye_' + usuarios.getUser() + '_' + usuarioChatActual;

                enGeneral = false;
                webRTC.joinRoom(roomName);


            }
            params = {};
            if(usuarioChatActual > usuarios.getUser()){
                params['user1'] = usuarioChatActual;
                params['user2'] = usuarios.getUser();
            }
            else{
                params['user1'] = usuarios.getUser();
                params['user2'] = usuarioChatActual;
            }
            chat = usuarios.getObject(params);
            comentario = new Comentario(textoComentarioChat.value, usuarios.getUser());
            chat.element.comentarios.push(comentario);
            usuarios.updateObject(chat.element, params);

            textoComentarioChat.value="";

        }

      }
    }, false);

    $("#cerrarChatBox").on("click", function (event) {
    	if($("#videoCall").is(":visible")){
    		colgarClick();
        }
        $("#chatBox").remove();
        chatAbierto = false;
        webRTC.sendToAll('salir', {});
        webRTC.leaveRoom();
		webRTC.joinRoom('socialEyeGeneral');
		enGeneral = true;
	}); 

	setInterval(function () {
		alert("hola");
		if(usuarios.isUserConnectedInWidget(usuarioChatActual) == false){
			$('#textoComentarioChat').prop("disabled", true);
			$("#call"+ usuarioChatActual).prop('onclick',null).off('click');
			userConnected = false;
			$('#labelConversacion').text("Conversación con " + usuarioChatActual + " (desconectado)");
		}
		else{
			if(userConnected == false){
				userConnected = true;
				$('#textoComentarioChat').prop("disabled", false);
				$("#call"+ usuarioChatActual).on('click', callClick);
				$('#labelConversacion').text("Conversación con " + usuarioChatActual);
			}
		}
    }, 10000);   
}

function Comentario(texto, userName){
	this.texto = texto;
	this.userName = userName;
}

function crearBoxLlamada(data, responde){
    var mensajeRespuesta = "<li class='socialEye'><div class='commentText socialEye'>";
    var respondio = false;
    bootbox.dialog({
        message: "¿Contestar a la videollamada?",
        title: data.payload.userNameLlamante + " llamando...",
        buttons: {
        success: {
        label: "Contestar",
        className: "btn-success",
          callback: function() {
            if(responde){
                mostrarChat(data.payload.idLlamante);
            }
            document.getElementById("chatBox").style.width = "650px";
            document.getElementById("conversacionBox").style.width = "60%";
            document.getElementById("divIconoLlamada").style.left = "59%";
            $("#videoCall").show();
            $("#call"+ usuarioChatActual).prop('onclick',null).off('click');
            $("#call"+ usuarioChatActual).on('click', colgarClick);
            mensajeRespuesta += "<span class='date sub-text socialEye'> Conexión de videollamada establecida </span>";
            mensajeRespuesta += "</div>";
            mensajeRespuesta += "</li>";
            setTimeout(function(){webRTC.sendToAll('callAnswer', {answer: 'aceptada', respuesta: mensajeRespuesta});}, 3000);
            webRTC.startLocalVideo();
            $("#remotes").show(); 
            $("#listaComentarios").append(mensajeRespuesta);
            $('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});
            respondio = true;
            }
        },
        danger: {
          label: "No contestar",
          className: "btn-danger",
          callback: function() {
            mensajeRespuesta += "<span class='date sub-text socialEye'>" + usuarios.getUser() + " llamada rechazada </span>";
            mensajeRespuesta += "</div>";
            mensajeRespuesta += "</li>";
            webRTC.sendToAll('callAnswer', {answer: 'rechazada', respuesta: mensajeRespuesta});
            $("#listaComentarios").append(mensajeRespuesta);
            if(!(responde)){
                $('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});
            }
            boxLlamadaCreado = false;
            respondio = true;
          }
        }
      }
    });
	setTimeout(function(){
		if(respondio == false){ 
			boxLlamadaCreado = false;
			bootbox.hideAll();
			mensajeRespuesta += "<span class='date sub-text socialEye'> llamada perdida de "+data.payload.idLlamante+" </span>";
            mensajeRespuesta += "</div>";
            mensajeRespuesta += "</li>";
            $("#listaComentarios").append(mensajeRespuesta);
            $('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});
		}
	}, 10000);
}

function callClick(e){
  if(llamando == false){
    var usuarioCallActual = e.target.id.substr(4, e.target.id.length);
    var textoLlamada = "<li class='socialEye'><div class='commentText socialEye'>";
    textoLlamada += "<span class='date sub-text socialEye'>" + usuarios.getUser() + " solicitando llamada... </span>";
    textoLlamada += "</div>";
    textoLlamada += "</li>";
    $("#listaComentarios").append(textoLlamada);
    $('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});

    if(userInChat){
        webRTC.sendToAll('call', {idLlamado: usuarioCallActual, idLlamante: usuarios.getUser(), userNameLlamante: usuarios.getUser()});
    }
    else{
        webRTC.leaveRoom();
        webRTC.joinRoom('socialEyeGeneral');
        setTimeout(function(){webRTC.sendToAll('call', {idLlamado: usuarioCallActual, idLlamante: usuarios.getUser(), userNameLlamante: usuarios.getUser()});}, 1000);
        webRTC.leaveRoom();
        webRTC.joinRoom(roomEspecifico);
    }   
    llamando = true; 
    setTimeout(function(){
    	if(llamando){
    		textoLlamada = "<li class='socialEye'><div class='commentText socialEye'>";
    		textoLlamada += "<span class='date sub-text socialEye'> La llamada no ha sido contestada </span>";
            textoLlamada += "</div>";
            textoLlamada += "</li>";
            $("#listaComentarios").append(textoLlamada);
            $('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});
            llamando = false;
    	}
    }, 10000);
  } 
}

function iniciarWebRTC(){
    // create our webrtc connection
    webRTC = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'localVideo',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: '',
        // immediately ask for camera access
        autoRequestMedia: true,
        debug: false,
        detectSpeakingEvents: true,
        autoAdjustMic: false
    });
    //Uniendose al room general

    var idUsuario = usuarios.getUser();

    webRTC.joinRoom('socialEyeGeneral');

    enGeneral = true;

    webRTC.connection.on('message', function(data){
                if(enGeneral){
                    if(data.type === 'call'){
                        if(data.payload.idLlamado == idUsuario){
                            if(boxLlamadaCreado == false){
                				crearBoxLlamada(data, true);
                				boxLlamadaCreado = true;
                			}  
                        }                           
                    }
                    else{
                        if(data.type === 'chat'){                                   
                            if(data.payload.idMensajeado == idUsuario){
                                $("#"+data.payload.idMensajero+ " label").show();
                            }
                        }
                    }
                }
    });
}

function cargarRTC(){
    // we got access to the camera
    webRTC.on('localStream', function (stream) {
    	console.log("acceso a la camara conseguido");
        var button = document.querySelector('form>button');
        if (button) button.removeAttribute('disabled');
    });
    // we did not get access to the camera
    webRTC.on('localMediaError', function (err) {
        console.log("hubo un error");
    });

    // local screen obtained
    webRTC.on('localScreenAdded', function (video) {
        console.log("video local agregado");
        video.onclick = function () {
            video.style.width = video.videoWidth + 'px';
            video.style.height = video.videoHeight + 'px';
        };
        document.getElementById('localScreenContainer').appendChild(video);
        $('#localScreenContainer').show();
    });
    // local screen removed
    webRTC.on('localScreenRemoved', function (video) {
        console.log("video local removido");
        document.getElementById('localScreenContainer').removeChild(video);
        $('#localScreenContainer').hide();
    });

    // a peer video has been added
    webRTC.on('videoAdded', function (video, peer) {
       if(userInChat){
        if((!(streamingsAgregados)) && (!(enGeneral))){
            console.log('video remoto agregado', peer);
            var remotes = document.getElementById('remotes');
            if (remotes) {
                var container = document.createElement('div');
                container.className = 'videoContainer';
                container.id = 'container_' + webRTC.getDomId(peer);
                container.appendChild(video);

                // suppress contextmenu
                video.oncontextmenu = function () { return false; };

                // resize the video on click
                video.onclick = function () {
                    container.style.width = video.videoWidth + 'px';
                    container.style.height = video.videoHeight + 'px';
                };

                // show the ice connection state
                if (peer && peer.pc) {
                    var connstate = document.createElement('div');
                    connstate.className = 'connectionstate';
                    container.appendChild(connstate);
                }
                remotes.appendChild(container);
            }
            streamingsAgregados = true;
        }
      }
    });
    // a peer was removed
    webRTC.on('videoRemoved', function (video, peer) {
        console.log('video remoto removido ', peer);
        var remotes = document.getElementById('remotes');
        var el = document.getElementById(peer ? 'container_' + webRTC.getDomId(peer) : 'localScreenContainer');
        if (remotes && el) {
            remotes.removeChild(el);
        }
    });

    // local p2p/ice failure
    webRTC.on('iceFailed', function (peer) {
        var connstate = document.querySelector('#container_' + webRTC.getDomId(peer) + ' .connectionstate');
        console.log('local fail', connstate);
        if (connstate) {
            fileinput.disabled = 'disabled';
        }
    });

    // remote p2p/ice failure
    webRTC.on('connectivityError', function (peer) {
        var connstate = document.querySelector('#container_' + webRTC.getDomId(peer) + ' .connectionstate');
        console.log('remote fail', connstate);
        if (connstate) {
            fileinput.disabled = 'disabled';
        }
    });           
}


function colgarClick(e){
            terminarLlamada();
            var mensaje = "<li class='socialEye'><div class='commentText socialEye'>";
            mensaje += "<span class='date sub-text socialEye'> Llamada finalizada </span>";
            mensaje += "</div>";
            mensaje += "</li>";
            webRTC.sendToAll('colgar', {mensajeColgar: mensaje});
            $("#listaComentarios").append(mensaje);
            $('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});

}

function terminarLlamada(){
            $("#videoCall").hide();
            document.getElementById("chatBox").style.width = "500px";
            document.getElementById("conversacionBox").style.width = "90%";
            document.getElementById("divIconoLlamada").style.left = "90%";
            $("#call"+ usuarioChatActual).prop('onclick',null).off('click');
            $("#call"+ usuarioChatActual).on('click', callClick);
            llamadaEstablecida = false;
            streamingsAgregados = false;
            boxLlamadaCreado = false;
}


