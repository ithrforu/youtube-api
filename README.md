## Youtube API usage example
### Поиск и загрузка видео на страницу с помощью youtube API.

1. По нажатию кнопки `submit` отправляется get запрос через API. Ответ будет содержать массив с объектами, содержащими данные видеороликов.
2. Для каждого объекта загружается обложка видео и кнопка запуска.
3. После нажатия по обложке загружается элемент `iframe`.

[Demo](https://ithrforu.github.io/youtube-api/).