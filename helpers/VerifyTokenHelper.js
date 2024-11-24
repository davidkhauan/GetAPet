const JWT = require ('jsonwebtoken')
const getToken = require ('./GetTokenHelper')

const checkTokenHelper = (requisition, response, next) => {
    const token = getToken (requisition)

    if (!requisition.headers.authorization) {
        return response.status (401).json ({ message: 'Acesso Negado!!' })
    }

    if (!token) {
        return response.status (401).json ({ message: 'Acesso Negado!!' })
    }
    
    try {
        const verified = JWT.verify (token, 'nossosecret')

        requisition.user = verified
        next()
    } catch (error) {
        return response.status (400).json ({ message: 'Token inválido!!' })
    }
}

module.exports = checkTokenHelper