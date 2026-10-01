/* =========================================
   PRONATIVE ATTENDANCE
   JAVASCRIPT
========================================= */


/* =========================================
   DATA
========================================= */

let participants =
    JSON.parse(
        localStorage.getItem(
            "pronativeParticipants"
        )
    ) || [];


let attendance =
    JSON.parse(
        localStorage.getItem(
            "pronativeAttendance"
        )
    ) || [];


/* =========================================
   ELEMENTS
========================================= */

const navItems =
    document.querySelectorAll(".nav-item");


const sections =
    document.querySelectorAll(
        ".content-section"
    );


const pageTitle =
    document.getElementById(
        "pageTitle"
    );


const currentDate =
    document.getElementById(
        "currentDate"
    );


const sidebar =
    document.getElementById(
        "sidebar"
    );


/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        showCurrentDate();

        document.getElementById(
            "attendanceDate"
        ).value = getToday();

        renderParticipants();

        updateClassDropdowns();

        renderAttendance();

        renderHistory();

        renderSummary();

        updateDashboard();

    }
);


/* =========================================
   NAVIGATION
========================================= */

navItems.forEach(
    function (item) {

        item.addEventListener(
            "click",
            function () {

                const target =
                    item.dataset.section;


                navItems.forEach(
                    function (nav) {

                        nav.classList.remove(
                            "active"
                        );

                    }
                );


                item.classList.add(
                    "active"
                );


                sections.forEach(
                    function (section) {

                        section.classList.remove(
                            "active-section"
                        );

                    }
                );


                const targetSection =
                    document.getElementById(
                        target
                    );


                if (targetSection) {

                    targetSection.classList.add(
                        "active-section"
                    );

                }


                const titles = {

                    dashboard:
                        "Dashboard",

                    participants:
                        "Participants",

                    attendance:
                        "Attendance",

                    history:
                        "Attendance History",

                    summary:
                        "Attendance Summary",

                    settings:
                        "Settings"

                };


                pageTitle.textContent =
                    titles[target];


                sidebar.classList.remove(
                    "open"
                );


                if (
                    target ===
                    "attendance"
                ) {

                    renderAttendance();

                }


                if (
                    target ===
                    "history"
                ) {

                    renderHistory();

                }


                if (
                    target ===
                    "summary"
                ) {

                    renderSummary();

                }


                if (
                    target ===
                    "dashboard"
                ) {

                    updateDashboard();

                }

            }
        );

    }
);


/* =========================================
   MOBILE MENU
========================================= */

document.getElementById(
    "mobileMenu"
).addEventListener(
    "click",
    function () {

        sidebar.classList.toggle(
            "open"
        );

    }
);


/* =========================================
   DATE
========================================= */

function getToday() {

    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


function showCurrentDate() {

    const date =
        new Date();


    currentDate.textContent =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

}


/* =========================================
   MODAL
========================================= */

const participantModal =
    document.getElementById(
        "participantModal"
    );


document.getElementById(
    "addParticipantBtn"
).addEventListener(
    "click",
    function () {

        openAddModal();

    }
);


document.getElementById(
    "closeModalBtn"
).addEventListener(
    "click",
    closeModal
);


document.getElementById(
    "cancelModalBtn"
).addEventListener(
    "click",
    closeModal
);


participantModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            participantModal
        ) {

            closeModal();

        }

    }
);


function openAddModal() {

    document.getElementById(
        "participantForm"
    ).reset();


    document.getElementById(
        "editParticipantId"
    ).value = "";


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Add Participant";


    participantModal.classList.add(
        "show"
    );

}


function closeModal() {

    participantModal.classList.remove(
        "show"
    );

}


/* =========================================
   PARTICIPANT FORM
========================================= */

document.getElementById(
    "participantForm"
).addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const editId =
            document.getElementById(
                "editParticipantId"
            ).value;


        const participantId =
            document.getElementById(
                "participantId"
            ).value.trim();


        const name =
            document.getElementById(
                "participantName"
            ).value.trim();


        const participantClass =
            document.getElementById(
                "participantClass"
            ).value.trim();


        const level =
            document.getElementById(
                "participantLevel"
            ).value;


        const phone =
            document.getElementById(
                "participantPhone"
            ).value.trim();


        if (
            !participantId ||
            !name ||
            !participantClass ||
            !level ||
            !phone
        ) {

            showNotification(
                "Please fill in all fields."
            );

            return;

        }


        if (!editId) {

            const duplicate =
                participants.some(
                    function (item) {

                        return (
                            item.participantId ===
                            participantId
                        );

                    }
                );


            if (duplicate) {

                showNotification(
                    "Participant ID already exists."
                );

                return;

            }


            participants.push({

                id:
                    Date.now().toString(),

                participantId:
                    participantId,

                name:
                    name,

                className:
                    participantClass,

                level:
                    level,

                phone:
                    phone

            });


            showNotification(
                "Participant added successfully."
            );

        } else {

            const index =
                participants.findIndex(
                    function (item) {

                        return (
                            item.id ===
                            editId
                        );

                    }
                );


            if (index !== -1) {

                participants[index] = {

                    id:
                        editId,

                    participantId:
                        participantId,

                    name:
                        name,

                    className:
                        participantClass,

                    level:
                        level,

                    phone:
                        phone

                };


                showNotification(
                    "Participant updated successfully."
                );

            }

        }


        saveData();

        renderParticipants();

        updateClassDropdowns();

        renderAttendance();

        renderHistory();

        renderSummary();

        updateDashboard();

        closeModal();

    }
);


/* =========================================
   RENDER PARTICIPANTS
========================================= */

function renderParticipants() {

    const tbody =
        document.getElementById(
            "participantTableBody"
        );


    const keyword =
        document.getElementById(
            "participantSearch"
        ).value
            .toLowerCase()
            .trim();


    const filtered =
        participants.filter(
            function (item) {

                return (

                    item.participantId
                        .toLowerCase()
                        .includes(
                            keyword
                        )

                    ||

                    item.name
                        .toLowerCase()
                        .includes(
                            keyword
                        )

                    ||

                    item.className
                        .toLowerCase()
                        .includes(
                            keyword
                        )

                );

            }
        );


    tbody.innerHTML = "";


    if (!filtered.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty">
                    No participants found.
                </td>
            </tr>
        `;

        return;

    }


    filtered.forEach(
        function (item, index) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${escapeHTML(
                        item.participantId
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.name
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.className
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.level
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        item.phone
                    )}
                </td>

                <td>

                    <div class="action-buttons">

                        <button
                            class="btn-small edit-btn"
                            onclick="editParticipant('${item.id}')"
                        >
                            ✏️
                        </button>

                        <button
                            class="btn-small delete-btn"
                            onclick="deleteParticipant('${item.id}')"
                        >
                            🗑️
                        </button>

                    </div>

                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


/* =========================================
   SEARCH PARTICIPANTS
========================================= */

document.getElementById(
    "participantSearch"
).addEventListener(
    "input",
    renderParticipants
);


/* =========================================
   EDIT PARTICIPANT
========================================= */

function editParticipant(id) {

    const participant =
        participants.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!participant) {
        return;
    }


    document.getElementById(
        "editParticipantId"
    ).value =
        participant.id;


    document.getElementById(
        "participantId"
    ).value =
        participant.participantId;


    document.getElementById(
        "participantName"
    ).value =
        participant.name;


    document.getElementById(
        "participantClass"
    ).value =
        participant.className;


    document.getElementById(
        "participantLevel"
    ).value =
        participant.level;


    document.getElementById(
        "participantPhone"
    ).value =
        participant.phone;


    document.getElementById(
        "modalTitle"
    ).textContent =
        "Edit Participant";


    participantModal.classList.add(
        "show"
    );

}


/* =========================================
   DELETE PARTICIPANT
========================================= */

function deleteParticipant(id) {

    const participant =
        participants.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!participant) {
        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to delete "${participant.name}"?`
        );


    if (!confirmed) {
        return;
    }


    participants =
        participants.filter(
            function (item) {

                return item.id !== id;

            }
        );


    attendance =
        attendance.filter(
            function (item) {

                return (
                    item.participantId !== id
                );

            }
        );


    saveData();

    renderParticipants();

    updateClassDropdowns();

    renderAttendance();

    renderHistory();

    renderSummary();

    updateDashboard();


    showNotification(
        "Participant deleted successfully."
    );

}


/* =========================================
   CLASS DROPDOWNS
========================================= */

function getClasses() {

    const classes =
        participants.map(
            function (item) {

                return item.className;

            }
        );


    return [
        ...new Set(classes)
    ].sort();

}


function updateClassDropdowns() {

    const attendanceClass =
        document.getElementById(
            "attendanceClass"
        );


    const historyClass =
        document.getElementById(
            "historyClass"
        );


    const oldAttendanceValue =
        attendanceClass.value;


    const oldHistoryValue =
        historyClass.value;


    attendanceClass.innerHTML =
        `
            <option value="">
                All Classes
            </option>
        `;


    historyClass.innerHTML =
        `
            <option value="">
                All Classes
            </option>
        `;


    getClasses().forEach(
        function (className) {

            const option1 =
                document.createElement(
                    "option"
                );


            option1.value =
                className;


            option1.textContent =
                className;


            attendanceClass.appendChild(
                option1
            );


            const option2 =
                document.createElement(
                    "option"
                );


            option2.value =
                className;


            option2.textContent =
                className;


            historyClass.appendChild(
                option2
            );

        }
    );


    attendanceClass.value =
        oldAttendanceValue;


    historyClass.value =
        oldHistoryValue;

}


/* =========================================
   ATTENDANCE
========================================= */

document.getElementById(
    "attendanceClass"
).addEventListener(
    "change",
    renderAttendance
);


document.getElementById(
    "attendanceDate"
).addEventListener(
    "change",
    renderAttendance
);


function renderAttendance() {

    const tbody =
        document.getElementById(
            "attendanceTableBody"
        );


    const date =
        document.getElementById(
            "attendanceDate"
        ).value;


    const selectedClass =
        document.getElementById(
            "attendanceClass"
        ).value;


    let list =
        [...participants];


    if (selectedClass) {

        list =
            list.filter(
                function (item) {

                    return (
                        item.className ===
                        selectedClass
                    );

                }
            );

    }


    tbody.innerHTML = "";


    if (!list.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty">
                    No participants available.
                </td>
            </tr>
        `;

        return;

    }


    list.forEach(
        function (participant, index) {

            const existing =
                attendance.find(
                    function (item) {

                        return (
                            item.participantId ===
                            participant.id
                            &&
                            item.date ===
                            date
                        );

                    }
                );


            const status =
                existing
                    ? existing.status
                    : "Present";


            const notes =
                existing
                    ? existing.notes
                    : "";


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${escapeHTML(
                        participant.name
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        participant.className
                    )}
                </td>

                <td>

                    <select
                        class="attendance-status"
                        data-id="${participant.id}"
                    >

                        <option
                            value="Present"
                            ${status === "Present"
                                ? "selected"
                                : ""}
                        >
                            Present
                        </option>

                        <option
                            value="Permission"
                            ${status === "Permission"
                                ? "selected"
                                : ""}
                        >
                            Permission
                        </option>

                        <option
                            value="Sick"
                            ${status === "Sick"
                                ? "selected"
                                : ""}
                        >
                            Sick
                        </option>

                        <option
                            value="Absent"
                            ${status === "Absent"
                                ? "selected"
                                : ""}
                        >
                            Absent
                        </option>

                    </select>

                </td>

                <td>

                    <input
                        type="text"
                        class="attendance-notes"
                        data-id="${participant.id}"
                        value="${escapeAttribute(
                            notes
                        )}"
                        placeholder="Notes..."
                    >

                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


/* =========================================
   SAVE ATTENDANCE
========================================= */

document.getElementById(
    "saveAttendanceBtn"
).addEventListener(
    "click",
    saveAttendance
);


function saveAttendance() {

    const date =
        document.getElementById(
            "attendanceDate"
        ).value;


    if (!date) {

        showNotification(
            "Please select a date."
        );

        return;

    }


    const statusInputs =
        document.querySelectorAll(
            ".attendance-status"
        );


    if (!statusInputs.length) {

        showNotification(
            "There are no participants to record."
        );

        return;

    }


    statusInputs.forEach(
        function (select) {

            const participantId =
                select.dataset.id;


            const status =
                select.value;


            const notesInput =
                document.querySelector(
                    `.attendance-notes[data-id="${participantId}"]`
                );


            const notes =
                notesInput
                    ? notesInput.value.trim()
                    : "";


            const existingIndex =
                attendance.findIndex(
                    function (item) {

                        return (
                            item.participantId ===
                            participantId
                            &&
                            item.date ===
                            date
                        );

                    }
                );


            const data = {

                id:
                    existingIndex >= 0
                        ? attendance[
                            existingIndex
                        ].id
                        :
                        Date.now().toString()
                        +
                        Math.random(),

                participantId:
                    participantId,

                date:
                    date,

                status:
                    status,

                notes:
                    notes

            };


            if (existingIndex >= 0) {

                attendance[
                    existingIndex
                ] = data;

            } else {

                attendance.push(data);

            }

        }
    );


    saveData();

    renderHistory();

    renderSummary();

    updateDashboard();


    showNotification(
        "Attendance saved successfully."
    );

}


/* =========================================
   HISTORY FILTER
========================================= */

document.getElementById(
    "historyName"
).addEventListener(
    "input",
    renderHistory
);


document.getElementById(
    "historyClass"
).addEventListener(
    "change",
    renderHistory
);


document.getElementById(
    "historyStatus"
).addEventListener(
    "change",
    renderHistory
);


document.getElementById(
    "historyDate"
).addEventListener(
    "change",
    renderHistory
);


/* =========================================
   RENDER HISTORY
========================================= */

function renderHistory() {

    const tbody =
        document.getElementById(
            "historyTableBody"
        );


    const keyword =
        document.getElementById(
            "historyName"
        ).value
            .toLowerCase()
            .trim();


    const selectedClass =
        document.getElementById(
            "historyClass"
        ).value;


    const selectedStatus =
        document.getElementById(
            "historyStatus"
        ).value;


    const selectedDate =
        document.getElementById(
            "historyDate"
        ).value;


    let list =
        attendance.map(
            function (record) {

                const participant =
                    participants.find(
                        function (item) {

                            return (
                                item.id ===
                                record.participantId
                            );

                        }
                    );


                return {

                    ...record,

                    participant:
                        participant || null

                };

            }
        );


    list =
        list.filter(
            function (item) {

                const name =
                    item.participant
                        ? item.participant.name
                        : "Deleted Participant";


                const className =
                    item.participant
                        ? item.participant.className
                        : "-";


                return (

                    name
                        .toLowerCase()
                        .includes(keyword)

                    &&

                    (
                        !selectedClass
                        ||
                        className ===
                        selectedClass
                    )

                    &&

                    (
                        !selectedStatus
                        ||
                        item.status ===
                        selectedStatus
                    )

                    &&

                    (
                        !selectedDate
                        ||
                        item.date ===
                        selectedDate
                    )

                );

            }
        );


    list.sort(
        function (a, b) {

            return b.date.localeCompare(
                a.date
            );

        }
    );


    tbody.innerHTML = "";


    if (!list.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    No attendance history found.
                </td>
            </tr>
        `;

        return;

    }


    list.forEach(
        function (item, index) {

            const name =
                item.participant
                    ? item.participant.name
                    : "Deleted Participant";


            const className =
                item.participant
                    ? item.participant.className
                    : "-";


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${formatDate(
                        item.date
                    )}
                </td>

                <td>
                    ${escapeHTML(name)}
                </td>

                <td>
                    ${escapeHTML(
                        className
                    )}
                </td>

                <td>

                    <span
                        class="status status-${item.status.toLowerCase()}"
                    >
                        ${item.status}
                    </span>

                </td>

                <td>
                    ${escapeHTML(
                        item.notes || "-"
                    )}
                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


/* =========================================
   SUMMARY
========================================= */

function renderSummary() {

    const tbody =
        document.getElementById(
            "summaryTableBody"
        );


    tbody.innerHTML = "";


    if (!participants.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="empty">
                    No participants available.
                </td>
            </tr>
        `;

        return;

    }


    participants.forEach(
        function (participant, index) {

            const records =
                attendance.filter(
                    function (item) {

                        return (
                            item.participantId ===
                            participant.id
                        );

                    }
                );


            const present =
                countStatus(
                    records,
                    "Present"
                );


            const permission =
                countStatus(
                    records,
                    "Permission"
                );


            const sick =
                countStatus(
                    records,
                    "Sick"
                );


            const absent =
                countStatus(
                    records,
                    "Absent"
                );


            const total =
                records.length;


            const rate =
                total > 0
                    ?
                    Math.round(
                        (present / total) *
                        100
                    )
                    :
                    0;


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${escapeHTML(
                        participant.name
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        participant.className
                    )}
                </td>

                <td>
                    ${present}
                </td>

                <td>
                    ${permission}
                </td>

                <td>
                    ${sick}
                </td>

                <td>
                    ${absent}
                </td>

                <td>
                    ${total}
                </td>

                <td>
                    <strong>
                        ${rate}%
                    </strong>
                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


function countStatus(
    records,
    status
) {

    return records.filter(
        function (item) {

            return item.status === status;

        }
    ).length;

}


/* =========================================
   DASHBOARD
========================================= */

function updateDashboard() {

    document.getElementById(
        "totalParticipants"
    ).textContent =
        participants.length;


    const today =
        getToday();


    const todayRecords =
        attendance.filter(
            function (item) {

                return item.date === today;

            }
        );


    document.getElementById(
        "totalPresent"
    ).textContent =
        countStatus(
            todayRecords,
            "Present"
        );


    document.getElementById(
        "totalPermission"
    ).textContent =
        countStatus(
            todayRecords,
            "Permission"
        );


    document.getElementById(
        "totalSick"
    ).textContent =
        countStatus(
            todayRecords,
            "Sick"
        );


    document.getElementById(
        "totalAbsent"
    ).textContent =
        countStatus(
            todayRecords,
            "Absent"
        );

}


/* =========================================
   EXPORT CSV
========================================= */

document.getElementById(
    "exportCsvBtn"
).addEventListener(
    "click",
    exportCSV
);


function exportCSV() {

    if (!attendance.length) {

        showNotification(
            "No attendance data available."
        );

        return;

    }


    let csv =
        "No,Date,Participant ID,Name,Class,Status,Notes\n";


    attendance.forEach(
        function (record, index) {

            const participant =
                participants.find(
                    function (item) {

                        return (
                            item.id ===
                            record.participantId
                        );

                    }
                );


            const row = [

                index + 1,

                record.date,

                participant
                    ? participant.participantId
                    : "-",

                participant
                    ? participant.name
                    : "-",

                participant
                    ? participant.className
                    : "-",

                record.status,

                record.notes || ""

            ];


            csv +=
                row
                    .map(csvEscape)
                    .join(",")
                    +
                    "\n";

        }
    );


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;

    link.download =
        "pronative-attendance.csv";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );


    showNotification(
        "Attendance data exported successfully."
    );

}


function csvEscape(value) {

    return `"${String(value)
        .replace(/"/g, '""')}"`;

}


/* =========================================
   PRINT SUMMARY
========================================= */

document.getElementById(
    "printSummaryBtn"
).addEventListener(
    "click",
    function () {

        window.print();

    }
);


/* =========================================
   DELETE ALL DATA
========================================= */

document.getElementById(
    "deleteAllBtn"
).addEventListener(
    "click",
    function () {

        if (
            participants.length === 0 &&
            attendance.length === 0
        ) {

            showNotification(
                "There is no data to delete."
            );

            return;

        }


        const confirmed =
            confirm(
                "WARNING!\n\n" +
                "All participants and attendance records will be permanently deleted.\n\n" +
                "Are you sure?"
            );


        if (!confirmed) {
            return;
        }


        participants = [];

        attendance = [];


        saveData();

        renderParticipants();

        updateClassDropdowns();

        renderAttendance();

        renderHistory();

        renderSummary();

        updateDashboard();


        showNotification(
            "All data has been deleted."
        );

    }
);


/* =========================================
   LOCAL STORAGE
========================================= */

function saveData() {

    localStorage.setItem(
        "pronativeParticipants",
        JSON.stringify(
            participants
        )
    );


    localStorage.setItem(
        "pronativeAttendance",
        JSON.stringify(
            attendance
        )
    );

}


/* =========================================
   NOTIFICATION
========================================= */

let notificationTimer;


function showNotification(message) {

    const notification =
        document.getElementById(
            "notification"
        );


    const text =
        document.getElementById(
            "notificationText"
        );


    text.textContent =
        message;


    notification.classList.add(
        "show"
    );


    clearTimeout(
        notificationTimer
    );


    notificationTimer =
        setTimeout(
            function () {

                notification.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================
   DATE FORMAT
========================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const parts =
        dateString.split("-");


    if (parts.length !== 3) {
        return dateString;
    }


    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );

}


/* =========================================
   SECURITY HELPERS
========================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        );

}