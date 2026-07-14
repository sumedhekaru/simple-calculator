function installExpoGlobalPolyfill() {
  if (!globalThis.expo) {
    globalThis.expo = {
      modules: {},
      SharedObject: class SharedObject {},
    };
  }
}

module.exports = { installExpoGlobalPolyfill };
