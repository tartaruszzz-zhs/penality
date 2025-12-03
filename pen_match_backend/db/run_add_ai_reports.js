const db = require('./connection');
const fs = require('fs');
const path = require('path');

async function addAiReportsTable() {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'add_ai_reports.sql'), 'utf8');
        await db.query(sql);
        console.log('✓ ai_reports table created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

addAiReportsTable();
