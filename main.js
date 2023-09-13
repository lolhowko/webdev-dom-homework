import { getComments } from "./api.js";
import { renderComments } from "./renderComments.js";
import { formatDateToRu } from "./lib/formatDate/formatDate.js";

import { format } from "date-fns";


//        ФОРМИРОВАНИЕ НОВОГО СПИСКА КОММЕНТОВ из хранилища данных

export let comments = [];

// const RUDate = Intl.DateTimeFormat();


//      GET запрос

export const fetchAndRenderComments = () => {
    getComments().then((responseData) => {

        const appComments = responseData.comments.map((comment) => {
            const createDate = formatDateToRu(new Date(comment.date));

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
