// this file bootstraps application
var App = require('./components/App.react');
var React = require('react');
var APIUtils = require('./utils/APIUtils');
window.React = React;

// initializes http request to server to get data from the database
APIUtils.getAllGraphData();

// renders entire application
React.render(
    <App />,
    document.getElementById('react')
);
