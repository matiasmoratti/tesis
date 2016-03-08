function Usuarios() {

    var widgetUsuariosCreado = false;
    var widgetUsuariosAbierto = false;
    var chatAbierto = false;
    var callAbierto = false;
    var callCreado = false;
    var userConnected = false;
    var usuarioChatActual = null;
    var usuarioCallActual = null;
    var interval = null;
    var roomEspecifico = null;
    var enGeneral = false;
    var llamadaEstablecida = false;
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
    	mostrarChat(e.target.id);
    }


    function mostrarChat(userId){
    		chatAbierto = true; 
    		enGeneral = false;
    		usuarioChatActual = userId;
    		if($("#"+usuarioChatActual+ " label").is(":visible")){
    			$("#"+usuarioChatActual+ " label").hide();
    		}
            var conversacion = "<div class='detailBox socialEye' id='chatBox'>";
	        conversacion += "<div class='titleBox socialEye'>";
	        conversacion += "<label class='socialEye'>Conversación con "+ $("#" +usuarioChatActual).attr('name') +" </label>";
	        conversacion += "<button type='button' class='close botonCerrar socialEye' id='cerrarChatBox' aria-hidden='true'>&times;</button>";
	        conversacion += "</div>";
	        conversacion += "<div id='conversacionBox' class='actionBox socialEye'>";
	        conversacion += "<ul id='listaComentarios' class='commentList socialEye'>";
        	$.ajax({
	            url: "https://127.0.0.1:8000/widgetRest/getChat/", // the endpoint
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
	                    conversacion += "<div class='contenidoComentario'>" + item.fields.text+ "</div>";
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
	        conversacion += "<div>";
	        conversacion += "<textarea class='form-control socialEye' id='textoComentarioChat' type='text' placeholder='Escribe un comentario' ></textarea>";
	        conversacion += "<a class='socialEye' title='Realizar videollamada'><span class='socialEye'><i id=call"+ usuarioChatActual +" class='fa fa-video-camera botonLlamada'></i></span></a>";
	        conversacion += "</div>";
	        conversacion += "</form>";
	        conversacion += "</div>";
	        conversacion += "<div id='videoCall'>"
	        conversacion += "<div class='videoContainer'>";
            conversacion += "<video id='localVideo' oncontextmenu='return false;'></video>";
			conversacion += "</div>";
        	conversacion += "<div id='remotes'></div>";
        	conversacion += "</div>";
	        conversacion += "</div>";
	        $("body").append(conversacion);
            $('#listaComentarios').scrollTop( $('#listaComentarios')[0].scrollHeight);

			webRTC.leaveRoom();

			//ambos deben entrar al mismo room. Para definir el nombre del mismo hago que calculen cual es el id mayor,
        	//ese va primero en el nombre
        	if(usuarioChatActual > localStorage['user'])
        		roomEspecifico = 'chatSocialEye_' + usuarioChatActual + '_' + localStorage['user'];
        	else
        		roomEspecifico = 'chatSocialEye_' + localStorage['user'] + '_' + usuarioChatActual;

        	//Modifico el comportamiento del onMessage ya que estoy dentro de un room específico
        	webRTC.connection.on('message', function(data){
        		if(!(enGeneral)){
        			if(data.type === 'chat'){
                    	  $("#listaComentarios").append(data.payload.message);
                    	  $('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});
                    }
                    else{
                    	if(data.type === 'call'){
                    		crearBoxLlamada(data, false);
                   		}
                   		else{
                   			if((data.type === 'offer') || (data.type === 'estoy')){
                   				userConnected = true;
                   				if(data.type === 'offer'){
                   					webRTC.sendToAll('estoy', {});
                   				}
                   			}
                   			else{
                   				if(data.type === 'callAnswer'){
                   					if(data.payload.answer == 'aceptada'){
                   						$("#videoCall").show();
                   						document.getElementById("chatBox").style.width = "50%";
                   						$("#call"+ usuarioChatActual).prop('onclick',null).off('click');
                   						$("#call"+ usuarioChatActual).on('click', colgarClick);
    									webRTC.startLocalVideo();
                   					}
                   					$("#listaComentarios").append(data.payload.respuesta);
                    				$('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});
                   				}
                   				else{
                   					if(data.type === 'colgar'){
                   						terminarLlamada();
                   					}
                   					else{
                   						if(data.type === 'salir'){
                   							userConnected = false;
                   							if($("#videoCall").is(":visible")){
                   								terminarLlamada();
                   							}
                   						}
                   					}
                   				}
                   			}
                   		}
                    }
                }
            });

            cargarRTC();

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
    		        var userName = localStorage['userName'];
    			    var mensaje = "<li class='socialEye'><div class='commentText socialEye'>";
    	            mensaje += "<span class='date sub-text socialEye'>" + userName + " dijo: </span>";
    	            mensaje += "<div class='contenidoComentario'>" + textoComentarioChat.value + "</div>";
    	            mensaje += "</div>";
    	            mensaje += "</li>";
    	            $("#listaComentarios").append(mensaje);
                    $('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});

                    if(userConnected){
                    	webRTC.sendToAll('chat', {message: mensaje});
                    }
                    else{
                    	webRTC.leaveRoom();
		    			webRTC.joinRoom('socialEyeGeneral');
		    			enGeneral = true;
		    			setTimeout(function(){webRTC.sendToAll('chat', {idMensajeado: usuarioChatActual, idMensajero: localStorage['user']});}, 1000);



				        var roomName;
			        	if(usuarioChatActual > localStorage['user'])
			        		roomName = 'chatSocialEye_' + usuarioChatActual + '_' + localStorage['user'];
			        	else
			        		roomName = 'chatSocialEye_' + localStorage['user'] + '_' + usuarioChatActual;

			        	enGeneral = false;
			        	webRTC.joinRoom(roomName);


                    }
    		        

    		        $.ajax({
    		            url: "https://127.0.0.1:8000/widgetRest/saveMessage/", // the endpoint
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
		    	if($("#videoCall").is(":visible")){
                   	terminarLlamada();
                }
	            $("#chatBox").remove();
	            chatAbierto = false;
	            webRTC.sendToAll('salir', {});
	            webRTC.leaveRoom();
    			webRTC.joinRoom('socialEyeGeneral');
    			enGeneral = true;
        	}); 
        
    }

    function callClick(e){
    		var usuarioCallActual = e.target.id.substr(4, e.target.id.length);

    		var textoLlamada = "<li class='socialEye'><div class='commentText socialEye'>";
			textoLlamada += "<span class='date sub-text socialEye'>" + localStorage['userName'] + " solicitando llamada... </span>";
			textoLlamada += "</div>";
			textoLlamada += "</li>";
			$("#listaComentarios").append(textoLlamada);
			$('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});

    		if(userConnected){
    			webRTC.sendToAll('call', {idLlamado: usuarioCallActual, idLlamante: localStorage['user'], userNameLlamante: localStorage['userName']});
    		}
    		else{
    			webRTC.leaveRoom();
    			webRTC.joinRoom('socialEyeGeneral');
    			setTimeout(function(){webRTC.sendToAll('call', {idLlamado: usuarioCallActual, idLlamante: localStorage['user'], userNameLlamante: localStorage['userName']});}, 1000);
    			webRTC.leaveRoom();
		        webRTC.joinRoom(roomEspecifico);
    		}
			
    }

    function colgarClick(e){
    		terminarLlamada();
            webRTC.sendToAll('colgar', {});

    }

    function terminarLlamada(){
    		$("#videoCall").hide();
            document.getElementById("chatBox").style.width = "400px";
            $("#call"+ usuarioChatActual).prop('onclick',null).off('click');
            $("#call"+ usuarioChatActual).on('click', callClick);
            llamadaEstablecida = false;
    }

    function crearBoxLlamada(data, responde){
            var mensajeRespuesta = "<li class='socialEye'><div class='commentText socialEye'>";
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
			        document.getElementById("chatBox").style.width = "50%";
			        $("#videoCall").show();
			        $("#call"+ usuarioChatActual).prop('onclick',null).off('click');
					$("#call"+ usuarioChatActual).on('click', colgarClick);
					mensajeRespuesta += "<span class='date sub-text socialEye'> Conexión de videollamada establecida </span>";
					mensajeRespuesta += "</div>";
					mensajeRespuesta += "</li>";
			        setTimeout(function(){webRTC.sendToAll('callAnswer', {answer: 'aceptada', respuesta: mensajeRespuesta});}, 3000);
			        webRTC.startLocalVideo(); 
			        $("#listaComentarios").append(mensajeRespuesta);
					$('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});
  					}
			    },
			    danger: {
			      label: "No contestar",
			      className: "btn-danger",
			      callback: function() {
					mensajeRespuesta += "<span class='date sub-text socialEye'>" + localStorage['userName'] + " llamada rechazada </span>";
					mensajeRespuesta += "</div>";
					mensajeRespuesta += "</li>";
			        webRTC.sendToAll('callAnswer', {answer: 'rechazada', respuesta: mensajeRespuesta});
			        $("#listaComentarios").append(mensajeRespuesta);
			        if(!(responde)){
			        	$('#listaComentarios').animate({scrollTop: $('#listaComentarios')[0].scrollHeight});
			        }
			      }
			    }
			  }
			});
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

    	 	var idUsuario = localStorage['user'];

            webRTC.joinRoom('socialEyeGeneral');

            enGeneral = true;

            webRTC.connection.on('message', function(data){
            			if(enGeneral){
	            			if(data.type === 'call'){
	            				if(data.payload.idLlamado == idUsuario){
	            					crearBoxLlamada(data, true);
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
                var button = document.querySelector('form>button');
                if (button) button.removeAttribute('disabled');
            });
            // we did not get access to the camera
            webRTC.on('localMediaError', function (err) {
            	console.log("hubo un error");
            });

            // local screen obtained
            webRTC.on('localScreenAdded', function (video) {
            	console.log("agrego video local");
                video.onclick = function () {
                    video.style.width = video.videoWidth + 'px';
                    video.style.height = video.videoHeight + 'px';
                };
                document.getElementById('localScreenContainer').appendChild(video);
                $('#localScreenContainer').show();
            });
            // local screen removed
            webRTC.on('localScreenRemoved', function (video) {
            	console.log("remuevo local");
                document.getElementById('localScreenContainer').removeChild(video);
                $('#localScreenContainer').hide();
            });

            // a peer video has been added
            webRTC.on('videoAdded', function (video, peer) {
                if((!(llamadaEstablecida)) && (!(enGeneral))){
	                console.log('video added', peer);
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
	                llamadaEstablecida = true;
            	}
            });
            // a peer was removed
            webRTC.on('videoRemoved', function (video, peer) {
                console.log('video removed ', peer);
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
                    connstate.innerText = 'Connection failed.';
                    fileinput.disabled = 'disabled';
                }
            });

            // remote p2p/ice failure
            webRTC.on('connectivityError', function (peer) {
                var connstate = document.querySelector('#container_' + webRTC.getDomId(peer) + ' .connectionstate');
                console.log('remote fail', connstate);
                if (connstate) {
                    connstate.innerText = 'Connection failed.';
                    fileinput.disabled = 'disabled';
                }
            });
    	 	
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
        
        var webRTC;
        iniciarWebRTC();

        widgetUsuariosCreado = true;
        widgetUsuariosAbierto = true;
        var dominio = window.location.hostname;
        interval = setInterval(function () {
            jQuery.ajax({
                type: "POST",
                url: "https://127.0.0.1:8000/widgetRest/user_ping/",
                dataType: 'json',
                data: {url: dominio},
                success: function (data) {
                    $('.usuarioChat').remove();
                    $.each(data, function (i, item) {
                        if (item.user__pk!=localStorage['user']){
							$('#listaUsuarios').append("<button type='button' id="+ item.user__pk +" name="+ item.user__username +" class='list-group-item usuarioChat socialEye'><span class='fa-stack fa-lg socialEye'><i class='fa fa-user fa-stack-1x socialEye'></i></span>" + item.user__username + " <label class='nuevoMensaje'> Nuevo mensaje </label></button>");
							$("#"+item.user__pk).on('click', chatClick);
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
                url: "https://127.0.0.1:8000/widgetRest/user_ping/",
                dataType: 'json',
                data: {url: dominio},
                success: function (data) {
                    $('.usuarioChat').remove();
                    $.each(data, function (i, item) {
                        if (item.user__pk!=localStorage['user'])
                        	 $('#listaUsuarios').append("<button type='button' id="+ item.user__pk +" name="+ item.user__username +" class='list-group-item usuarioChat socialEye'><span class='fa-stack fa-lg socialEye'><i class='fa fa-user fa-stack-1x socialEye'></i></span>" + item.user__username + " <label class='nuevoMensaje'> Nuevo mensaje </label></button>");

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
            url: "https://127.0.0.1:8000/widgetRest/user_ping/", // the endpoint
            type: "POST", // http method
            data: { url: dominio},
            dataType: 'json',
            async: false,
            // data : {'comment_url' : url,}, // data sent with the post request

// handle a successful response
            success: function (data) {
                $.each(data, function (i, item) {
                    if (item.user__pk!=localStorage['user'])
                       listaUsuarios += "<button type='button' id="+ item.user__pk +" name="+ item.user__username +" class='list-group-item usuarioChat socialEye'><span class='fa-stack fa-lg socialEye'><i class='fa fa-user fa-stack-1x socialEye'></i></span>" + item.user__username + " <label class='nuevoMensaje'> Nuevo mensaje </label></button>";
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