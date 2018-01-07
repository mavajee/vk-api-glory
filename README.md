**vk-api-glory** – простая библиотека с минимальным списком зависимостей для работы с [API VK](https://vk.com/dev/manuals). Возможность использования с промисами или асинхронными функциями ES6.

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

- options <object\> [Структура](#options)

```js
new Auth(options);
```

#### Options
Опции авторизации

| Параметр     | Тип           | Описание                                                 |
|--------------|---------------|----------------------------------------------------------|
| username     | string        | email или телефон для авторизации во вконтакте.          |
| password     | string        | Пароль пользователя.                                     |
| clientId     | string        | Идентификатор Вашего приложения.                         |
| clientSecret | string        | Секретный ключ Вашего приложения.                        |
| scope        | string        | [Права доступа](https://vk.com/dev/permissions).         |
| version      | string        | Версия API для использования. Стандартная версия: 5.69.  |

#### Auth.implicit(obj)
- obj <object\> {clientId, clientSecret, scope}
- returns <object\> {accessToken, userId, expires}

[Явная авторизация](https://vk.com/dev/implicit_flow_user) для Standelone приложений. Dyrty way авторизация т.к. эмитируется авторизация через браузер. Этот тип авторизации используется для недоверенных приложений(приложений которые не прошли проверку командой вк).

#### Auth.direct(obj)
- <object\> {clientId, clientSecret, scope}
- returns <object\> {accessToken, userId, expires}

[Прямая авторизация](https://vk.com/dev/auth_direct), через API.

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
- options <object\>

```js
new Api(options);
```

#### Api.call(methodName, params)
- methodName <string\>
- params <object\>

#### Api.setAccessToken(accessToken)
- accessToken <string\>

#### Api.setApiVersion(apiVersion)
- apiVersion <string|number\>
