var fileHandler = undefined;

class MandarElement {
    constructor() {
        this.isLocked = false;
        this.text = "";
        this.walign = "center";
        this.valign = "center";
        this.bgColor = "white";
        this.color = "black";
    }
}

// 
class MandarBox {
    constructor(row, x, y) {
        let box = document.createElement('td');
        box.classList.add('mandar-box');

        let header = {
            row: document.createElement('div'),
            col: document.createElement('div'),
            body: document.createElement('div')
        };
        header.row.classList.add('row');
        header.col.classList.add('col');

        header.body.classList.add('border');
        header.body.style.textAlign = 'end';

        // - Start Option Initialization - 

        var optionSpan = document.createElement('span');
        optionSpan.classList.add('mandar-non-selection');
        var optionTip = document.createElement('span');
        optionTip.innerText = '　⚙　';
        optionTip.setAttribute('data-bs-toggle', 'tooltip');
        optionTip.setAttribute('title', '設定ボタン');
        optionTip.setAttribute('data-bs-placement', 'top');
        optionSpan.setAttribute('data-bs-toggle', 'modal');
        optionSpan.setAttribute('data-bs-target', '#optionModal');
        optionSpan.appendChild(optionTip);
        optionSpan.addEventListener('mouseup', () => {
            document.getElementById('optionModal').target = [x, y];
            document.getElementById('bg-text-color').value = this.textBox.style.backgroundColor;
            document.getElementById('text-color').value = this.textBox.style.color;
            if (this.textBox.classList.contains('text-start')) {
                onWAlignChanged(document.getElementById('text-start'));
            } else if (this.textBox.classList.contains('text-center')) {
                onWAlignChanged(document.getElementById('text-center'));
            } else if (this.textBox.classList.contains('text-end')) {
                onWAlignChanged(document.getElementById('text-end'));
            }
        });
        header.body.appendChild(optionSpan);

        // - End Option Initialization - 
        // - Start Lock Initialization - 

        var lockSpan = document.createElement('span');
        lockSpan.classList.add('mandar-non-selection');
        lockSpan.innerText = '　🔒　';
        lockSpan.setAttribute('data-bs-toggle', 'tooltip');
        lockSpan.setAttribute('title', '編集ロック');
        lockSpan.setAttribute('data-bs-placement', 'top');

        header.body.appendChild(lockSpan);

        lockSpan.onclick = () => {
            if (this.textBox.contentEditable == "true") {
                lockSpan.style.backgroundColor = "red";
                this.textBox.contentEditable = "false";
            } else {
                lockSpan.style.backgroundColor = "";
                this.textBox.contentEditable = "true";
            }
        };

        // - End Lock Initialization - 

        header.col.appendChild(header.body);
        header.row.appendChild(header.col);
        box.append(header.row);

        // - Start Textbox Initialization -

        this.textBox = document.createElement('div');
        this.textBox.contentEditable = true;
        this.textBox.classList.add('mandar-text');
        this.textBox.classList.add('text-start');
        this.textBox.classList.add('text-top');
        this.textBox.style.backgroundColor = "white";
        this.textBox.style.color = "black";
        box.append(this.textBox);
        
        // - End Textbox Initialization -

        row.appendChild(box);
    }
}

class MandarRow {
    constructor(tbody, id) {
        var row = document.createElement('tr');
        this.box = [
            new MandarBox(row, id, 0), 
            new MandarBox(row, id, 1), 
            new MandarBox(row, id, 2)
        ];
        tbody.appendChild(row);
    }
}

var createTable = function() {
    let table = document.createElement('table');
    table.head = document.createElement('thead');
    table.body = document.createElement('tbody');
    table.appendChild(table.head);
    table.appendChild(table.body);
    return table;
};

class Mandalart {
    constructor(parent) {
        var table = createTable();
        table.style.width = "100%";
        table.style.margin = 0;
        table.style.tableLayout = "fixed";
        parent.appendChild(table);

        this.parseMandalart = function(content) {
            var json = JSON.parse(content);
            Object.keys(json).forEach(key => {
                for (var i = 0; i < 9; i++) {
                    elements[key][i].isLocked = json[key][i].isLocked;
                    elements[key][i].bgColor = json[key][i].bgColor;
                    elements[key][i].color = json[key][i].color;
                    elements[key][i].walign = json[key][i].walign;
                    elements[key][i].valign = json[key][i].valign;
                    elements[key][i].text = json[key][i].text;
                }
            });
        }

        this.extractMandalart = function() {
            var content = {};
            Object.keys(elements).forEach(key => {
                content[key] = [];
                for (var i = 0; i < 9; i++) {
                    content[key].push({
                        "isLocked": elements[key][i].isLocked,
                        "bgColor": elements[key][i].bgColor,
                        "color": elements[key][i].color,
                        "walign": elements[key][i].walign,
                        "valign": elements[key][i].valign,
                        "text": elements[key][i].text
                    });
                }
            });
            return content;
        }

        var elements = [];
        for (var i = 0; i < 9; i++) {
            elements.push(new MandarElement());
        }

        table.mandarRow = [
            new MandarRow(table.body, 0), 
            new MandarRow(table.body, 1), 
            new MandarRow(table.body, 2)
        ];

        this.getBox = (x, y) => {
            return table.mandarRow[x].box[y];
        };

        this.render = function() {
            var i = 0;
            table.mandarRow.forEach(row => {
                row.box.forEach(box => {
                    box.textBox.style.backgroundColor = elements[i].bgColor;
                    box.textBox.style.color = elements[i].color;
                    box.textBox.innerText = elements[i].text;
                    if (elements[i].walign == 'left') {
                        box.textBox.classList.add('text-start');
                    } else if ( elements[i].walign == 'center') {
                        box.textBox.classList.add('text-center');
                    } else if (elements[i].walign == 'right') {
                        box.textBox.classList.add('text-end');
                    }
                    i++;
                });
            });
        }

        this.update = function() {
            var i = 0;
            table.mandarRow.forEach(row => {
                row.box.forEach(box => {
                    elements[i].bgColor = box.textBox.style.backgroundColor;
                    elementsr[i].color = box.textBox.style.color;
                    elements[i].text = box.textBox.innerText;

                    if (box.textBox.classList.contains('text-start')) {
                        elements[i].walign = 'left';
                    } else if (box.textBox.classList.contains('text-center')) {
                        elements[i].walign = 'center';
                    } else if (box.textBox.classList.contains('text-end')) {
                        elements[i].walign = 'right';
                    }
                    i++;
                });
            });
        }

        var selfElement = document.getElementById('mandalart');

        this.toggleMap = function() {
            selfElement.hidden = !selfElement.hidden;
        }
    }
}

class FieldMap {
    constructor() {
        var selfElement = document.getElementById('map');
        
        this.toggleMap = function() {
            selfElement.hidden = !selfElement.hidden;
        };
    }
}

class Project {
    constructor() {
        this.projectName = "New Project";
        this.activeMandalart = undefined;
        var mandalarts = [];
        var fieldMap = new FieldMap();
        this.toggleMap = function() {
            fieldMap.toggleMap();
            this.activeMandalart.toggleMap();
        };

        this.addMandalarts = function(changeActivation) {
            let mandalart = new Mandalart(this.content);
            mandalarts.push(mandalart);
            if (changeActivation) {
                this.activeMandalart = mandalart;
            }
            return mandalart;
        };

        let addRow = function(parent) {
            let row = document.createElement('div');
            row.classList.add('row');
            parent.appendChild(row);
            return row;
        };

        let setScrollButton = function(node, char) {
            let addEmptyCol = function() {
                let col = document.createElement('div');
                col.classList.add('col-1');
                node.appendChild(col);
            };
            addEmptyCol();
            {
                let col = document.createElement('div');
                col.classList.add('col');
                let button = document.createElement('div');
                button.innerText = char;
                button.hidden = true;
                button.classList.add('mandar-button');
                col.appendChild(button);
                node.appendChild(col);
            }
            addEmptyCol();
        };

        this.content = document.getElementById('mandalart');
        document.getElementById('mandalart').project = this;
    }
}

class MandarIsland {
    constructor() {
        this.project = new Project();
        this.project.addMandalarts(true);
    }
}

var onBGColorChanged = function(mandalart, color) {
    let target = document.getElementById("optionModal").target;
    mandalart.getBox(target[0], target[1]).textBox.style.backgroundColor = color;
}

var onColorChanged = function(mandalart, color) {
    let target = document.getElementById("optionModal").target;
    mandalart.getBox(target[0], target[1]).textBox.style.color = color;
}

var onExpand = function() {
    document.getElementById('mandalart').project.toggleMap();
}

// - Event functions -

var onWAlignChanged = function(align) {
    let target = document.getElementById("optionModal").target;
    let mandalart = document.getElementById('mandalart').project.activeMandalart;
    mandalart.getBox(target[0], target[1]).textBox.classList.remove('text-start');
    mandalart.getBox(target[0], target[1]).textBox.classList.remove('text-center');
    mandalart.getBox(target[0], target[1]).textBox.classList.remove('text-end');

    align.parentNode.childNodes.forEach((child) => {
        if (child.nodeName == '#text')
            return;

        child.classList.remove('active');
    });

    align.classList.add('active');
    console.log(align.id);
    mandalart.getBox(target[0], target[1]).textBox.classList.add(align.id);
}

var onVAlignChanged = function(align) {
    let target = document.getElementById("optionModal").target;
    let mandalart = document.getElementById('mandalart').project.activeMandalart
    mandalart.getBox(target[0], target[1]).textBox.classList.remove('text-top');
    mandalart.getBox(target[0], target[1]).textBox.classList.remove('text-middle');
    mandalart.getBox(target[0], target[1]).textBox.classList.remove('text-bottom');

    align.parentNode.childNodes.forEach((child) => {
        if (child.nodeName != '#text')
            child.classList.remove('active');
    });
    align.classList.add('active');
    mandalart.getBox(target[0], target[1]).textBox.classList.add(align.id);
}

var onLoadFile = function(mandalart) {
    const options = {
        types: [
          {
            description: "JSON Files",
            accept: {
              "application/json": [".json"],
            },
            multiple: false
          },
        ],
    };

    (async ()=> {
        const handle = await window.showOpenFilePicker(options);
        fileHandler = handle[0];
        const file = await handle[0].getFile();
        mandarlart.parseMandalart(await file.text());
        document.getElementById('filename').innerText = file.name;
        
        mandarlart.render();
    })();
}

var onSaveFile = function(mandalart) {
    async function _saveFile(content, handle) {
        async function _writeFile(fileHandle) {
            const writable = await fileHandle.createWritable();

            var content = mandarlart.extractMandalart();
            await writable.write(JSON.stringify(content));
            await writable.close();
        }

        const saveFileOptions = {
            types: [
                {
                    description: "JSON Files",
                    accept: { "application/json": [".json"] },
                }
            ],
        };

        if (handle == null || handle == undefined) {
            handle = await window.showSaveFilePicker(saveFileOptions);
        }
        await _writeFile(handle);
        return handle;
    }

    mandarlart.update();

    (async ()=> {
        fileHandler = await _saveFile("書き込む内容", fileHandler);
        document.getElementById('filename').innerText = fileHandler.name;
    })();
}