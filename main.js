import { getComments } from "./api.js";
import { renderComments } from "./renderComments.js";

import { format } from "date-fns";

// старая версия ДАТЫ-формат
// import { formatDateToRu } from "./lib/formatDate/formatDate.js";

//        ФОРМИРОВАНИЕ НОВОГО СПИСКА КОММЕНТОВ из хранилища данных

export let comments = [];

// const RUDate = Intl.DateTimeFormat();


//      GET запрос

export const fetchAndRenderComments = () => {
    getComments().then((responseData) => {

        const appComments = responseData.comments.map((comment) => {
            //старый вариант
            // const createDate = formatDateToRu(new Date(comment.date));

            //новый вариант с HW 2.17
            const createDate = format(
                new Date(comment.date),
                'yyyy-MM-dd hh.mm.ss',
            );

            // Теперь мы с легкостью можем указывать нужный нам формат даты, не переживая за реализацию:

            // const now = new Date();
            
            // format(now, "dd/MM/yyyy hh:mm"); // 26/03/2023 10:33
            // format(now, "MM-dd-yyyy hh:mm"); // 03-26-2023 10:33
            // format(now, "dd.MM.yyyy hh:mm:ss"); // 26.03.2023 10:33:41


            return {
                name: comment.author.name,

                date: createDate,

                text: comment.text,

                like: comment.likes,
                isLiked: false,

                // isEdit: false,
                // isLoading: false,
            };
        });

        comments = appComments;

        renderComments({
            comments,
            fetchAndRenderComments,
            name: window.userName,
        });

        // return true;
    })
}

fetchAndRenderComments();








// renderComments({ comments, fetchAndRenderComments });



// //       РЕАЛИЗАЦИЯ - КНОПКА УДАЛИТЬ

// const buttonDelComment = document.getElementById("del-comment");


// buttonDelComment.addEventListener('click', () => {

//     let lastComment = listElement.lastChild;
//     lastComment.parentNode.removeChild(lastComment);

// })
