# Jazz SDK Demo App

## Описание

**Jazz** — это платформа для проведения видеоконференций. Она предоставляет
возможность организовывать встречи и общаться онлайн с использованием различных
инструментов для совместной работы и обмена информацией.

**Jazz SDK Web** - это набор утилит низкого уровня для работы с платформой Jazz.
SDK позволяет создавать конференции, управлять аудио и видео участников,
переключать камеру и микрофон.

**Jazz SDK Demo App** - это веб-приложение, основная задача которого познакомить
разработчика с набором инструментов для работы с платформой Jazz.

## Запуск веб-приложения

Для начала установим зависимости

```
npm install
```

Запускаем проект

```
npm start
```

Переходим по ссылке `http://localhost:8080`

## Авторизация

Для работы Jazz SDK требуется ключ (SDK Key), который нужен для любых интеграций
c платформой видеоконференций.

[Выпустить ключ](https://developers.sber.ru/docs/ru/jazz/sdk/sdk-key)

### Получаем транспортный токен

Транспортный токен - содержит в себе зашифрованную информацию о пользователе и
позволяет запросить Jazz токен.

Jazz токен - предоставляет доступ к Jazz API.

> Рекомендуется формировать транспортный токен на стороне сервера - это позволит
> скрыть SDK Key от публичного доступа.

##### Исходник

`src/shared/utils/sdkToken.ts`

##### Пример использования

```ts
createSdkToken(SDK_KEY, {
  iss: 'JazzTestApp',
  userName: 'USER_NAME',
  sub: 'USER_ID',
})
  .then(async ({ sdkToken }) => {
    // sdkToken - транспортный токен
  })
  .catch((error) => {});
```