let level = 1;
let maxHp = 50;
let currentHp = 50;
let maxXp = 25;
let currentXp = 0;
let money = 100;
let inventory = [];

function updateHpBar() {
    const hpBar = document.getElementById('hp-bar');
    const hpValue = document.getElementById('hp-value');
    const hpPercentage = (currentHp / maxHp) * 100;
    hpBar.style.width = `${hpPercentage}%`;
    hpValue.innerText = `${currentHp} / ${maxHp}`;
}

function updateXpBar() {
    const xpBar = document.getElementById('xp-bar');
    const xpValue = document.getElementById('xp-value');
    const xpPercentage = (currentXp / maxXp) * 100;
    xpBar.style.width = `${xpPercentage}%`;
    xpValue.innerText = `${currentXp} / ${maxXp}`;
}

function updateMoney() {
    document.getElementById('money').innerText = money;
}

function completeGoal(goalId) {
    const task = document.getElementById(goalId);
    const xpGained = parseInt(task.getAttribute('data-xp'));
    const moneyGained = parseInt(task.getAttribute('data-money'));
    
    gainXp(xpGained);
    gainMoney(moneyGained);
    task.remove(); // Remove a tarefa da coluna "Concluído"
    
    // Adiciona a missão ao registro de missões concluídas
    const completedList = document.getElementById('completed-missions-list');
    const listItem = document.createElement('li');
    listItem.innerText = task.innerText;
    completedList.appendChild(listItem);
}

function gainXp(amount) {
    currentXp += amount;
    if (currentXp >= maxXp) {
        currentXp -= maxXp;
        levelUp();
    }
    updateXpBar();
}

function gainMoney(amount) {
    money += amount;
    updateMoney();
}

function levelUp() {
    level++;
    maxXp += 25; // Aumenta o máximo de XP em 25 a cada nível
    currentXp = 0; // Reinicia o XP para o próximo nível
    document.getElementById('level').innerText = level;
    updateXpBar();
    showLevelUpMessage();
}

function showLevelUpMessage() {
    document.getElementById('dialog-level').innerText = level;
    document.getElementById('level-up-dialog').style.display = 'block';
}

function closeLevelUpDialog() {
    document.getElementById('level-up-dialog').style.display = 'none';
}

function showMissionDialog(missionName) {
    document.getElementById('mission-name').innerText = missionName;
    document.getElementById('mission-dialog').style.display = 'block';
}

function closeMissionDialog() {
    document.getElementById('mission-dialog').style.display = 'none';
}

function chooseClass(className) {
    const classIcon = document.getElementById('class-icon');
    const classDisplayName = document.getElementById('class-name');
    const characterImage = document.getElementById('character-image');
    
    switch (className) {
        case 'lutador':
            classIcon.src = 'img/classes/boxing.png';
            classDisplayName.innerText = 'Lutador';
            characterImage.src = 'img/personas/lutador_persona.jpeg';
            break;
        case 'mago':
            classIcon.src = 'img/classes/witch-hat.png';
            classDisplayName.innerText = 'Mago';
            characterImage.src = 'img/personas/mago_persona.jpeg';
            break;
        case 'ninja':
            classIcon.src = 'img/classes/star.png';
            classDisplayName.innerText = 'Ninja';
            characterImage.src = 'img/personas/ninja_persona.jpeg';
            break;
        case 'monge':
            classIcon.src = 'img/classes/ying-yang.png';
            classDisplayName.innerText = 'Monge';
            characterImage.src = 'img/personas/monge_persona.jpeg';
            break;
        default:
            classIcon.src = 'img/classes/default.png';
            classDisplayName.innerText = 'Classe';
            characterImage.src = 'img/personas/lutador_persona.jpeg';
            break;
    }
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
    event.target.classList.add('dragging');
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const item = document.getElementById(data);
    
    if (event.target.className.includes('kanban-column')) {
        event.target.appendChild(item);

        if (event.target.id === 'in-progress') {
            showMissionDialog(item.innerText);
        } else if (event.target.id === 'done') {
            completeGoal(data);
        }
    }
    event.target.classList.remove('dragging-over');
}

document.querySelectorAll('.kanban-column').forEach(column => {
    column.addEventListener('dragover', () => {
        column.classList.add('dragging-over');
    });

    column.addEventListener('dragleave', () => {
        column.classList.remove('dragging-over');
    });
});

function buyItem(itemName, itemPrice, itemImage, itemBenefits) {
    if (money >= itemPrice) {
        money -= itemPrice;
        updateMoney();
        addItemToInventory(itemName, itemImage, itemBenefits);
        alert(`${itemName} comprado por ${itemPrice} moedas e adicionado ao inventário!`);
    } else {
        alert('Você não tem dinheiro suficiente para comprar este item.');
    }
}


function equipItem(itemElement, itemBenefits) {
    const items = document.querySelectorAll('#inventory .item');
    items.forEach(item => item.classList.remove('equipped'));

    itemElement.classList.add('equipped');
    alert(`${itemElement.innerText} foi equipado! Benefícios: ${itemBenefits}`);
}

function showPurchaseDialog(itemName, itemBenefits) {
    const dialog = document.getElementById('purchase-dialog');
    document.getElementById('purchase-item-name').innerText = itemName;
    document.getElementById('purchase-item-benefits').innerText = itemBenefits;
    dialog.style.display = 'block';
}

function closePurchaseDialog() {
    document.getElementById('purchase-dialog').style.display = 'none';
}

function showItemDetails(event, itemName, itemDescription, itemStats) {
    const tooltip = document.getElementById('item-tooltip');
    const itemPrice = event.currentTarget.getAttribute('data-price'); // Recupera o preço do atributo data-price
    const itemInInventory = inventory.some(item => item.name === itemName); // Verifica se o item está no inventário

    tooltip.style.display = 'block';
    tooltip.style.left = `${event.pageX + 15}px`;
    tooltip.style.top = `${event.pageY + 15}px`;

    document.getElementById('tooltip-item-name').innerText = itemName;
    document.getElementById('tooltip-item-description').innerText = itemDescription;

    if (itemInInventory) {
        document.getElementById('tooltip-item-stats').innerHTML = `${itemStats}<br><strong>Este item já está no seu inventário</strong>`;
    } else {
        document.getElementById('tooltip-item-stats').innerHTML = `${itemStats}<br><strong>Preço:</strong> ${itemPrice} Moedas`;
    }
}


function hideItemDetails() {
    const tooltip = document.getElementById('item-tooltip');
    tooltip.style.display = 'none';
}

function addItemToInventory(itemName, itemImage, itemBenefits) {
    const inventoryList = document.getElementById('inventory');
    const newItem = document.createElement('div');
    newItem.classList.add('item');
    const imgElement = document.createElement('img');
    imgElement.src = itemImage;
    imgElement.alt = itemName;
    newItem.appendChild(imgElement);
    
    // Remove o preço quando o item é adicionado ao inventário
    newItem.removeAttribute('data-price');
    
    newItem.onclick = () => equipItem(newItem, itemBenefits);
    newItem.onmouseover = (event) => showItemDetails(event, itemName, "Benefícios: " + itemBenefits, itemBenefits);
    newItem.onmouseout = hideItemDetails;
    inventoryList.appendChild(newItem);
    inventory.push({ name: itemName, image: itemImage, benefits: itemBenefits });
    showPurchaseDialog(itemName, itemBenefits);
}

// Abre o diálogo para criar nova missão
function openCustomTaskDialog() {
    document.getElementById('custom-task-dialog').style.display = 'block';
}

// Fecha o diálogo de criação de missão
function closeCustomTaskDialog() {
    document.getElementById('custom-task-dialog').style.display = 'none';
}

function openCustomTaskDialog() {
    document.getElementById('custom-task-dialog').style.display = 'flex';
}

function closeCustomTaskDialog() {
    document.getElementById('custom-task-dialog').style.display = 'none';
}

function addCustomTask() {
    const title = document.getElementById('task-title').value;
    const xp = document.getElementById('task-xp').value;
    const money = document.getElementById('task-money').value;

    if (title && xp && money) {
        const todoColumn = document.getElementById('todo');
        const newTask = document.createElement('div');
        newTask.classList.add('kanban-item');
        newTask.setAttribute('draggable', 'true');
        newTask.setAttribute('ondragstart', 'drag(event)');
        newTask.setAttribute('data-xp', xp);
        newTask.setAttribute('data-money', money);
        newTask.innerText = `${title} (${xp} XP, ${money} Moedas)`;

        todoColumn.appendChild(newTask);
        closeCustomTaskDialog();
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}


// Adiciona a missão personalizada na coluna "A Fazer"
function addCustomTask() {
    const title = document.getElementById('task-title').value;
    const xp = document.getElementById('task-xp').value || 0; // Valor padrão 0 se não for preenchido
    const money = document.getElementById('task-money').value || 0; // Valor padrão 0 se não for preenchido

    if (title.trim() !== '') {
        const taskId = `task${document.querySelectorAll('.kanban-item').length + 1}`; // Gera um ID único para a tarefa

        const newTask = document.createElement('div');
        newTask.classList.add('kanban-item');
        newTask.id = taskId;
        newTask.draggable = true;
        newTask.ondragstart = drag;
        newTask.dataset.xp = xp;
        newTask.dataset.money = money;
        newTask.innerText = `${title} (${xp} XP, ${money} Moedas)`;

        document.getElementById('todo').appendChild(newTask);

        closeCustomTaskDialog(); // Fecha o diálogo
    } else {
        alert('O título da tarefa não pode estar vazio.');
    }
}


// Inicializa as barras e o dinheiro
updateHpBar();
updateXpBar();
updateMoney();

// Define a classe padrão ao carregar a página
chooseClass('default');
