const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const db = require('./db');

async function seed() {
  console.log('Starting database seeding...');
  
  // Clear existing database
  const emptyDB = {
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
  db.write(emptyDB);

  // Helper to hash passwords
  const salt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash('admin123', salt);
  const facultyHash = await bcrypt.hash('faculty123', salt);
  const studentHash = await bcrypt.hash('student123', salt);

  // 1. Seed Users
  console.log('Seeding Users...');
  const users = [
    { id: 1, username: 'admin', password_hash: adminHash, role: 'admin', profile_completed: true },
    { id: 2, username: 'faculty1', password_hash: facultyHash, role: 'faculty', profile_completed: true },
    { id: 3, username: 'faculty2', password_hash: facultyHash, role: 'faculty', profile_completed: true },
    { id: 4, username: 'student1', password_hash: studentHash, role: 'student', profile_completed: true },
    { id: 5, username: 'student2', password_hash: studentHash, role: 'student', profile_completed: true },
    { id: 6, username: 'student3', password_hash: studentHash, role: 'student', profile_completed: true }
  ];
  users.forEach(u => db.insert('users', u));

  // 2. Seed Departments
  console.log('Seeding Departments...');
  const departments = [
    { id: 1, name: 'Computer Science and Engineering', code: 'CSE', head_id: 1 },
    { id: 2, name: 'Electronics and Communication Engineering', code: 'ECE', head_id: 2 }
  ];
  departments.forEach(d => db.insert('departments', d));

  // 3. Seed Faculty
  console.log('Seeding Faculty...');
  const faculty = [
    {
      id: 1,
      user_id: 2,
      name: 'Dr. Sarah Jenkins',
      email: 'sjenkins@university.edu',
      phone: '+1 (555) 019-2834',
      department_id: 1,
      designation: 'Professor & Head',
      joining_date: '2018-08-15'
    },
    {
      id: 2,
      user_id: 3,
      name: 'Dr. Robert Carter',
      email: 'rcarter@university.edu',
      phone: '+1 (555) 014-9988',
      department_id: 2,
      designation: 'Associate Professor',
      joining_date: '2020-01-10'
    }
  ];
  faculty.forEach(f => db.insert('faculty', f));

  // Update head_ids for departments to match actual faculty ids
  db.update('departments', 1, { head_id: 1 });
  db.update('departments', 2, { head_id: 2 });

  // 4. Seed Courses
  console.log('Seeding Courses...');
  const courses = [
    { id: 1, code: 'CS-BTECH', name: 'Bachelor of Technology in Computer Science', department_id: 1, credits: 160 },
    { id: 2, code: 'EC-BTECH', name: 'Bachelor of Technology in Electronics', department_id: 2, credits: 160 }
  ];
  courses.forEach(c => db.insert('courses', c));

  // 5. Seed Students
  console.log('Seeding Students...');
  const students = [
    {
      id: 1,
      user_id: 4,
      roll_no: 'CSE-2023-001',
      name: 'Alice Vance',
      email: 'alice.vance@student.edu',
      phone: '+1 (555) 012-3456',
      department_id: 1,
      admission_year: 2023,
      semester: 4,
      status: 'active'
    },
    {
      id: 2,
      user_id: 5,
      roll_no: 'CSE-2023-002',
      name: 'Bob Miller',
      email: 'bob.miller@student.edu',
      phone: '+1 (555) 012-7890',
      department_id: 1,
      admission_year: 2023,
      semester: 4,
      status: 'active'
    },
    {
      id: 3,
      user_id: 6,
      roll_no: 'ECE-2023-001',
      name: 'Charlie Smith',
      email: 'charlie.smith@student.edu',
      phone: '+1 (555) 013-4455',
      department_id: 2,
      admission_year: 2023,
      semester: 4,
      status: 'active'
    }
  ];
  students.forEach(s => db.insert('students', s));

  // 6. Seed Subjects
  console.log('Seeding Subjects...');
  const subjects = [
    { id: 1, code: 'CS401', name: 'Design and Analysis of Algorithms', course_id: 1, faculty_id: 1, semester: 4 },
    { id: 2, code: 'CS402', name: 'Modern Web Engineering', course_id: 1, faculty_id: 1, semester: 4 },
    { id: 3, code: 'CS403', name: 'Database Management Systems', course_id: 1, faculty_id: 2, semester: 4 },
    { id: 4, code: 'EC401', name: 'Signals and Systems', course_id: 2, faculty_id: 2, semester: 4 },
    { id: 5, code: 'EC402', name: 'Microprocessors and Interfacing', course_id: 2, faculty_id: 2, semester: 4 }
  ];
  subjects.forEach(s => db.insert('subjects', s));

  // 7. Seed Timetable
  console.log('Seeding Timetable...');
  const timetable = [
    // CSE Timetable
    { id: 1, subject_id: 1, day_of_week: 'Monday', start_time: '09:00', end_time: '10:30', classroom: 'Room 301 (Block A)' },
    { id: 2, subject_id: 2, day_of_week: 'Monday', start_time: '11:00', end_time: '12:30', classroom: 'Lab 2 (Block C)' },
    { id: 3, subject_id: 3, day_of_week: 'Wednesday', start_time: '09:00', end_time: '10:30', classroom: 'Room 302 (Block A)' },
    { id: 4, subject_id: 1, day_of_week: 'Wednesday', start_time: '11:00', end_time: '12:30', classroom: 'Room 301 (Block A)' },
    { id: 5, subject_id: 2, day_of_week: 'Friday', start_time: '09:00', end_time: '10:30', classroom: 'Lab 2 (Block C)' },
    { id: 6, subject_id: 3, day_of_week: 'Friday', start_time: '14:00', end_time: '15:30', classroom: 'Room 302 (Block A)' },
    
    // ECE Timetable
    { id: 7, subject_id: 4, day_of_week: 'Tuesday', start_time: '09:00', end_time: '10:30', classroom: 'Room 105 (Block B)' },
    { id: 8, subject_id: 5, day_of_week: 'Tuesday', start_time: '11:00', end_time: '12:30', classroom: 'Lab 5 (Block B)' },
    { id: 9, subject_id: 4, day_of_week: 'Thursday', start_time: '09:00', end_time: '10:30', classroom: 'Room 105 (Block B)' },
    { id: 10, subject_id: 5, day_of_week: 'Thursday', start_time: '11:00', end_time: '12:30', classroom: 'Lab 5 (Block B)' }
  ];
  timetable.forEach(t => db.insert('timetable', t));

  // 8. Seed Attendance
  console.log('Seeding Attendance...');
  const dates = [
    '2026-06-15', '2026-06-16', '2026-06-17', '2026-06-18', '2026-06-19',
    '2026-06-10', '2026-06-11', '2026-06-12'
  ];

  let attId = 1;
  // Alice (id:1) - high attendance
  // Bob (id:2) - mid attendance
  // Charlie (id:3) - high attendance
  dates.forEach((date) => {
    // Mon, Wed, Fri classes for CSE
    const day = new Date(date).getDay();
    if (day === 1 || day === 3 || day === 5) {
      // CS401
      db.insert('attendance', {
        id: attId++, student_id: 1, subject_id: 1, date, status: 'present', marked_by: 1
      });
      db.insert('attendance', {
        id: attId++, student_id: 2, subject_id: 1, date, status: Math.random() > 0.3 ? 'present' : 'absent', marked_by: 1
      });
      // CS402
      db.insert('attendance', {
        id: attId++, student_id: 1, subject_id: 2, date, status: 'present', marked_by: 1
      });
      db.insert('attendance', {
        id: attId++, student_id: 2, subject_id: 2, date, status: Math.random() > 0.2 ? 'present' : 'absent', marked_by: 1
      });
    }

    // Tue, Thu classes for ECE
    if (day === 2 || day === 4) {
      // EC401
      db.insert('attendance', {
        id: attId++, student_id: 3, subject_id: 4, date, status: 'present', marked_by: 2
      });
      // EC402
      db.insert('attendance', {
        id: attId++, student_id: 3, subject_id: 5, date, status: 'present', marked_by: 2
      });
    }
  });

  // 9. Seed Examinations
  console.log('Seeding Examinations...');
  const examinations = [
    { id: 1, subject_id: 1, name: 'Algorithms Internal Assessment 1', date: '2026-04-10', max_marks: 30, type: 'internal' },
    { id: 2, subject_id: 2, name: 'Web Engineering Midterm', date: '2026-05-15', max_marks: 50, type: 'midterm' },
    { id: 3, subject_id: 3, name: 'DBMS Internal Assessment 1', date: '2026-04-12', max_marks: 30, type: 'internal' },
    { id: 4, subject_id: 4, name: 'Signals & Systems Midterm', date: '2026-05-16', max_marks: 50, type: 'midterm' },
    { id: 5, subject_id: 5, name: 'Microprocessor Internal 1', date: '2026-04-14', max_marks: 30, type: 'internal' }
  ];
  examinations.forEach(e => db.insert('examinations', e));

  // 10. Seed Results
  console.log('Seeding Results...');
  const results = [
    // Alice
    { id: 1, examination_id: 1, student_id: 1, marks_obtained: 28, grade: 'A+', remarks: 'Excellent performance' },
    { id: 2, examination_id: 2, student_id: 1, marks_obtained: 46, grade: 'A', remarks: 'Strong concepts' },
    { id: 3, examination_id: 3, student_id: 1, marks_obtained: 27, grade: 'A', remarks: 'Good grasp' },
    
    // Bob
    { id: 4, examination_id: 1, student_id: 2, marks_obtained: 18, grade: 'C', remarks: 'Need to focus more on dynamic programming' },
    { id: 5, examination_id: 2, student_id: 2, marks_obtained: 35, grade: 'B', remarks: 'Decent performance' },
    { id: 6, examination_id: 3, student_id: 2, marks_obtained: 22, grade: 'B+', remarks: 'Solid effort' },

    // Charlie
    { id: 7, examination_id: 4, student_id: 3, marks_obtained: 42, grade: 'A', remarks: 'Very good' },
    { id: 8, examination_id: 5, student_id: 3, marks_obtained: 25, grade: 'A', remarks: 'Good logic' }
  ];
  results.forEach(r => db.insert('results', r));

  // 11. Seed Fees
  console.log('Seeding Fees...');
  const fees = [
    { id: 1, student_id: 1, amount: 2500.00, due_date: '2026-07-01', status: 'paid', paid_amount: 2500.00, payment_date: '2026-06-10' },
    { id: 2, student_id: 2, amount: 2500.00, due_date: '2026-07-01', status: 'partial', paid_amount: 1500.00, payment_date: '2026-06-14' },
    { id: 3, student_id: 3, amount: 2400.00, due_date: '2026-07-01', status: 'unpaid', paid_amount: 0.00, payment_date: null }
  ];
  fees.forEach(f => db.insert('fees', f));

  // 12. Seed Notifications
  console.log('Seeding Notifications...');
  const notifications = [
    { id: 1, sender_id: 1, recipient_role: 'all', title: 'Summer Academic Term Starting Date', message: 'The official starting date for the upcoming academic semester will be July 15, 2026. Make sure to complete registrations by June 30.', timestamp: new Date().toISOString() },
    { id: 2, sender_id: 1, recipient_role: 'student', title: 'Fee Payment Reminder', message: 'This is a reminder that the tuition fee for the current semester is due by July 01, 2026. Late fees will apply after the deadline.', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: 3, sender_id: 2, recipient_role: 'faculty', title: 'Department Faculty Meeting', message: 'All CSE department professors are requested to attend the curriculum review meeting on Wednesday at 2:00 PM in Conference Room B.', timestamp: new Date(Date.now() - 3600000 * 5).toISOString() }
  ];
  notifications.forEach(n => db.insert('notifications', n));

  // 13. Audit logs
  console.log('Seeding Audit Logs...');
  db.logActivity(1, 'Database Seeded', 'Initial mock data correctly loaded into database');
  
  console.log('Database successfully seeded!');
}

if (require.main === module) {
  seed().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
}

module.exports = seed;
