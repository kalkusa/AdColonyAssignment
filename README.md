# AdColony JS Skill Test

Next to this README file you can find `weather-todo-app` package that contains server and React project.
The goal of this assignment is to finish work on that package and create TODO app that additionally displays current weather.
For weather data please use [https://openweathermap.org/](https://openweathermap.org/).

More technical details on `weather-todo-app` package you can find in README inside the package.


## Frontend


Modify existing React app and add TODO and weather functionality.
Use redux to maintain the state.

Layout should consist of two columns
 - sidebar where you'd display current weather info
 - main content with list/controls of TODOs

TODO Functionality:
 - add TODOs
 - remove TODOs
 - edit TODOs
 - TODOs should be persistent (saved in db)
 - optionaly add TODO search and sort

Weather functionality:
 - show current weather
 - if the temperature is above 25C / 77F, show it in red otherwise green
 - if the user hovers the temperature, show a tooltip (any)

Service doesn't require any credentials or login data so whoever knows the URL can maintain the state. Multiple simultanious session suport is not needed as well (althought might be a plus).

## Backend


Modify existing server based on expressJS to handle all needed actions for frontend.

Store TODOs in MySQL database. DB structure is attached (`weather-todo.sql` next to this README file)




