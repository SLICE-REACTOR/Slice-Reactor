var React = require('react');
var Header = React.createClass({
  render: function() {
    return (
      <header>
        <div id="logo"></div>
        <span className="header-icons">
          <span id="menu">MENU</span>
          <i id="content-icon" className="fa fa-bars fa-lg"></i>
        </span>
      </header>
    );
  }
});


module.exports = Header;


