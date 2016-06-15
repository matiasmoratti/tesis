from django.conf.urls import url,include

from . import views
from views import WidgetListView
from django.contrib.auth.views import logout_then_login

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^objects/', views.objects, name='objects'),
    url(r'^updateObject/', views.updateObject, name='updateObject'),
    url(r'^framework/', views.framework, name='framework'),
    url(r'^interface/', views.interface, name='interface'),
    url(r'^scripts/', views.scripts, name='scripts'),
    url(r'^specific_comments/', views.specific_comments, name='specific_comments'),
    url(r'^registration/', views.registration, name='registration'),
    url(r'^logout/', views.logout, name='logout'),
    url(r'^user_ping/', views.user_ping, name='user_ping'),
    url(r'', include('tokenapi.urls')),
    url(r'^poll_list/', views.poll_list, name='poll_list'),
    url(r'^poll_add/', views.poll_add, name='poll_add'),
    url(r'^poll_vote/', views.poll_vote, name='poll_vote'),
    url(r'^chats/', views.chats, name='chats'),
    url(r'^getChat/', views.getChat, name='getChat'),
    url(r'^saveMessage/', views.saveMessage, name='saveMessage'),
    url(r'^poll_details/', views.poll_details, name='poll_details'),
    url(r'^get_votes/', views.get_votes, name='get_votes'),
    url(r'^widget/', views.widget, name='widget'),
    url(r'^getWidget/', views.getWidget, name='getWidget'),
    url(r'^addUserWidget/', views.addUserWidget, name='addUserWidget'),
    url(r'^removeUserWidget/', views.removeUserWidget, name='removeUserWidget'),
    url(r'^widgetsByUser/', views.widgetsByUser, name='widgetsByUser'),
    url(r'^register', views.register, name='register'),
    url(r'^loginWeb', views.loginWeb, name='loginWeb'),
    url(r'^remove', views.remove, name='remove'),
    url(r'^exit', lambda request: logout_then_login(request, views.loginWeb), name='logout'),
    # url(r'^exit', views.exit, name='exit'),
    url(r'^newWidget', views.newWidget, name='newWidget'),
    url(r'^widgets', WidgetListView.as_view(), name='widget-list'),

    # url(r'^usuariosActivos/', views.usuariosActivos, name='usuariosActivos'),
]
