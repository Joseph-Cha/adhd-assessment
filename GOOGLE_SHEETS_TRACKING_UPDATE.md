# 📊 Google Sheets 유입 경로 추적 업데이트 가이드

## 개요

이 문서는 기존 Google Sheets 설정에 유입 경로 추적 기능을 추가하는 방법을 설명합니다.

**중요:** 이미 `GOOGLE_SHEETS_SETUP.md`를 따라 기본 설정을 완료한 상태여야 합니다.

---

## 변경 사항 요약

### 추가되는 데이터 필드

기존 데이터:
- 타임스탬프, 성별, 문항1-12, 총점, 결과등급

새로 추가되는 데이터:
- `utm_source` - 유입 소스 (youtube, instagram, kakaotalk 등)
- `utm_medium` - 유입 매체 (social, video, messaging 등)
- `utm_campaign` - 캠페인 이름 (adhd-jan-2025 등)
- `utm_term` - 검색 키워드 (선택)
- `utm_content` - 콘텐츠 구분 (bio-link, post-link 등)
- `referrer` - 전체 referrer URL
- `referrer_domain` - referrer 도메인만
- `user_agent` - 브라우저/기기 정보
- `screen_width` - 화면 너비
- `screen_height` - 화면 높이
- `language` - 브라우저 언어
- `source_timestamp` - 유입 경로 캡처 시각

---

## 1단계: Google Sheets 헤더 업데이트

### 기존 헤더 (A1-P1)
```
타임스탬프 | 성별 | 문항1 | 문항2 | 문항3 | 문항4 | 문항5 | 문항6 | 문항7 | 문항8 | 문항9 | 문항10 | 문항11 | 문항12 | 총점 | 결과등급
```
융ㅇㅇ
### 새로운 헤더 (A1-AB1)

기존 헤더를 유지하고, **Q1부터 AB1까지** 다음 컬럼을 추가하세요:

```
타임스탬프 | 성별 | 문항1 | 문항2 | 문항3 | 문항4 | 문항5 | 문항6 | 문항7 | 문항8 | 문항9 | 문항10 | 문항11 | 문항12 | 총점 | 결과등급 | 유입소스 | 유입매체 | 캠페인 | 검색어 | 콘텐츠 | Referrer URL | Referrer 도메인 | 브라우저정보 | 화면너비 | 화면높이 | 언어 | 소스캡처시각
```

**컬럼 매핑:**
- A: 타임스탬프
- B: 성별
- C-N: 문항1-12
- O: 총점
- P: 결과등급
- **Q: 유입소스** (utm_source)
- **R: 유입매체** (utm_medium)
- **S: 캠페인** (utm_campaign)
- **T: 검색어** (utm_term)
- **U: 콘텐츠** (utm_content)
- **V: Referrer URL** (referrer)
- **W: Referrer 도메인** (referrer_domain)
- **X: 브라우저정보** (user_agent)
- **Y: 화면너비** (screen_width)
- **Z: 화면높이** (screen_height)
- **AA: 언어** (language)
- **AB: 소스캡처시각** (source_timestamp)

---

## 2단계: Apps Script 코드 업데이트

1. Google Sheets 열기
2. 상단 메뉴: **확장 프로그램** → **Apps Script**
3. 기존 `doPost` 함수를 아래 코드로 **완전히 교체**하세요:

```javascript
function doPost(e) {
  try {
    // 스프레드시트와 시트 가져오기
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("ADHD 테스트 응답");

    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        'result': 'error',
        'message': 'Sheet not found: ADHD 테스트 응답'
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

    // 행 데이터 구성 (기존 필드 + 새로운 추적 필드)
    const row = [
      // 기존 필드
      timestamp,                                                    // A: 타임스탬프
      data.gender || 'not-provided',                               // B: 성별
      ...data.answers.map(ans => ans ? '그렇다' : '아니다'),       // C-N: 문항1-12
      data.score || 0,                                             // O: 총점
      grade,                                                        // P: 결과등급

      // 유입 경로 추적 필드 (NEW!)
      data.utm_source || 'direct',                                 // Q: 유입소스
      data.utm_medium || 'none',                                   // R: 유입매체
      data.utm_campaign || 'not-set',                              // S: 캠페인
      data.utm_term || 'not-set',                                  // T: 검색어
      data.utm_content || 'not-set',                               // U: 콘텐츠
      data.referrer || 'none',                                     // V: Referrer URL
      data.referrer_domain || 'direct',                            // W: Referrer 도메인

      // 추가 메타데이터 (NEW!)
      data.user_agent || 'unknown',                                // X: 브라우저정보
      data.screen_width || 'unknown',                              // Y: 화면너비
      data.screen_height || 'unknown',                             // Z: 화면높이
      data.language || 'unknown',                                  // AA: 언어
      data.source_timestamp || timestamp.toISOString()             // AB: 소스캡처시각
    ];

    // 시트에 행 추가
    sheet.appendRow(row);

    // 성공 응답
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Data saved successfully with tracking info',
      'row_number': sheet.getLastRow()
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
  return ContentService.createTextOutput("ADHD Test API v2.0 with Traffic Tracking is running");
}
```

4. **저장** 버튼 클릭 (💾 아이콘)

---

## 3단계: 재배포

코드를 업데이트했으므로 새 버전으로 배포해야 합니다.

### Option A: 새 배포 (권장)

1. 우측 상단 **배포** 버튼 클릭
2. **배포 관리** 선택
3. 기존 배포 옆 ✏️ (편집) 아이콘 클릭
4. **버전** 드롭다운에서 **새 버전** 선택
5. 설명 입력: "유입 경로 추적 기능 추가"
6. **배포** 버튼 클릭

**중요:** 기존 배포 URL은 그대로 유지됩니다! `app.js`의 `GOOGLE_SHEETS_URL`을 변경할 필요가 없습니다.

### Option B: 완전히 새로운 배포 (URL이 바뀜)

1. 우측 상단 **배포** 버튼 클릭 → **새 배포** 선택
2. 설명: "ADHD Test with Traffic Tracking v2.0"
3. 액세스 권한: **모든 사용자**
4. **배포** 클릭
5. **새로운 웹 앱 URL 복사**
6. `app.js`의 `GOOGLE_SHEETS_URL` 상수를 새 URL로 업데이트

---

## 4단계: 테스트

### 테스트 URL

브라우저에서 다음 URL로 접속하여 테스트:

```
http://localhost:8000/index.html?utm_source=youtube&utm_medium=video&utm_campaign=test
```

또는 실제 배포된 사이트:
```
https://yourdomain.com/index.html?utm_source=test&utm_medium=manual&utm_campaign=script-test
```

### 확인 사항

1. **브라우저 콘솔 확인**
   - F12 → Console 탭
   - "신규 방문자 - 유입 경로 캡처" 메시지 확인
   - trafficSourceData 객체 내용 확인

2. **테스트 완료 후 Google Sheets 확인**
   - 새로운 행이 추가되었는지 확인
   - Q열 (유입소스): `youtube` 또는 `test`
   - R열 (유입매체): `video` 또는 `manual`
   - S열 (캠페인): `test` 또는 `script-test`
   - V열 (Referrer URL): 실제 referrer 또는 `none`
   - X열 (브라우저정보): User-Agent 문자열

3. **다양한 시나리오 테스트**

   **테스트 1: UTM 파라미터 있음**
   ```
   ?utm_source=youtube&utm_medium=video&utm_campaign=test
   ```
   기대 결과: utm_source = "youtube"

   **테스트 2: UTM 파라미터 없음 (직접 방문)**
   ```
   http://localhost:8000/index.html
   ```
   기대 결과: utm_source = "direct"

   **테스트 3: Referrer 시뮬레이션**
   다른 웹사이트에서 링크를 클릭하여 방문
   기대 결과: utm_source = (referrer 도메인 이름), utm_medium = "referral"

---

## 5단계: 데이터 분석

### Google Sheets에서 피벗 테이블 만들기

1. 데이터 범위 선택 (A1:AB100 등)
2. 메뉴: **삽입** → **피벗 테이블**
3. 새 시트에 생성

**유용한 피벗 테이블 예시:**

#### 유입 소스별 방문자 수
- 행: 유입소스 (Q열)
- 값: COUNTA of 타임스탬프

#### 캠페인별 평균 점수
- 행: 캠페인 (S열)
- 값: AVERAGE of 총점

#### 매체별 고위험군 비율
- 행: 유입매체 (R열)
- 열: 결과등급 (P열)
- 값: COUNTA of 타임스탬프

---

## 트러블슈팅

### 문제 1: 새 컬럼에 데이터가 저장되지 않음

**원인:** Apps Script 코드가 업데이트되지 않았거나 재배포하지 않음

**해결:**
1. Apps Script 편집기에서 코드 확인
2. 저장 후 재배포
3. 브라우저 캐시 삭제 후 재테스트

### 문제 2: 모든 유입소스가 "direct"로 표시됨

**원인:** UTM 파라미터가 없는 URL 사용

**해결:**
1. UTM 파라미터가 포함된 URL 사용
2. `UTM_URL_GUIDE.md` 참고하여 올바른 URL 생성

### 문제 3: "Sheet not found" 에러

**원인:** 시트 이름이 일치하지 않음

**해결:**
1. Google Sheets에서 시트 이름 확인
2. 정확히 **"ADHD 테스트 응답"**이어야 함
3. 공백, 대소문자 주의

### 문제 4: 일부 필드가 "undefined"로 표시됨

**원인:** 프론트엔드 (`app.js`)가 최신 버전이 아님

**해결:**
1. `app.js` 파일이 최신 코드인지 확인
2. 브라우저 하드 리프레시 (Ctrl+Shift+R 또는 Cmd+Shift+R)
3. 개발자 콘솔에서 전송되는 데이터 확인

---

## 데이터 프라이버시 고려사항

### 수집되는 개인 정보

다음 정보가 Google Sheets에 저장됩니다:
- 테스트 응답 (문항 1-12)
- 성별
- 유입 경로 (UTM 파라미터, Referrer)
- 기기 정보 (User-Agent, 화면 해상도, 언어)

### 개인 식별 정보는 수집하지 않음

- 이름, 이메일, 전화번호 수집 안 함
- IP 주소 수집 안 함
- 정확한 위치 정보 수집 안 함

### 권장 사항

1. **개인정보 처리방침 작성**
   - 어떤 데이터를 수집하는지 명시
   - 데이터 사용 목적 설명
   - 보관 기간 명시

2. **Google Sheets 접근 권한 제한**
   - 필요한 사람만 시트 접근 가능하도록 설정
   - 외부 공유 금지

3. **정기적인 데이터 삭제**
   - 분석 완료 후 오래된 데이터 삭제
   - 최소 보관 원칙 준수

---

## 다음 단계

1. ✅ Google Sheets 헤더 업데이트 완료
2. ✅ Apps Script 코드 업데이트 완료
3. ✅ 재배포 완료
4. ✅ 테스트 완료
5. ⬜ `UTM_URL_GUIDE.md` 참고하여 채널별 UTM URL 생성
6. ⬜ 각 채널에 UTM URL 배포
7. ⬜ 주기적으로 데이터 분석하여 인사이트 도출

---

## 참고 문서

- `GOOGLE_SHEETS_SETUP.md` - 기본 Google Sheets 설정
- `UTM_URL_GUIDE.md` - UTM 파라미터 URL 생성 및 사용 가이드
- `app.js:48-140` - 트래픽 소스 추적 코드

---

**업데이트 날짜:** 2025-01-15
**버전:** 2.0 (유입 경로 추적 추가)

## 요약

이 업데이트를 통해:
- ✅ 어떤 채널에서 방문자가 왔는지 추적 가능
- ✅ 캠페인별 성과 측정 가능
- ✅ 데이터 기반 마케팅 의사결정 가능
- ✅ ROI 분석 가능

**중요:** 반드시 UTM 파라미터가 포함된 URL을 사용해야 정확한 추적이 가능합니다!
