const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const dbConfig = {
    host: 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '3acRgbTAZnJx7og.root',
    password: 'nw99N0tYGdialNDh',
    database: 'test',
    connectTimeout: 30000,
    ssl: {
        rejectUnauthorized: false
    }
};

async function testConnection() {
    console.log('🔌 Testing connection to TiDB Cloud...');
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   Port: ${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}`);

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connection successful!');

        const [rows] = await connection.query('SELECT VERSION() as version');
        console.log(`   Database version: ${rows[0].version}`);

        await connection.end();
        return true;
    } catch (error) {
        console.error('❌ Connection failed:');
        console.error(`   Error code: ${error.code}`);
        console.error(`   Error message: ${error.message}`);
        return false;
    }
}

async function initSchema(connection) {
    console.log('\n� Reading and executing schema.sql...');
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    const statements = schemaSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.toUpperCase().startsWith('USE'));

    for (const statement of statements) {
        try {
            await connection.query(statement);
        } catch (error) {
            if (!error.message.includes('already exists')) {
                throw error;
            }
        }
    }

    console.log('✅ Schema created successfully!');
}

async function initSeedData(connection) {
    console.log('\n🌱 Reading and executing seed.sql...');
    const seedPath = path.join(__dirname, 'db', 'seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    const statements = seedSql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.toUpperCase().startsWith('USE'));

    for (const statement of statements) {
        try {
            await connection.query(statement);
        } catch (error) {
            if (!error.message.includes('Duplicate entry')) {
                console.warn(`⚠️  Warning: ${error.message}`);
            }
        }
    }

    console.log('✅ Seed data inserted successfully!');
}

async function main() {
    const isConnected = await testConnection();

    if (!isConnected) {
        console.log('\n❌ Cannot proceed without a valid connection.');
        process.exit(1);
    }

    console.log('\n🚀 Starting database initialization...');

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        await initSchema(connection);
        await initSeedData(connection);

        console.log('\n✨ Database initialization completed successfully!');
        console.log('You can now deploy your backend to Render.');

    } catch (error) {
        console.error('\n❌ Initialization failed:', error.message);
        throw error;
    } finally {
        if (connection) await connection.end();
    }
}

main();
