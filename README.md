# Employee Management System

A full-stack Employee Management System developed using **React.js, Spring Boot, Spring Security, JWT, Spring Data JPA, Hibernate, and MySQL**.

The application provides role-based access for **Admin, HR, and Employee** users and helps manage employees, departments, attendance, leaves, and user accounts through a secure web-based interface.

---

## 🚀 Project Overview

The Employee Management System is designed to simplify employee-related operations within an organization.

The system provides different access levels based on the logged-in user's role:

- **Admin** – Complete system management
- **HR** – Employee and HR-related operations
- **Employee** – Access to personal information, attendance, and leaves

The frontend is developed using **React.js**, while the backend is developed using **Spring Boot REST APIs**. **MySQL** is used as the database and **JWT-based authentication** is used to secure the application.

---

## ✨ Features

### 🔐 Authentication & Security

- User login and authentication
- JWT-based authentication
- Spring Security integration
- Password encryption using BCrypt
- Role-based authorization
- Protected routes
- Forgot password functionality
- OTP-based password reset
- Secure API access

---

### 👨‍💼 Employee Management

- Add new employees
- View employee details
- Search employees
- Filter employees
- Edit employee information
- Delete employees
- Manage employee code
- Manage department and designation
- Manage salary
- Manage joining date
- Manage employee status

Employee information includes:

- Employee Code
- Name
- Email
- Phone
- Department
- Designation
- Salary
- Joining Date
- Status

---

### 🏢 Department Management

- Add departments
- View departments
- Edit departments
- Delete departments
- Store department descriptions
- Display department information

---

### 👤 User Management

The system maintains authentication users separately from employee records.

Admin can:

- Create Employee users
- Create HR users
- Edit users
- Delete users
- Manage user roles

HR can:

- Create Employee users
- Edit Employee users
- Delete Employee users

Employees cannot manage user accounts.

> The system maintains a separate `users` table for login/security information and an `employees` table for employee/business information.

---

### 📝 Leave Management

Employees can:

- Apply for leave
- View their leave requests
- Track leave status

Admin and HR can:

- View leave requests
- Approve leaves
- Reject leaves
- Delete leave records

Leave statuses include:

- Pending
- Approved
- Rejected

---

### 🕐 Attendance Management

The application provides attendance functionality for managing employee attendance records.

Features include:

- Attendance tracking
- Attendance records
- Attendance settings
- Role-based attendance access

---

### 📊 Dashboard

The dashboard provides an overview of important employee-management information.

It includes information such as:

- Total Employees
- Active Employees
- Departments
- Pending Leaves
- Attendance-related information

Dashboard access is controlled according to the user's role.

---

### 👤 My Profile

Employees can view their personal profile information.

Profile information includes:

- Name
- Email
- Employee Code
- Phone
- Department
- Designation
- Joining Date
- Status

---

## 👥 User Roles & Permissions

| Feature | Admin | HR | Employee |
|---|:---:|:---:|:---:|
| Dashboard | ✅ | ✅ | ✅ |
| View Employees | ✅ | ✅ | Limited |
| Add Employee | ✅ | ✅ | ❌ |
| Edit Employee | ✅ | ✅ | ❌ |
| Delete Employee | ✅ | ✅ | ❌ |
| Manage Departments | ✅ | ✅ | ❌ |
| Apply Leave | ✅ | ✅ | ✅ |
| View Own Leaves | ✅ | ✅ | ✅ |
| Approve/Reject Leaves | ✅ | ✅ | ❌ |
| Attendance | ✅ | ✅ | Own |
| User Management | ✅ | Limited | ❌ |
| Create HR User | ✅ | ❌ | ❌ |
| Create Employee User | ✅ | ✅ | ❌ |
| Create Admin User | ❌ | ❌ | ❌ |
| Delete Admin User | ❌ | ❌ | ❌ |

---

## 🛠️ Technologies Used

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Vite
- Axios
- React Router

### Backend

- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- REST APIs
- Maven

### Database

- MySQL

### Development Tools

- Visual Studio Code
- Spring Tool Suite (STS)
- Postman
- Git
- GitHub

---

## 🏗️ Project Architecture

```text
Employee-Management-System
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend
│   ├── src
│   │   ├── main
│   │   │   ├── java
│   │   │   │   └── com.example.backend
│   │   │   │       ├── controller
│   │   │   │       ├── dto
│   │   │   │       ├── entity
│   │   │   │       ├── exception
│   │   │   │       ├── repository
│   │   │   │       ├── security
│   │   │   │       └── service
│   │   │   └── resources
│   │   │       └── application.properties
│   │   └── test
│   ├── pom.xml
│   └── mvnw
│
├── .gitignore
└── README.md

## 🔄 How the System Works
The application follows a full-stack architecture where the React frontend communicates with the Spring Boot backend through REST APIs.
User
 │
 ▼
React.js Frontend
 │
 │ Axios / HTTP Requests
 ▼
Spring Boot REST API
 │
 ▼
Service Layer
 │
 ▼
Repository Layer
 │
 ▼
MySQL Database

The frontend is responsible for the user interface and user interaction.

The backend handles:
- Business logic
- Authentication
- Authorization
- Validation
- Database operations
- REST API processing
The database stores application data such as employees, users, departments, leaves, and attendance records.

🔐 Authentication Flow
The application uses JWT-based authentication.
The login process works as follows:

User enters Email & Password
           │
           ▼
      React Login Page
           │
           ▼
   Spring Boot Auth API
           │
           ▼
 Validate User Credentials
           │
           ▼
   Generate JWT Token
           │
           ▼
 React Stores Authentication
           │
           ▼
 Protected API Requests

The JWT token is used to authenticate protected requests.
Spring Security checks the user's authentication and role before allowing access to protected resources.

👥** Role-Based Access Control**
The application uses three main roles:
Admin
Admin has the highest level of access.

Admin can:
- Manage employees
- Manage departments
- Manage users
- Create HR users
- Create Employee users
- Manage leaves
- Approve/reject leaves
- Manage attendance
- Access dashboard
- Edit and delete operational records
The system does not allow creation of another Admin user.
The Admin account is also protected from deletion.
HR
HR handles employee and HR-related operations.

HR can:
- Add employees
- Edit employees
- Delete employees
- View employees
- Manage departments
- Create Employee login users
- Edit Employee users
- Delete Employee users
- Manage leaves
- Approve/reject leaves
- Manage attendance
- Access dashboard


HR cannot:
- Create another HR user
- Create an Admin user
- Delete the Admin user
- Manage Admin accounts
Employee
Employees have limited access to the system.


Employees can:
- Login
- Access dashboard
- View their profile
- View their employee information
- View their attendance
- Apply for leave
- View their own leave requests
- Track leave status


Employees cannot:
- Add employees
- Edit employees
- Delete employees
- Manage departments
- Manage users
- Approve/reject leaves


👨‍💼 Employee Management
Employee Management is used by Admin and HR to maintain employee information.
The system supports:
- Creating employees
- Updating employees
- Searching employees
- Filtering employees
- Viewing employee details
- Deleting employees
Each employee contains information such as:
Employee Code
Name
Email
Phone
Department
Designation
Salary
Joining Date
Status

Employee status can be used to identify whether an employee is currently active or inactive.


🏢 Department Management
The Department Management module allows Admin and HR to manage organizational departments.
Department information includes:
Department ID
Department Name
Description

The system supports:
- Creating departments
- Viewing departments
- Updating departments
- Deleting departments


👤 User Management
User Management is responsible for authentication and login accounts.
The application intentionally keeps user records separate from employee records.
Users Table
The users table stores authentication-related information such as:
User ID
Name
Email
Password
Role
Employee ID

Employees Table
The employees table stores business-related employee information such as:
Employee ID
Employee Code
Name
Email
Phone
Department
Designation
Salary
Joining Date
Status

For an Employee login, the users.employee_id field connects the login account with the corresponding employee record.
Admin and HR accounts can exist without an employee record.
🔗 User and Employee Relationship
The application follows a separate creation flow.
Add Employee
The Employee Management module creates the employee business record.
Add Employee
      │
      ▼
employees table

Add User
The User Management module creates the authentication/login account.
Add User
      │
      ▼
users table

For an Employee user, the login account is linked to the employee record through:
users.employee_id → employees.id

This separation makes authentication data independent from employee business information.


📝 Leave Management
The Leave Management module allows employees to request leave and allows Admin and HR to manage those requests.
Employee
Employees can:
- Apply for leave
- View their own leave requests
- Track leave status
Admin / HR
Admin and HR can:
- View leave requests
- Approve leave
- Reject leave
- Delete leave records
Leave status:
Pending
Approved
Rejected

🕐 Attendance Management
The Attendance module is used to manage employee attendance information.
The system includes:
- Attendance records
- Attendance tracking
- Attendance settings
- Role-based attendance access
Admin and HR can manage attendance-related operations.
Employees can access their own attendance information.


📊 Dashboard
The dashboard provides a summary of important information.
Depending on the user's role, the dashboard can display information such as:
- Total Employees
- Active Employees
- Departments
- Pending Leaves
- Attendance information
The dashboard provides a quick overview of the current system data.


🔄 Data Synchronization
The system maintains synchronization between user login information and the linked employee information.
For example, when an employee's:
- Name
- Email
is updated through Employee Management, the linked user information is also updated.
Similarly, when the linked Employee user's name or email is updated through User Management, the corresponding employee information is synchronized.
This helps prevent inconsistent information between:
users
   ↕
employees


🧩 Backend Architecture
The Spring Boot backend follows a layered architecture.
Controller
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
Database

Controller Layer
The Controller layer handles HTTP requests and responses.
Responsibilities include:
- Receiving API requests
- Calling service methods
- Returning API responses
Service Layer
The Service layer contains the main business logic.
Responsibilities include:
- Validation
- Role checking
- Business rules
- Data processing
- Calling repositories
Repository Layer
The Repository layer communicates with the database using Spring Data JPA.
Repositories provide operations such as:
- Save
- Find
- Update
- Delete
- Search
Entity Layer
Entities represent database tables.
Examples include:
- User
- Employee
- Department
- Leave
- Attendance
- Attendance Settings
- Password Reset OTP


🌐 Frontend Architecture
The React frontend is organized into reusable components, pages, context, and services.
src
│
├── components
├── context
├── pages
├── services
├── App.jsx
├── App.css
├── index.css
└── main.jsx

Components
Reusable UI components such as:
- Navbar
- Sidebar
- Toast notifications
are maintained inside the components folder.
Pages
Application screens such as:
- Login
- Register
- Dashboard
- Employees
- Employee Details
- Add Employee
- Edit Employee
- Departments
- Users
- Leaves
- My Profile
- Attendance
are maintained inside the pages folder.
Services
The services folder handles communication between the React application and backend APIs.
Axios is used for HTTP requests.


🗄️ Database Design
The application uses MySQL as the relational database.
Main database tables include:
users
employees
departments
leaves
attendance
attendance_settings
password_reset_otp

The database is accessed by Spring Data JPA and Hibernate.


🔗 Database Relationship
The main relationship between authentication and employee information is:
users
  │
  │ employee_id
  ▼
employees

This allows an Employee login account to be connected with the corresponding employee record.
Other modules use employee information for:
- Attendance
- Leaves
- Employee management
- User management


⚠️ Validation & Error Handling
The application contains validation at both frontend and backend levels.
Validation includes:
- Required fields
- Email validation
- Duplicate email checking
- Duplicate employee code checking
- Employee selection validation
- Role validation
- Permission validation
- Login validation
The backend also provides error messages when an operation is not allowed.
The frontend displays user-friendly success and error notifications.


🔔 User Notifications
The frontend uses reusable Toast notifications for displaying important messages.
Toast notifications are used for events such as:
- Successful operations
- Failed operations
- Validation errors
- Restricted actions
- Delete confirmations/results
This provides a better user experience compared to relying only on browser alerts.


🔒 Password Security
Passwords are not stored as plain text.
The backend uses BCrypt password encoding before storing passwords in the database.
User Password
      │
      ▼
 BCrypt Encryption
      │
      ▼
Database

During login, Spring Security validates the entered password against the encrypted password.


🔑 Forgot Password
The application provides forgot-password functionality.
The general process is:
Enter Email
     │
     ▼
Generate OTP
     │
     ▼
Send OTP
     │
     ▼
Verify OTP
     │
     ▼
Reset Password

The password reset functionality uses email-based OTP verification.


📡 API Communication
The React frontend communicates with the Spring Boot backend using HTTP requests.
Axios is used for API communication.
Example flow:
React Component
      │
      ▼
Axios Request
      │
      ▼
Spring Boot REST Controller
      │
      ▼
Service Layer
      │
      ▼
Repository
      │
      ▼
MySQL

The backend returns the required response to the frontend.


🧪 API Testing
Postman is used for testing backend REST APIs.
API testing includes:
- Authentication APIs
- Employee APIs
- User APIs
- Department APIs
- Leave APIs
- Attendance APIs
Postman helps verify backend functionality before connecting or testing it through the React frontend.


⚙️ Project Setup
Follow the steps below to run the project locally.
1. Clone the Repository
git clone https://github.com/YOUR-USERNAME/Employee-Management-System.git

Move into the project directory:
cd Employee-Management-System

🗄️ 2. Create MySQL Database
Open MySQL and create the database:
CREATE DATABASE employee_management;

The application uses this database for storing employee management data.

🔐 3. Configure Environment Variables
The application does not store real database or email passwords directly in the GitHub repository.
Configure the following environment variables on your local machine:
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_gmail_app_password

The backend reads these values from the environment.
Do not upload real passwords, API keys, database credentials, or email credentials to GitHub.

⚙️ 4. Backend Configuration
The backend uses Spring Boot and Maven.
Navigate to the backend directory:
cd backend

Run the Spring Boot application using:
Windows
mvnw.cmd spring-boot:run

The backend will run on:
http://localhost:8080

💻 5. Frontend Setup
Open another terminal and navigate to the frontend:
cd frontend

Install the required dependencies:
npm install

Start the React development server:
npm run dev

The frontend will normally run on:
http://localhost:5173

▶️ Running the Complete Application
Start both applications.
Backend
Spring Boot
http://localhost:8080

Frontend
React + Vite
http://localhost:5173

The complete application works as:
Browser
   │
   ▼
React Frontend
   │
   │ HTTP / Axios
   ▼
Spring Boot Backend
   │
   │ JPA / Hibernate
   ▼
MySQL Database

🔄 Complete Application Flow
User
 │
 ▼
Login Page
 │
 ▼
Authentication
 │
 ▼
JWT Token
 │
 ▼
Role Verification
 │
 ├── Admin
 │     ├── Dashboard
 │     ├── Employees
 │     ├── Departments
 │     ├── Users
 │     ├── Leaves
 │     └── Attendance
 │
 ├── HR
 │     ├── Dashboard
 │     ├── Employees
 │     ├── Departments
 │     ├── Users
 │     ├── Leaves
 │     └── Attendance
 │
 └── Employee
       ├── Dashboard
       ├── My Profile
       ├── My Attendance
       └── My Leaves

🛡️ Security Design
The application implements multiple security mechanisms:
- JWT authentication
- Spring Security
- BCrypt password encryption
- Role-based authorization
- Protected backend APIs
- Protected frontend routes
- Permission-based operations
- Admin account protection
The backend validates the authenticated user's role before allowing restricted operations.


📌 Important Design Decisions
Separate Users and Employees
The system intentionally uses separate users and employees tables.
This allows authentication information and business employee information to be managed independently.
Separate Employee and User Creation
Creating an employee does not automatically create a login account.
The system provides two separate flows:
Add Employee
      ↓
Employee Record

Add User
      ↓
Login Account

For Employee users, the login account can be linked to the corresponding employee.
Role Restrictions
The system prevents unauthorized users from performing restricted operations.
For example:
- Employee cannot create users.
- Employee cannot modify employees.
- HR cannot create another HR.
- HR cannot create an Admin.
- Admin cannot create another Admin.
- Admin cannot be deleted through normal user management.


📈 Future Enhancements
The project can be further improved with features such as:
- Employee profile photo
- Advanced attendance reports
- Monthly salary/payroll management
- Employee performance management
- Email notifications
- Export reports to PDF
- Export employee data to Excel
- Advanced dashboard charts
- Search and pagination improvements
- Audit logs
- Two-factor authentication
- Cloud deployment
- Docker support
- Automated testing
- Production database configuration


🎯 Learning Outcomes
This project helped in understanding and implementing:
- React.js
- Component-based UI development
- React Router
- React state management
- Axios API integration
- REST APIs
- Java
- Spring Boot
- Spring Security
- JWT authentication
- Role-based authorization
- BCrypt password encryption
- Spring Data JPA
- Hibernate
- MySQL
- Entity and repository design
- Service-layer business logic
- DTO concepts
- Exception handling
- API testing using Postman
- Git and GitHub
- Full-stack application architecture

🧑‍💻 Development Tools
The project was developed using:
Frontend:
React.js
Vite
JavaScript
HTML5
CSS3
Axios
React Router

Backend:
Java
Spring Boot
Spring Security
JWT
Spring Data JPA
Hibernate
Maven

🌐 Application URLs
During local development:
Frontend
http://localhost:5173

Backend
http://localhost:8080

⭐ Conclusion
The Employee Management System is a complete full-stack project demonstrating how a modern web application can be developed using React.js, Spring Boot, Spring Security, JWT, Hibernate, and MySQL.
The project demonstrates frontend development, backend REST API development, database management, authentication, authorization, role-based access control, and full-stack integration.
It is designed as a practical portfolio project and demonstrates the implementation of a real-world employee management application.
