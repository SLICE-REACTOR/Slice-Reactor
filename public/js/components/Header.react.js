var React = require('react');
var Header = React.createClass({
  render: function() {
    return (
      <header>
        <div id="logo"></div>
        <span className="header-icons">
          <a href="/logout" id="signout-link">
            <span id="signout">SIGN OUT</span>
            <i id="signout-icon" className="fa fa-sign-out fa-lg"></i>
          </a>
        </span>
      </header>
    );
  }
});


module.exports = Header;


