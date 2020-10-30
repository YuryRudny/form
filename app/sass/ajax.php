<?php
//Пример формы axax для отправки почты
if(isset($_POST['feedback']) && $_POST['feedback'] == 1)
	{
	if(empty($_POST['name']))
		echo 1; //Укажите свое имя
	elseif(empty($_POST['tel']))
		echo 2; //Укажите свой телефон
	elseif(empty($_POST['email']))
		echo 3; //Укажите свой email
	elseif(!empty($_POST['name']) && !empty($_POST['email']) && !empty($_POST['tel']))
		{
		$subject = "Отправлено с формы обратной связи";
		$com = (!empty($_POST['com']))? "<p>Сообщение: ".$_POST['com']." </p>" : "";
		$body = '
			<p>Имя: '.$_POST['name'].'</p>
			<p>Email: '.$_POST['email'].'</p>
			<p>Тел: '.$_POST['tel'].'</p>'.$com;
		send('victoria@astana-it.kz', $subject, $body);
		//request::start($_POST, '');
		}
	}
function send($email, $subject, $body)
	{
	/* Mail sending */
	echo 0;	//Заявка успешно отправлено!
	}
?>