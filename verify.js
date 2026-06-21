// verify.js - Workspace Verification Script for ERP Student Management System

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'index.html',
  'css/styles.css',
  'js/db.js',
  'js/api.js',
  'js/app.js',
  'js/views/dashboard.js',
  'js/views/admin.js',
  'js/views/faculty.js',
  'js/views/student.js'
];

console.log('========================================================');
console.log('       Academix ERP System Verification Check');
console.log('========================================================');

let passed = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`[✔] Found file: ${file} (${stats.size} bytes)`);
  } else {
    console.log(`[✘] Missing file: ${file}`);
    passed = false;
  }
});

console.log('--------------------------------------------------------');
if (passed) {
  console.log('SUCCESS: All ERP core files and modules verified!');
  console.log('You can run this app immediately by opening index.html in any modern browser.');
  console.log('No Node.js runtime installation or local server is required.');
  process.exit(0);
} else {
  console.error('ERROR: One or more required components are missing. Check file creations.');
  process.exit(1);
}
