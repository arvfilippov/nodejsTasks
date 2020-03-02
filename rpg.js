
/*Бой идет по ходам. Каждый ход компьютер (Лютый) случайно 
выбирает одно из доступных действий и сообщает, что он 
собирается делать. В ответ на это игрок (Евстафий) должен 
выбрать свое действие.

После происходит взаимное нанесение урона. Магическая броня 
блокирует магический урон, физическая броня блокирует физический урон.

После совершения действия, оно не может быть повторно выбрано
 в течение cooldown ходов*/

function randomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function turn(obj){
    let numberMove=0;
    //проверяем чей ход
    if(obj.name == "Лютый"){
        //поиск случайного номера для хода монстра
        while(true){
        numberMove = randomInteger(0, 2);
        if(validateCooldown(obj, numberMove))
            break;
    }

    }else{
        //запускаем цикл с запросом на ввод хода и проверкой на правильный ввод игрока
        while(true){

        numberMove=readLine.question("Choose your move: ");

        if(!isFinite(numberMove) || numberMove < 0 || numberMove > 3 || numberMove=='' || validateCooldown(obj, numberMove) == false)
            console.log(`\n!!'${numberMove}'  - неверное значение!!\n`);
        else 
            break;
        }

    }
    console.log(`\n${obj.name} производит ${obj.moves[numberMove].name}\n`);
    return numberMove;
}

function calculateDammage(value1, value2){
    return value1 / 100 * value2;
}

function calculateActions(player, playerMove, comp, compMove){
     //считаем нанесенный даммаг
    player.maxHealth -= Math.ceil((comp.moves[compMove].physicalDmg - calculateDammage(comp.moves[compMove].physicalDmg, player.moves[playerMove].physicArmorPercents)) + (comp.moves[compMove].magicDmg - calculateDammage(comp.moves[compMove].magicDmg, player.moves[playerMove].magicArmorPercents)));
    comp.maxHealth -= Math.ceil((player.moves[playerMove].physicalDmg - calculateDammage(player.moves[playerMove].physicalDmg, comp.moves[compMove].physicArmorPercents)) + (player.moves[playerMove].magicDmg - calculateDammage(player.moves[playerMove].magicDmg, comp.moves[compMove].magicArmorPercents)));
}
//проверка восстановился ли кулдаун
function validateCooldown(obj, move){
    if(obj.moves[move].cooldown == obj.cooldown[move]){
        obj.cooldown[move] = 0;
        return true;
    }
    return false;
}

function cooldownNextTurn(player, comp){
    for(let i = 0 ; i < 4 ; i++){
        if(player.moves[i].cooldown != player.cooldown[i]){
            player.cooldown[i]++;
        }
        if (i < 3)
            if(comp.moves[i].cooldown != comp.cooldown[i]){
                comp.cooldown[i]++;
            }
    }
}

function printCooldown(obj){
    console.log(`\nВозможные действия для ${obj.name}`);
    for(let i = 0 ; i < 4 ; i++){
        console.log(`${i}:  ${obj.moves[i].name} (готовность ${obj.cooldown[i]} из ${obj.moves[i].cooldown})`);
    }
    console.log("\n");
}


const readLine = require('readline-sync');
const monster = {
        maxHealth: 10,
        name: "Лютый",
        moves: [
            {
                "name": "Удар когтистой лапой",
                "physicalDmg": 3, // физический урон
                "magicDmg": 0,    // магический урон
                "physicArmorPercents": 20, // физическая броня
                "magicArmorPercents": 20,  // магическая броня
                "cooldown": 0     // ходов на восстановление
            },
            {
                "name": "Огненное дыхание",
                "physicalDmg": 0,
                "magicDmg": 4,
                "physicArmorPercents": 0,
                "magicArmorPercents": 0,
                "cooldown": 3
            },
            {
                "name": "Удар хвостом",
                "physicalDmg": 2,
                "magicDmg": 0,
                "physicArmorPercents": 50,
                "magicArmorPercents": 0,
                "cooldown": 2
            },
        ],
        cooldown: [0,3,2]
    }

const player = {
    name: "Естафий",
    moves: [
            {
                "name": "Удар боевым кадилом",
                "physicalDmg": 2,
                "magicDmg": 0,
                "physicArmorPercents": 0,
                "magicArmorPercents": 50,
                "cooldown": 0
            },
            {
                "name": "Вертушка левой пяткой",
                "physicalDmg": 4,
                "magicDmg": 0,
                "physicArmorPercents": 0,
                "magicArmorPercents": 0,
                "cooldown": 4
            },
            {
                "name": "Каноничный фаербол",
                "physicalDmg": 0,
                "magicDmg": 5,
                "physicArmorPercents": 0,
                "magicArmorPercents": 0,
                "cooldown": 3
            },
            {
                "name": "Магический блок",
                "physicalDmg": 0,
                "magicDmg": 0,
                "physicArmorPercents": 100,
                "magicArmorPercents": 100,
                "cooldown": 4
            },
        ],
        cooldown: [0,4,3,4]
    }

//запрашиваем начальное здоровье
player.maxHealth = readLine.question("Choose initial health: ");

while(true){
    cooldownNextTurn(player, monster);
    printCooldown(player);
    calculateActions(player, turn(player), monster, turn(monster));
    
    console.log(`Player: ${player.maxHealth}hp\nMonster: ${monster.maxHealth}hp\n`);

    if(monster.maxHealth <= 0){
        console.log(`${player.name} побеждает`)
        break;
    }
    if(player.maxHealth <= 0){
        console.log(`${monster.name} побеждает`)
        break;
    }   
}