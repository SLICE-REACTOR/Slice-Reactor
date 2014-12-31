var user = {
  "result": {
    "userName": "",
    "updateTime": 1419985113000,
    "firstName": "Test",
    "lastName": "Testofferson",
    "linkedAccounts": [],
    "userEmail": "testemail@gmail.com",
    "mailboxes": [{
      "href": "https://api.slice.com/api/v1/mailboxes/1964530000009988109"
    }, {
      "href": "https://api.slice.com/api/v1/mailboxes/6381180000003457895"
    }],
    "href": "https://api.slice.com/api/v1/users/self",
    "createTime": 1418548075000
  },
  "currentTime": 1419985131000
}

var insertSqlUser = function (users) {
  var sqlQuery = 'INSERT INTO users (createTime, firstName, lastName, userEmail, userName) VALUES ';
  sqlQuery += '(' + users.result.createTime + ', "' + users.result.firstName + '" , "' + users.result.lastName + '", "' + users.result.userEmail + '", "' + users.result.userName + '");';
  return sqlQuery;
};