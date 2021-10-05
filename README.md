# MindMirror
#### Mind Mirror : NLP(자연어 처리) 기술 기반으로 일기를 감정에 대한 유의미한 정보를 제공하는 반응형 웹/앱
#### 팀 멤버 : 양태오, 김선호, 변찬호, 차동엽


# 특징
* 일기를 토대로 분석하여 감정과 상황 정보를 추출
* 일기속 감정데이터 시각화 된 페이지 제공
* 사용자 및 일기, 감정분석 결과 일자별 정보 관리
* 대표 감정 유발 대표 상황 제공

#구현 된 기능
* Oauth 카카오 로그인 및 회원가입 구현
* 정보 관리를 위한 DB 구축
* 달력 선택을 통한 일자별 감정분석페이지 접근
* 일별 최근1주 월별 감정 데이터 시각화 페이지 구현
* 일기 분석을 통해 감정 추출 모델
* 일기 분석을 통해 상황 추출 모델

# 역할 분담
    양태오 : NLP BERT 모델 개발
    김선호 : 데이터 전처리 및 후처리
    변찬호 : NLP BERT 모델 개발
    차동엽 : 웹 서비스 구현(프론트 & 백엔드)
    
# 전체 페이지 UI
<img width="800" alt="스크린샷 2021-10-06 오전 5 12 34" src="https://user-images.githubusercontent.com/64008899/136095721-929da116-42ac-4240-a467-590f5d1970f0.png">


# 전체 시스템 구상도

![화면 캡처 2021-10-06 042547](https://user-images.githubusercontent.com/38696775/136089898-4ebf2a9d-0dd1-468b-b085-c5a33dc0ba1d.jpg)


# 일기 분석 모듈 구상도

![image](https://user-images.githubusercontent.com/38696775/136090131-b2c3ed8a-8cf3-4ad2-841b-dc0ecd879504.png)

# 감정 및 상황 예측 시스템

![image](https://user-images.githubusercontent.com/38696775/136090237-f955f203-687f-44ea-a5dc-9706a6e98d66.png)

# 파일 개요
* Analysis_Note_System.ipynb : 일기 분석 모듈 
* Emotion_model.ipynb : 감정 예측 시스템
* Situation_model.ipynb : 상황 예측 시스템

