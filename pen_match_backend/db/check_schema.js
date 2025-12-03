const db = require('./connection');

async function checkSchema() {
    try {
        const [columns] = await db.query('SHOW COLUMNS FROM users');
        console.log('Users table columns:', columns.map(c => c.Field));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkSchema();
