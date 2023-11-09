# React 부동산 직거래 웹사이트
**개발기간: 2023.09.06 ~ 2022.09.28 (약 3주)

## 배포 주소
> [https://real-estate-red-two.vercel.app/](https://real-estate-red-two.vercel.app/) <br>

## 프로젝트 소개

부동산을 사고팔 때, 중개업체를 거치지 않고 직거래로 거래를 진행하고 싶은 사람들을 위해 준비한 웹사이트 입니다. 부동산 거래를 간편하고 효율적으로 진행할 수 있는 플랫폼으로, 구매자와 판매자 간의 직거래를 촉진하고자 합니다. 웹사이트를 통해 부동산 거래를 직거래로 진행할 수 있는 다양한 기회를 제공하고, 중개업체의 수수료를 줄일 수 있도록 돕고 있습니다.


사이트를 방문하여 다양한 부동산 매물을 확인하고, 직거래로 부동산 거래의 혜택을 누려보세요.

---
## 주요 기능

### ⭐️ 지도
- 카카오맵 API를 사용한 넓은 지도를 제공해 원하는 지역의 매물을 한 눈에 확인할 수 있습니다.

### ⭐️ 다양한 옵션
- 매매, 전세, 월세 등 다양한 유형의 매물을 제공합니다. 또한 검색을 통해 원하는 지역에 맞는 부동산을 쉽게 찾을 수 있습니다.

### ⭐️ 직거래 채팅
- 관심있는 부동산 매물에 대한 질문이나 협상을 웹사이트 내에서 직접 판매자와 소통할 수 있습니다.

### ⭐️ 매물 등록
- 나의 매물에 다양한 조건을 설정하여 간단하게 등록할 수 있습니다.

---

## 폴더 구조
```
📦src
 ┣ 📂assets
 ┃ ┗ 📂svg
 ┃ ┃ ┣ 📜custom.d.ts
 ┃ ┃ ┗ 📜spinner.svg
 ┣ 📂components
 ┃ ┣ 📜Button.tsx
 ┃ ┣ 📜Carousel.tsx
 ┃ ┣ 📜ChatRoom.tsx
 ┃ ┣ 📜DropdownMenu.tsx
 ┃ ┣ 📜Editor.tsx
 ┃ ┣ 📜EmptyState.tsx
 ┃ ┣ 📜Header.tsx
 ┃ ┣ 📜Input.tsx
 ┃ ┣ 📜ListingItem.tsx
 ┃ ┣ 📜MenuIcon.tsx
 ┃ ┣ 📜Message.tsx
 ┃ ┣ 📜OptionBtn.tsx
 ┃ ┣ 📜PrivateRoute.tsx
 ┃ ┣ 📜ResearchAddress.tsx
 ┃ ┣ 📜SideSlider.tsx
 ┃ ┣ 📜Spinner.tsx
 ┃ ┗ 📜Toast.tsx
 ┣ 📂hooks
 ┃ ┣ 📜useAuthStatus.tsx
 ┃ ┗ 📜useSnapShot.tsx
 ┣ 📂interfaces
 ┃ ┗ 📜interfaces.ts
 ┣ 📂pages
 ┃ ┣ 📜Chat.tsx
 ┃ ┣ 📜CreateListing.tsx
 ┃ ┣ 📜Detail.tsx
 ┃ ┣ 📜EditListing.tsx
 ┃ ┣ 📜FavoriteListings.tsx
 ┃ ┣ 📜ForgotPassword.tsx
 ┃ ┣ 📜Home.tsx
 ┃ ┣ 📜MyListings.tsx
 ┃ ┣ 📜Profile.tsx
 ┃ ┣ 📜Signin.tsx
 ┃ ┗ 📜Signup.tsx
 ┣ 📂reducers
 ┃ ┗ 📜formReducer.tsx
 ┣ 📂store
 ┃ ┣ 📂features
 ┃ ┃ ┣ 📜alertSlice.ts
 ┃ ┃ ┗ 📜mapSlice.ts
 ┃ ┗ 📜store.ts
 ┣ 📂utils
 ┃ ┗ 📜numberToKorean.ts
 ┣ 📜App.tsx
 ┣ 📜firebase.ts
 ┣ 📜index.css
 ┗ 📜index.tsx
```
---

## 기술 스택

### Environment
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white)
![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)             

### Config
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)        

### Development
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white)
![Tailwind-CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=Tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=Firebase&logoColor=white)
![RTK](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=Redux&logoColor=white)
---
## 화면 구성
| 로그인 페이지  |  회원가입 페이지   |
| :-------------------------------------------: | :------------: |
|  <img width="400" alt="스크린샷 2023-11-08 오후 7 04 19" src="https://github.com/geonwooPark/Real-estate/assets/136573728/f05a1b9b-7d67-418b-bebf-94b824136e3a"> |  <img width="400" alt="스크린샷 2023-11-08 오후 7 04 28" src="https://github.com/geonwooPark/Real-estate/assets/136573728/e04f154c-8647-4a04-bce6-3dfd7b32f423">|  
| 메인 페이지   |  상세 페이지   |  
| <img width="400" alt="스크린샷 2023-11-10 오전 2 50 26" src="https://github.com/geonwooPark/Real-estate/assets/136573728/298268b0-e914-4c4c-b62a-0352c203fd84"> |  <img width="400" alt="스크린샷 2023-11-08 오후 7 05 45" src="https://github.com/geonwooPark/Real-estate/assets/136573728/23e7d106-dced-4e55-9a40-21015940869b">|
| 채팅 페이지  |  매물등록 페이지   |
|  <img width="400" alt="스크린샷 2023-11-08 오후 7 08 21" src="https://github.com/geonwooPark/Real-estate/assets/136573728/335311d1-c785-4c0e-9332-620d633f2fed"> |  <img width="400" alt="스크린샷 2023-11-08 오후 7 06 03" src="https://github.com/geonwooPark/Real-estate/assets/136573728/5c128998-c14d-4c06-9f0a-d8f6e00899a0">|  
