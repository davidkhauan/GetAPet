const getTokenHelper = (requisition) => {
    const authHeader = requisition.headers.authorization
    const token = authHeader.split (" ") [1]

    return token
}

module.exports = getTokenHelper