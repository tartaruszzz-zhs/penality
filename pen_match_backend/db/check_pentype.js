const db = require('./connection');

async function checkPenType() {
    try {
        const [types] = await db.query('SELECT type_name, slogan, LEFT(description, 50) as desc_preview FROM pen_types');
        console.log('Pen Types in Database:');
        console.table(types);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkPenType();
