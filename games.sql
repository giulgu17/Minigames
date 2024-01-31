CREATE DATABASE Tris;
USE Tris;
CREATE TABLE Partite(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    giocatore1 VARCHAR(30),
    giocatore2 VARCHAR(30),
    vincitore VARCHAR(30),
    cas1 VARCHAR(1),
    cas2 VARCHAR(1),
    cas3 VARCHAR(1),
    cas4 VARCHAR(1),
    cas5 VARCHAR(1),
    cas6 VARCHAR(1),
    cas7 VARCHAR(1),
    cas8 VARCHAR(1),
    cas9 VARCHAR(1)
);

DROP TABLE Partita;