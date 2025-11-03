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

### 헤더 행 작성 (A1부터 시작)

다음 내용을 첫 번째 행에 입력하세요:

```
타임스탬프 | 성별 | 문항1 | 문항2 | 문항3 | 문항4 | 문항5 | 문항6 | 문항7 | 문항8 | 문항9 | 문항10 | 문항11 | 문항12 | 총점 | 결과등급
```

---

## 2단계: Apps Script 작성

1. 스프레드시트 상단 메뉴: **확장 프로그램** → **Apps Script** 클릭

2. 기존 코드를 모두 지우고 아래 코드를 붙여넣으세요:

```javascript
function doPost(e) {
  try {
    // 스프레드시트와 시트 가져오기
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("ADHD 테스트 응답");

    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        'result': 'error',
        'message': 'Sheet not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // POST 데이터 파싱
    const data = JSON.parse(e.postData.contents);

    // 타임스탬프 생성
    const timestamp = new Date();

    // 결과 등급 판단
    let grade = '';
    if (data.score >= 0 && data.score <= 3) grade = '저위험';
    else if (data.score >= 4 && data.score <= 6) grade = '주의';
    else if (data.score >= 7 && data.score <= 9) grade = '중위험';
    else if (data.score >= 10 && data.score <= 12) grade = '고위험';

    // 행 데이터 구성
    const row = [
      timestamp,
      data.gender,
      ...data.answers.map(ans => ans ? '그렇다' : '아니다'),
      data.score,
      grade
    ];

    // 시트에 행 추가
    sheet.appendRow(row);

    // 성공 응답
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // 에러 응답
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("ADHD Test API is running");
}
```

3. 파일 이름: **"ADHD_Data_Collector"** (선택사항)

4. **저장** 버튼 클릭 (💾 아이콘)

---

## 3단계: 웹 앱으로 배포

1. 우측 상단 **배포** 버튼 클릭 → **새 배포** 선택

2. 설정:
   - **유형 선택**: ⚙️ 아이콘 클릭 → **웹 앱** 선택
   - **설명**: "ADHD Test Data Collector" (선택사항)
   - **다음 계정으로 실행**: **나**
   - **액세스 권한**: **모든 사용자** 선택

3. **배포** 버튼 클릭

4. 권한 승인:
   - **액세스 권한 부여** 클릭
   - Google 계정 선택
   - "Google에서 확인하지 않은 앱입니다" 경고가 나타나면:
     - **고급** 클릭
     - **[프로젝트 이름](안전하지 않음)으로 이동** 클릭
   - **허용** 클릭

5. **웹 앱 URL 복사**
   - 배포 완료 후 나타나는 URL 복사
   - 형식: `https://script.google.com/macros/s/AKfycby.../exec`

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

Google Sheets에 저장되는 데이터:

| 컬럼 | 설명 | 예시 |
|:---|:---|:---|
| 타임스탬프 | 테스트 완료 시간 | 2025-11-03 15:30:22 |
| 성별 | 선택한 성별 | 남성 / 여성 / skip |
| 문항1~12 | 각 문항 응답 | 그렇다 / 아니다 |
| 총점 | 그렇다 응답 개수 | 0~12 |
| 결과등급 | 위험도 분류 | 저위험/주의/중위험/고위험 |

---

## ✅ 완료!

이제 사용자가 테스트를 완료할 때마다 자동으로 Google Sheets에 데이터가 저장됩니다.

고위험군(총점 10~12)에게는 인터뷰 참여 안내가 표시됩니다.
