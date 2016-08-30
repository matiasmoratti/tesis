function Manager() {

    var activo = 0;
    var debateGeneralA = 0;
    var comentariosA = 0;
    var altoBarra;
    var toolInitialized = false;
    var widgetLogin = null;
    var widgetRegistro = null;
    var widgetConfiguraciones = null;

    this.iniciarScript = function () {

      // _.templateSettings = {
      //   interpolate: /\{\{(.+?)\}\}/g
      // };

        $("head").append("<link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css' rel='stylesheet'>");

        $("body").append(" <div id='socialEyeBar' class='socialEyeBar socialEye'> <ul class='socialEyeList socialEye' id='socialEyeList'>   <li class='socialEyeIcon active socialEye'>    <a id='icono' title='SocialEye'><span class='fa-stack fa-lg socialEye'><i class='fa fa-eye fa-stack-1x socialEye'></i></span></a> </li>  <li class='socialEyeWidget socialEye'>  <a id='configuraciones' class='socialEye' title='Configuraciones'><span class='fa-stack fa-lg socialEye'><i class='fa fa-cogs fa-stack-1x socialEye'></i></span></a> </li> <li class='socialEyeWidget'> <a id='cerrarSesion' title='Cerrar sesión'><span class='fa-stack fa-lg'><i class='fa fa-sign-out fa-stack-1x '></i></span></a> </li></ul> </div> ");

        $.ajaxSetup({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', "Basic " + btoa(localStorage['user'] + ":" + localStorage['token']));
            }
        });

        function initializeTool(){

            $("#configuraciones").click(function () {
                if ((widgetConfiguraciones == null) || ($(widgetConfiguraciones.getWidgetElement('boxConfiguraciones')).length == 0)) {
                    div = document.createElement('div');
                    div.setAttribute('id', 'container999');
                    div.classList.add('socialEye');
                    $("body").append(div);
                    div.appendChild(crearBoxConfiguraciones());
                    $('.cerrar'+widgetConfiguraciones.getIdWidget()).on('click',function (e) {
                        $(widgetConfiguraciones.getWidgetContainer()).remove();
                        widgetConfiguraciones = null;
                        $("#configuraciones").removeAttr('style');
                    });
                    $(".widgetCheck").click(function () {
                        widgetId = this.id.substring(14, this.id.length);
                        widgetActual = getWidget(widgetId);
                        if(this.checked){
                            addUserWidget(widgetId);
                            iconPos =  $("#socialEyeList li").length - 3;
                            $("#socialEyeList li:eq("+iconPos+")").after("<li class='socialEyeWidget socialEye' id='widgetList"+widgetId+"' style='display: list-item;'>  <a class='widgetIcon' id='widget"+widgetId+"' title='"+widgetActual.fields.widget_name+"'><span class='fa-stack fa-lg'><i class='fa fa-"+widgetActual.fields.widget_icon+" fa-stack-1x '></i></span></a> </li>");
                            altoBarra = altoBarra + 44;
                            $("#widget"+widgetId).click(function (e) {
                                if($("#container"+widgetId).length == 0){
                                    runWidget(widgetActual);
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
                            if($("#container"+widgetId).length != 0){
                                $('#widgetList'+widgetId).remove();
                                widgetAux = eval(widgetActual.fields.widget_name);
                                widgetAux.close();
                            }
                        }
                        $("#socialEyeBar").animate({height: ""+altoBarra+"px"}, "500");
                    });
               }
               else{
                   $(widgetConfiguraciones.getWidgetContainer()).remove();
                    widgetConfiguraciones = null;
                    $("#configuraciones").removeAttr('style');
               }
          });


        $("#cerrarSesion").click(function () {
            var widgetsUsuario = getUserWidgets();
            var widgetAux;
            $.each(widgetsUsuario, function (i, item) {
                if($("#container"+item.pk).length != 0){
                        console.log(item.pk);
                        widgetAux = eval(item.fields.widget_name);
                        widgetAux.close();
                }
                $('#widgetList'+item.pk).remove();
            });

            if(widgetConfiguraciones != null){
                $(widgetConfiguraciones.getWidgetContainer()).remove();
                widgetConfiguraciones = null;
                $("#configuraciones").removeAttr('style');
            }

            $(".socialEyeWidget").hide('slow');
            $("#socialEyeBar").animate({height: "45px"}, "500");
            activo = 0;
            deleteSession();

        });

          toolInitialized = true;
        }

        function loadUserWidgets(){
            var widgets = getUserWidgets();
            var widgetAux;
            $.each(widgets, function (i, item) {
                $("#socialEyeList li:eq(0)").after("<li class='socialEyeWidget socialEye' id='widgetList"+item.pk+"'>  <a class='widgetIcon' id='widget"+item.pk+"' title='"+item.fields.widget_title+"'><span class='fa-stack fa-lg'><i class='fa fa-"+item.fields.widget_icon+" fa-stack-1x '></i></span></a> </li>");
                $("#widget"+item.pk).click(function (e) {
                    widgetAux = eval(item.fields.widget_name);
                    if($("#container"+item.pk).length == 0){
                        runWidget(item);
                    }
                    else{
                        widgetAux.close();
                        widgetAux = null;
                    }
                });
            });
        }


        function initializeWidgets (){
            var widgets = getUserWidgets();
            altoBarra = 44*(widgets.length + 3);
            $.each(widgets, function (i, item) {
                     runWidget(item);
            });

            $("#socialEyeBar").animate({height: ""+altoBarra+"px"}, "500");
            activo = 1;
            $(".socialEyeWidget").show('slow');
        }

        function runWidget(widget){
              var archivo = widget.fields.fileJS;
              widget.filesHTML = widget.fields.filesHTML;
              $(function () {
                $('<script>').attr('type', 'text/javascript').text(archivo).appendTo('head');
              });
              var div;
              var widgetAux;
              div = document.createElement('div');
              div.setAttribute('id', 'container' + widget.pk);
              div.classList.add('socialEye');
              $('body').append(div);
              widgetAux = eval(widget.fields.widget_name);
              widgetAux.idWidget = widget.pk;
              widgetAux.ping(widgetAux.idWidget);
              var load = widgetAux.loadWidget();
              if(load != null){
                  widget.filesHTML.forEach(function(item,index){
                    if (item.name ==load.name){
                      var template = _.template(item.data);
                      var test = template(load.data);
                      $(div).html(test);
                    }
                  });
              }

              widgetAux.onReady();
              $("#widget"+widget.pk).css({"text-decoration": "none", "background": "rgba(255,255,255,0.2)",  "border-left": "red 2px solid"});
        }


        $("#icono").click(function () {
            if (widgetRegistro != null) {
                $(widgetRegistro.getWidgetContainer()).remove();
                widgetRegistro = null;
            }
            if (typeof localStorage['user'] != "undefined") {
                if(!toolInitialized){
                     initializeTool();
                     loadUserWidgets();
                }
                var widgetsUsuario = getUserWidgets();
                var widgetAux;
                if (activo) {
                    $(".socialEyeWidget").hide('slow');
                    $("#socialEyeBar").animate({height: "45px"}, "500");
                    $.each(widgetsUsuario, function (i, item) {
                        if($("#container"+item.pk).length != 0){
                                widgetAux = eval(item.fields.widget_name);
                                widgetAux.close();
                        }

                    });
                    if(widgetConfiguraciones != null){
                        $(widgetConfiguraciones.getWidgetContainer()).remove();
                        widgetConfiguraciones = null;
                        $("#configuraciones").removeAttr('style');
                    }
                    activo = 0;
                }
                else {
                    initializeWidgets();
                }
            }
            else {
                if ((widgetLogin == null) || ($(widgetLogin.getWidgetElement('boxLogin')).length == 0)) {
                    div = document.createElement('div');
                    div.setAttribute('id', 'container0');
                    div.classList.add('socialEye');
                    $("body").append(div);
                    div.appendChild(crearBoxLogin());
                    $('.cerrar'+widgetLogin.getIdWidget()).on('click',function (e) {
                        $(widgetLogin.getWidgetContainer()).remove();
                        widgetLogin = null;
                    });
                    $(widgetLogin.getWidgetElement('loginButton')).click(function () {
                        $.ajax({
                            url: "https://127.0.0.1:8000/widgetRest/token/new.json", // the endpoint
                            type: "POST", // http method
                            data: {
                                username: $(widgetLogin.getWidgetElement('user')).val(),
                                password: $(widgetLogin.getWidgetElement('pass')).val(),
                                //domain: window.location.hostname,
                            }, // data sent with the post request

                            // handle a successful response
                            success: function (response) {
                                if (response.success == true) {
                                    localStorage.setItem('token', response.token);
                                    localStorage.setItem('user', response.user);
                                    localStorage.setItem('username', $(widgetLogin.getWidgetElement('user')).val());
                                    $(widgetLogin.getWidgetElement('boxLogin')).remove();
                                    if(!toolInitialized){
                                        initializeTool();
                                    }
                                    loadUserWidgets();
                                    initializeWidgets();
                                }
                                else {
                                    alert("Usuario o contraseña inválidos");
                                    $(widgetLogin.getWidgetElement('user')).val("");
                                    $(widgetLogin.getWidgetElement('pass')).val("");
                                }
                            },
                        });
                    });

                    $(widgetLogin.getWidgetElement('registro')).click(function () {
                        $(widgetLogin.getWidgetElement('boxLogin')).remove();
                        if ((widgetRegistro == null) || ($(widgetRegistro.getWidgetElement('boxRegistro')).length == 0)) {
                            div = document.createElement('div');
                            div.setAttribute('id', 'container99');
                            div.classList.add('socialEye');
                            $("body").append(div);
                            div.appendChild(crearBoxRegistro());
                            $('.cerrar'+widgetRegistro.getIdWidget()).on('click',function (e) {
                                $(widgetRegistro.getWidgetContainer()).remove();
                                widgetRegistro = null;
                            });
                            $(widgetRegistro.getWidgetElement('registrationButton')).click(function () {
                                $.ajax({
                                    url: "https://127.0.0.1:8000/widgetRest/registration/", // the endpoint
                                    type: "POST", // http method
                                    async: false,
                                    data: {
                                        username: $(widgetRegistro.getWidgetElement('userReg')).val(),
                                        password1: $(widgetRegistro.getWidgetElement('passReg')).val(),
                                        password2: $(widgetRegistro.getWidgetElement('passReg')).val(),
                                    }, // data sent with the post request

                                    // handle a successful response
                                    success: function (data) {
                                        $(widgetRegistro.getWidgetContainer()).remove();
                                        widgetRegistro = null;
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
        widgetConfiguraciones = new Widget();
        widgetConfiguraciones.setIdWidget(999);
        boxConfiguraciones = widgetConfiguraciones.getPrincipalBox('boxConfiguraciones','Configuraciones');
        boxConfiguraciones.classList.add('boxConfiguraciones');
        bodyConfiguraciones = widgetConfiguraciones.getPrincipalBody('bodyConfiguraciones');
        bodyConfiguraciones.classList.add('bodyConfiguraciones');
        listaConfiguraciones = widgetConfiguraciones.getPrincipalList('listaConfiguraciones');
        allWidgets = getWidgets();
        userWidgets = getUserWidgets();
        idsWidgets = getIdsWidgets(userWidgets);
        $.each(allWidgets, function (i, item) {
            li = widgetConfiguraciones.getLi();
            a = widgetConfiguraciones.getA();
            a.classList.add('widgetIcon');
            a.setAttribute('title',item.widget_title+": "+item.description);
            span = widgetConfiguraciones.getSpan();
            span.classList.add('fa-stack', 'fa-lg');
            i = widgetConfiguraciones.getI();
            i.classList.add('fa', 'fa-'+item.widget_icon,'fa-stack-1x', 'configuracionesIcon');
            span.appendChild(i);
            a.appendChild(span);
            li.appendChild(a);
            checkbox = widgetConfiguraciones.getInput('checkbox', 'widgetCheck'+item.pk);
            checkbox.classList.add('widgetCheck');
            if($.inArray(item.pk, idsWidgets) != -1){
                checkbox.setAttribute('checked', true);
            }
            li.appendChild(checkbox);
            listaConfiguraciones.appendChild(li);
        });
        bodyConfiguraciones.appendChild(listaConfiguraciones);
        boxConfiguraciones.appendChild(bodyConfiguraciones);
        return boxConfiguraciones;
    }

    function crearBoxLogin() {
        widgetLogin = new Widget();
        widgetLogin.setIdWidget(0);
        boxLogin = widgetLogin.getPrincipalBox('boxLogin','Login');
        boxLogin.classList.add('socialEyeContainer','boxLogin');
        bodyLogin = widgetLogin.getPrincipalBody('bodyLogin');
        formLogin = widgetLogin.getForm('');
        userInput = widgetLogin.getInput('text','user');
        userInput.setAttribute('name', 'user');
        userInput.setAttribute('placeholder', 'Usuario');
        passInput = widgetLogin.getInput('password','pass');
        passInput.setAttribute('name', 'pass');
        passInput.setAttribute('placeholder', 'Contraseña');
        div = widgetLogin.getDiv();
        div.classList.add('loginButtonsDiv');
        buttonLogin = widgetLogin.getInput('button','loginButton');
        buttonLogin.setAttribute('value', 'Ingresa');
        buttonLogin.classList.add('loginButton');
        buttonRegistro = widgetLogin.getInput('button','registro');
        buttonRegistro.innerHTML='Registrarse';
        buttonRegistro.classList.add('buttonRegistrarse');
        buttonRegistro.setAttribute('value', 'Registrarse');
        div.appendChild(buttonLogin);
        div.appendChild(buttonRegistro);
        formLogin.appendChild(userInput);
        formLogin.appendChild(passInput);
        formLogin.appendChild(div);
        bodyLogin.appendChild(formLogin);
        boxLogin.appendChild(bodyLogin);
        return boxLogin;
    }

    function crearBoxRegistro() {
        widgetRegistro = new Widget();
        widgetRegistro.setIdWidget(99);
        boxRegistro = widgetRegistro.getPrincipalBox('boxRegistro','Registro');
        boxRegistro.classList.add('socialEyeContainer','boxRegistro');
        bodyRegistro = widgetRegistro.getPrincipalBody('bodyRegistro');
        formRegistro = widgetRegistro.getForm('');
        userInput = widgetRegistro.getInput('text','userReg');
        userInput.setAttribute('name', 'userReg');
        userInput.setAttribute('placeholder', 'Usuario');
        passInput = widgetRegistro.getInput('password','passReg');
        passInput.setAttribute('name', 'passReg');
        passInput.setAttribute('placeholder', 'Contraseña');
        div = widgetRegistro.getDiv();
        div.classList.add('registroButtonsDiv');
        buttonRegistro = widgetRegistro.getInput('button','registrationButton');
        buttonRegistro.setAttribute('value', 'Registrarse');
        buttonRegistro.classList.add('registrationButton');
        div.appendChild(buttonRegistro);
        formRegistro.appendChild(userInput);
        formRegistro.appendChild(passInput);
        formRegistro.appendChild(div);
        bodyRegistro.appendChild(formRegistro);
        boxRegistro.appendChild(bodyRegistro);
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
            url: "https://127.0.0.1:8000/widgetRest/widgetsByUser/", // the endpoint
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
            url: "https://127.0.0.1:8000/widgetRest/widget/", // the endpoint
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
            url: "https://127.0.0.1:8000/widgetRest/getWidget/", // the endpoint
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
            url: "https://127.0.0.1:8000/widgetRest/addUserWidget/", // the endpoint
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
            url: "https://127.0.0.1:8000/widgetRest/removeUserWidget/", // the endpoint
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
});
