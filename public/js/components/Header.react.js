var React = require('react');
var Header = React.createClass({
  render: function() {
    return (
      <header>
        <div id="logo"></div>
        <span className="header-icons">Header Icons</span>
      </header>
    );
  }
});


module.exports = Header;


