var App = require('./components/App.react');
var React = require('react');
var ExampleGraphData = require('./ExampleData');
var APIUtils = require('./utils/APIUtils');
window.React = React; // export for http://fb.me/react-devtools

// loads example graph data
ExampleGraphData.init();
APIUtils.getAllOrders();

React.render(
    <App />,
    document.getElementById('react')
);
