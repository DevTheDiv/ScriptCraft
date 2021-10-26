//globals - global self

function _echo(...arguments) {
  var _self = false;
  try {
    _self = arguments[0].getClass().getSimpleName() === "CraftPlayer"
        ||  arguments[0].getClass().getSimpleName() === "ColouredConsoleSender"
    ;
  } catch(e){
    _self = false;
  }
  var sender = _self ? arguments[0] : global.self;
  var msg    = _self ? arguments[1] : arguments[0];
  sender.sendMessage(msg);
}

var echo = _echo;
var alert = _echo;
