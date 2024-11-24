const JWT = require ('jsonwebtoken')

const UserModel = require ('../models/UserModel')

const getUserByTokenHelper = async (token) => {
    if (!token) {
        return response.status (401).json ({ message: 'Acesso Negado!!' })
    }

    const decoded = JWT.verify (token, 'nossosecret')

    const userId = decoded.id

    const user = await UserModel.findOne ({ _id: userId })

    return user
}

module.exports = getUserByTokenHelper
