// ==UserScript==
// @name       SocialAumentation2
// @namespace  http://lifia.unlp.edu.ar
// @version    1.0
// @description  Web augmentation social layer
// @match      https://*/*
// @match      http://*/*
// @noframes

// @grant GM_getResourceText
// @grant GM_addStyle
// @require   file:///home/matias/Tesis/ambiente/bin/SocialEye/js/jquery-2.1.4.min.js
// @require   file:///home/matias/Tesis/ambiente/bin/SocialEye/js/jquery-ui.min.js
// @resource   jqueryUICSS file:///home/matias/Tesis/ambiente/bin/SocialEye/css/jquery-ui.min.css
// @require   file:///home/matias/Tesis/ambiente/bin/SocialEye/bootstrap/js/bootstrap.min.js
// @require   file:///home/matias/Tesis/ambiente/bin/SocialEye/js/socialEye.js
// @resource   bootstrapCSS file:///home/matias/Tesis/ambiente/bin/SocialEye/bootstrap/css/bootstrap.min.css
// @resource   bootstrapThemeCSS file:///home/matias/Tesis/ambiente/bin/SocialEye/bootstrap/css/bootstrap-theme.min.css
// @require   file:///home/matias/Tesis/ambiente/bin/SocialEye/js/sidebar_menu.js
// @resource   sidebar file:///home/matias/Tesis/ambiente/bin/SocialEye/css/simple-sidebar.css
// @resource   login file:///home/matias/Tesis/ambiente/bin/SocialEye/css/login.css
// @require   file:///home/matias/Tesis/ambiente/bin/SocialEye/js/bootbox.min.js
// @resource   commentBox file:///home/matias/Tesis/ambiente/bin/SocialEye/css/commentBox.css
// @resource   listaUsuarios file:///home/matias/Tesis/ambiente/bin/SocialEye/css/listaUsuarios.css
// @resource   encuestas file:///home/matias/Tesis/ambiente/bin/SocialEye/css/encuestas.css
// @resource   chats file:///home/matias/Tesis/ambiente/bin/SocialEye/css/chats.css
// @require   file:///home/matias/Tesis/ambiente/bin/SocialEye/js/comentarios.js
// @require   file:///home/matias/Tesis/ambiente/bin/SocialEye/js/comentariosEspecificos.js
// @require   file:///home/matias/Tesis/ambiente/bin/SocialEye/js/usuarios.js
// @require   file:///home/matias/Tesis/ambiente/bin/SocialEye/js/encuestas.js
// @require   file:///home/matias/Tesis/ambiente/bin/SocialEye/js/chats.js
// @require   file:///home/matias/Tesis/ambiente/bin/SocialEye/js/common.js
// @require   file:///home/matias/Tesis/ambiente/bin/SocialEye/js/latest-v2.js
// @require   file:///home/matias/Tesis/ambiente/bin/SocialEye/js/widgetInterface.js
// @resource   video file:///home/matias/Tesis/ambiente/bin/SocialEye/css/main.css
// ==/UserScript==





//va a estar el click del icono del widget, en donde
//se debe llamar primero al onLoadWidget y luego agregarlo
//al body como esta aca abajo en el inyectHTML

//El codigo de abajo es para colorear el icono en la barra cuando es apretado
//unWidget.style.cssText = "text-decoration: none; color: #fff; background: rgba(255,255,255,0.2);  border-left: red 2px solid;";

function Manager() {

    var activo = 0;
    var debateGeneralA = 0;
    var comentariosA = 0;
    var altoBarra;
    var widgetsInitialized = false;

    this.iniciarScript = function () {

        var cssTxt = GM_getResourceText("jqueryUICSS");
        GM_addStyle(cssTxt);
        cssTxt = GM_getResourceText("sidebar");
        GM_addStyle(cssTxt);
        cssTxt = GM_getResourceText("login");
        GM_addStyle(cssTxt);
        cssTxt = GM_getResourceText("listaUsuarios");
        GM_addStyle(cssTxt);
        cssTxt = GM_getResourceText("bootstrapCSS");
        GM_addStyle(cssTxt);
        cssTxt = GM_getResourceText("bootstrapThemeCSS");
        GM_addStyle(cssTxt);
        cssTxt = GM_getResourceText("commentBox");
        GM_addStyle(cssTxt);
        cssTxt = GM_getResourceText("encuestas");
        GM_addStyle(cssTxt);
        cssTxt = GM_getResourceText("video");
        GM_addStyle(cssTxt);
        cssTxt = GM_getResourceText("chats");
        GM_addStyle(cssTxt);

        $("head").append("<link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css' rel='stylesheet'>");

        $("body").append(" <div id='socialEyeBar' class='socialEye'> <ul class='socialEyeNavStyle nav-pills nav-stacked socialEye' id='menu'>   <li class='active socialEye'>    <a id='icono' title='SocialEye'><span class='fa-stack fa-lg socialEye'><i class='fa fa-eye fa-stack-1x socialEye'></i></span></a> </li></ul> </div> ");

        //PARTE BORRADA DEL APPEND AL MENU  <li class='socialEyeWidget socialEye'>  <a id='debateGeneral' class='socialEye' title='Debate general'><span class='fa-stack fa-lg socialEye'><i class='fa fa-commenting fa-stack-1x socialEye'></i></span></a> </li> <li class='socialEyeWidget socialEye'>  <a id='comentarios' title='Comentar contenido'><span class='fa-stack fa-lg'><i class='fa fa-comments fa-stack-1x '></i></span></a> </li> <li class='socialEyeWidget socialEye'> <a id='widgetUsuarios' class='socialEye' title='Contactos'><span class='fa-stack fa-lg socialEye'><i class='fa fa-users fa-stack-1x socialEye'></i></span></a> </li> <li class='socialEyeWidget socialEye'> <a id='widgetEncuestas' class='socialEye' title='Encuestas'><span class='fa-stack fa-lg'><i class='fa fa-question-circle fa-stack-1x socialEye'></i></span></a></li> <li class='socialEyeWidget socialEye'>  <a id='chats' class='socialEye' title='Chats'><span class='fa-stack fa-lg socialEye'><i class='fa fa-weixin fa-stack-1x socialEye'></i></span></a> </li> <li class='socialEyeWidget socialEye'>  <a id='configuraciones' class='socialEye' title='Configuraciones'><span class='fa-stack fa-lg socialEye'><i class='fa fa-cogs fa-stack-1x socialEye'></i></span></a> </li> <li class='socialEyeWidget'> <a id='cerrarSesion' title='Cerrar sesión'><span class='fa-stack fa-lg'><i class='fa fa-sign-out fa-stack-1x '></i></span></a> </li> 
        $.ajaxSetup({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', "Basic " + btoa(localStorage['user'] + ":" + localStorage['token']));
            }
        });



        function initializeWidgets (){
            var widgets = getUserWidgets();
            var div;
            var widgetAux;
            altoBarra = 44*(widgets.length + 3);
            $.each(widgets, function (i, item) {
                $("#menu").append("<li class='socialEyeWidget socialEye' id='widgetList"+item.pk+"'>  <a class='widgetIcon' id='widget"+item.pk+"' title='"+item.fields.widget_title+"'><span class='fa-stack fa-lg'><i class='fa fa-"+item.fields.widget_icon+" fa-stack-1x '></i></span></a> </li>");
               // if((item.pk == 1) || (item.pk == 2) || (item.pk == 4)){ //CONDICION MOMENTANEA AL NO ESTAR IMPLEMENTADOS TODOS LOS WIDGETS
                     runWidget(item);
               // }
                $("#widget"+item.pk).click(function (e) {
                     widgetAux = eval(item.fields.widget_name);
                     if($(".container"+item.pk).length == 0){
                         runWidget(item);
                     }
                     else{
                         widgetAux.close();
                         widgetAux = null;
                     }
                });
            });

            $("#menu").append(" <li class='socialEyeWidget socialEye'>  <a id='configuraciones' class='socialEye' title='Configuraciones'><span class='fa-stack fa-lg socialEye'><i class='fa fa-cogs fa-stack-1x socialEye'></i></span></a> </li> <li class='socialEyeWidget'> <a id='cerrarSesion' title='Cerrar sesión'><span class='fa-stack fa-lg'><i class='fa fa-sign-out fa-stack-1x '></i></span></a> </li>");
            
            $("#configuraciones").click(function () {
                if($("#boxConfig").length == 0){
                    $("#configuraciones").css({"text-decoration": "none", "background": "rgba(255,255,255,0.2)",  "border-left": "red 2px solid"});
                    $("body").append(crearBoxConfiguraciones());
                    $("#cerrarBoxConfig").on("click", function (event) {
                        $("#boxConfig").remove();
                        $("#configuraciones").removeAttr('style');
                    });
                    $(".widgetCheck").click(function () {
                        widgetId = this.id.substring(11, this.id.length);
                        widgetActual = getWidget(widgetId);
                        if(this.checked){
                            addUserWidget(widgetId);
                            iconPos =  $("#menu li").length - 3;
                            $("#menu li:eq("+iconPos+")").after("<li class='socialEyeWidget socialEye' id='widgetList"+widgetId+"' style='display: list-item;'>  <a class='widgetIcon' id='widget"+widgetId+"' title='"+widgetActual.fields.widget_name+"'><span class='fa-stack fa-lg'><i class='fa fa-"+widgetActual.fields.widget_icon+" fa-stack-1x '></i></span></a> </li>");
                            altoBarra = altoBarra + 44;
                            $("#widget"+widgetId).click(function (e) {
                                widgetAux = eval(widgetActual.fields.widget_name);
                                if($(".container"+widgetId).length == 0){
                                    div = document.createElement('div');
                                    div.className = 'container'+widgetId;
                                    widgetAux.idWidget = widgetId;
                                    widgetAux.ping(widgetAux.idWidget);
                                    div.innerHTML = widgetAux.loadWidget();
                                    $('body').append(div);
                                    widgetAux.onReady();
                                    $("#widget"+widgetId).css({"text-decoration": "none", "background": "rgba(255,255,255,0.2)",  "border-left": "red 2px solid"});
                                }
                                else{
                                    widgetAux.close();
                                    widgetAux = null;
                                }
                            });
                        }
                        else{
                            $('#widgetList'+widgetId).remove();
                            removeUserWidget(widgetId);
                            altoBarra = altoBarra - 44;
                            if($(".container"+widgetId).length != 0){
                                $('#widgetList'+widgetId).remove();
                                widgetAux = eval(widgetActual.fields.widget_name);
                                widgetAux.close();
                            }                
                        }
                        $("#socialEyeBar").animate({height: ""+altoBarra+"px"}, "500");
                    });
               }
               else{
                   $("#boxConfig").remove();
                   $("#configuraciones").removeAttr('style');
               }
          });

        $("#cerrarSesion").click(function () {
            var widgetsUsuario = getUserWidgets();
            var widgetAux;
            $.each(widgetsUsuario, function (i, item) {
               // if((item.pk == 1) || (item.pk == 2)){ //CONDICION MOMENTANEA AL NO ESTAR IMPLEMENTADOS TODOS LOS WIDGETS
                    if($(".container"+item.pk).length != 0){
                        widgetAux = eval(item.fields.widget_name);
                        widgetAux.close();
                    }
             //   }
                $('#widgetList'+item.pk).remove();
            });
            $('#configuraciones').remove();
            $('#cerrarSesion').remove();
            if($("#boxConfig").length != 0){
                $('#boxConfig').remove();
            }

            $(".socialEyeWidget").hide('slow');
            $("#socialEyeBar").animate({height: "42px"}, "500");
            activo = 0;
            deleteSession();

        });

            widgetsInitialized = true;

        }
        
        function runWidget(widget){
              var div;
              var widgetAux;
              div = document.createElement('div');
              div.className = 'container'+widget.pk;
              widgetAux = eval(widget.fields.widget_name);
              widgetAux.idWidget = widget.pk;
              widgetAux.ping(widgetAux.idWidget);
              if((item.pk == 2) || (item.pk == 3)){ //MOMENTANEO POR LOS QUE TODAVIA NO IMPLEMENTAN LA INTERFAZ DEL FRAMEWORK             
                div.innerHTML = widgetAux.loadWidget();
              }
              else{
                div.appendChild(widgetAux.loadWidget());
              }

              $('body').append(div);
              widgetAux.onReady();
              $("#widget"+widget.pk).css({"text-decoration": "none", "background": "rgba(255,255,255,0.2)",  "border-left": "red 2px solid"});
        }


        $("#icono").click(function () {
            if ($("#boxRegistro").length != 0) {
                $("#boxRegistro").remove();
            }
            if (typeof localStorage['user'] != "undefined") {
                if(!widgetsInitialized){
                     initializeWidgets();
                }
                var widgetsUsuario = getUserWidgets();
                var widgetAux;
                if (activo) {
                    $(".socialEyeWidget").hide('slow');
                    $("#socialEyeBar").animate({height: "42px"}, "500");
                    $.each(widgetsUsuario, function (i, item) {
                        if((item.pk == 1) || (item.pk == 2)){ //CONDICION MOMENTANEA AL NO ESTAR IMPLEMENTADOS TODOS LOS WIDGETS
                            if($(".container"+item.pk).length != 0){
                                widgetAux = eval(item.fields.widget_name);
                                widgetAux.close();
                            }
                        }

                    });
                    if($("#boxConfig").length != 0){
                        $('#boxConfig').remove();
                        $("#configuraciones").removeAttr('style');
                    }
                    activo = 0;
                }
                else {
                    $.each(widgetsUsuario, function (i, item) {
                        if((item.pk == 1) || (item.pk == 2) || (item.pk == 4)){ //CONDICION MOMENTANEA AL NO ESTAR IMPLEMENTADOS TODOS LOS WIDGETS
                            runWidget(item);
                        }
                    });
                    $("#socialEyeBar").animate({height: ""+altoBarra+"px"}, "500");
                    activo = 1;
                    $(".socialEyeWidget").show('slow');
                }
            }
            else {
                if ($("#boxLogin").length == 0) {
                    $("body").append(crearBoxLogin());
                    $("#cerrarBoxLogin").on("click", function (event) {
                        $("#boxLogin").remove();
                    });
                    $("#loginButton").click(function () {
                        $.ajax({
                            url: "http://127.0.0.1:8000/widgetRest/token/new.json", // the endpoint
                            type: "POST", // http method
                            data: {
                                username: $("#user").val(),
                                password: $("#pass").val(),
                                //domain: window.location.hostname,
                            }, // data sent with the post request

                            // handle a successful response
                            success: function (response) {
                                if (response.success == true) {
                                    localStorage.setItem('token', response.token);
                                    localStorage.setItem('user', response.user);
                                    localStorage.setItem('username', $("#user").val());
                                    $("#boxLogin").remove();
                                    initializeWidgets();
                                    $("#socialEyeBar").animate({height: ""+altoBarra+"px"}, "500");
                                    activo = 1;
                                    $(".socialEyeWidget").show('slow');
                                }
                                else {
                                    alert("Usuario o contraseña inválidos");
                                    $("#user").val("");
                                    $("#pass").val("");
                                }
                            },
                        });
                    });

                    $("#registro").click(function () {
                        $("#boxLogin").remove();
                        if ($("#boxRegistro").length == 0) {
                            $("body").append(crearBoxRegistro());
                            $("#cerrarBoxRegistro").on("click", function (event) {
                                $("#boxRegistro").remove();
                            });
                            $("#registrationButton").click(function () {
                                $.ajax({
                                    url: "http://127.0.0.1:8000/widgetRest/registration/", // the endpoint
                                    type: "POST", // http method
                                    async: false,
                                    data: {
                                        username: $("#userReg").val(),
                                        password1: $("#passReg").val(),
                                        password2: $("#passReg").val(),
                                    }, // data sent with the post request

                                    // handle a successful response
                                    success: function (data) {
                                        //createSession(data[0].fields.user_name);
                                        $("#boxRegistro").remove();
                                    },

                                    // handle a non-successful response
                                    error: function (xhr, errmsg, err) {
                                        alert("El usuario ingresado ya existe");
                                    }
                                });
                            });
                        }
                    });

                }
            }

        });




    }

    function crearBoxConfiguraciones(){
        var allWidgets;
        var userWidgets;
        var boxConfig = "<div id='boxConfig' class='socialEyeContainer' style='z-index: 999999999999999999;'>";
        boxConfig += "<button type='button' class='close' id='cerrarBoxConfig' aria-hidden='true'>&times;</button>";
        boxConfig += "<h2 class='socialEyeForm-signin-heading'>Configuración</h2>";
        boxConfig += "<ul id='listaWidgets'>";
        allWidgets = getWidgets();
        userWidgets = getUserWidgets();
        idsWidgets = getIdsWidgets(userWidgets);
        $.each(allWidgets, function (i, item) {
            boxConfig += "<li> <a class='widgetIcon' title='"+item.widget_title+": "+item.description+"'><span class='fa-stack fa-lg'><i class='fa fa-"+item.widget_icon+" fa-stack-1x '></i></span></a>";
            if($.inArray(item.pk, idsWidgets) != -1){
                boxConfig += "<input type='checkbox' id='widgetCheck"+item.pk+"' class='widgetCheck' checked>";
            }
            else{
                boxConfig += "<input type='checkbox' id='widgetCheck"+item.pk+"' class='widgetCheck'>";
            }
            boxConfig += "</li>";
        });
        boxConfig += "</ul>";
        boxConfig += "</div>";
        return boxConfig;
    }

    function crearBoxLogin() {
        var boxLogin = "<div id='boxLogin' class='socialEyeContainer' style='z-index: 999999999999999999;'>";
        boxLogin += "<button type='button' class='close' id='cerrarBoxLogin' aria-hidden='true'>&times;</button>";
        boxLogin += "<form class='socialEyeForm-signin'>";
        boxLogin += "<h2 class='socialEyeForm-signin-heading'>Login</h2>";
        boxLogin += "<input type='text' name='user' id='user' class='form-control' placeholder='Usuario' >";
        boxLogin += "<input type='password' name='pass' id='pass' class='form-control' placeholder='Contraseña' >";
        boxLogin += "<input type='button' class='btn btn-lg btn-primary btn-block' value='Ingresa' id='loginButton'>";
        boxLogin += "<br> <br>";
        boxLogin += "<input type='button' class='btn btn-lg btn-primary btn-block' value='Registrarse' id='registro'>";
        boxLogin += "</form>";
        boxLogin += "</div>";
        return boxLogin;
    }

    function crearBoxRegistro() {
        var boxRegistro = "<div id='boxRegistro' class='socialEyeContainer' style='z-index: 999999999999999999;'>";
        boxRegistro += "<button type='button' class='close' id='cerrarBoxRegistro' aria-hidden='true'>&times;</button>";
        boxRegistro += "<form class='socialEyeForm-signin'>";
        boxRegistro += "<h2 class='socialEyeForm-signin-heading'>Registro</h2>";
        boxRegistro += "<input type='text' name='userReg' id='userReg' class='form-control' placeholder='Usuario' >";
        boxRegistro += "<input type='password' name='passReg' id='passReg' class='form-control' placeholder='Contraseña' >";
        boxRegistro += "<input type='button' class='btn btn-lg btn-primary btn-block' value='Ingresa' id='registrationButton'>";
        boxRegistro += "</form>";
        boxRegistro += "</div>";
        return boxRegistro;
    }


    function deleteSession() {
        var dominio = window.location.hostname;
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/logout/", // the endpoint
            type: "POST", // http method
            data: {
                url: dominio,
            }, // data sent with the post request
            // handle a successful response
            success: function (data) {
                setTimeout(function () {
                    alert("Hasta luego "+ localStorage['username']);
                }, 400);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
            },
            error: function (xhr, errmsg, err) {
                alert("Hubo un error al cerrar la sesión");
            }
        });
    }

    function getUserWidgets(){
        var data;
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/widgetsByUser/", // the endpoint
            type: "GET", // http method
            dataType: 'json',
            async: false,
            data : {
            }, // data sent with the post request

            // handle a successful response
            success: function (response) {
                data = response
            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {
                alert("Error al cargar los comentarios");

            }
        });
        return data;
    }

    function getWidgets(){
        var data;
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/widget/", // the endpoint
            type: "GET", // http method
            dataType: 'json',
            async: false,
            data : {
            }, // data sent with the post request

            // handle a successful response
            success: function (response) {
                data = response
            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {
                alert("Error al cargar los comentarios");

            }
        });
        return data;
    }

    function getWidget(idWidget){
        var data;
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/getWidget/", // the endpoint
            type: "GET", // http method
            async: false,
            data : {idWidget: idWidget
            }, // data sent with the post request

            // handle a successful response
            success: function (response) {
                data = response
            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {
                alert("Error al cargar los comentarios");

            }
        });
        return data[0];
    }
    
    function getIdsWidgets(widgets){
        var result = [];
        $.each(widgets, function (i, item) {
             result.push(item.pk);
        });
        return result;
    }

    function addUserWidget(idWidget){
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/addUserWidget/", // the endpoint
            type: "POST", // http method
            async: false,
            data: {
                idWidget: idWidget
            }, // data sent with the post request

            // handle a successful response
            success: function () {
            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {
                alert("Error al enviar el objeto");
            }
        });    
    }

    function removeUserWidget(idWidget){
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/removeUserWidget/", // the endpoint
            type: "POST", // http method
            async: false,
            data: {
                idWidget: idWidget
            }, // data sent with the post request

            // handle a successful response
            success: function () {
            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {
                alert("Error al enviar el objeto");
            }
        });    
    }

}


$(document).ready(function () {
    M = new Manager();
    M.iniciarScript();
    //V = new Llamada();
    //V.iniciarScript();
    //main();
});