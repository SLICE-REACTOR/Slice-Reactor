var React = require('react');
var Header = React.createClass({
  render: function() {
    return (
      <header>
        <span id="logo">Slice Logo</span>
        <span className="header-icons">Header Icons</span>
      </header>
    );
  }
});


module.exports = Header;


