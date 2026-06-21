const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Initialize empty database structure
const initialDB = {
  users: [],
  departments: [],
  faculty: [],
  students: [],
  courses: [],
  subjects: [],
  timetable: [],
  attendance: [],
  examinations: [],
  results: [],
  fees: [],
  notifications: [],
  audit_logs: []
};

function ensureDBExists() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), 'utf8');
  }
}

class Database {
  constructor() {
    ensureDBExists();
  }

  read() {
    try {
      ensureDBExists();
      const content = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error reading database file, resetting to initial state:', error);
      return initialDB;
    }
  }

  write(data) {
    try {
      ensureDBExists();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error('Error writing to database file:', error);
      return false;
    }
  }

  getCollection(collectionName) {
    const db = this.read();
    return db[collectionName] || [];
  }

  find(collectionName, predicate = () => true) {
    const collection = this.getCollection(collectionName);
    return collection.filter(predicate);
  }

  findOne(collectionName, predicate) {
    const collection = this.getCollection(collectionName);
    return collection.find(predicate);
  }

  insert(collectionName, item) {
    const db = this.read();
    if (!db[collectionName]) {
      db[collectionName] = [];
    }
    const collection = db[collectionName];
    
    // Generate simple incremental auto-increment ID
    const maxId = collection.reduce((max, current) => (current.id > max ? current.id : max), 0);
    const newItem = { ...item, id: maxId + 1 };
    
    collection.push(newItem);
    this.write(db);
    return newItem;
  }

  update(collectionName, id, updates) {
    const db = this.read();
    if (!db[collectionName]) return null;
    
    const collection = db[collectionName];
    const index = collection.findIndex(item => item.id === parseInt(id));
    if (index === -1) return null;
    
    // Keep id unchanged, merge other updates
    const updatedItem = { ...collection[index], ...updates, id: collection[index].id };
    collection[index] = updatedItem;
    
    this.write(db);
    return updatedItem;
  }

  delete(collectionName, id) {
    const db = this.read();
    if (!db[collectionName]) return false;
    
    const collection = db[collectionName];
    const index = collection.findIndex(item => item.id === parseInt(id));
    if (index === -1) return false;
    
    collection.splice(index, 1);
    this.write(db);
    return true;
  }

  logActivity(userId, action, details) {
    this.insert('audit_logs', {
      user_id: userId,
      action,
      details,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new Database();
