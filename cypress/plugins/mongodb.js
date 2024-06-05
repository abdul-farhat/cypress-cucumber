// cypress/plugins/mongodb.js

const { MongoClient } = require('mongodb');

async function addRecord({ url, dbName, collectionName, record }) {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(record);

    if (!result || !result.insertedId) {
      throw new Error('Failed to insert record');
    }

    const insertedRecord = await collection.findOne({ _id: result.insertedId });

    return insertedRecord;
  } catch (error) {
    console.error('Error inserting record:', error);
    throw error;
  } finally {
    await client.close();
  }
}

async function clearCollection({ url, dbName, collectionName }) {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.deleteMany({});

    if (result.deletedCount === 0) {
      console.warn(`No documents found in collection ${collectionName}`);
    }

    return { deletedCount: result.deletedCount };
    
  } catch (error) {
    console.error('Error clearing collection:', error);
    throw error;
  } finally {
    await client.close();
  }
}

module.exports = (on) => {
  on('task', {
    addRecord,
    clearCollection
  });
};
