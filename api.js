const host = "https://wedev-api.sky.pro/api/v2/lana-olhowko/comments";
const userURL = "https://wedev-api.sky.pro/api/user";

const containerPreloader = document.getElementById('container-preloader');

containerPreloader.textContent = 'Пожалуйста подождите, загружаю комментарии...';

export let token;

export const setToken = (newToken) => {
  token = newToken;
}

export function getComments() {
  return fetch(host, {
    method: "GET",
    headers: {
      Authorization: token,
    }
  })
    .then((response) => {
      containerPreloader.textContent = '';
      return response.json();
    });
}


export function postComments({ name, text }) {
    return fetch(host, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: name
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;")
                .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
                .replaceAll("QUOTE_END", "</div>"),
            // date: fullDate + fullTime,
            text: text
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;")
                .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
                .replaceAll("QUOTE_END", "</div>"),
            // forceError: false,
        }),
    }).then((response) => {
        if (response.status === 500) {
            throw new Error("Ошибка сервера");
        } else if (response.status === 400) {
            throw new Error("Неверный запрос!");
        } else {
            return response.json();
        }
    });
}


export function login({ login, password }) {
  return fetch(userURL, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  })
    .then((response) => {
      return response.json();
    })
}