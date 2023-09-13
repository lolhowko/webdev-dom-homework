const host = "https://wedev-api.sky.pro/api/v2/lana-olhowko/comments";
const userURL =  'https://wedev-api.sky.pro/api/user/login';
const userRegistr = 'https://wedev-api.sky.pro/api/user';

export let token;


export const setToken = (newToken) => {
  token = newToken;
}

// GET запрос - получение 

export function getComments() {

  // const containerPreloader = document.getElementById('container-preloader');

  return fetch(host, {
    method: "GET",
    headers: {
      Authorization: `Bearer &{token}`,
    }
  })
    .then((response) => {

      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      // containerPreloader.textContent = '';
      return response.json();
    });
}


// запостить новый коммент

export function postComments({ name, text }) {
  return fetch(host, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: name.replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
        .replaceAll("QUOTE_END", "</div>"),
      // date: fullDate + fullTime,
      text: text.replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
        .replaceAll("QUOTE_END", "</div>"),
      // forceError: false,
    }),
  })
    .then((response) => {
      if (response.status === 500) {
				throw new Error('Ошибка сервера');
			}
			else if (response.status === 400) {
				throw new Error('Неверный запрос!');
			}
			else {
				return response.json();
			}
    })
}

// ЗАЛОГИНИТЬСЯ для формы ВОЙТИ

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

// ЗАРЕГАТЬСЯ для формы Зарегестрироваться

export function register({ login, password, name }) {

	return fetch(userRegistr, {
		method: 'POST',
		body: JSON.stringify({
			login,
			password,
			name,
		}),
	}).then((response) => {
		return response.json();
	});
}