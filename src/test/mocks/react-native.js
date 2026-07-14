const React = require('react');

function createMockComponent(name) {
  return function MockComponent(props) {
    const { children, ...rest } = props || {};
    const safeProps = {};
    for (const key of Object.keys(rest)) {
      if (key !== 'style' && typeof rest[key] !== 'function') {
        safeProps[key] = rest[key];
      }
    }
    return React.createElement(
      name,
      safeProps,
      children
    );
  };
}

module.exports = {
  View: createMockComponent('View'),
  Text: createMockComponent('Text'),
  Pressable: createMockComponent('Pressable'),
  SafeAreaView: createMockComponent('SafeAreaView'),
  StyleSheet: {
    create: (styles) => styles,
  },
};
