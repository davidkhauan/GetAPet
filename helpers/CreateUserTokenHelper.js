const JWT = require ('jsonwebtoken')

const createUserTokenHelper = async (user, requisition, response) => {
    const token = JWT.sign ({
        name: user.name,
        id: user._id
    }, 'nossosecret')

    response.status (200).json ({
        message: "Você está autenticado!",
        token: token,
        userId: user._id
    })
} 

module.exports = createUserTokenHelper