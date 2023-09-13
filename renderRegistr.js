import { register, setToken } from "./api.js";
import { setName } from "./loginPage.js";


export function renderRegister({ fetchAndRenderTasks }) {

    const appElement = document.getElementById('app');

    const loginHtml = `
	<div class="container">
	<div class="add-form">
		<h2 class="login-title">Форма регистрации</h2>

        <div class="form-row">
        <input type="text" id="login-input" placeholder="Введите логин" value="" />
        <input type="password" id="password-input" placeholder="Введите ваш пароль">
		<input type="text" id="login-name" placeholder="Введите имя" value="" />

        </div>

		<button id="login-button">Зарегистрироваться</button>
		<a class="login-link" href="index.html">Войти</a>
	</div> 
	`;

    appElement.innerHTML = loginHtml;

    const buttonLoginElement = document.getElementById("login-button");
    const loginInputElement = document.getElementById("login-input");
    const passwordInputElement = document.getElementById("password-input");
    const nameRegisterElement = document.getElementById('login-name');

    buttonLoginElement.addEventListener('click', () => {
        buttonLoginElement.disabled = true;

        register({
            login: loginInputElement.value,
            password: passwordInputElement.value,
            name: nameRegisterElement.value,
        })
            .then((responseData) => {

                setToken(responseData.user.token);

                localStorage.setItem('tokenSave', responseData.user.token);

                setName(responseData.user.name);
            })
            .then(() => {
                fetchAndRenderTasks();
            });
    });
}