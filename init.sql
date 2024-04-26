-- Active: 1707208765864@@127.0.0.1@3306@petstay

show TABLES

DESC users

SELECT * from users

SELECT * from sitters

DELETE FROM `users` WHERE `useridx` IN (4,5,6,7)

SELECT * from reservations

UPDATE reservations set confirm=REPLACE(confirm,"approved","request")

INSERT INTO `reservations`(`resvidx`,`content`,`price`,`startTime`,`endTime`,`type`,`animalNumber`,`createdAt`,`updatedAt`,`confirm`,`date`)
VALUES(3,'예약 내용',10000,240428,240428,'dog',2,'2024-04-26 00:00:00','2024-04-26 00:00:00','request','2024-04-26 00:00:00');

INSERT INTO users (userid, userpw, name, address, usertype) VALUES ( "aaa", "aaapw", "name1","address1", "user");
INSERT INTO users (userid, userpw, name, address, usertype) VALUES ("bbb", "bbbpw", "name2","address2", "user");
INSERT INTO users (userid, userpw, name, address, usertype) VALUES ("ccc", "cccpw", "name3","address3", "sitter");
INSERT INTO users (userid, userpw, name, address, usertype) VALUES ("ddd", "dddpw", "name4","address4", "sitter");

INSERT INTO sitters (type, license, career, selfIntroduction, pay, confirm, useridx) VALUES ("강아지", "반려동물 자격증", "동물 훈련사 경력 5년","안녕하세요", 50000, true, 3);
INSERT INTO sitters (type, license, career, selfIntroduction, pay, confirm, useridx) VALUES ("고양이", "해당사항없음", "동물 훈련사 경력 2","반가워요!", 30000, true, 4);