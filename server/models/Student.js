function Student() {}

global.inMemoryDb = global.inMemoryDb || { students: [], cards: [] };

Student.find = function(query) {
    let results = global.inMemoryDb.students;
    if (query && query.isActive !== undefined) {
        results = results.filter(s => s.isActive === query.isActive);
    }
    return Promise.resolve(results);
};

Student.findOne = function(query) {
    if (!query) return Promise.resolve(null);
    const student = global.inMemoryDb.students.find(s => 
        s.studentId === query.studentId || s._id === query._id || s.studentId === query.id
    );
    return Promise.resolve(student || null);
};

Student.findOneAndUpdate = function(query, update, options) {
    const index = global.inMemoryDb.students.findIndex(s => s.studentId === query.studentId);
    if (index !== -1) {
        global.inMemoryDb.students[index] = { ...global.inMemoryDb.students[index], ...update };
        return Promise.resolve(global.inMemoryDb.students[index]);
    }
    return Promise.resolve(null);
};

Student.countDocuments = function(query) {
    let count = global.inMemoryDb.students;
    if (query && query.isActive !== undefined) {
        count = count.filter(s => s.isActive === query.isActive).length;
    }
    return Promise.resolve(count);
};

module.exports = Student;