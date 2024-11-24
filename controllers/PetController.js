const Pet = require('../models/PetModel');
const getTokenHelper = require('../helpers/GetTokenHelper');
const getUserByTokenHelper = require('../helpers/GetUserByTokenHelper');

class PetController {
    static async create(requisition, response) {
        const { name, age, weight, color } = requisition.body;
        const images = requisition.files || [];
        const available = true;

        if (!name) {
            return response.status(422).json({ message: 'O nome é obrigatório!' });
        }
        if (!age) {
            return response.status(422).json({ message: 'A idade é obrigatória!' });
        }
        if (!weight) {
            return response.status(422).json({ message: 'O peso é obrigatório!' });
        }
        if (!color) {
            return response.status(422).json({ message: 'A cor é obrigatória!' });
        }
        if (images.length === 0) {
            return response.status(422).json({ message: 'A imagem é obrigatória!' });
        }

        const token = getTokenHelper(requisition);
        const user = await getUserByTokenHelper(token);

        // if (!user) {
        //     return response.status(401).json({ message: 'Usuário não autorizado!' });
        // }

        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }
        });

        images.forEach((image) => {
            pet.images.push(image.filename);
        });

        try {
            const newPet = await pet.save();
            return response.status(201).json({ message: "Pet cadastrado com sucesso!", newPet });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }
}

module.exports = PetController;
