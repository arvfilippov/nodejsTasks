/*В папке лежит некоторое количество файлов. Каждый файл 
состоит из следующих строк

текст вопроса
номер правильного ответа
ответ 1
ответ 2
...
ответ n
Нужно написать программу-викторину, которая выбирает 
5 случайных файлов вопросов и в командной строке по очереди 
задает их пользователю, получая от него варианты ответов. 
После получения всех ответов, программа выводит итоговое 
количество правильных ответов.*/

const fs = require('fs');
const readline = require('readline-sync');
let countCorrectAnswers = 0;
const countOfQuestions = 5;


packFiles = {
	filesArray: [],
	questionsData: []
};


const path = '.\\questions\\'; //пишем сюда путь папки где лежат файлы с вопросами

function randomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//функция для выбора случайных 5 файлов
function chooseRandomFive(count){
	let rndDigits = [];
	let digit = 0;
	
	for(let i = 0 ; i < countOfQuestions; i++){
		//ставим true для double чтобы зайти в цикл while
		let double = true;
		while(double == true){
			digit=randomInteger(1, count);
			for(let j = 0; j < countOfQuestions; j++){
				if(digit == rndDigits[j]){
					//если есть совпадение запускаем цикл еще раз
					double = true;
					break;
				}
				//если совпадений нет, тогда меняем значение double на false чтобы выйти из цикла
				double = false;
			}

		}
		//вписываем найденное число в массив
		rndDigits[i] = digit;
	}
	return rndDigits;
}

function showAndCheck(data){
	let userChoose = '';
	console.log(`\n${data.question}\n${data.otherAnswers}\n`);
	do{
	userChoose = readline.question('Enter your answer: ');
	}while(checkCorrectInput(userChoose, data.countOfAnswers))
	if (Number(userChoose) == Number(data.numCorAnswer)){
	
		countCorrectAnswers++;
	}
}
//разделяем файл на составляющие и вписываем в переменные: Вопрос, правильный ответ и другие ответы
function separationFile(data){
	let question= '';
	let numCorAnswer = '';
	let otherAnswers = '';
	let start = 0;
	let countOfAnswers = 0;

	let end = data.indexOf('Правильный') - 4;
	question = data.slice(start+9, end);
	
	start = end;
	end  = data.indexOf('Выберите') - 4;
	numCorAnswer = data.slice(start+22, end);
	
	start = end+5;
	otherAnswers = data.slice(start-1);
	
	//считаем количество вариантов ответа
	for (let i = start; i < data.length; i++){
		if(data[i]=='\n' && isFinite(data[i+1]) && data[i+2] == ')'){
			countOfAnswers++;
		}
	}
	return{
		question,
		numCorAnswer,
		otherAnswers,
		countOfAnswers
	};
}

function chooseFiles(path, pack){
	let i = 1;
	let allFiles = [];
	//проверяем на существование файлов по порядковому номеру с расширением .txt
	while (fs.existsSync(path+i+'.txt') == true) {
		allFiles[i-1] = path+i+'.txt'; //записываем файл в массив
		i++;
	}
	//ищем и записываем в rndDigit 5 случайных чисел от количества существующих файлов
	let rndDigits = chooseRandomFive(i-2);
	for(let j = 0; j < 5; j++){
		pack[j] = allFiles[rndDigits[j]];
	}

}

function checkCorrectInput(number, countOfAnswers){
	if (!isFinite(number) || number < 1 || number > countOfAnswers || number==''){
		console.log(`\n!!'${number}'  - неверное значение!!\n`);
		return true;
	}
	return false;
}


try{
	//запоняем массив названиями путей файлов по порядку
	chooseFiles(path, packFiles.filesArray);
	//заполняем массив с вопросами с разделением на составляющие: вопрос, правильный ответ, другие ответы
	for(let i = 0; i < countOfQuestions; i++){
		const data = fs.readFileSync(packFiles.filesArray[i], "utf8");
		packFiles.questionsData[i] = separationFile(data);
	}
	//показываем вопрос и проверяем на корректность ввода юзером
	for(let i = 0; i < countOfQuestions; i++){
		showAndCheck(packFiles.questionsData[i]);
	}
	console.log(`Правильных ответов: ${countCorrectAnswers}`);
	
}catch (err){
	console.error(err);
}

