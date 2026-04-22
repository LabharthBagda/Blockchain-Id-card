function Card() {}

global.inMemoryDb = global.inMemoryDb || { students: [], cards: [] };

Card.find = function(query) {
    return Promise.resolve(global.inMemoryDb.cards);
};

Card.findOne = function(query) {
    if (!query) return Promise.resolve(null);
    const card = global.inMemoryDb.cards.find(c => 
        c.studentId === query.studentId || c.studentUniqueId === query.studentUniqueId
    );
    return Promise.resolve(card || null);
};

Card.countDocuments = function(query) {
    let count = global.inMemoryDb.cards.length;
    if (query) {
        if (query.isActive !== undefined) {
            count = global.inMemoryDb.cards.filter(c => c.isActive === query.isActive).length;
        }
        if (query.isRevoked !== undefined) {
            count = global.inMemoryDb.cards.filter(c => c.isRevoked === query.isRevoked).length;
        }
    }
    return Promise.resolve(count);
};

module.exports = Card;