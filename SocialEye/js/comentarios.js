var comentarios = new Widget();

comentarios.loadWidget = function () {
    var commentBox = "<div class='detailBox socialEye' id='comentariosGenerales'>";
    commentBox += "<div class='titleBox socialEye'>";
    commentBox += "<label class='socialEye'>Comentarios Generales</label>";
    commentBox += "<button type='button' class='close botonCerrar socialEye' id='cerrarBoxGenerales' aria-hidden='true'>&times;</button>";
    commentBox += "</div>";
    commentBox += "<div class='actionBox socialEye'>";
    commentBox += "<ul id='listaComentariosGenerales' class='commentList socialEye'>";
    //Creo los objetos
    data = comentarios.getObjects();
    $.each(data, function (i, item) {
        object = JSON.parse(item.element);
        commentBox += "<li class='socialEye'><div class='commentText socialEye'>";
        commentBox += "<span class='date sub-text socialEye'>" + item.username + " dijo el " + item.date + "</span>";
        commentBox += "<p class='socialEye'>" + object.texto + "</p>";
        commentBox += "</div>";
        commentBox += "</li>";
    });



    commentBox += "</ul>";
    commentBox += "<form class='form-inline socialEye' role='form'>";
    commentBox += "<textarea class='form-control socialEye' id='textoComentarioGeneral' type='text' placeholder='Escribe un comentario' ></textarea>";
    commentBox += "<button id='agregarComentarioGeneral' class='btn btn-primary socialEye'>Agregar</button>";
    commentBox += "</form>";
    commentBox += "</div>";
    commentBox += "</div>";
    return commentBox;
}

comentarios.onCloseWidget = function (){
    $("#textoComentarioGeneral").val("");
}


comentarios.onReady = function () {
    $('#listaComentariosGenerales').scrollTop($('#listaComentariosGenerales')[0].scrollHeight);
    $("#cerrarBoxGenerales").on("click", function (event) {
        comentarios.close();
    });

    $("#agregarComentarioGeneral").on('click', function (event) {
        if ($("#textoComentarioGeneral").val() != "") {
            var c = new Object();
            c.texto = $("#textoComentarioGeneral").val();
            c.user = getUser() //Aca deberiamos llamar a nuestra funcion
            cAsJson = JSON.stringify(c);
            //Funcion del framework que guarda los objetos
            result = comentarios.saveObject(cAsJson);
            if (result == true) {
                var parrafo = document.createElement('p');
                var span = document.createElement('span');
                span.setAttribute('class', 'date sub-text');
                var d = new Date();
                var hs = d.getHours();
                var mins = d.getMinutes();
                var secs = d.getSeconds();
                span.innerHTML = getUser() + " dijo el " + $.datepicker.formatDate('dd-mm-yy', d) + " " + hs + ":" + mins + ":" + secs;
                parrafo.innerHTML = $("#textoComentarioGeneral").val();
                var divComentario = document.createElement('div');
                divComentario.setAttribute('class', 'commentText');
                var lineaComentario = document.createElement('li');
                //Uno los objetos
                divComentario.appendChild(span);
                divComentario.appendChild(parrafo);
                lineaComentario.appendChild(divComentario);
                $("#listaComentariosGenerales").append(lineaComentario);
                $("#textoComentarioGeneral").val("");
                $('#listaComentariosGenerales').animate({scrollTop: $('#listaComentariosGenerales')[0].scrollHeight});
            }


        }

        return false;
    });
}


