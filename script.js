// ==========================================
// STUDENT ATTENDANCE TRACKER
// ==========================================

// Minimum attendance required for exam
const REQUIRED_ATTENDANCE = 75;

// Load saved students
let students = JSON.parse(localStorage.getItem("students")) || [];


// ==========================================
// ADD STUDENT
// ==========================================

document.getElementById("studentForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();

    const usn = document
        .getElementById("studentUSN")
        .value
        .trim()
        .toUpperCase();


    // Check empty fields
    if (name === "" || usn === "") {
        alert("Please enter all details.");
        return;
    }


    // ==========================================
    // USN VALIDATION
    // ==========================================
    // Examples:
    // 4MM23CS001
    // 2GI23CS076
    // 1AB24EC025

    const usnPattern =
        /^[0-9][A-Z]{2}[0-9]{2}[A-Z]{2,4}[0-9]{3}$/;


    if (!usnPattern.test(usn)) {

        alert(
            "Please enter a valid USN.\n\n" +
            "Examples:\n" +
            "4MM23CS001\n" +
            "2GI23CS076"
        );

        return;
    }


    // ==========================================
    // CHECK DUPLICATE USN
    // ==========================================

    const existingStudent = students.find(
        student => student.usn === usn
    );


    if (existingStudent) {

        alert("This USN is already registered.");

        return;
    }


    // ==========================================
    // CREATE STUDENT
    // ==========================================

    const student = {

        id: Date.now(),

        name: name,

        usn: usn,

        present: 0,

        absent: 0

    };


    // Add student
    students.push(student);


    // Save data
    saveData();


    // Clear form
    document.getElementById("studentForm").reset();


    // Update page
    displayStudents();


    alert("Student added successfully!");

});


// ==========================================
// MARK ATTENDANCE
// ==========================================

function markAttendance() {

    const studentId =
        document.getElementById("studentSelect").value;

    const status =
        document.getElementById("attendanceStatus").value;


    // Check selection
    if (studentId === "" || status === "") {

        alert(
            "Please select a student and attendance status."
        );

        return;
    }


    // Find student
    const student = students.find(
        student => student.id == studentId
    );


    if (!student) {

        alert("Student not found.");

        return;
    }


    // ==========================================
    // UPDATE ATTENDANCE
    // ==========================================

    if (status === "Present") {

        student.present++;

    } else if (status === "Absent") {

        student.absent++;

    }


    // Save data
    saveData();


    // Update table
    displayStudents();


    // Reset attendance form
    document.getElementById("studentSelect").value = "";

    document.getElementById("attendanceStatus").value = "";


    alert("Attendance marked successfully!");

}


// ==========================================
// DISPLAY STUDENTS
// ==========================================

function displayStudents() {

    const table =
        document.getElementById("studentTable");

    const select =
        document.getElementById("studentSelect");


    // Clear old data
    table.innerHTML = "";

    select.innerHTML =
        '<option value="">Select Student</option>';


    // ==========================================
    // DISPLAY EACH STUDENT
    // ==========================================

    students.forEach(student => {


        // ==========================================
        // ADD STUDENT TO DROPDOWN
        // ==========================================

        const option =
            document.createElement("option");


        option.value = student.id;


        option.textContent =
            `${student.name} - ${student.usn}`;


        select.appendChild(option);


        // ==========================================
        // CALCULATE ATTENDANCE
        // ==========================================

        const totalClasses =
            student.present + student.absent;


        let percentage = 0;


        if (totalClasses > 0) {

            percentage =
                (student.present / totalClasses) * 100;

        }


        // Round to 2 decimal places
        percentage = percentage.toFixed(2);


        // ==========================================
        // CHECK 75% ELIGIBILITY
        // ==========================================

        let eligibility;


        if (totalClasses === 0) {

            eligibility = `
                <span class="no-attendance">
                    No Attendance
                </span>
            `;

        } else if (Number(percentage) >= REQUIRED_ATTENDANCE) {

            eligibility = `
                <span class="eligible">
                    Eligible ✓
                </span>
            `;

        } else {

            eligibility = `
                <span class="not-eligible">
                    Not Eligible ✗
                </span>
            `;

        }


        // ==========================================
        // CREATE TABLE ROW
        // ==========================================

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${student.name}</td>

            <td>${student.usn}</td>

            <td class="present">
                ${student.present}
            </td>

            <td class="absent">
                ${student.absent}
            </td>

            <td>
                <strong>
                    ${percentage}%
                </strong>
            </td>

            <td>
                ${eligibility}
            </td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})">

                    Delete

                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// ==========================================
// DELETE STUDENT
// ==========================================

function deleteStudent(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmation) {
        return;
    }


    // Remove student
    students = students.filter(
        student => student.id !== id
    );


    // Save updated data
    saveData();


    // Update page
    displayStudents();

}


// ==========================================
// SAVE DATA
// ==========================================

function saveData() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}


// ==========================================
// LOAD DATA WHEN PAGE OPENS
// ==========================================

displayStudents();