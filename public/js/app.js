var App = require('./components/App.react');
var React = require('react');
var APIUtils = require('./utils/APIUtils');
window.React = React; // export for http://fb.me/react-devtools

APIUtils.getAllGraphData();

React.render(
    <App />,
    document.getElementById('react')
);
