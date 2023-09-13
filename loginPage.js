import { login, setToken, token } from "./api.js";
import { renderRegister } from './renderRegistr.js';

export function setName(newName) {
    window.userName = newName;
}


export const renderLogin = ({ fetchAndRenderComments }) => {
    const appElement = document.getElementById('app');

    const loginHtml = `
    <div class="container">
	    <div class="add-form">
            <h2 class="login-title">Форма входа</h2>
            
            <div class="form-row">
            <input type="text" id="login-input" class="add-form-login" placeholder="Введите логин" value="" />
            <input type="password" id="password-input" class="add-form-login" placeholder="Введите ваш пароль">
            </div>

            <button id="login-button" class="login-button">Войти</button>
            <a class="login-link" href="index.html">Перейти на стр комментариев</a>

            <a id="register-link" class="login-link" href="#">Зарегистрироваться</a>

	    </div>
    </div>
	`;


    appElement.innerHTML = loginHtml;

    const registerElement = document.getElementById('register-link');

    registerElement?.addEventListener('click', (event) => {
        event.preventDefault();

        renderRegister({ fetchAndRenderComments });
    });



    const buttonLoginElement = document.getElementById("login-button");
    const loginInputElement = document.getElementById("login-input");
    const passwordInputElement = document.getElementById("password-input");

    buttonLoginElement.addEventListener('click', () => {

        login({
            login: loginInputElement.value,
            password: passwordInputElement.value,
        })
            .then((responseData) => {

                setToken(responseData.user.token);
                localStorage.setItem('tokenSave', responseData.user.token);
                setName(responseData.user.name);
            })
            .then(() => {
                fetchAndRenderComments();
            })
    });
}