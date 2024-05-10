
# 👨‍👩‍👦‍👦 Pet Stay 👨‍👩‍👦‍👦 

[![license](https://img.shields.io/badge/License-AGPL-red)](https://github.com/NDjust/Generate-HeadLine/blob/master/LICENSE)
[![code](https://img.shields.io/badge/Code-Python3.7-blue)](https://docs.python.org/3/license.html)
[![data](https://img.shields.io/badge/Data-news-blueviolet)](https://news.chosun.com/ranking/list.html)
[![member](https://img.shields.io/badge/Project-Member-brightgreen)](https://github.com/NDjust/Generate-HeadLine/blob/Feature_README/README.md#participation-member)
[![DBMS](https://img.shields.io/badge/DBMS-MySQL-orange)](https://www.mysql.com/downloads/)

(↑관련된 뱃지 달기)

> ### 반려인과 펫시터를 연결시켜주는 중개 사이트 👉 https://rollingpaper.site/

(↑프로젝트 한 줄 설명 : 설명을 장황하게 작성하는 것보다 한 줄로 어떤 프로젝트인지 설명하는 것이 훨씬 직관적이다.)

![image](https://github.com/HJ17J/PetStay-backend/assets/154948606/1a19b76e-2e17-497e-bf9c-01daef8c482d)


## 📖 Description

강아지, 고양이 및 모든 반려동물을 취급하는 반려인-펫시터 중개 사이트입니다.

1시간부터 여러 날까지 유연하게 선택이 가능합니다.

펫시터가 의뢰인 동물만 관리하도록 1대1 매칭 및 소통이 됩니다.

번역기능을 추가해서 외국인도 사용가능하게끔 구현하는 것이 목표입니다.

## :baby_chick: Demo
![2024-05-10110133-ezgif com-video-to-gif-converter](https://github.com/HJ17J/PetStay-backend/assets/154948606/f490d07c-a792-4757-9fe7-f05bd180aed7)

## ⭐ Main Feature
### 예약 관리 기능
- react-calendar를 사용하여 예약 일정 선택 기능 구현
- sequelize로 db저장

### 회원가입 및 로그인 
- session-express 사용

### 채팅방 기능
- socekt.io를 사용하여 실시간 채팅 구현
- aws의 s3를 사용하여 이미지 저장 및 경로를 소켓으로 전송할 수 있도록 구현

## 💻 Getting Started

### Installation
```
npm install
```
### Develop Mode
```
npm run dev
```
### Production
```
npm start
```

## 🔧 Stack
- **Language**: JavaScript
- **Library & Framework** : Node.js
- **Database** : AWS RDS (Mysql)
- **ORM** : Sequelize
- **Deploy**: AWS EC2

## :open_file_folder: Project Structure

```markdown
frontend
├── public
│   ├── images
├── src
    ├── components
    └── config
    └── locales
    └── pages
    └── store
    └── styles
    └── types
├── App.tsx
├── index.tsx
backend
├── config
├── controller
├── models
├── routes
├── sockets
├── app.js
```

## 👨‍💻 Role & Contribution

![image](https://github.com/HJ17J/PetStay-backend/assets/107241014/65e4ee30-7446-45bc-afab-2b22c5696518)

## 👨‍👩‍👧‍👦 Developer
*  **신동원** ([eastorigin](https://github.com/eastorigin))
*  **이형석** ([yhs0329](https://github.com/yhs0329))
*  **임학민** ([sabb12](https://github.com/sabb12)
*  **진현정** ([HJ17J](https://github.com/HJ17J))
*  **홍주희** ([hjh3933](https://github.com/hjh3933))
