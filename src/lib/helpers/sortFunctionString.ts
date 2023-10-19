export let sort = `
const sortableColumns = document.querySelectorAll('.sort');
sortableColumns.forEach(col => {
    col.addEventListener('click', () => {
        const table = document.querySelector('table');
        const columnIndex = Array.from(col.parentNode.cells).indexOf(col);

        const rows = Array.from(table.rows).slice(1);
        const isNumeric = columnIndex >= 1 && columnIndex <= 4;
        const currentOrder = col.getAttribute('data-order');
        const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
        rows.sort((a, b) => {
            const aValue = isNumeric ? parseFloat(a.cells[columnIndex].innerText) : a.cells[columnIndex].innerText;
            const bValue = isNumeric ? parseFloat(b.cells[columnIndex].innerText) : b.cells[columnIndex].innerText;
            if (currentOrder === 'asc' && currentOrder !== 'none') {
                return aValue > bValue ? 1 : aValue === bValue ? 0 : -1;
            } else {
                return aValue > bValue ? -1 : aValue === bValue ? 0 : 1;
            }
            return aValue > bValue ? 1 : aValue === bValue ? 0 : -1;;
        });
        table.tBodies[0].append(...rows);
        col.setAttribute('data-order', newOrder);
    });
});
`;
export let style = `
body {
    font-size: 14px;
    font-family: Arial, sans-serif;
    color: #6b7280;
}

table {
    width: 100%;
    caption-side: bottom;
    font-size: 14px;
    text-align: left;
    border-collapse: collapse;
}

table caption {
    margin-top: 1rem;
    font-size: 14px;
    color: #6b7280;
}

table thead tr {
    border-bottom: 1px solid;
}

table th {
    height: 48px;
    padding: 0 16px;
    font-weight: 500;
    color: #6b7280;
}

table td {
    padding: 16px;
}

table tbody tr {
    border-bottom: 1px solid;
}

a {
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}
`;
