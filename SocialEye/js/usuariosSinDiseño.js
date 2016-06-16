var usuarios = new Widget();
usuarios.descripcion = "Contacta con otros usuarios que naveguen las mismas páginas web.";
usuarios.icono = "users";
var chatAbierto = false;
var llamadaEstablecida = false;
var llamando = false;
var interval;
var conexion;
var usuarioChatActual = null;
var connected = null;
var callAnswer = 0; //0 -> No contestó, 1 -> Aceptó, 2 -> Rechazó
var webRTCEnabled = false;

usuarios.loadWidget = function () {
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
        idsEnChat = [];
        mostrados = $('.usuarioChat');
        enChat = usuarios.getUsersConnectedInWidget();
        $.each(enChat, function (i, item) { //Agrego nuevos usuarios conectados
            idsEnChat.push(item.userName);
            if( (item.userName != usuarios.getUser()) && ($('#'+item.userName).length == 0) ){
                $('#listaUsuarios').append("<button type='button' id="+ item.userName +" name="+ item.userName +" class='list-group-item usuarioChat socialEye'><span class='fa-stack fa-lg socialEye'><i class='fa fa-user fa-stack-1x socialEye'></i></span>" + item.userName + " <label class='nuevoMensaje'> Nuevo mensaje </label></button>");
                $("#"+item.userName).on('click', chatClick);
            }
        });       
        $.each(mostrados, function (i, item) { //Elimino de la lista los usuarios que ya no están conectados
            if($.inArray($(item).attr('id'), idsEnChat ) == -1){
                $(item).remove();
            }
        });
    }, 15000);

    conexion = new SocketConnection();

    conexion.joinRoom(usuarios.getUser());

    if (window.location.protocol == "https:"){
        conexion.startWebRTC();
    }


    conexion.on('message', function(messageData){
        $("#"+messageData.messenger+ " label").show();
    });

}

usuarios.onCloseWidget = function(){
	clearInterval(interval);
    if(llamadaEstablecida){
        colgarClick();
    }
}

function chatClick(e){
	if(chatAbierto){
        if(e.target.id != usuarioChatActual){
            cerrarChat();
            mostrarChat(e.target.id);
        }
	}
    else{
        mostrarChat(e.target.id);
    }

}

function getChatMessage(textMessage){
    var msg = "<li class='socialEye'><div class='commentText socialEye'>";
    msg += "<span class='date sub-text socialEye'> "+ textMessage +" </span>";
    msg += "</div>";
    msg += "</li>";
    return msg;
}

function mostrarChat(otroUsuario){
	llamando = false;
    chatAbierto = true; 
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
    }
    else{
        $.each(chat.element.comentarios, function (i, item) {
            conversacion += "<li class='socialEye'><div class='commentText socialEye'>";
            conversacion += "<span class='date sub-text socialEye' id='userIcon'>" + item.userName + " dijo: </span>";
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
	    conversacion += "<div id='divIconoLlamada'><a class='socialEye' id='iconTitle' title='Realizar videollamada'><span class='socialEye'><i id=call"+ usuarioChatActual +" class='fa fa-video-camera botonLlamada'></i></span></a></div>";
	    conversacion += "<div id='videoCall'>"
        conversacion += "<label id='labelConnecting'>Conectando...</label>"
	    conversacion += "<video id='localVideo' class='videos' oncontextmenu='return false;'></video>";
        conversacion += "<video id='remoteVideo' class='videos' oncontextmenu='return false;'></video>";	    
	}
    conversacion += "</div>";
    conversacion += "</div>";
    $("body").append(conversacion);

    $('#listaComentarios').scrollTop( $('#listaComentarios')[0].scrollHeight);

    conexion.joinRoom(usuarioChatActual);


    conexion.on('message', function(message){
            //Recibo mensaje del usuario con el cual estoy chateando
        if(message.messenger == usuarioChatActual){
            $("#listaComentarios").append(message.messageText);
            $('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});
        }
        //Recibo mensaje de otro usuario
        else{
            $("#"+message.messenger+ " label").show();//Muestro aviso en la lista de usuarios
        }     
    });

    //Ver si lo puedo cambiar por el evento de webRTC que se dispara al dejar de recibir el streaming remoto.
    conexion.on('colgar', function(callData){
        if((llamadaEstablecida) && (callData.sender != usuarios.getUser())){
            terminarLlamada();
            $("#listaComentarios").append(getChatMessage(usuarioChatActual + ' colgó la llamada'));
            $('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});
        }
    });


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

            conexion.send(usuarioChatActual, 'message', {messenger: usuarios.getUser(), messageText: mensaje});

            textoComentarioChat.value="";

        }

      }
    }, false);

    $("#cerrarChatBox").on("click", cerrarChat);

    connected = true;

	setInterval(function () {
		if(usuarios.isUserConnectedInWidget(usuarioChatActual) == false){
            connected = false;
			$('#textoComentarioChat').prop("disabled", true);
			$("#call"+ usuarioChatActual).prop('onclick',null).off('click');
			$('#labelConversacion').text("Conversación con " + usuarioChatActual + " (desconectado)");
		}
		else{
            if(!connected){
                connected = true;
                $('#textoComentarioChat').prop("disabled", false);
                $("#call"+ usuarioChatActual).on('click', callClick);
                $('#labelConversacion').text("Conversación con " + usuarioChatActual);
            }			
		}
    }, 10000);   
}

function colgarClick(e){
    terminarLlamada();
    conexion.send(usuarioChatActual, 'colgar', {});
    $("#listaComentarios").append(getChatMessage("Llamada finalizada"));
    $('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});

}

function terminarLlamada(){
    $('#localVideo').attr('src', '');
    $('#remoteVideo').attr('src', '');
    conexion.endPeerConnection();
    contraerChatBox();
    llamadaEstablecida = false;
    callAnswer = 0;
}

function cerrarChat(event) {
        if(llamadaEstablecida){
            colgarClick();
        }
        $("#chatBox").remove();
        chatAbierto = false;
        conexion.on('message', function(messageData){
            $("#"+messageData.messenger+ " label").show();
        });
} 

function Comentario(texto, userName){
	this.texto = texto;
	this.userName = userName;
}


function callClick(e){
    conexion.setWebRTC();
    conexion.send(usuarioChatActual, 'call', {} );
    extenderChatBox();
    $("#listaComentarios").append(getChatMessage("Llamando a " + usuarioChatActual + "..."));
    $('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});    
}

function extenderChatBox(){
    $("#videoCall").show();
    document.getElementById("chatBox").style.width = "650px";
    document.getElementById("conversacionBox").style.width = "60%";
    document.getElementById("divIconoLlamada").style.left = "59%";
    $("#call"+ usuarioChatActual).prop('onclick',null).off('click');
    $("#call"+ usuarioChatActual).on('click', colgarClick);
    $("#iconTitle").attr('title', 'Colgar videollamada');
}

function contraerChatBox(){
    $("#videoCall").hide();
    document.getElementById("chatBox").style.width = "500px";
    document.getElementById("conversacionBox").style.width = "90%";
    document.getElementById("divIconoLlamada").style.left = "90%";
    $("#call"+ usuarioChatActual).prop('onclick',null).off('click');
    $("#call"+ usuarioChatActual).on('click', callClick);
    $("#iconTitle").attr('title', 'Realizar videollamada');
}

function crearBoxLlamada(data){
    bootbox.dialog({
        message: "¿Contestar a la videollamada?",
        title: data.sender + " llamando...",
        buttons: {
        success: {
        label: "Contestar",
        className: "btn-success",
          callback: function() {
            if(chatAbierto){
                if(usuarioChatActual != data.sender){
                    cerrarChat();
                    mostrarChat(data.sender);
                }
            }
            else{
                mostrarChat(data.sender);
                chatAbierto = true;
            }
            extenderChatBox();
            $('#labelConnecting').show();
            callAnswer = 1;
            }
        },
        danger: {
          label: "No contestar",
          className: "btn-danger",
          callback: function() {
            callAnswer = 2;
          }
        }
      }
    });
}


function SocketConnection(){
    var localStream;
    var localPeerConnection;
    var remotePeerConnection;
    var total = '';
    var socket = io.connect('https://localhost:2013', {secure: true});
    var pc = null;
    var candidatoCreado = false;
    var candidatoAgregado = false;

    this.joinRoom = function(room){
        socket.emit('joinRoom', room); 
    }

    this.send = function(msgRoom, msgType, msgContent){
        var msg = {};
        msg.type = msgType;
        msg.room = msgRoom;
        msg.content = msgContent;
        msg.content.sender = usuarios.getUser();
        socket.emit('message', msg);
    }

    this.on = function(messageType, actionFunction){
        socket.removeAllListeners(messageType);
        socket.on(messageType, actionFunction);
    }

    this.startWebRTC  = function(){
        socket.on('call', function (evt){
            if(evt.sender != usuarios.getUser()){
                crearBoxLlamada(evt);
                //Timeout porque debo esperar la respuesta, sino el hilo continúa.
                setTimeout(function(){
                    bootbox.hideAll(); //Cierro el box
                    if(callAnswer == 1){ //Aceptó
                        conexion.setWebRTC();
                        conexion.send(evt.sender, 'callAnswer' ,{answer: 'aceptada'});
                        llamadaEstablecida = true;
                        conexion.startPeerConnection(false);
                        $("#listaComentarios").append(getChatMessage("Conexión de videollamada establecida"));
                        $("#labelConnecting").hide();
                    }
                    else{
                        if(callAnswer == 2) //Rechazó
                            conexion.send(evt.sender, 'callAnswer' ,{answer: 'rechazada'});
                        else{ //No contestó
                            conexion.send(evt.sender, 'callAnswer' ,{answer: 'noRta'});
                            if(chatAbierto)
                                $("#listaComentarios").append(getChatMessage("Llamada perdida de " + usuarioChatActual));
                        }
                    }
                    if(chatAbierto)
                        $('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});
                }, 10000);
            }      
        });
    }

    function logError(error) {
        console.log(error.name + ": " + error.message);
    }

    this.setWebRTC = function(){

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        var constraints = {video: true, audio:true};

        function successCallback(localMediaStream) {
          window.stream = localMediaStream;
          localStream = localMediaStream;
          $('#localVideo').attr('src', window.URL.createObjectURL(localMediaStream));
          $('#localVideo').get(0).play();
        }

        function errorCallback(error){
          console.log("navigator.getUserMedia error: ", error);
        }

        navigator.getUserMedia(constraints, successCallback, errorCallback);

        if(!webRTCEnabled){
            socket.on('callAnswer', function(callData){
                if((callData.sender != usuarios.getUser()) && (!llamadaEstablecida)){
                    if(callData.answer == 'aceptada'){
                        conexion.startPeerConnection(true);
                        llamadaEstablecida = true;
                        $("#listaComentarios").append(getChatMessage("Conexión de videollamada establecida"));
                    }
                    else{
                        if(callData.answer == 'rechazada')
                            $("#listaComentarios").append(getChatMessage(usuarioChatActual + " ha rechazado la llamada"));  
                        else
                            $("#listaComentarios").append(getChatMessage(usuarioChatActual + " no ha contestado a la llamada"));    
                        contraerChatBox();       
                    }

                    $('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});
                }
            });

            socket.on('localDescription', function(description){
                if(description.sender != usuarios.getUser()){
                    console.log('Description recibida de ' + description.sender + ': '+ description.sdp.sdp);
                    pc.setRemoteDescription(new RTCSessionDescription(description.sdp), function () {
                        if (pc.remoteDescription.type == "offer")
                          pc.createAnswer(gotLocalDescription, logError);
                    }, logError);  
                }
            });

            socket.on('callCandidate', function(candidate){
                if(candidate.sender != usuarios.getUser()){
                    candidatoAgregado = true;
                    console.log(usuarios.getUser() + ' agregando candidato: ' + candidate.sender);
                    pc.addIceCandidate(new RTCIceCandidate(candidate.candidate), function () {}, logError);
                }
            });

            webRTCEnabled = true;

        }

    }

    this.startPeerConnection = function(caller){
        setTimeout(function(){
            var configuration = {"iceServers": [{"url": "stun:stun.example.org"}]};

            pc = new RTCPeerConnection(configuration);

            pc.onicecandidate = gotLocalIceCandidate;

            pc.onaddstream = gotRemoteStream;

            pc.addStream(localStream);

            if(caller){
                pc.createOffer(gotLocalDescription, logError);
            }
        }, 1000);
    }

    this.endPeerConnection = function(){
       pc.close();
       pc = null;
       candidatoCreado = false;
    }

    function gotLocalIceCandidate(event) {
      if ((event.candidate) && (candidatoCreado == false)) {
         candidatoCreado = true;
         console.log(usuarios.getUser() + ' se envía como candidato');
         conexion.send(usuarioChatActual, 'callCandidate', { candidate: event.candidate});
      }
    }

    function gotRemoteStream(event) {
        $('#remoteVideo').attr('src', URL.createObjectURL(event.stream));
        $('#remoteVideo').get(0).play();
    }


    function gotLocalDescription(description) {
        pc.setLocalDescription(description, function () {
            conexion.send(usuarioChatActual, 'localDescription', {sdp: pc.localDescription });});
        console.log(usuarios.getUser() + ' seteando descripcion local y enviando: ' + description.sdp);      
    }

}