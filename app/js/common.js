
window.addEventListener('DOMContentLoaded', function() {
	const overlay = document.querySelectorAll('.link_ai__hidden_block'), // Блок обёрка
				formBody = document.querySelectorAll('.link_ai__main-body-form'), // Блок с формой
				body = document.querySelector('body'), // Получаем body чтобы убрать скролл при открытом модальном окне
				forms = document.querySelectorAll('.link_ai__form'), // Все формы с классом '.link_ai__form'
				inputs = document.querySelectorAll('.link_ai__form input'), // Все инпуты
				// Сообщения о статусе отправки формы
				message = {
					loading: 'Отправка...',	
					failureName: '* Поле “имя” не заполнено',
					failureMail: '* Поле “e-mail” не заполнено',
					failurePhone: '* Поле “телефон” не заполнено',
					success: 'Спасибо за отправку заявки. мы свяжемся с вами в течение дня.',
					failure: 'Что-то пошло не так...'
				};
	let modalToggle = false; // Переключатель статуса модального окна

	// Функция открытия модального окна параметры (triggerSelector = class кнопки или ссылки по которой открывать окно, modalSelector = class модификатор с модальным окном, closeSelector = class кнопки для закрытия модального окна )
	function bindModal(triggerSelector, modalSelector, closeSelector) {

		const trigger = document.querySelectorAll(triggerSelector),
					modal = document.querySelector(modalSelector),
					close = document.querySelector(closeSelector),
					modalForm = modal.querySelector('.link_ai__main-body-form');

		// Открытие модального окна 
		trigger.forEach(item => {
				item.addEventListener('click', (e) => {
						if (e.target) {
								e.preventDefault();
						}
						modal.classList.add('active');
						modalForm.classList.add('active');
						body.classList.add('link_ai__no-scroll');
						modalToggle = true;
						clearInfo();
				});
		});

		// Закрытие модального окна по клику на крестик
		close.addEventListener('click', () => {
			modal.classList.remove('active');
			modalForm.classList.remove('active');
			body.classList.remove('link_ai__no-scroll');
			modalToggle = false;
			clearInfo();
		});

		// Закрытие модального окна по клику на подложку
		modal.addEventListener('click', (e) => {
				if (e.target === modal) {
					modal.classList.remove('active');
					modalForm.classList.remove('active');
					body.classList.remove('link_ai__no-scroll');
					modalToggle = false;
					clearInfo();
				}
		});
		
	}

	// Вызов функции открытия модального окна с параметрами
	bindModal('.link_ai__show-modal', '.link_ai__hidden_block--callback', '.link_ai__popapClose');


	//Закрытие окна по нажатию Esc
	document.onkeydown = function(e) {
		if(modalToggle == true){
			if (e.keyCode == 27) {
				overlay.forEach(item => {
					item.classList.remove('active');
				});
				formBody.forEach(item => {
					item.classList.remove('active');
				});
				document.body.classList.remove('actilink_ai__no-scrollve');
				clearInfo();
			}
		}
	};



	// Работа с инпутами
	inputs.forEach(item => {
		// Получаю placeholder
		let itemPlaceholder = item.getAttribute("placeholder");
		// Очищаю при фокусе
		item.addEventListener ('focus', ()=>{
			item.placeholder = ' ';
		});
		// Возвращаю значение при уходе с фокуса
		item.addEventListener ('blur', ()=>{
			item.placeholder = itemPlaceholder;
		});
		// Убираю class 'link_ai__error' у инпута при вводе, очищаю сообщение о статусе отправки формы
		item.addEventListener ('input', ()=>{
			item.classList.remove('link_ai__error');
			document.querySelectorAll('.link_ai__form-status p').forEach(item => {
				item.textContent = '';
			});
		});
	});

	// Очистка информации о статусе отправки и подсветки инпута с ошибкой при уходе с формы
	function clearInfo (){
		document.querySelectorAll('.link_ai__form-status p').forEach(item => {
			item.textContent = '';
		});
		inputs.forEach(item => {
			item.classList.remove('link_ai__error');
		});
	}
	
	// Собираю все поля с формы
	forms.forEach(item => {
			postData(item);
	});

	// Функция отправки запроса
	function postData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			let statusMessage = form.querySelector('.link_ai__form-status p');
					statusMessage.textContent = message.loading;
			const request = new XMLHttpRequest();
			request.open('POST', 'ajax.php'); // адрес php скрипта 
			const formData = new FormData(form);
			request.send(formData);
			// Обработка ответа
			request.addEventListener('load', () => {				
					if (request.status === 200) { // При успешной отправке на сервер
						statusMessage.textContent = "";
							switch(request.response) {
								case '1': // Не введено имя
									statusMessage.textContent = message.failureName;
									form.name.classList.add('link_ai__error');
									break;
								case '2': // Не введен телефон
									statusMessage.textContent = message.failurePhone;
									form.tel.classList.add('link_ai__error');
									break;
								case '3': // Не введен e-mail
									statusMessage.textContent = message.failureMail;
									form.email.classList.add('link_ai__error');
									break;
								default: // Все поля заполнены
									const statusSucces = form.querySelector('.link_ai__form-status--succes');
									statusSucces.querySelector('p').textContent = message.success;
									statusSucces.classList.add('link_ai__form-status--succes--active');
									form.reset();
									//Удаляю сообщение об успешной отправке через 5 секунд
									setTimeout(() => {
										statusSucces.classList.remove('link_ai__form-status--succes--active');
									}, 5000);
									break;
							}
						} else { // При ошибке отправки на сервер
							statusMessage.textContent = message.failure;
					}
			});
	});
	}
});