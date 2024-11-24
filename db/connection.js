const mongoose = require ('mongoose')

async function main() {
    await mongoose.connect ('mongodb://localhost:27017/getapet')
    console.log ('Conectado com sucesso ao MongoDB com Mongoose!!')
}

main().catch ((error) => console.error (error))

module.exports = mongoose