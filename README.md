# WatchlistApp

This app should allow its users to search for movies and add them to their "Watch Later" list.

## Pages

The app consists of 3 pages:

- "Watch later" list page
- "Search" page, where user can search for movies
- "Title" page, where user can view information about a movie

## Requirements per page:

### Watch later page

User should be able to:

- View movies added to the list (poster and title)
- Mark movies as watched/completed
- Remove movies from the list
- Navigate to search page
- Navigate to Title page by clicking movie tile

List should be saved in localStorage, so it remains after user reloads the page.

### Search page

User should be able to:

- Search for a movie by typing its title in search input
- Add movie to the list by clicking a button on the corresponding button on a search result tile
- Go to movie page by clicking on a result tile

Search results should be displayed as tiles with poster and title. Also, a "Add to your list" button should be displayed on hover. Loading and "No results" states would be great as well.

### Title page

User should be able to:

- View information about a movie (poster, title, rating, etc)
- Add movie to the list
- Remove movie from a list


### API
This app uses AMDB API: http://www.omdbapi.com/

Please get your API key there and insert it api.service


### Additional requirements

- Whilst implementation is up to you, please try to follow what's already written.
- Making pages lazy-loaded would be a plus
- Design is up to you as well :) No need for something super-special, just make something simple enough for it to look good and also demonstrate your styling skills.
- Unit tests would be great.
- Please upload a solution to github private repository.

### comand for test coverage

ng test --no-watch --code-coverage

//task далее себе
//подумать где могу сделать сигналы
//сделать реактивную форму отдельным компонентом и кнопку с серча и какой то фейковый запрос отправлять в локал сторадж
//а потом из него брать список типа запросов и подгружать есть ли такие фильмы
//как вариант добавить логин пароль авторизацию и добавить интерсепторы 
//и сделать чтобы пользователя выбивало как вариант каждый час и показывало сообщение типа вам нужно снова авторизоваться
