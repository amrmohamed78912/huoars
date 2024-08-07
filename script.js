document.addEventListener('DOMContentLoaded', function() {
    initializeTable();
    loadSavedData();
});

function initializeTable() {
    const tbody = document.querySelector('#workHoursTable tbody');
    for (let i = 1; i <= 31; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>اليوم ${i}</td>
            <td><input type="time" id="checkIn${i}" onchange="updateHours(${i})"></td>
            <td><input type="time" id="checkOut${i}" onchange="updateHours(${i})"></td>
            <td id="hours${i}">0</td>
        `;
        tbody.appendChild(row);
    }
}

function updateHours(day) {
    const checkIn = document.getElementById(`checkIn${day}`).value;
    const checkOut = document.getElementById(`checkOut${day}`).value;
    if (checkIn && checkOut) {
        const hoursWorked = calculateHoursWorked(checkIn, checkOut);
        document.getElementById(`hours${day}`).textContent = hoursWorked.toFixed(2);
        saveData(); // حفظ البيانات بعد التحديث
    }
}

function calculateTotalHours() {
    let totalHours = 0;
    for (let i = 1; i <= 31; i++) {
        const hoursWorked = parseFloat(document.getElementById(`hours${i}`).textContent) || 0;
        totalHours += hoursWorked;
    }
    alert(`إجمالي عدد الساعات: ${totalHours.toFixed(2)}`);
}

function calculateHoursWorked(checkIn, checkOut) {
    const [checkInHour, checkInMinute] = checkIn.split(':').map(Number);
    const [checkOutHour, checkOutMinute] = checkOut.split(':').map(Number);

    let start = new Date();
    start.setHours(checkInHour, checkInMinute, 0);

    let end = new Date();
    end.setHours(checkOutHour, checkOutMinute, 0);

    if (end < start) {
        end.setDate(end.getDate() + 1); // إضافة يوم إذا كان وقت الانصراف قبل وقت الحضور
    }

    let diff = (end - start) / (1000 * 60 * 60); // فرق الوقت بالساعات

    return Math.max(diff, 0); // نعيد الفرق بدون قيمة سالبة
}

function saveData() {
    const data = [];
    for (let i = 1; i <= 31; i++) {
        data.push({
            checkIn: document.getElementById(`checkIn${i}`).value,
            checkOut: document.getElementById(`checkOut${i}`).value,
            hours: document.getElementById(`hours${i}`).textContent
        });
    }
    localStorage.setItem('workHoursData', JSON.stringify(data));
}

function loadSavedData() {
    const savedData = JSON.parse(localStorage.getItem('workHoursData'));
    if (savedData) {
        savedData.forEach((item, index) => {
            document.getElementById(`checkIn${index + 1}`).value = item.checkIn;
            document.getElementById(`checkOut${index + 1}`).value = item.checkOut;
            document.getElementById(`hours${index + 1}`).textContent = item.hours;
        });
    }
}

function resetTable() {
    if (confirm('هل أنت متأكد من إعادة تشغيل الجدول؟ سيتم فقدان جميع البيانات.')) {
        localStorage.removeItem('workHoursData');
        document.querySelector('#workHoursTable tbody').innerHTML = '';
        initializeTable();
    }
}
