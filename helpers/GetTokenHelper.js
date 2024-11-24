const getTokenHelper = (requisition) => {
    const authHeader = requisition.headers.authorization
    if (!authHeader) {
        throw new Error ('Cabeçalho de autorização ausente')
    }

    const tokenParts = authHeader.split(' ')
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        throw new Error ('Token no formato inválido. Esperado "Bearer <token>"')
    }

    return tokenParts [1]
}

module.exports = getTokenHelper
