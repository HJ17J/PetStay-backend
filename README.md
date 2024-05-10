
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

오프라인에 존재했던 롤링페이퍼 서비스를 온라인으로 옮겨왔습니다.

## :baby_chick: Demo
(↑해당 프로젝트가 실제 배포되고 있지 않아서, 이미지로 프로젝트의 뷰를 대체할 경우)
![2024-05-10110133-ezgif com-video-to-gif-converter](https://github.com/HJ17J/PetStay-backend/assets/154948606/f490d07c-a792-4757-9fe7-f05bd180aed7)


## ⭐ Main Feature
### 정기 결제 기능
- 아임포트(Iamport)를 이용한 정기 결제 기능 구현

### 회원가입 및 로그인 
- JWT 이용

### 기타 기능
- 상품 리스트 조회 및 세부 사항 조회
- 마이페이지

## 💻 Getting Started
(↑해당 프로젝트 설치 및 실행 방법)

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
npm run build
```

## 🔧 Stack
- **Language**: JavaScript
- **Library & Framework** : Node.js
- **Database** : AWS RDS (MariaDB)
- **ORM** : Sequelize
- **Deploy**: AWS EC2

## :open_file_folder: Project Structure

```markdown
src
├── common
│   ├── config
│   ├── types
│   └── utils
│       ├── types
│       └── utils
├── controller
├── entity
├── infrastructure
│   ├── express
│   └── typeorm
├── repository
└── ser
```

## 🔨 Server Architecture
(↑서버 아키텍처에 대한 내용을 그림으로 표현함으로써 인프라를 어떻게 구축했는 지 한 눈에 보여줄 수 있다.)
![](https://docs.aws.amazon.com/gamelift/latest/developerguide/images/realtime-whatis-architecture-vsd.png)

## ⚒ CI/CD
- github actions를 활용해서 지속적 통합 및 배포
- `feature` 브랜치에서 `dev`로 Pull Request를 보내면, CI가 동작된다.
- `dev`에서 `master`로 Pull Request를 보내면, CI가 동작되고 Merge가 되면, 운영 리소스에 배포된다.

## 👨‍💻 Role & Contribution

**Frontend (Web)**

- 관리자 페이지 (Vue.js) 개발
- 전체 아키텍처 구성

**Devops**

- CI/CD 구축 (Docker, Github Action)
- 서버 모니터링

**etc**

- 전체 개발 일정 및 이슈 관리

## 👨‍👩‍👧‍👦 Developer
*  **박재성** ([jaeseongDev](https://github.com/jaeseongDev))
*  **고성진** ([seongjin96](https://github.com/seongjin96))
*  **조연희** ([yeoneei](https://github.com/yeoneei))
