const bcrypt = require ('bcrypt')
const JWT = require ('jsonwebtoken')

const User = require ('../models/UserModel')

const createUserTokenHelper = require ('../helpers/CreateUserTokenHelper')
const getTokenHelper = require ('../helpers/GetTokenHelper')
const getUserByTokenHelper = require ('../helpers/GetUserByTokenHelper')

class UserController {
    static async register (requisition, response) {
        const { name, email, phone, password, confirmPassword } = requisition.body

        if (!name) {
            return response.status (422).json ({ message: 'O nome é obrigatório!' })
        }
        if (!email) {
            return response.status (422).json ({ message: 'E-mail é obrigatório!' })
        }
        if (!phone) {
            return response.status (422).json ({ message: 'O telefone é obrigatório!' })
        }
        if (!password) {
            return response.status (422).json ({ message: 'A Senha é obrigatória!' })
        }
        if (!confirmPassword) {
            return response.status (422).json ({ message: 'Confirme a senha!' })
        }

        if (password !== confirmPassword) {
            return response.status (422).json ({ message: 'As senhas devem ser iguais!!'})
        }

        const userExists = await User.findOne ({ email: email })

        if (userExists) {
            return response.status (422).json ({ message: 'Email já cadastrado!! Utilize outro email!' })
        }

        if (!email.includes ('@')) {
            return response.status (422).json ({ message: 'Email inválido! O email deve conter @.' })
        }

        const salt = await bcrypt.genSalt (12)
        const passwordHash = await bcrypt.hash (password, salt)
        
        const user = new User ({
            name,
            email,
            phone,
            password: passwordHash
        })

        try {
            const newUser = await user.save()

            await createUserTokenHelper (newUser, requisition, response)
        } catch (error) {
            response.status (500).json ({ message: error.message })
        }
    }

    static async login (requisition, response) {
        const { email, password } = requisition.body

        if (!email) {
            return response.status (422).json ({ message: 'E-mail obrigatório!' })
        }
        if (!password) {
            return response.status (422).json ({ message: 'Senha obrigatória!' })
        }

        const user = await User.findOne ({ email: email })

        if (!user) {
            return response.status (422).json ({ message: 'Usuário não cadastrado!!' })
        }

        const checkPassword = await bcrypt.compare (password, user.password)

        if (!checkPassword) {
            return response.status (422).json ({ message: 'Senha inválida!' })
        }

        await createUserTokenHelper (user, requisition, response)
    }

    static async checkUser (requisition, response) {
        let currentUser

        if (requisition.headers.authorization) {
            const token = getTokenHelper (requisition)
            const decoded = JWT.verify (token, 'nossosecret')

            currentUser = await User.findById (decoded.id)

            currentUser.password = undefined
        } else {
            currentUser = null
        }

        response.status (200).send (currentUser)
    }

    static async getUserById (requisition, response) {
        const id = requisition.params.id

        const user = await User.findById (id).select ('-password')

        if (!user) {
            return response.status (422).json ({ message: 'Usuário não encontrado!' })
        }

        response.status (200).json ({ user })
    }

    static async editUser (requisition, response) {    
        const token = getTokenHelper (requisition)
        const user = await getUserByTokenHelper (token)
    
        const { name, email, phone, password, confirmPassword } = requisition.body

        if (requisition.file) {
            user.image = requisition.file.filename
        }
    
        if (name) {
            user.name = name
        }

        if (email) {
            const userExists = await User.findOne ({ email: email })
    
            if (user.email !== email && userExists) {
                return response.status (422).json ({ message: 'Email já cadastrado!! Utilize outro email!' })
            }
    
            user.email = email
        }
    
        if (phone) {
            user.phone = phone
        }
    
        if (password) {
            if (password !== confirmPassword) {
                return response.status (422).json ({ message: 'As senhas devem ser iguais!!' })
            }
    
            const salt = await bcrypt.genSalt (12)
            const passwordHash = await bcrypt.hash (password, salt)

            user.password = passwordHash
        }
    
        try {
            await User.findByIdAndUpdate ({ _id: user._id }, { $set: user }, { new: true })
    
            return response.status (200).json ({ message: 'Usuário atualizado com sucesso!' })
        } catch (error) {
            return response.status (500).json ({ message: error.message })
        }
    }    

    static async updateUser (requisition, response) {
        const id = requisition.params.id

        const token = getTokenHelper (requisition)
        const user = await getUserByTokenHelper (token)

        const { name, email, phone, password, confirmPassword } = requisition.body

        if (requisition.file) {
            user.image = requisition.file.filename
        }

        if (!name) {
            return response.status (422).json ({ message: 'O nome é obrigatório!' })
        }
        if (!email) {
            return response.status (422).json ({ message: 'E-mail é obrigatório!' })
        }

        const userExists = await User.findOne ({ email: email })

        if (user.email !== email && userExists) {
            return response.status (422).json ({ message: 'Email já cadastrado!! Utilize outro email!' })
        }

        user.name = name
        user.email = email
        user.phone = phone

        if (password !== confirmPassword) {
            return response.status (422).json ({ message: 'As senhas devem ser iguais!!' })
        } else if (password && password === confirmPassword) {
            const salt = await bcrypt.genSalt (12)
            const passwordHash = await bcrypt.hash (password, salt)

            user.password = passwordHash
        }

        try {
            await User.findByIdAndUpdate ({ _id: user._id }, { $set: user }, { new: true })

            return response.status (200).json ({ message: 'Usuário atualizado com sucesso!' })
        } catch (error) {
            return response.status (500).json ({ message: error.message })
        }
    }
}

module.exports = UserController