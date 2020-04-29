"use strict";

const EventEmitter = require("events");

class ReadToken {

  constructor(stream, options) {
    this.stream = stream;
    options = options || {};


    this.emitter = new EventEmitter();
    this.sep = options.sep || " \t\r\n";
    this.maxLength = options.maxLength || 0;
    this.readSize = options.readSize || 8192;
    this.buf = "";

    stream.on("readable", this.doRead.bind(this));
    stream.on("end", () => {
      if (this.buf.length > 0) {
        this.emitter.emit("token", this.buf);
        this.buf = "";
      }
      this.emitter.emit("close");
    });
  }

  on(name, func) {
    this.emitter.on(name, func);
  }

  off(name, func) {
    this.emitter.off(name, func);
  }

  close() {
    try {
      this.stream.close();
    } catch (e) {
      // Ignore errors
    }
  }

  doRead() {
    let str = this.stream.read(this.readSize);
    while(str) {
      if (this.buf) {
        str = this.buf + str;
        this.buf = "";
      }
      let spos = 0;
      let index = 0;
      while (index < str.length) {
        const c = str.charAt(index++);
        if (this.sep.indexOf(c) !== -1) {
          if (spos < index - 1) {
            this.emitter.emit("token", str.substring(spos, index - 1));
          }
          spos = index;
        } else if (this.maxLength > 0 && index - spos > this.maxLength) {
          this.emitter.emit("token", str.substring(spos, index - 1));
          spos = index - 1;
        }
      }
      if (spos < index) {
        this.buf = str.substring(spos);
      }
      str = this.stream.read(this.readSize);
    }
  }
}

module.exports = ReadToken;