// ==UserScript==
// @name       SocialAumentation2
// @namespace  http://lifia.unlp.edu.ar
// @version    1.0
// @description  Web augmentation social layer
// @match      https://*/*
// @match      http://*/*
// @noframes

// @require   file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/js/jquery-2.1.4.min.js
// @require   file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/js/jquery-ui.min.js
// @resource   jqueryUICSS file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/css/jquery-ui.min.css
// @require   file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/bootstrap/js/bootstrap.min.js
// @resource   bootstrapCSS file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/bootstrap/css/bootstrap.min.css
// @resource   bootstrapThemeCSS file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/bootstrap/css/bootstrap-theme.min.css
// @require   file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/js/sidebar_menu.js
// @resource   sidebar file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/css/simple-sidebar.css
// @resource   login file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/css/login.css
// @require   file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/js/bootbox.min.js
// @resource   commentBox file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/css/commentBox.css
// @resource   listaUsuarios file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/css/listaUsuarios.css
// @resource   encuestas file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/css/encuestas.css
// @resource   chats file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/css/chats.css
// @require  file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/js/comentarios.js
// @require   file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/js/usuarios.js
// @require   file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/js/encuestas.js
// @require   file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/js/chats.js
// @require   file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/js/common.js
// @resource   video file:////Users/ferminrecalt/Documents/TesisGit/SocialEye/css/main.css
// ==/UserScript==

function Manager() {

    var activo = 0;
    var debateGeneralA = 0;
    var comentariosA = 0;

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

        $("body").append(" <div id='socialEyeBar' class='socialEye'> <ul class='socialEyeNavStyle nav-pills nav-stacked socialEye' id='menu'>   <li class='active socialEye'>    <a id='icono' title='SocialEye'><span class='fa-stack fa-lg socialEye'><i class='fa fa-eye fa-stack-1x socialEye'></i></span></a> </li> <li class='socialEyeWidget socialEye'>  <a id='debateGeneral' class='socialEye' title='Debate general'><span class='fa-stack fa-lg socialEye'><i class='fa fa-commenting fa-stack-1x socialEye'></i></span></a> </li> <li class='socialEyeWidget socialEye'>  <a id='comentarios' title='Comentar contenido'><span class='fa-stack fa-lg'><i class='fa fa-comments fa-stack-1x '></i></span></a> </li> <li class='socialEyeWidget socialEye'> <a id='widgetUsuarios' class='socialEye' title='Contactos'><span class='fa-stack fa-lg socialEye'><i class='fa fa-users fa-stack-1x socialEye'></i></span></a> </li> <li class='socialEyeWidget socialEye'> <a id='widgetEncuestas' class='socialEye' title='Encuestas'><span class='fa-stack fa-lg'><i class='fa fa-question-circle fa-stack-1x socialEye'></i></span></a></li> <li class='socialEyeWidget socialEye'>  <a id='chats' class='socialEye' title='Chats'><span class='fa-stack fa-lg socialEye'><i class='fa fa-weixin fa-stack-1x socialEye'></i></span></a> </li> <li class='socialEyeWidget'> <a id='cerrarSesion' title='Cerrar sesión'><span class='fa-stack fa-lg'><i class='fa fa-sign-out fa-stack-1x '></i></span></a> </li> </ul> </div> ");
        

        $.ajaxSetup({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', "Basic " + btoa(localStorage['user'] + ":" + localStorage['token']));
            }
        });


        $("#icono").click(function () {
            if ($("#boxRegistro").length != 0) {
                $("#boxRegistro").remove();
            }
            if (typeof localStorage['user'] != "undefined") {
                if (activo) {
                    $(".socialEyeWidget").hide('fast');
                    $("#socialEyeBar").animate({height: "42px"}, "500");
                    activo = 0;
                }
                else {
                    $("#socialEyeBar").animate({height: "310px"}, "500");
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
                            url: "https://127.0.0.1:8000/widgetRest/token/new.json", // the endpoint
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
                                    localStorage.setItem('userName', $("#user").val());
                                    $("#boxLogin").remove();
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
                                    url: "https://127.0.0.1:8000/widgetRest/registration/", // the endpoint
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

        Generales = new Comentarios();
        Generales.iniciarWidgetComentariosGenerales();
        Especificos = new comentariosEspecificos();
        Especificos.iniciarWidgetComentariosEspecificos();
        WidgetUsuarios = new Usuarios();
        WidgetUsuarios.iniciarWidgetUsuarios();
        WidgetEncuestas = new Encuestas();
        WidgetEncuestas.iniciarWidgetEncuestas();
        WidgetChats = new Chats();
        WidgetChats.iniciarWidgetChats();

        $("#cerrarSesion").click(function () {
            cerrarBoxes();
            deleteSession();
            setTimeout(function () {  //Delay porque quedaba la barra a medio cerrar cuando aparecia el mensaje de saludo.
                $(".socialEyeWidget").hide('fast');
                $("#socialEyeBar").animate({height: "42px"}, "500");
                activo = 0;
            }, 350);

        });

        function cerrarBoxes() {
            Generales.cerrarBox();
            Especificos.cerrarBox();
            WidgetUsuarios.cerrarBox();
        }


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
            url: "https://127.0.0.1:8000/widgetRest/logout/", // the endpoint
            type: "POST", // http method
            data: {
                url: dominio,
            }, // data sent with the post request
            // handle a successful response
            success: function (data) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                alert("Hasta luego");
            },
            error: function (xhr, errmsg, err) {
                alert("Hubo un error al cerrar la sesión");
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