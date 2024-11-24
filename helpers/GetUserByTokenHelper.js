const JWT = require ('jsonwebtoken')
const UserModel = require ('../models/UserModel')

const getUserByTokenHelper = async (token) => {
    if (!token) {
        throw new Error ('Acesso negado! Token ausente.')
    }

    try {
        const decoded = JWT.verify (token, 'nossosecret')

        const userId = decoded.id

        const user = await UserModel.findOne ({ _id: userId })

        if (!user) {
            throw new Error ('Usuário não encontrado.')
        }

        return user
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new Error ('Token inválido!')
        } else if (error.name === 'TokenExpiredError') {
            throw new Error ('Token expirado!')
        }
        throw new Error (error.message || 'Erro ao recuperar usuário.')
    }
}

module.exports = getUserByTokenHelper
