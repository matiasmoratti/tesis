// ==UserScript==
// @name       SocialAumentation2
// @namespace  http://lifia.unlp.edu.ar
// @version    1.0
// @description  Web augmentation social layer
// @match      https://*/*
// @match      http://*/*
// @noframes

// @require   file:////C:/Users/ips/Documents/Proyecto/SocialEye/js/jquery-2.1.4.min.js
// @require   file:////C:/Users/ips/Documents/Proyecto/SocialEye/js/jquery-ui.min.js
// @resource   jqueryUICSS file:////C:/Users/ips/Documents/Proyecto/SocialEye/css/jquery-ui.min.css
// @require   file:////C:/Users/ips/Documents/Proyecto/SocialEye/js/bootstrap.min.js
// @resource   bootstrapCSS file:////C:/Users/ips/Documents/Proyecto/SocialEye/bootstrap/css/bootstrap.min.css
// @resource   bootstrapThemeCSS file:////C:/Users/ips/Documents/Proyecto/SocialEye/bootstrap/css/bootstrap-theme.min.css
// @require   file:////C:/Users/ips/Documents/Proyecto/SocialEye/js/bootbox.min.js
// @require   file:////C:/Users/ips/Documents/Proyecto/SocialEye/js/sidebar_menu.js
// @resource   sidebar file:////C:/Users/ips/Documents/Proyecto/SocialEye/css/simple-sidebar.css
// @resource   login file:////C:/Users/ips/Documents/Proyecto/SocialEye/css/login.css
// @require   file:////C:/Users/ips/Documents/Proyecto/SocialEye/js/bootbox.min.js
// @resource   commentBox file:////C:/Users/ips/Documents/Proyecto/SocialEye/css/commentBox.css
// @resource   listaUsuarios file:////C:/Users/ips/Documents/Proyecto/SocialEye/css/listaUsuarios.css
// @require   file:////C:/Users/ips/Documents/Proyecto/SocialEye/js/comentarios.js
// @require   file:////C:/Users/ips/Documents/Proyecto/SocialEye/js/usuarios.js
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

        $("head").append("<link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css' rel='stylesheet'>");

        $("body").append(" <div id='socialEyeBar'> <ul class='socialEyeNavStyle nav-pills nav-stacked' id='menu'>   <li class='active'>    <a id='icono' title='SocialEye'><span class='fa-stack fa-lg'><i class='fa fa-eye fa-stack-1x '></i></span></a> </li> <li class='socialEyeWidget'>  <a id='debateGeneral' title='Debate general'><span class='fa-stack fa-lg'><i class='fa fa-commenting fa-stack-1x '></i></span></a> </li> <li class='socialEyeWidget'>  <a id='comentarios' title='Comentar contenido'><span class='fa-stack fa-lg'><i class='fa fa-comments fa-stack-1x '></i></span></a> </li> <li class='socialEyeWidget'> <a id='widgetUsuarios' title='Contactos'><span class='fa-stack fa-lg'><i class='fa fa-users fa-stack-1x '></i></span></a> </li> <li class='socialEyeWidget'> <a id='cerrarSesion' title='Cerrar sesión'><span class='fa-stack fa-lg'><i class='fa fa-sign-out fa-stack-1x '></i></span></a> </li> </ul> </div> ");

        $("#icono").click(function () {
            if ($("#boxRegistro").length != 0) {
                $("#boxRegistro").remove();
            }
            if (typeof localStorage['username'] != "undefined") {
                //if(getSession() != ""){
                if (activo) {
                    $(".socialEyeWidget").hide('fast');
                    $("#socialEyeBar").animate({height: "42px"}, "500");
                    activo = 0;
                }
                else {
                    $("#socialEyeBar").animate({height: "220px"}, "500");
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
                            url: "http://127.0.0.1:8000/widgetRest/login/", // the endpoint
                            type: "POST", // http method
                            data: {
                                user_name: $("#user").val(),
                                user_pass: $("#pass").val(),
                                //domain: window.location.hostname,
                            }, // data sent with the post request

                            // handle a successful response
                            success: function () {
                                localStorage.setItem('username', $("#user").val());
                                //createSession(data[0].fields.user_name);
                                $("#boxLogin").remove();
                            },

                            // handle a non-successful response
                            error: function (xhr, errmsg, err) {
                                alert("Usuario o contraseña inválidos");
                                $("#user").val("");
                                $("#pass").val("");
                            }
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
                                    dataType: 'json',
                                    async: false,
                                    data: {
                                        user_name: $("#userReg").val(),
                                        user_pass: $("#passReg").val(),
                                    }, // data sent with the post request

                                    // handle a successful response
                                    success: function (data) {
                                        localStorage.setItem('username', $("#userReg").val());
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

        $("#cerrarSesion").click(function () {
            cerrarBoxes();
            deleteSession();
            $(".socialEyeWidget").hide('fast');
            $("#socialEyeBar").animate({height: "42px"}, "500");
            activo = 0;
        });
        
        function cerrarBoxes(){
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

    //function getSession(){
    //    var name =  "socialEyeUser=";
    //    var ca = document.cookie.split(';');
    //    for(var i=0; i<ca.length; i++) {
    //        var c = ca[i];
    //        while (c.charAt(0)==' ') c = c.substring(1);
    //        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    //    }
    //    return "";
    //}

    //function createSession(value) {
    //    document.cookie = "socialEyeUser=" + value;
    //    alert("Logueo exitoso como: " + value);
    //}

    function deleteSession() {
        var usuario = localStorage['username'];
        localStorage.removeItem('username');
        //document.cookie="socialEyeUser=" + getSession() + "; expires=Thu, 18 Dec 2013 12:00:00 UTC";
        $.ajax({
            url: "http://127.0.0.1:8000/widgetRest/logout/", // the endpoint
            type: "POST", // http method
            data: {
                user_name: usuario,
            }, // data sent with the post request
            // handle a successful response
            success: function (data) {
                alert("Hasta luego " + usuario);
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
});