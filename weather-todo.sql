
CREATE DATABASE `WeatherTodo` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE `WeatherTodo`.`Todos` (
    `id` INT UNSIGNED 
        NOT NULL 
        PRIMARY KEY 
        AUTO_INCREMENT,
    `uuid` CHAR(40)
        CHARACTER SET ascii 
        COLLATE ascii_general_ci
        NOT NULL
        UNIQUE,
    `title` VARCHAR(64) NOT NULL,
    `description` MEDIUMTEXT,
    `priority` TINYINT UNSIGNED NOT NULL DEFAULT '0',
    `createdAt` DATETIME NOT NULL DEFAULT NOW(),
    `updatedAt` DATETIME NOT NULL DEFAULT NOW()
);


