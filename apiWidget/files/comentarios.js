var comentarios = new Widget();
comentarios.descripcion = "Permite realizar comentarios entre los usuarios sobre una web en particular.";
comentarios.icono = "commenting";
comentarios.tittle = "Comentarios Generales";
comentarios.loadWidget = function () {
  // var html = "<div class='detailBox socialEye <%= idWidget %>'><div class='titleBox socialEye'><label class='socialEye'><%= title %></label><button class='botonCerrar socialEye cerrar<%= idWidget %>' aria-hidden='true'>&times;</button></div><div id='<%= idWidget %>principalGenerales' class='actionBox socialEye principal<%= idWidget %>'><ul id='<%= idWidget %>listaComentariosGenerales' class='commentList socialEye list<%= idWidget %>'><% _.each(items, function(item) { %><li class='socialEye'><div class='socialEye commentText'><span class='socialEye sub-text'><%= item.username %> dijo el <%= item.date %></span><p class='socialEye'><%= item.element.texto %></p></div></li><% }); %></ul><form class='socialEye form<%= idWidget %>'><textarea class='form-control socialEye textArea<%= idWidget %>' type='text' id='<%= idWidget %>textoComentarioGeneral' placeholder='Escriba su comentario...'></textarea><button class='submitButton socialEye button<%= idWidget %>' id='<%= idWidget %>agregarComentarioGeneral'>Agregar</button></form></div></div>";

  items = comentarios.getObjectsInUrl(window.location.href);
  var data = {idWidget: comentarios.idWidget,
            title : comentarios.tittle,
            items : items
            file: 'comentarios_L76B80n'};
    return data;
}

comentarios.onCloseWidget = function (){
    $("#textoComentarioGeneral").val("");
}


comentarios.onReady = function () {
    $("#"+comentarios.idWidget+"listaComentariosGenerales").scrollTop($("#"+comentarios.idWidget+"listaComentariosGenerales")[0].scrollHeight);
    alert("hola");
    //REVISAR
    $(".cerrar"+comentarios.idWidget).on('click',function (e) {
        comentarios.close();
    });

    $(comentarios.getWidgetElement("agregarComentarioGeneral")).on('click', function (event) {
        if ($(comentarios.getWidgetElement("textoComentarioGeneral")).val() != "") {
            var c = {};
            c['texto'] = $(comentarios.getWidgetElement("textoComentarioGeneral")).val();
            result = comentarios.saveObject(c);
            if (result != 0) {
                var parrafo = comentarios.getP();
                var span = comentarios.getSpan();
                span.setAttribute('class', 'date sub-text');
                var d = new Date();
                var hs = d.getHours();
                var mins = d.getMinutes();
                var secs = d.getSeconds();
                span.innerHTML = comentarios.getUser() + " dijo el " + $.datepicker.formatDate('dd-mm-yy', d) + " " + hs + ":" + mins + ":" + secs;
                parrafo.innerHTML = $(comentarios.getWidgetElement("textoComentarioGeneral")).val();
                var divComentario = comentarios.getDiv();
                divComentario.setAttribute('class', 'commentText');
                var lineaComentario = comentarios.getLi();
                //Uno los objetos
                divComentario.appendChild(span);
                divComentario.appendChild(parrafo);
                lineaComentario.appendChild(divComentario);
                listaAux = comentarios.getWidgetElement("listaComentariosGenerales");
                $(listaAux).append(lineaComentario);
                $(comentarios.getWidgetElement("textoComentarioGeneral")).val("");
                $(listaAux).animate({scrollTop: $(listaAux)[0].scrollHeight});
            }
        }

        return false;
    });
}
