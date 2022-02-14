const Sauce = require('./sauce');
const fs = require('fs');

exports.createSauces = (req, res, next) => {
    const saucesObject = JSON.parse(req.body.sauce);
    console.log('ma sauce',saucesObject)
    const sauce = new Sauce({
        userId: saucesObject.userId,
        name: saucesObject.name,
        manufacturer: saucesObject.manufacturer,
        description: saucesObject.description,
        mainPepper: saucesObject.mainPepper,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        heat: saucesObject.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save().then(
        () => {
            res.status(201).json({
                message: 'Post saved successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};


exports.getOneSauces = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifySauces = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...req.body,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        } : { ...req.body} ;
    Sauce.updateOne({_id: req.params.id}, sauceObject).then(
        () => {
            res.status(201).json({
                message: 'sauces updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.deleteSauces = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};


exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.likes = (req, res, next) => {
    const likesObject = req.body;
    Sauce.findById(req.params.id)
        .then(sauce => {
            if (likesObject.like > 0) {
                sauce.likes += 1;
                sauce.usersLiked.push(likesObject.userId);
            } else if (likesObject.like < 0) {
                sauce.dislikes += 1;
                sauce.usersDisliked.push(likesObject.userId)
            } else { // ici like = 0
                if(sauce.usersLiked.includes(likesObject.userId)){
                    sauce.likes -= 1;
                    sauce.usersLiked = sauce.usersLiked.filter((userId) => likesObject.userId !== userId);
                } else {
                    sauce.dislikes -= 1;
                    sauce.usersDisliked = sauce.usersDisliked.filter((userId) => likesObject.userId !== userId);
                }
            }

            sauce.save().then(
                () => {
                    res.status(201).json({
                        message: 'Post saved successfully!'
                    });
                }
            ).catch(
                (error) => {
                    res.status(400).json({
                        error: error
                    });
                }
            );

        }).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};
