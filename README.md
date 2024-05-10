
# 👨‍👩‍👦‍👦 PetStay 👨‍👩‍👦‍👦 
## 반려인과 펫시터를 연결시켜주는 중개 사이트 👉 http://13.124.54.214/
![image](https://github.com/HJ17J/PetStay-backend/assets/57868607/c7cca7cd-e886-4cb8-8822-5491bf2b238b)

### 작업 기간: 2024.04.19 ~ 2024.05.08
### 인원: 5명(프론트엔드 2명, 프론트앤백 3명)
### 로그인:
- ID: `user`
- PW: `user`

## 📖 Description

<p style="font-size: 18px;"><b>✨2차 팀프로젝트 대상 수상작</b></p>
<div markdown="1">

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
