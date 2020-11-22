

import Todo from './Todo.js';


export default function defineModels(connection) {
    [
        Todo
    ].forEach(defineModel => defineModel(connection));
}



