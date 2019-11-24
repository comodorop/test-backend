var jwt = require('jsonwebtoken');


function generateToken(body) {
    var older_token = jwt.sign({
        exp:Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000) + 3600,
        complete: true,
        data: body
    }, 'shhhhh');
    return older_token
}

async function decodeToken(token) {
    let data = null
    jwt.verify(token, 'shhhhh', function (err, decoded) {
        if (err) {
        } else {
            data = decoded
            console.log(decoded) // bar
        }
    });
    return data
}

module.exports = {
    generateToken,
    decodeToken
}