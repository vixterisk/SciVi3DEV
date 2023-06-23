const labelColumnClassName = "ColorScaleRowNumber";
const labelColumnIndexConst = 0;
const valueColumnIndexConst = 1;
const colorColumnIndexConst = 2;
const deleteColumnIndexConst = 3;
const addColumnIndexConst = 4;
const inputWidth = "100px";

// var settingsValue = SETTINGS_VAL["SETTING_NAME"];
// if (settingsValue === undefined)
//     settingsValue = { colors: ["#000", "#000"], values: [0] };
settingsValue = { colors: ["#000", "#000"], values: [0] };
SETTINGS_VAL["SETTING_NAME"] = settingsValue;

const isEven = (number) => number % 2 == 0;

const getTextLabel = (index) => isEven(index) ? "Color " : "Value ";

const getLabelNumber = (index) => Math.floor(index / 2) + 1;

const isDeleteButtonVisible = (table, index) => table.rows.length > 3 && isEven(index);

const getInputValue = (table, rowIndex, columnIndex) => table.rows[rowIndex].cells[columnIndex].getElementsByClassName("input")[0].value;

function createLabelCell(row) {
    var cell = row.insertCell();

    var cellContent = document.createElement("div");

    var label = document.createElement("label");
    label.innerHTML = getTextLabel(row.rowIndex);

    var number = document.createElement("label");
    number.className = labelColumnClassName;
    number.innerHTML = getLabelNumber(row.rowIndex);

    cellContent.appendChild(label);
    cellContent.appendChild(number);
    cell.appendChild(cellContent);
}

function updateSettings(table) {
    settingsValue.colors = []
    settingsValue.values = []
    for (let i = 0; i < table.rows.length; i++) {
        if (isEven(i))
            settingsValue.colors[i / 2] = getInputValue(table, i, colorColumnIndexConst);
        else {
            var index = Math.floor(i / 2)
            settingsValue.values[index] = getInputValue(table, i, valueColumnIndexConst);
            if (settingsValue.values[index] === undefined || settingsValue.values[index] === "")
                settingsValue.values[index] = 0;
        }
    }
    SETTINGS_VAL["SETTING_NAME"] = settingsValue;
    SETTINGS_CHANGED["SETTING_NAME"] = true;
}

function createInputCell(table, row, inputType, isVisible) {
    var cell = row.insertCell();
    if (isVisible) {
        var cellElement = document.createElement("input");
        cellElement.type = inputType;
        cellElement.value = 0;
        cellElement.required = true;
        cellElement.className = "input";
        cellElement.style.width = inputWidth;
        cellElement.addEventListener("change", function (e) {
            updateSettings(table);
        });
        cell.appendChild(cellElement);
    }
}

function createButtonCell(row, buttonText, isVisible, eventHandler) {
    var cell = row.insertCell();

    var cellElement = document.createElement("button");
    cellElement.innerHTML = buttonText;
    cellElement.style.width = inputWidth;
    cellElement.addEventListener("click", eventHandler);
    cell.appendChild(cellElement);
    cell.hidden = !isVisible;
}

function setRowValues(rowIndex, labelColumnIndex, labelColumnValue, deleteColumnIndex, deleteColumnValue, addColumnIndex, addColumnValue) {
    table.rows[rowIndex].cells[labelColumnIndex].getElementsByClassName(labelColumnClassName)[0].innerHTML = labelColumnValue;
    table.rows[rowIndex].cells[deleteColumnIndex].hidden = deleteColumnValue;
    table.rows[rowIndex].cells[addColumnIndex].hidden = addColumnValue;
}

function setButtonVisibility(table) {

    for (let i = 0; i < table.rows.length - 1; i++) {
        var deleteColumnValue = !(isDeleteButtonVisible(table, i) && i > 0);
        setRowValues(i, labelColumnIndexConst, getLabelNumber(i), deleteColumnIndexConst, deleteColumnValue, addColumnIndexConst, true);
    }
    setRowValues(table.rows.length - 1, labelColumnIndexConst, getLabelNumber(table.rows.length), deleteColumnIndexConst, table.rows.length <= 3, addColumnIndexConst, false);
}

function addPairRows(table, index) {
    createRow(table, index - 1);
    createRow(table, index);
    setButtonVisibility(table);
    updateSettings(table);
}

function removePairRows(table, index) {
    table.deleteRow(index);
    table.deleteRow(index - 1);
    setButtonVisibility(table);
    updateSettings(table);
}

function createRow(table, index) {
    var row = table.insertRow();

    createLabelCell(row);

    createInputCell(table, row, "number", !isEven(index));
    createInputCell(table, row, "color", isEven(index));

    createButtonCell(row, "Delete", isDeleteButtonVisible(table, index), () => removePairRows(table, row.rowIndex));
    createButtonCell(row, "Add", table.rows.length > 2, () => addPairRows(table, row.rowIndex));
}

function createTable() {
    var table = document.createElement("table");
    for (let i = 0; i < 3; i++) {
        createRow(table, i);
    }
    return table;
}

var table = createTable();
ADD_WIDGET(table);
