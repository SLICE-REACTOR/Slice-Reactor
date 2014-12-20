var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  currentTime: int,
  result: {
    createTime: int,
    firstname: String,
    href: String,
    lastname: String,
    mailboxes: [{
      href: String,
    }, {
      href: String,
    }],
    updateTime: int,
    useremail: String,
    username: String
  }
});