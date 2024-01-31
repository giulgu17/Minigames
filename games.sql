CREATE DATABASE Tris;
USE Tris;

CREATE TABLE Partite(
    id int PRIMARY KEY /*AUTO_INCREMENT*/,
    p1 VARCHAR(30),
    p2 VARCHAR(30),
    stato VARCHAR(30),
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

INSERT INTO partite (id, p1, p2, stato, vincitore, cas1, cas2, cas3, cas4, cas5, cas6, cas7, cas8, cas9)
    VALUES (NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

DROP TABLE partite