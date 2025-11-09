# 📊 Google Sheets 연동 설정 가이드

ADHD 평가 결과를 Google Sheets에 자동으로 저장하는 방법입니다.

## 1단계: Google Sheets 준비

### Option A: 새 스프레드시트 생성
1. [Google Sheets](https://sheets.google.com) 접속
2. 새 스프레드시트 만들기
3. 시트 이름: **"ADHD 테스트 응답"**

### Option B: 기존 Google Form 스프레드시트에 시트 추가 (추천)
1. Google Form 응답 스프레드시트 열기
2. 하단의 **+** 버튼 클릭하여 새 시트 추가
3. 시트 이름: **"ADHD 테스트 응답"**

### "ADHD 테스트 응답" 시트 헤더 행 작성

첫 번째 시트("ADHD 테스트 응답")의 첫 번째 행에 다음 내용을 입력하세요:

```
타임스탬프 | 성별 | 문항1 | 문항2 | 문항3 | 문항4 | 문항5 | 문항6 | 문항7 | 문항8 | 문항9 | 문항10 | 문항11 | 문항12 | 총점 | 결과등급 | UTM소스 | UTM매체 | UTM캠페인 | UTM검색어 | UTM콘텐츠 | 리퍼러 | 리퍼러도메인 | 사용자에이전트 | 화면너비 | 화면높이 | 언어 | 소스캡처시각
```

### "이메일 구독" 시트 추가 및 헤더 작성

1. 하단의 **+** 버튼을 클릭하여 새 시트 추가
2. 시트 이름을 **"이메일 구독"**으로 변경
3. 첫 번째 행에 다음 헤더를 입력하세요:

```
타임스탬프 | 이메일 | 동의여부 | 점수 | 성별 | UTM소스 | UTM매체 | UTM캠페인 | 사용자에이전트
```

---

## 2단계: Apps Script 작성

1. 스프레드시트 상단 메뉴: **확장 프로그램** → **Apps Script** 클릭

2. 기존 코드를 모두 지우고 아래 코드를 붙여넣으세요:

```javascript
function doPost(e) {
  try {
    // POST 데이터 파싱
    const data = JSON.parse(e.postData.contents);

    // 데이터 타입 확인
    if (data.type === 'email_subscription') {
      // 이메일 구독 데이터 처리
      return handleEmailSubscription(data);
    } else {
      // 일반 테스트 결과 데이터 처리
      return handleTestResult(data);
    }

  } catch (error) {
    // 에러 응답
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 일반 테스트 결과 처리 함수
function handleTestResult(data) {
  // 스프레드시트와 시트 가져오기
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("ADHD 테스트 응답");

  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': 'Sheet "ADHD 테스트 응답" not found'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 타임스탬프 생성
  const timestamp = new Date();

  // 결과 등급 판단
  let grade = '';
  if (data.score >= 0 && data.score <= 2) grade = '저위험';
  else if (data.score >= 3 && data.score <= 5) grade = '경도';
  else if (data.score >= 6 && data.score <= 8) grade = '중등도';
  else if (data.score >= 9 && data.score <= 12) grade = '고위험';

  // 행 데이터 구성
  const row = [
    timestamp,
    data.gender || 'skip',
    ...data.answers.map(ans => ans ? '그렇다' : '아니다'),
    data.score,
    grade,
    data.utm_source || 'not-set',
    data.utm_medium || 'not-set',
    data.utm_campaign || 'not-set'
  ];

  // 시트에 행 추가
  sheet.appendRow(row);

  // 성공 응답
  return ContentService.createTextOutput(JSON.stringify({
    'result': 'success',
    'message': 'Test result saved successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}

// 이메일 구독 데이터 처리 함수
function handleEmailSubscription(data) {
  // 스프레드시트와 시트 가져오기
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("이메일 구독");

  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': 'Sheet "이메일 구독" not found'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 타임스탬프 생성
  const timestamp = new Date();

  // 행 데이터 구성
  const row = [
    timestamp,
    data.email,
    data.consent ? '동의' : '미동의',
    data.score,
    data.gender || 'skip',
    data.utm_source || 'not-set',
    data.utm_medium || 'not-set',
    data.utm_campaign || 'not-set',
    data.user_agent || 'unknown'
  ];

  // 시트에 행 추가
  sheet.appendRow(row);

  // 성공 응답
  return ContentService.createTextOutput(JSON.stringify({
    'result': 'success',
    'message': 'Email subscription saved successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput("ADHD Test API is running");
}
```

3. 파일 이름: **"ADHD_Data_Collector"** (선택사항)

4. **저장** 버튼 클릭 (💾 아이콘)

---

## 3단계: 웹 앱으로 배포

### 최초 배포 시

1. 우측 상단 **배포** 버튼 클릭 → **새 배포** 선택

2. 설정:
   - **유형 선택**: ⚙️ 아이콘 클릭 → **웹 앱** 선택
   - **설명**: "ADHD Test Data Collector" (선택사항)
   - **다음 계정으로 실행**: **나**
   - **액세스 권한**: **모든 사용자** 선택

3. **배포** 버튼 클릭

### 기존 배포 업데이트 시 (코드 수정 후)

1. 우측 상단 **배포** 버튼 클릭 → **배포 관리** 선택

2. 기존 배포 항목 옆 **수정** 아이콘(연필 모양) 클릭

3. **버전**: **새 버전** 선택

4. **배포** 버튼 클릭

### 권한 승인 (최초 배포 시)

1. **액세스 권한 부여** 클릭
2. Google 계정 선택
3. "Google에서 확인하지 않은 앱입니다" 경고가 나타나면:
   - **고급** 클릭
   - **[프로젝트 이름](안전하지 않음)으로 이동** 클릭
4. **허용** 클릭

### 웹 앱 URL 확인

배포 완료 후 나타나는 URL을 복사하세요:
- 형식: `https://script.google.com/macros/s/AKfycby.../exec`
- 이 URL은 이미 app.js에 설정되어 있다면 변경할 필요가 없습니다

---

## 4단계: 웹 앱 URL을 코드에 적용

1. `app.js` 파일을 엽니다

2. 다음 줄을 찾습니다:
```javascript
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxt07-OoDhRFKBzfXSy0rfYFTh-5XWzIccby4aNh3kXT17S3bSSClCk93dsAI9x4V9oog/exec';
```

3. `YOUR_WEB_APP_URL_HERE`를 복사한 웹 앱 URL로 교체합니다:
```javascript
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
```

4. 파일을 저장합니다

---

## 5단계: 테스트

1. 웹 페이지에서 ADHD 테스트를 완료합니다

2. Google Sheets로 돌아가서 데이터가 추가되었는지 확인합니다

3. 확인할 내용:
   - 타임스탬프가 제대로 기록되었는지
   - 모든 문항 응답이 정확한지
   - 총점과 결과등급이 올바른지

---

## 🔧 문제 해결

### 데이터가 저장되지 않는 경우

1. **Apps Script 로그 확인**
   - Apps Script 에디터에서 **실행** → **doPost** 선택
   - 하단 **실행 로그** 확인

2. **시트 이름 확인**
   - 시트 이름이 정확히 **"ADHD 테스트 응답"**인지 확인

3. **웹 앱 URL 확인**
   - app.js의 URL이 올바르게 입력되었는지 확인
   - URL 끝에 `/exec`가 있는지 확인

4. **브라우저 콘솔 확인**
   - F12 키를 눌러 개발자 도구 열기
   - Console 탭에서 에러 메시지 확인

### 권한 에러가 발생하는 경우

1. Apps Script 배포 설정 확인:
   - **액세스 권한**이 **모든 사용자**로 설정되었는지 확인

2. 재배포:
   - **배포** → **배포 관리** → 기존 배포 옆 **수정** 아이콘
   - **버전**: **새 버전** 선택
   - **배포** 클릭

---

## 📊 데이터 구조

### "ADHD 테스트 응답" 시트

| 컬럼 | 설명 | 예시 |
|:---|:---|:---|
| 타임스탬프 | 테스트 완료 시간 | 2025-11-03 15:30:22 |
| 성별 | 선택한 성별 | 남성 / 여성 / skip |
| 문항1~12 | 각 문항 응답 | 그렇다 / 아니다 |
| 총점 | 그렇다 응답 개수 | 0~12 |
| 결과등급 | 위험도 분류 | 저위험 / 경도 / 중등도 / 고위험 |
| UTM소스 | 유입 소스 | youtube / instagram / direct |
| UTM매체 | 유입 매체 | video / social / referral |
| UTM캠페인 | 캠페인명 | adhd-jan-2025 |
| UTM검색어 | 검색어 (선택) | not-set |
| UTM콘텐츠 | 콘텐츠 구분 (선택) | community-post |
| 리퍼러 | 전체 리퍼러 URL | https://bit.ly/4oNvE2m |
| 리퍼러도메인 | 리퍼러 도메인 | bit.ly |
| 사용자에이전트 | 브라우저 정보 | Mozilla/5.0... |
| 화면너비 | 화면 해상도 너비 | 1440 |
| 화면높이 | 화면 해상도 높이 | 900 |
| 언어 | 브라우저 언어 | ko-KR |
| 소스캡처시각 | 최초 방문 시각 | 2025-11-07T10:42:57.505Z |

### "이메일 구독" 시트 (9~12점 고위험군 대상)

| 컬럼 | 설명 | 예시 |
|:---|:---|:---|
| 타임스탬프 | 이메일 등록 시간 | 2025-11-03 15:35:10 |
| 이메일 | 사용자 이메일 | user@example.com |
| 동의여부 | 개인정보 수집 동의 | 동의 / 미동의 |
| 점수 | ADHD 테스트 점수 | 9~12 |
| 성별 | 선택한 성별 | 남성 / 여성 / skip |
| UTM소스 | 유입 소스 | youtube / instagram / direct |
| UTM매체 | 유입 매체 | video / social / referral |
| UTM캠페인 | 캠페인명 | test-campaign |
| 사용자에이전트 | 브라우저 정보 | Mozilla/5.0... |

---

## ✅ 완료!

이제 사용자가 테스트를 완료할 때마다 자동으로 Google Sheets에 데이터가 저장됩니다.

### 데이터 저장 로직

1. **일반 테스트 결과**: 모든 사용자의 테스트 결과가 "ADHD 테스트 응답" 시트에 자동 저장됩니다
2. **이메일 구독**: 고위험군(9~12점) 사용자가 이메일을 입력하면 "이메일 구독" 시트에 별도로 저장됩니다

### 주의사항

- 코드를 수정한 경우 Apps Script를 **새 버전으로 재배포**해야 변경사항이 적용됩니다
- 두 개의 시트("ADHD 테스트 응답", "이메일 구독")가 모두 존재하는지 확인하세요
- 헤더 행이 정확히 입력되어 있는지 확인하세요
