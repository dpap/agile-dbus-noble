const dbus = require('dbus-native');

/*
	This test file's purpose is to show how to write a simple, basic DBus service with this library.
	In order to do that, we connect to the session bus and create a DBus service exposing some functions,
	some properties and some signals.
	For instance you can use `gdbus` to introspect a service and make function calls.
	- introspect: `gdbus introspect -e -d com.dbus.native.return.types -o /com/dbus/native/return/types`
	- make a method call: `gdbus introspect -e -d com.dbus.native.return.types -o /com/dbus/native/return/types -m com.dbus.native.return.types.FunctionName`
*/

const serviceName = 'org.eclipse.agail.protocol.BLE'; // our DBus service name
/*
	The interface under which we will expose our functions (chose to be the same as the service name, but we can
	choose whatever name we want, provided it respects the rules, see DBus naming documentation)
*/
const interfaceName = serviceName;
/*
	The object pat hthat we want to expose on the bus. Here we chose to have the same path as the service (and
	interface) name, with the dots replaced by slashes (because objects path must be on the form of UNIX paths)
	But again, we could chose anything. This is just a demo here.
*/
const objectPath = `/${serviceName.replace(/\./g, '/')}`;

// First, connect to the session bus (works the same on the system bus, it's just less permissive)
const sessionBus = dbus.sessionBus();

// Check the connection was successful
if (!sessionBus) {
  throw new Error('Could not connect to the DBus session bus.');
}

/*
	Then request our service name to the bus.
	The 0x4 flag means that we don't want to be queued if the service name we are requesting is already
	owned by another service ;we want to fail instead.
*/
sessionBus.requestName(serviceName, 0x4, (err, retCode) => {
  // If there was an error, warn user and fail
  if (err) {
    throw new Error(
      `Could not request service name ${serviceName}, the error was: ${err}.`
    );
  }

  // Return code 0x1 means we successfully had the name
  if (retCode === 1) {
    console.log(`Successfully requested service name "${serviceName}"!`);
    proceed();
  } else {
    /* Other return codes means various errors, check here
	(https://dbus.freedesktop.org/doc/api/html/group__DBusShared.html#ga37a9bc7c6eb11d212bf8d5e5ff3b50f9) for more
	information
	*/
    throw new Error(
      `Failed to request service name "${
        serviceName
      }". Error connecting to dbus: error code: "${retCode}" `
    );
  }
});

// Function called when we have successfully got the service name we wanted
function proceed() {
  var methods = {
    // Simple types
    //  SayHello: ['', 's', [], ['hello_sentence']],
    //  GiveTime: ['', 's', [], ['current_time']],
    //  Capitalize: ['s', 's', ['initial_string'], ['capitalized_string']],
        Connect: ['s', '', ['arg_0'] , []],
        Data: ['', 'ay', [] , ['arg_0'], []],
        DeviceStatus : [ 's' , '(s)', ['arg_0'] , ['arg_1']],
        Devices : [ '' , 'a(ssss)', [] , ['arg_0']],
        Disconnect : [ 's' , '' , ['arg_0'] , []],
        DiscoveryStatus : [ '' , 's' , [] , ['arg_0']],
        Driver : [ '' , 's' , [] , ['arg_0']],
        Name : [ '' , 's' , [] , ['arg_0']],
        NotificationRead : ['sa{ss}' , 'ay' , ['arg_0','arg_1'] , ['arg_2']],
        Read : ['sa{ss}' , 'ay' , ['arg_0','arg_1'] , ['arg_2']],
        StartDiscovery : ['' , '' , [] , []],
        Status : [ '' , 's' , [] , ['arg_0'], []],
        StopDiscovery : [ '' , '' , [] , []],
        Subscribe : [ 'sa{ss}' , '' , ['arg_0','arg_1'] , []],
        Unsubscribe : [ 'sa{ss}' , '' , ['arg_0','arg_1'] , []],
        Write :  [ 'sa{ss}ay', '' , ['arg_0','arg_1','arg_2'] , []]
  
    } 

  // First, we need to create our interface description (here we will only expose method calls)
   var ifaceDesc = {
    name: interfaceName,
    methods: methods,
    signals: {
      NewRecordSignal: ['aysa{ss}', 'NewRecordSignal']
    }
  };

  // Then we need to create the interface implementation (with actual functions)

  var iface = {
    Connect: function(deviceId) {
        console.log("deviceId " + deviceId);
        return null;
    },
    Data: function () {
        var array = [];
        //array.push(35);
        return array;
    },
    DeviceStatus : function (deviceAddress) {
        var status =  "DISCONNECTED";
        console.log(status);
        //Struct of (String)
        return [status];
    },
    Devices : function () {
       let device = ['D0:37:02:2C:27:42','org.eclipse.agail.protocol.BLE','X10Pro','AVAILABLE'];

       console.log("get devices"); 
//       let devId = "ble1341413";
//       let devProt = "BLE";
//       let devName = "X1232";
//       let devStatus = "Con" ;
        //Array of [Struct of (String,String,String,String)]
       return [device] 
    },
    Disconnect : function (deviceAddress) {
        console.log ("Disconnect " + deviceAddress);
        return null;
    },
    DiscoveryStatus : function () {
        let discoveryStatus = "NONE";
        //'RUNNING'    
        return "NONE"
    },
    Driver : function () {
        console.log('Driver: BLE')
        return "BLE"
    },
    Name : function () {
        console.log('Name : Bluetooth Low Energy');
        return "Bluetooth Low Energy"
    },
    NotificationRead : function (device, profile) {
        let arr = []        
        return arr;
    },
    Read : function () {
        let arr = []
        return arr;
    },
    StartDiscovery :function () {
        console.log('Starting discovery');
        return null;
    },
    Status : function () {
        let status = "PROTOCOL STATUS NOT IMPLEMENTED"
        return status
    },
    StopDiscovery : function () {
        console.log('Stop discovery'); 
        return null;      
    },
    Subscribe : function (deviceAddess, profile) {
        console.log(deviceAddress);
        console.log(profile);
        return null;
    },
    Unsubscribe : function (deviceAddess, profile) {
        console.log(deviceAddress);
        console.log(profile);
        return null;
    },
    Write : function (deviceAddress, profile, payload) {
        console.log(deviceAddress);
        console.log(profile);
        console.log(payload);
        return null;
    },
    emit: function() {
      // no nothing, as usual
        return null;
    }
  };

  // Now we need to actually export our interface on our object
  sessionBus.exportInterface(iface, objectPath, ifaceDesc);

  // Say our service is ready to receive function calls (you can use `gdbus call` to make function calls)
  console.log('Interface exposed to DBus, ready to receive function calls!');

  setInterval(() => {
      let data = [];
      data.push(0x31);
      data.push(0x32);
      let address = "D0:11:22:33:44:55"  
      let profile = [ 'test1' , 'test2'];
      console.log('Sending NewRecordSignal') ;     
        
      iface.emit('NewRecordSignal', data , address, [profile] );
  }, 30000);

}
