var dbus = require('dbus-native');
var sessionBus = dbus.sessionBus();
sessionBus.getService('org.freedesktop.Notifications').getInterface(
    '/org/freedesktop/Notifications',
    'org.freedesktop.Notifications', function(err, notifications) {

    // dbus signals are EventEmitter events
    notifications.on('ActionInvoked', function() {
        console.log('ActionInvoked', arguments);
    });
    notifications.on('NotificationClosed', function() {
        console.log('NotificationClosed', arguments);
    });
    notifications.Notify('exampl', 0, '', 'summary 3', 'new message text', ['xxx yyy', 'test2', 'test3', 'test4'], [],  5, function(err, id) {
       //setTimeout(function() { n.CloseNotification(id, console.log); }, 4000);
    });
});
