$(document).ready(function(){
  $('.icono').on('click',function(){
     var location = this.href;
     alert(location);
     chrome.tabs.create({active: true, url: location});
  });


  // chrome.browserAction.onClicked.addListener(function() {
  //    chrome.tabs.create({active: true, url: 'http://localhost:8000/widgetRest/'});
  // });

});
