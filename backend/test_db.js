const mongoose = require('mongoose');

const DB_URI = 'mongodb://nsaisiddharth05_db_user:FKsGKpTAbZrm23wT@ac-iokb8un-shard-00-00.pb9xu8w.mongodb.net:27017,ac-iokb8un-shard-00-01.pb9xu8w.mongodb.net:27017,ac-iokb8un-shard-00-02.pb9xu8w.mongodb.net:27017/?ssl=true&replicaSet=atlas-iokb8un-shard-0&authSource=admin&retryWrites=true&w=majority';

async function testConnection() {
    try {
        console.log('Testing direct connection to shards...');
        await mongoose.connect(DB_URI);
        console.log('✅ Connection Successful!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Failed:', err);
        process.exit(1);
    }
}

testConnection();
