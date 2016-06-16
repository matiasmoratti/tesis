var usuarios = new Widget();
usuarios.descripcion = "Contacta con otros usuarios que naveguen las mismas páginas web.";
usuarios.icono = "users";
usuarios.tittle = "Usuarios activos en: ";
var chatAbierto = false;
var llamadaEstablecida = false;
var llamando = false;
var interval;
var conexion;
var usuarioChatActual = null;
var connected = null;
var callAnswer = 0; //0 -> No contestó, 1 -> Aceptó, 2 -> Rechazó
var webRTCEnabled = false;
var lastWrite = false;

usuarios.loadWidget = function () {
    var dominio = window.location.hostname;
    boxGeneral = usuarios.getPrincipalBox('boxUsuarios',usuarios.tittle + dominio); //AGREGAR UN MÉTODO QUE FACILITE ESTOO!!! CREAR METODOS
                                                                                      //PARA OBTENER UN BODY Y LIST IGUAL QUE BOX
    boxGeneral.classList.add('boxUsuarios');
    body = usuarios.getPrincipalBody('listaUsuarios');
    body.classList.add('list-group','listaUsuarios');

    enChat = usuarios.getUsersConnectedInWidget();
    $.each(enChat, function (i, item) { 
        if(item.userName != usuarios.getUser()){
          userButton = usuarios.getButton(item.userName);
          userButton.classList.add('usuarioChat');
          userSpan = usuarios.getSpan();
          userSpan.classList.add('fa-stack', 'fa-lg');
          userI = usuarios.getI();
          userI.classList.add('fa', 'fa-user', 'fa-stack-1x');
          messageLabel = usuarios.getLabel('labelMensaje', '  Nuevo mensaje');
          messageLabel.classList.add('nuevoMensaje');
          userLabel = usuarios.getLabel('userLabel', item.userName);
          userLabel.classList.add('userLabel');
          userSpan.appendChild(userI);
          userButton.appendChild(userSpan);
          userButton.appendChild(userLabel);
          userButton.appendChild(messageLabel);
          body.appendChild(userButton);
        }
    });    
    boxGeneral.appendChild(body); 

    return boxGeneral;
}

usuarios.onReady = function(){
    $(".usuarioChat").each(function () {
        this.onclick = chatClick;
    });
    interval = setInterval(function () {
        idsEnChat = [];
        mostrados = $('.usuarioChat');
        enChat = usuarios.getUsersConnectedInWidget();
        $.each(enChat, function (i, item) { //Agrego nuevos usuarios conectados
            idsEnChat.push(item.userName);
            if( (item.userName != usuarios.getUser()) && (usuarios.getWidgetElement(item.userName) == null) ){
                userButton = usuarios.getButton(item.userName);
                userButton.classList.add('usuarioChat');
                userSpan = usuarios.getSpan();
                userSpan.classList.add('fa-stack', 'fa-lg');
                userI = usuarios.getI();
                userI.classList.add('fa', 'fa-user', 'fa-stack-1x');
                messageLabel = usuarios.getLabel('labelMensaje', 'Nuevo mensaje');
                messageLabel.classList.add('nuevoMensaje');
                userLabel = usuarios.getLabel('userLabel', item.userName);
                userLabel.classList.add('userLabel');
                userSpan.appendChild(userI);
                userButton.appendChild(userSpan);
                userButton.appendChild(userLabel);
                userButton.appendChild(messageLabel);
                usuarios.getWidgetElement('listaUsuarios').appendChild(userButton);
                $(userButton).on('click', chatClick);
            }
        });       
        $.each(mostrados, function (i, item) { //Elimino de la lista los usuarios que ya no están conectados
            userDiscName = $(item).attr('id').substring(usuarios.idWidget.toString().length, $(item).attr('id').length);
            if($.inArray(userDiscName, idsEnChat ) == -1){
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
        if(messageData.messenger != usuarios.getUser())
          $(usuarios.getWidgetElement(messageData.messenger).childNodes[2]).show();
    });

}

usuarios.onCloseWidget = function(){
    clearInterval(interval);
    if(llamadaEstablecida){
        colgarClick();
    }
}

function chatClick(e){
    userChatName = e.target.id.substring(usuarios.idWidget.toString().length, e.target.id.length);
    if(chatAbierto){
        if(userChatName != usuarioChatActual){
            cerrarChat();
            mostrarChat(userChatName);
        }
    }
    else{
        mostrarChat(userChatName);
    }

}

function getChatMessage(textMessage){
    li = usuarios.getLi();
    div = usuarios.getDiv();
    div.classList.add('commentText');
    span = usuarios.getSpan();
    span.classList.add('date','sub-text');
    span.innerHTML= textMessage;
    div.appendChild(span);
    li.appendChild(div);

    return li;
}

function mostrarChat(otroUsuario){
    llamando = false;
    chatAbierto = true; 
    usuarioChatActual = otroUsuario;
    if($(usuarios.getWidgetElement(otroUsuario).childNodes[2]).is(":visible")){
        $(usuarios.getWidgetElement(otroUsuario).childNodes[2]).hide();
    }

    chatBox = usuarios.getBox('chatBox', "Conversación con " + usuarioChatActual);
    chatBox.classList.add('chatBox');

    chatBody = usuarios.getPrincipalBody("chatBody");
    chatBody.classList.add('chatBody');
    
    chatList = usuarios.getPrincipalList("listaComentarios");

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
        var lastUserWriting = null;
        $.each(chat.element.comentarios, function (i, item) {
            li = usuarios.getLi();
            div = usuarios.getDiv();
            div.classList.add('commentText');
            if((lastUserWriting == null) || (lastUserWriting != item.userName)){
                span = usuarios.getSpan();
                span.classList.add('date','sub-text', 'userIcon');
                span.innerHTML=item.userName + " dijo: "; 
                div.appendChild(span);
            }
            p = usuarios.getP();
            p.classList.add('commentTextP');
            p.innerHTML=item.texto;      
            div.appendChild(p);
            li.appendChild(div);
            chatList.appendChild(li);
            lastUserWriting = item.userName;
        });
    }

    if(lastUserWriting == usuarios.getUser()){
        lastWrite = true;
    }

    chatBody.appendChild(chatList);
    chatForm = usuarios.getForm('');
    chatTextArea = usuarios.getTextArea('textoComentarioChat');
    chatTextArea.classList.add('textoComentarioChat');
    chatTextArea.placeholder = 'Envía un mensaje a ' + usuarioChatActual;
    chatForm.appendChild(chatTextArea);
    chatBody.appendChild(chatForm);
    chatBox.appendChild(chatBody);



    if (window.location.protocol == "https:"){
        divIconoLlamada = usuarios.getDiv('divIconoLlamada');
        divIconoLlamada.classList.add('divIconoLlamada');
        aLlamada = usuarios.getA('iconTitle');
        aLlamada.title = 'Realizar videollamada';
        spanLlamada = usuarios.getSpan();
        iLlamada = usuarios.getI('call' + usuarioChatActual); 
        iLlamada.classList.add('fa', 'fa-video-camera', 'botonLlamada');
        spanLlamada.appendChild(iLlamada);
        aLlamada.appendChild(spanLlamada);
        divIconoLlamada.appendChild(aLlamada);
        chatBox.appendChild(divIconoLlamada);
        
        divVideoCall = usuarios.getDiv('videoCall');
        divVideoCall.classList.add('videoCall');
        labelConnecting = usuarios.getLabel('labelConnecting', 'Conectando...');
        labelConnecting.classList.add('labelConnecting');
        localVideoTag = usuarios.getVideo('localVideo');
        localVideoTag.classList.add('videos');
        remoteVideoTag = usuarios.getVideo('remoteVideo');
        remoteVideoTag.classList.add('videos');
        divVideoCall.appendChild(labelConnecting);
        divVideoCall.appendChild(localVideoTag);
        divVideoCall.appendChild(remoteVideoTag);
        chatBox.appendChild(divVideoCall);
    }

    $(usuarios.getWidgetContainer()).append(chatBox);

    var listaComentariosElement = usuarios.getWidgetElement('listaComentarios');

    $(listaComentariosElement).scrollTop( $(listaComentariosElement)[0].scrollHeight);

    conexion.joinRoom(usuarioChatActual);


    conexion.on('message', function(message){
         //Recibo mensaje del usuario con el cual estoy chateando
        if(message.messenger != usuarios.getUser()){
             if(message.messenger == usuarioChatActual){
                li = usuarios.getLi();
                div = usuarios.getDiv();
                div.classList.add('commentText');
                if(lastWrite){
                    span = usuarios.getSpan();
                    span.classList.add('date','sub-text');
                    span.innerHTML=usuarioChatActual + " dijo: ";
                    div.appendChild(span);
                }          
                p = usuarios.getP();
                p.classList.add('commentTextP');
                p.innerHTML= message.messageText;
                div.appendChild(p);
                li.appendChild(div);
                usuarios.getWidgetElement('listaComentarios').appendChild(li);
                $(usuarios.getWidgetElement('listaComentarios')).animate({scrollTop: $(usuarios.getWidgetElement('listaComentarios'))[0].scrollHeight});
                lastWrite = false;
            }
            //Recibo mensaje de otro usuario
            else{
                $(usuarios.getWidgetElement(message.messenger).childNodes[2]).show();//Muestro aviso en la lista de usuarios
            }     
        }
       
    });

    //Ver si lo puedo cambiar por el evento de webRTC que se dispara al dejar de recibir el streaming remoto.
    conexion.on('colgar', function(callData){
        if((llamadaEstablecida) && (callData.sender != usuarios.getUser())){
            terminarLlamada();
            appendAndScrollList(listaComentariosElement, getChatMessage(usuarioChatActual + ' colgó la llamada'));
        }
    });


    $(usuarios.getWidgetElement("call"+ usuarioChatActual)).on('click', callClick);

    var textoComentarioChat = usuarios.getWidgetElement("textoComentarioChat");
    textoComentarioChat.addEventListener("keydown", function(e) {
      if (!e) { var e = window.event; }
 
      //keyCode 13 is the enter/return button keyCode
      if (e.keyCode == 13) {
        // enter/return probably starts a new line by default
        e.preventDefault();
        if(textoComentarioChat.value != ""){
            li = usuarios.getLi();
            div = usuarios.getDiv();
            div.classList.add('commentText');
            if(!lastWrite){
                span = usuarios.getSpan();
                span.classList.add('date','sub-text');
                span.innerHTML=usuarios.getUser() + " dijo: ";
                div.appendChild(span);
            }
            p = usuarios.getP();
            p.classList.add('commentTextP');
            p.innerHTML=textoComentarioChat.value;           
            div.appendChild(p);
            li.appendChild(div);
            usuarios.getWidgetElement('listaComentarios').appendChild(li);
            $(usuarios.getWidgetElement('listaComentarios')).animate({scrollTop: $(usuarios.getWidgetElement('listaComentarios'))[0].scrollHeight});

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

            conexion.send(usuarioChatActual, 'message', {messenger: usuarios.getUser(), messageText: textoComentarioChat.value});

            textoComentarioChat.value="";
            lastWrite = true;

        }

      }
    }, false);

    usuarios.onCloseBox('chatBox', cerrarChat);

    connected = true;

    setInterval(function () {
        if(usuarios.isUserConnectedInWidget(usuarioChatActual) == false){
            connected = false;
            $(usuarios.getWidgetElement('textoComentarioChat')).prop("disabled", true);
            $(usuarios.getWidgetElement("call"+ usuarioChatActual)).prop('onclick',null).off('click');
            usuarios.setBoxTitle('chatBox', "Conversación con " + usuarioChatActual + " (desconectado)");
            if(llamadaEstablecida)
                terminarLlamada();
        }
        else{
            if(!connected){
                connected = true;
                $(usuarios.getWidgetElement('textoComentarioChat')).prop("disabled", false);
                $(usuarios.getWidgetElement("call"+ usuarioChatActual)).on('click', callClick);
                usuarios.setBoxTitle('chatBox', "Conversación con " + usuarioChatActual);
            }           
        }
    }, 10000);   
}

function colgarClick(e){
    terminarLlamada();
    conexion.send(usuarioChatActual, 'colgar', {});
    appendAndScrollList(usuarios.getWidgetElement('listaComentarios'), getChatMessage("Llamada finalizada"));
}

function terminarLlamada(){
    conexion.endPeerConnection();
    contraerChatBox();
    llamadaEstablecida = false;
    callAnswer = 0;
}

function cerrarChat(event) {
        if(llamadaEstablecida){
            colgarClick();
        }
        $(usuarios.getWidgetElement('chatBox')).remove();
        chatAbierto = false;
        conexion.on('message', function(messageData){
            if(messageData.messenger != usuarios.getUser())
                $(usuarios.getWidgetElement(messageData.messenger).childNodes[2]).show();
        });
        conexion.leaveRoom(usuarioChatActual);
} 

function Comentario(texto, userName){
    this.texto = texto;
    this.userName = userName;
}

function appendAndScrollList(list, text){
        $(list).append(text);
        $(list).animate({scrollTop: $(list)[0].scrollHeight});
}


function callClick(e){
    conexion.setWebRTC();
    conexion.send(usuarioChatActual, 'call', {} );
    extenderChatBox();
    appendAndScrollList(getChatMessage("Llamando a " + usuarioChatActual + "..."));
}

function extenderChatBox(){
    $(usuarios.getWidgetElement("videoCall")).show();
    usuarios.getWidgetElement("chatBox").style.width = "650px";
    $(usuarios.getWidgetElement("call"+ usuarioChatActual)).prop('onclick',null).off('click');
    $(usuarios.getWidgetElement("call"+ usuarioChatActual)).on('click', colgarClick);
    $(usuarios.getWidgetElement("iconTitle")).attr('title', 'Colgar videollamada');
}

function contraerChatBox(){
    $(usuarios.getWidgetElement("videoCall")).hide();
    usuarios.getWidgetElement("chatBox").style.width = "400px";
    $(usuarios.getWidgetElement("call"+ usuarioChatActual)).prop('onclick',null).off('click');
    $(usuarios.getWidgetElement("call"+ usuarioChatActual)).on('click', callClick);
    $(usuarios.getWidgetElement("iconTitle")).attr('title', 'Realizar videollamada');
    $(usuarios.getWidgetElement('localVideo')).attr('src', '');
    $(usuarios.getWidgetElement('remoteVideo')).attr('src', '');
    conexion.stopStreaming();
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
            $(usuarios.getWidgetElement('labelConnecting')).show();
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

    this.leaveRoom = function(room){
        socket.emit('leaveRoom', room); 
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

    this.stopStreaming = function(){
        localStream.getVideoTracks()[0].stop();
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
                        appendAndScrollList(usuarios.getWidgetElement('listaComentarios',getChatMessage("Conexión de videollamada establecida")));
                        $(usuarios.getWidgetElement("labelConnecting")).hide();
                    }
                    else{
                        if(callAnswer == 2) //Rechazó
                            conexion.send(evt.sender, 'callAnswer' ,{answer: 'rechazada'});
                        else{ //No contestó
                            conexion.send(evt.sender, 'callAnswer' ,{answer: 'noRta'});
                            if(chatAbierto)
                                appendAndScrollList(usuarios.getWidgetElement("listaComentarios"), getChatMessage("Llamada perdida de " + usuarioChatActual));
                        }
                    }
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
          $(usuarios.getWidgetElement('localVideo')).attr('src', window.URL.createObjectURL(localMediaStream));
          $(usuarios.getWidgetElement('localVideo')).get(0).play();
        }

        function errorCallback(error){
          console.log("navigator.getUserMedia error: ", error);
        }

        navigator.getUserMedia(constraints, successCallback, errorCallback);

        if(!webRTCEnabled){
            socket.on('callAnswer', function(callData){
                var listaComentariosElement = usuarios.getWidgetElement('listaComentarios');
                if((callData.sender != usuarios.getUser()) && (!llamadaEstablecida)){
                    if(callData.answer == 'aceptada'){
                        conexion.startPeerConnection(true);
                        llamadaEstablecida = true;
                        appendAndScrollList(listaComentariosElement, getChatMessage("Conexión de videollamada establecida"));
                    }
                    else{
                        if(callData.answer == 'rechazada')
                            appendAndScrollList(listaComentariosElement, getChatMessage(usuarioChatActual + " ha rechazado la llamada"));
                        else
                            appendAndScrollList(listaComentariosElement, getChatMessage(usuarioChatActual + " no ha contestado la llamada"));   
                        contraerChatBox();       
                    }
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
       console.log(localStream);
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
        $(usuarios.getWidgetElement('remoteVideo')).attr('src', URL.createObjectURL(event.stream));
        $(usuarios.getWidgetElement('remoteVideo')).get(0).play();
    }


    function gotLocalDescription(description) {
        pc.setLocalDescription(description, function () {
            conexion.send(usuarioChatActual, 'localDescription', {sdp: pc.localDescription });});
        console.log(usuarios.getUser() + ' seteando descripcion local y enviando: ' + description.sdp);      
    }

}