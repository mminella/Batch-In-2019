///<reference path="../../headers/common.d.ts" />

import EventEmitter from 'eventemitter3';

var hasOwnProp = {}.hasOwnProperty;

function createName(name) {
    return '$' + name;
}

export class Emitter {
  emitter: any;

  constructor() {
    this.emitter = new EventEmitter();
  }

  emit(name, data?) {
    this.emitter.emit(name, data);
  }

  on(name, handler, scope?) {
    this.emitter.on(name, handler);

    if (scope) {
      var unbind = scope.$on('$destroy', () => {
        this.emitter.off(name, handler);
        unbind();
      });
    }
  }

  removeAllListeners(evt?) {
    this.emitter.removeAllListeners(evt);
  }

  off(name, handler) {
    this.emitter.off(name, handler);
  }
}
