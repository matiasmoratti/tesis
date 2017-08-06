var especificos = new Widget();

especificos.loadWidget = function() {
    params = {};
    params.tipo = 'comment';
    items = especificos.getObjectsInUrl(window.location.href, params);
    setPositionItems(items);
    var data = {
        items: items,
        file: 'comentariosEspecificos.html'
    };
    especificos.createTemplate('principal', 'Comentarios Especificos', 'comentariosEspecificos.html', data,true);
}

function setPositionItems(items) {
  $.each(items, function(index,value) {
    var obj = getElementByXpath(value.element.tag);
    value.element.data = value.element.tag;
    value.element.tag = value.element.tag.replace(/[/]/g,'_');
    value.element.tag = value.element.tag.replace(/\[/g,'-');
    value.element.tag = value.element.tag.replace(/\]/g,'close');
    value.element.positionTop = getOffset(obj).top;
    value.element.positionLeft = getOffset(obj).left;
  })
}

function getOffset(obj) {
  return $(obj).offset();
}

especificos.onReady = function() {
    $('body').on("click", '.iconoComentarioEspecifico', showSpecificBox);
    changeClickListeners();
}

especificos.onCloseWidget = function() {
    revertClickListeners();
}

function showSpecificBox(e) {
  debugger;
    var tagAux = getXPath(e.target);
    params = {};
    params.tag = tagAux;
    params.tipo = 'comment';
    var boxObject = especificos.getObjectsInUrl(window.location.href, params);
    positionLeft = e.pageX;
    positionTop = e.pageY;
    tagForId = tagAux.replace(/[/]/g,'_');
    tagForId = tagForId.replace(/\[/g,'-');
    tagForId = tagForId.replace(/\]/g,'close');
    data = {
      idWidget: this.idWidget,
      positionLeft: positionLeft,
      positionTop: positionTop,
      tag: tagForId,
      items:boxObject
    }
    especificos.injectInTemplate('principal', 'boxEspecifico.html',data,'',true);

    $(".agregarComentarioEspecifico").on('click', function(e) {
      debugger;
        var tag = e.target.id.substr(17);
        var usuarioComentario = especificos.getUser();
        var textoComentarioTag = $(e.target).parent().find("textarea");
        if (textoComentarioTag.val() != "") {
          tagForSave = tag.replace(/[_]/g,'/');
          tagForSave = tagForSave.replace(/[-]/g,'[');
          tagForSave = tagForSave.replace(/close/g,']');
            obj = {}
            obj['texto'] = textoComentarioTag.val();
            obj['tipo'] = 'comment';
            obj['tag'] = tagForSave;
            result = especificos.saveObject(obj);
            if (result != 0) {
                var parrafo = especificos.getP();
                var span = especificos.getSpan();
                span.setAttribute('class', 'sub-text');
                var d = new Date();
                var hs = d.getHours();
                var mins = d.getMinutes();
                var secs = d.getSeconds();
                span.innerHTML = usuarioComentario + " dijo el " + $.datepicker.formatDate('dd-mm-yy', d) + " " + hs + ":" + mins + ":" + secs;
                parrafo.innerHTML = textoComentarioTag.val();
                var divComentario = especificos.getDiv();
                divComentario.setAttribute('class', 'commentText');
                var lineaComentario = especificos.getLi();
                lineaComentario.setAttribute('class', 'socialEye');
                //Uno los objetos
                divComentario.appendChild(span);
                divComentario.appendChild(parrafo);
                lineaComentario.appendChild(divComentario);
                var lista = getListWithId("listaComentario"+tag);
                lista.appendChild(lineaComentario);
                $(textoComentarioTag).val("");
                lista.animate({
                    scrollTop: lista.children[0].scrollHeight
                });
            }
        }
        return false;
    });

    $(".botonCerrar").on("click",function(e){
      $(e.target).parent().parent().remove();
    });
}



function getXPath(element) {
    debugger;
  var data = element.getAttribute('data-social');
  if (!data) {
    var val = element.value;
    var xpath = '';
    for (; element && element.nodeType == 1; element = element.parentNode) {
        var id = $(element.parentNode).children(element.tagName).index(element) + 1;
        id > 1 ? (id = '[' + id + ']') : (id = '');
        xpath = '/' + element.tagName.toLowerCase() + id + xpath;
    }
    return xpath;
  }
  return data;
}
function getElementByXpath(tag) {
  return document.evaluate(tag,document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function getListWithId(id) {
  return especificos.getWidgetElement("#"+id);
}

function toArray(arraylike) {
    var array = new Array(arraylike.length);
    for (var i = 0, n = arraylike.length; i < n; i++)
        array[i] = arraylike[i];
    return array;
}

function changeClickListeners() {
    var all = toArray(document.getElementsByTagName('a')).concat(toArray(document.getElementsByTagName('div')));
    for (var i = 0, max = all.length; i < max; i++) {
        all[i]._onclick = all[i].onclick;
        all[i].onclick = function(e) {
            if (!($(e.target).parents().hasClass('socialEye'))) {
                e.stopPropagation();
                e.preventDefault();
                showSpecificBox(e);
            }
        }
    }
}

function revertClickListeners() {
    var all = toArray(document.getElementsByTagName('a')).concat(toArray(document.getElementsByTagName('div')));
    for (var i = 0, max = all.length; i < max; i++) {
        if (!($(all[i]).parents().hasClass('socialEye')))
            all[i].onclick = all[i]._onclick;
    }
}
