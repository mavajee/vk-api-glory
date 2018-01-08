**vk-api-glory** – простая библиотека с минимальным списком зависимостей для работы с
[API VK](https://vk.com/dev/manuals) ☄. Возможность использования с промисами или асинхронными функциями ES6 🤟.

## Зависимости
[Node.js](https://nodejs.org/) >= 8.0.0.

## Установка
```shell
npm install --save vk-api-glory
```

В библиотеке присутствует несколько несвязанных классов для работы с VK.

## Class: Auth
Класс для авторизации и получения токена пользователя.

#### Constructor: new Auth(options)

- options <object\> [Структура](#auth-options)

```js
new Auth(options);
```

#### Auth options
Опции авторизации

| Параметр     | Тип            | Описание                                                |
|--------------|----------------|---------------------------------------------------------|
| username     | string         | email или телефон для авторизации во вконтакте.         |
| password     | string         | Пароль пользователя.                                    |
| clientId     | string         | Идентификатор Вашего приложения.                        |
| clientSecret | string         | Секретный ключ Вашего приложения.                       |
| scope        | string         | [Права доступа](https://vk.com/dev/permissions).        |
| apiVersion   | string, number | Версия API для использования. Стандартная версия: 5.69. |

#### Auth.implicit(obj)
- obj <object\> [Описание](#obj)
- returns <object\> {accessToken, userId, expires}

[Явная авторизация](https://vk.com/dev/implicit_flow_user) для Standelone приложений. Dyrty way авторизация т.к.
имитируется авторизация через браузер. Этот тип авторизации используется для недоверенных приложений(приложений которые
не прошли проверку командой вк).


#### obj

| Параметр    | Тип    | Описание                                                 |
|-------------|--------|----------------------------------------------------------|
| accessToken | string | Ключ доступа к API.                                      |
| userId      | number | Id пользователя для которого была выполнена авторизация. |
| expires     | number | Время жизни ключа в секундах.                            |

#### Auth.direct(obj)
- obj <object\> [Описание](#obj)
- returns <object\> {accessToken, userId, expires}

[Прямая авторизация](https://vk.com/dev/auth_direct), через API, для одобренных или официальных
приложений.

#### Пример использования

```js
import { Auth } from 'vk-api-glory'

let auth = new Auth({
    username: 'phone',
    password: 'pass',
    clientId: 'client_id',
    clientSecret: 'client_secret'
});

(async _ => {
  let { accessToken } = await auth.implicit();
})();
```

## Class: Api

#### Constructor: new Api(options)
- options <object\> [Описание](#api-options)

```js
new Api(options);
```

#### Api options

| Параметр       | Тип            | Описание                       | Значение по умолчанию |
|----------------|----------------|--------------------------------|-----------------------|
| accessToken    | string         | Ключ доступа.                  | undefined             |
| apiVersion     | string, number | Версия работы API.             | 5.69                  |
| lang           | string         | Язык возвращаемых результатов. | ru                    |
| captchaHandler | function       | Обработка капчи.               | undefined             |

#### Api.call(methodName, params)
- methodName <string\> [Список методов](https://vk.com/dev/methods)
- params <object\> Параметры для соответствующего метода API. Есть возможность переопределить параметры
заданные в инстанции объекта.

#### Api.setAccessToken(accessToken)
- accessToken <string\>

#### Api.setApiVersion(apiVersion)
- apiVersion <string|number\>

#### Api.setCaptchaHandler(handler)
- handler <function\>

Функции обработки капчи. В установленную функцию передается ссылка на изображение капчи и ожидается Promise.resolve с кодом капчи. Пример:

```js
function handler(imageSrc) {
  return new Promise(resolve => {
    let key = getCaptchaKeyByImage(imageSrc);
    return resolve(key);
  })
}
```

#### Пример использования Api

```js
import { Api } from 'vk-api-glory'

const accessToken = 'token';

function captchaHandler(imgSrc) {
  return new Promise(async resolve => {
    let key = await getCaptchaKeyByImage(imgSrc);
    return resolve(key);
  })
}

let vkApi = new Api({ accessToken, captchaHandler });

vkApi.call('users.get')
  .then(data => console.log(data))
  .catch(error => console.log(error));
```

# Todo
- Переписать промисы на асинхронные функции;
- Добавить middleware;
- Добавить очереди с возможностью запуска параллельных потоков.
