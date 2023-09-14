import { postComments, token } from "./api.js";
import { renderLogin } from "./loginPage.js";

import { comments, fetchAndRenderComments } from "./main.js";



const listElement = document.getElementById("list");

//      ФОРМАТИРОВАНИЕ ДАТЫ

//  трудночитаема и лучше использовать библиотеки!!

// const formatDate = (date) => {
//     return `${date.getDate() < 10 ? '0' +
//         date.getDate() : date.getDate()
//         }/${date.getMonth() < 10 ? '0' + date.getMonth() :
//             date.getMonth()}/${date.getFullYear()} ${date.getHours() < 10 ? '0' + date.getHours() :
//                 date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
// }


// рендер всех комментов + объявление const

export const renderComments = ({ comments, fetchAndRenderComments, name }) => {
    const commentsHtml = comments
        .map((comment, index) => {
            return `<li class="comment" data-text="${comment.text}" data-name="${comment.name}" data-index="${index}"">
      <div class="comment-header">
        <div> ${comment.name} </div>
        <div>${comment.date}</div>
      </div>

      <div class="comment-body">
        ${comment.isEdit ? `<textarea class="edit-text" id="textarea-${index}">${comment.text}</textarea>` : `<div class="comment-text">
          ${comment.text}
        </div>`}
      </div>

      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">${comment.like}</span>
          <button class="like-button ${comment.isLiked ? '-active-like' : ''}" data-index="${index}"></button>
        </div>
      </div>

      <div class="add-form-row">
      <button class="add-form-button edit-comment" data-index="${index}">
      ${comment.isEdit ? 'Сохранить' : 'Редактировать'} </button>
    </div>

    </li>`
        }).join(' ');

    const appElement = document.getElementById("app");

    const appHTML = `
        <div class="container">

            <div id="container-preloader">>Пожалуйста подождите, загружаю комментарии..</div>

            <ul id="list" class="comments">
                <!-- Список рендерится из JS -->
                ${commentsHtml}
            </ul>

            <div id="container-preloader-post"></div>

            ${token
            ? `<div class="add-form">
                        <input type="text" class="add-form-name" id="name-input" placeholder="Введите ваше имя" disabled value="${name}" />
                        <textarea type="textarea" class="add-form-text" id="comment-input" placeholder="Введите ваш коментарий" rows="4"></textarea>
                        <div class="add-form-row">
                            <button class="add-form-button" id="add-comment">Написать</button>
                        </div>
                </div>`

            : `<div class="authorization">Чтобы добавить комментарий, <a href="index.html" id="authorization-link" class="authorization-link">авторизуйтесь</a></div>`
        }

            <div class="add-form-row">
                <button id="del-comment" class="add-form-button">Удалить последний комментарий</button>
            </div>
        </div>
        `;


    appElement.innerHTML = appHTML;

    const authorizationElement = document.getElementById('authorization-link');

    authorizationElement?.addEventListener('click', (event) => {
        event.preventDefault();

        renderLogin({ comments, fetchAndRenderComments });
    });



    //        ОБЪЯВЛЕНИЕ ВСЕХ CONST
    const buttonAddElement = document.getElementById("add-comment");
    const nameInputElement = document.getElementById("name-input");
    const commentInputElement = document.getElementById("comment-input");
    const addFormElement = document.querySelector('.add-form');


    const containerPreloader = document.getElementById('container-preloader');
    const containerPreloaderPost = document.getElementById('container-preloader-post');
    containerPreloader.textContent = '';

    btnElementInit(buttonAddElement, commentInputElement, nameInputElement, addFormElement, fetchAndRenderComments);


    initLikesButtonListeners(comments, fetchAndRenderComments, nameInputElement); // ЛАЙКИ initEventListeners
    initEditButtonListeners(comments, fetchAndRenderComments); // Редактирование коммента = functionEdit

    initEditCommentListeners(comments, fetchAndRenderComments); // ОТВЕТЫ на комменты
}



//        ПРОВЕРКА НА ЗАПОЛНЕНИЕ ФОРМ + НЕАКТИВНАЯ КНОПКА


function btnElementInit(buttonAddElement, commentInputElement, nameInputElement, addFormElement, fetchAndRenderComments) {

    const containerPreloaderPost = document.getElementById(
        'container-preloader-post',
    );

    buttonAddElement?.addEventListener('click', () => {

        nameInputElement.classList.remove("error");
        commentInputElement.classList.remove("error");
        buttonAddElement.removeAttribute('disabled', 'disabled');

        if (commentInputElement.value === '' || nameInputElement.value === '') {
            buttonAddElement.setAttribute('disabled', 'disabled');


            if (commentInputElement.value === '' && nameInputElement.value === '') {
                commentInputElement.classList.add("error");
                nameInputElement.classList.add("error");
                return;
            } if (nameInputElement.value === '') {
                nameInputElement.classList.add("error");
                buttonAddElement.setAttribute('disabled', '');
                return;
            } else {
                commentInputElement.classList.add("error");
                return;
            }
        }

        addFormElement.classList.add('form-none');

        buttonAddElement.disabled = true;
        buttonAddElement.textContent = 'Комментарий добавляется..';

        //        ДОБАВИТЬ С ПОМОЩЬЮ КЛАВИШИ ENTER + ВОЗВРАТ АКТИВНОСТИ КНОПКИ

        document.addEventListener("keyup", function (e) {
            if (e.keyCode === 13) {
                document.getElementById("add-comment").click();
            }
        });

        nameInputElement.addEventListener('input', () => {

            buttonAddElement.disabled = false;
            buttonAddElement.style.backgroundColor = '';
            nameInputElement.classList.remove('error');

        })

        commentInputElement.addEventListener('input', () => {

            buttonAddElement.disabled = false;
            buttonAddElement.style.backgroundColor = '';
            commentInputElement.classList.remove('error');

        })

        // fetchPromise = addTodo

        const fetchPromise = () => {
            // containerPreloaderPost.textContent = 'Добавляется комментарий...';

            postComments({
                name: nameInputElement.value, //nameInputElement
                text: commentInputElement.value, //nameTextAreaElement
            })
                .then((responseData) => {
                    return fetchAndRenderComments();
                })
                .then((data) => {
                    containerPreloaderPost.textContent = '';
                    addFormElement.classList.remove('form-none');
                    nameInputElement.value = '';
                    commentInputElement.value = '';
                })
                .catch((error) => {

                    containerPreloaderPost.textContent = '';
                    addFormElement.classList.remove('form-none');

                    if (error.message === "Неверный запрос") {
                        alert('Короткое имя или текст комментария, минимум 3 символа');
                    }
                    else if (error.message === "Ошибка сервера") {
                        alert('Сломался сервер , попробуйте позже');
                        fetchPromise();
                    }
                    else {
                        // (window.navigator.onLine === false)
                        // alert('Проблемы с интернетом, проверьте подключение');
                        console.error(error);
                    }
                })
        }

        fetchPromise();
    })
}

//        ОБРАБОТЧИК на LIKES,  РЕАЛИЗАЦИЯ ЛАЙКОВ


const initLikesButtonListeners = (comments, fetchAndRenderComments) => {

    if (!token) return;

    const buttonElements = document.querySelectorAll(".like-button");

    for (const buttonElement of buttonElements) {
        buttonElement.addEventListener("click", (event) => {
            // stop цепочка распростронения событий
            event.stopPropagation();

            // индекс номер объекта в массиве, получаем из data-атрибута кнопки на к-ую нажимаем
            const index = buttonElement.dataset.index;
            //обращаемся к свойству isLiked объекта, к-ый получили из массивы comments по индексу
            if (comments[index].isLiked) {
                comments[index].isLiked = false;
                comments[index].like--;
            } else {
                comments[index].isLiked = true;
                comments[index].like++;
            }

            renderComments({ comments, fetchAndRenderComments });
        });

    }

}



//        РЕДАКТИРОВАНИЕ КОММЕНТАРИЕВ

const initEditButtonListeners = (comments, fetchAndRenderComments) => {

    if (!token) return;

    const buttonEditElements = document.querySelectorAll(".edit-comment");


    for (const buttonEditElement of buttonEditElements) {
        buttonEditElement.addEventListener("click", (event) => {
            event.stopPropagation();

            const index = buttonEditElement.dataset.index;
            const textarea = document.getElementById(`textarea-${index}`);


            if (comments[index].isEdit) {
                comments[index].isEdit = false;
                comments[index].text = textarea.value;

                renderComments({ comments, fetchAndRenderComments })
            } else {
                comments[index].isEdit = true;
            }

            renderComments({ comments, fetchAndRenderComments });
        })
    }
}


//        Ответы на комменты

const initEditCommentListeners = (comments, fetchAndRenderComments) => {

    if (!token) return;

    const answerElements = document.querySelectorAll(".comment");

    for (const answerElement of answerElements) {

        answerElement.addEventListener('click', () => {


            const index = answerElement.dataset.index;

            console.log(comments[index]);

            const text = answerElement.dataset.text;
            const name = answerElement.dataset.name;

            // когда нажимаю = &{comment.text} должен появляться в commentInputElement (тексте добавления комментариев)
            // commentInputElement.value = `> ${text} \n ${name}, `;


            if (comments[index].isEdit === false) {

                commentInputElement.value = `BEGIN_QUOTE ${text} ${name} QUOTE_END`;

                renderComments({ comments, fetchAndRenderComments });

            }

        })
    }
}