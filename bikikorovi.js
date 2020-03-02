/*Компьютер загадывает число из нескольких различающихся цифр (от 3 до 6).
 Игроку дается несколько попыток на то, чтобы угадать это число.
После каждой попытки компьютер сообщает количество совпавших цифр 
стоящих не на своих местах, а также количество правильных цифр
 на своих местах.
Например загаданное число: 56478 предположение игрока: 52976
ответ: совпавших цифр не на своих местах - 1 (6), цифр на своих местах - 2 (5 и 7)
игра ведется до окончания количества ходов либо до отгадывания*/

//генератор случайных чисел по заданому интервалу
function randomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//функция для поиска повторяющихся цифр
function searchDoubleMatch(number, amount){
	for(let i=0;i<amount;i++){
		for(let j=0;j<amount;j++){
			if(i==j){
				continue;
			}
			if(String(number)[i] == String(number)[j]){
				return true;
			}
		}
	}
	return false;
}

//функция сравнения цифры между числами игрока и компьютера
function compareDigits(player, comp, amount){
	let validMatches=0; 
	let invalidMatches=0;
	let validPosition='';
	let invalidPosition='';
	
	for(let i=0; i < amount; i++){

		for(let j=0; j < amount; j++){
			
			if (String(player)[i] == String(comp)[j]){

				if(i == j){ //совпадает ли позиция цифр
			 		if(i>0 && i<amount && validPosition)
			 			validPosition+=' и ';

			 		validPosition+=String(player)[i];
			 		validMatches++;
			 	}else{
			 		if(i>0 && i<amount && invalidPosition)
			 			invalidPosition+=' и ';

			 		invalidPosition+=String(player)[i];
			 		invalidMatches++;
			 	}
			}
		}
	}
	console.log(`совпавших цифр не на своих местах - ${invalidMatches} (${invalidPosition}), цифр на своих местах - ${validMatches} (${validPosition}) `);
}



const readlineSync = require('readline-sync');
const countOfSteps = 10;//количество попыток
let double=false;
let playerDigits;
let compsDigits;
let amount;

	//запрашиваем количество отгадываемых чисел
	amount = readlineSync.question('Enter amount of digits for guessing(from 3 to 6): ');
	//проверяем правильно ли введено количество цифр
	while (amount < 3 || amount > 6){
		console.log("Введено неверное количество угадавыемых чисел");
		amount = readlineSync.question('Enter amount of digits for guessing(from 3 to 6): ');
	}
		//вычисляем минимальное и максимальное возможное значения
		let min=1;
		let max=9;
		for(let i=1; i < amount; i++){
			min*=10;
			max=max*10+9;
		}

		//ищем и присваиваем рандомное число в заданном промежутке
		do{
			compsDigits=randomInteger(min,max);
		}while(searchDoubleMatch(compsDigits, amount)) //цикл повторяется пока не будет повторяющихся цифр

		//начало игры
		for(let i=0; i<countOfSteps; i++){

			do{
				playerDigits=readlineSync.question(`Your turn.\nEnter a ${amount}-digits number: `); //запрашиваем у игрока число
				double=searchDoubleMatch(playerDigits, amount); 
				if(double){
					console.log("Цифры не должны повторяться");
				}else{
					break;
				}
			}while(true) //цикл повторяется пока не будет повторяющихся цифр

			//сравниваем числа
			if(playerDigits == compsDigits){
				console.log("You won");
				break; //если сошлось, выходим из цикла
			} else {
				//если не сошлось, то сравниваем цифры
				compareDigits(playerDigits, compsDigits, amount);
			}
		} 