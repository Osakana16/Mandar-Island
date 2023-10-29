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
        this.table = createTable();
        this.table.style.width = "100%";
        this.table.style.margin = 0;
        this.table.style.tableLayout = "fixed";
        parent.appendChild(this.table);

        this.parseMandalart = function (content) {
            for (var i = 0; i < 9; i++) {
                elements[i].isLocked = content[i].isLocked;
                elements[i].bgColor = content[i].bgColor;
                elements[i].color = content[i].color;
                elements[i].walign = content[i].walign;
                elements[i].valign = content[i].valign;
                elements[i].text = content[i].text;
            }
            this.render();
        }

        this.extractMandalart = function () {
            this.update();

            let content = [];
            elements.forEach(e => {
                content.push({
                    "isLocked": e.isLocked,
                    "bgColor": e.bgColor,
                    "color": e.color,
                    "walign": e.walign,
                    "valign": e.valign,
                    "text": e.text
                });
            });
            return content;
        }

        var elements = [];
        for (var i = 0; i < 9; i++) {
            elements.push(new MandarElement());
        }

        this.table.mandarRow = [
            new MandarRow(this.table.body, 0), 
            new MandarRow(this.table.body, 1), 
            new MandarRow(this.table.body, 2)
        ];

        this.getBox = (x, y) => {
            return this.table.mandarRow[x].box[y];
        };

        this.render = function() {
            var i = 0;
            this.table.mandarRow.forEach(row => {
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

        this.update = function () {
            var i = 0;
            this.table.mandarRow.forEach(row => {
                row.box.forEach(box => {
                    elements[i].bgColor = box.textBox.style.backgroundColor;
                    elements[i].color = box.textBox.style.color;
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
        };

        this.replace = function () {
            selfElement.appendChild(this.table);
        };

        this.remove = function () {
            this.table.parentElement.removeChild(this.table);
        };

        var selfElement = document.getElementById('mandalart');

        this.toggleMap = function() {
            selfElement.hidden = !selfElement.hidden;
        }
    }
}
class Button {
    constructor(parentElement, mandalart, onClick, text, isTextEditable) {
        this.mandalart = mandalart;

        var outer = document.createElement('div');
        outer.classList.add("add-island-button-outer");
        var inner = document.createElement('div');
        inner.classList.add("add-island-button");
        var title = document.createElement('span');
        title.innerText = text;
        title.contentEditable = isTextEditable;

        var self = this;

        this.getName = function () {
            return title.innerText;
        };

        this.rename = function (newone) {
            title.innerText = newone;
        };

        inner.onclick = function () {
            onClick(self);
        };

        parentElement.appendChild(outer);
        outer.appendChild(inner);
        inner.appendChild(title);
    }
}

class FieldMap {
    constructor() {
        var self = this;
        var isNeedToRender = false;
        var selfElement = document.getElementById('map');

        this.onNewButtonPressed = function (_) {
            let project = document.getElementById('mandalart').project;
            if (project.activeMandalart != null && project.activeMandalart != undefined) {
                project.activeMandalart.remove();
            }

            let button = new Button(
                selfElement,
                project.addMandalarts(true),
                function (self_) {
                    project.activeMandalart.remove();
                    project.changeActiveMandalart(self_.mandalart);
                    self_.mandalart.replace();
                    project.toggleMap();
                },
                "New Mandalart",
                true
            );

            self.buttons.push(button);
            project.toggleMap();
            return button;
        };

        var newButton = new Button(
            selfElement,
            undefined,
            this.onNewButtonPressed,
            "マンダラートを追加",
            false
        );

        this.buttons = [];

        this.toggleMap = function() {
            selfElement.hidden = !selfElement.hidden;
        };
    }
}

class Project {
    constructor() {
        var self = this;
        this.projectName = "New Project";
        this.activeMandalart = undefined;
        this.mandalarts = [];
        var fieldMap = new FieldMap();

        this.read = function () {
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

            (async () => {
                const handle = await window.showOpenFilePicker(options);
                fileHandler = handle[0];
                const file = await handle[0].getFile();
                let json = JSON.parse(await file.text());
                self.projectName = json["project"];
                json["button"].forEach(e => {
                    let button = fieldMap.onNewButtonPressed();
                    this.activeMandalart.parseMandalart(e["detail"]);
                    this.toggleMap();
                    button.rename(e["name"]);
                });

                document.getElementById('filename').innerText = file.name;
            })();
        };

        this.write = function () {
            async function _saveFile(handle) {
                async function _writeFile(fileHandle) {
                    const writable = await fileHandle.createWritable();
                    let content = {};
                    content["project"] = self.projectName;
                    content["button"] = [];

                    fieldMap.buttons.forEach(b => {
                        content["button"].push({ "name": b.getName(), "detail": b.mandalart.extractMandalart() });
                    });

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

            (async () => {
                fileHandler = await _saveFile(fileHandler);
                document.getElementById('filename').innerText = fileHandler.name;
            })();
        };

        this.toggleMap = function() {
            fieldMap.toggleMap();
            this.activeMandalart.toggleMap();
        };

        this.addMandalarts = function(changeActivation) {
            let mandalart = new Mandalart(this.content);
            this.mandalarts.push(mandalart);
            if (changeActivation) {
                this.changeActiveMandalart(mandalart);
            }
            return mandalart;
        };

        this.changeActiveMandalart = function (mandalart) {
            this.activeMandalart = mandalart;
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
    }
}

var onBGColorChanged = function(color) {
    let target = document.getElementById("optionModal").target;
    let mandalart = document.getElementById('mandalart').project.activeMandalart;
    mandalart.getBox(target[0], target[1]).textBox.style.backgroundColor = color;
}

var onColorChanged = function(color) {
    let target = document.getElementById("optionModal").target;
    let mandalart = document.getElementById('mandalart').project.activeMandalart;
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
    let mandalart = document.getElementById('mandalart').project.activeMandalart;
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

var onLoadFile = function () {
    document.getElementById('mandalart').project.read();
}

var onSaveFile = function () {
    document.getElementById('mandalart').project.write();
}