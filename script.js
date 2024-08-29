document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('health-form');
    const tableBody = document.querySelector('#data-table tbody');

    // 讀取本地存儲中的數據並填充表格
    function loadTableData() {
        const data = JSON.parse(localStorage.getItem('healthData')) || [];
        tableBody.innerHTML = ''; // 清空表格內容

        data.forEach(rowData => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${rowData.recordDate}</td>
                <td>${rowData.recordTime}</td>
                <td>${rowData.measurementDate}</td>
                <td>${rowData.timeOfDay}</td>
                <td>${rowData.temperature}</td>
                <td>${rowData.heartrate}</td>
                <td>${rowData.systolic}</td>
                <td>${rowData.diastolic}</td>
                <td><button class="delete-btn">刪除</button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // 保存數據到本地存儲
    function saveTableData() {
        const rows = Array.from(tableBody.querySelectorAll('tr'));
        const data = rows.map(row => {
            const cells = row.querySelectorAll('td');
            return {
                recordDate: cells[0].textContent,
                recordTime: cells[1].textContent,
                measurementDate: cells[2].textContent,
                timeOfDay: cells[3].textContent,
                temperature: cells[4].textContent,
                heartrate: cells[5].textContent,
                systolic: cells[6].textContent,
                diastolic: cells[7].textContent
            };
        });
        localStorage.setItem('healthData', JSON.stringify(data));
    }

    // 表單提交事件處理程序
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const rowData = {
            recordDate: new Date().toLocaleDateString(),
            recordTime: new Date().toLocaleTimeString(),
            measurementDate: formData.get('measurement-date'),
            timeOfDay: formData.get('time-of-day'),
            temperature: formData.get('temperature'),
            heartrate: formData.get('heartrate'),
            systolic: formData.get('systolic'),
            diastolic: formData.get('diastolic')
        };

        // 創建新行
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${rowData.recordDate}</td>
            <td>${rowData.recordTime}</td>
            <td>${rowData.measurementDate}</td>
            <td>${rowData.timeOfDay}</td>
            <td>${rowData.temperature}</td>
            <td>${rowData.heartrate}</td>
            <td>${rowData.systolic}</td>
            <td>${rowData.diastolic}</td>
            <td><button class="delete-btn">刪除</button></td>
        `;

        tableBody.appendChild(row);
        form.reset();
        saveTableData(); // 保存數據到本地存儲
    });

    // 刪除按鈕事件處理程序
    tableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const row = event.target.closest('tr');
            row.remove();
            saveTableData(); // 保存數據到本地存儲
        }
    });

    // 清除所有資料按鈕事件處理程序
    document.getElementById('clear-button').addEventListener('click', function() {
        tableBody.innerHTML = '';
        localStorage.removeItem('healthData'); // 移除本地存儲中的數據
    });

    // 匯出 Excel 按鈕事件處理程序
    document.getElementById('export-btn').addEventListener('click', function() {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(document.getElementById('data-table'));
        XLSX.utils.book_append_sheet(wb, ws, '健康數據');
        XLSX.writeFile(wb, '健康數據.xlsx');
    });

    loadTableData(); // 頁面加載時讀取數據
});
