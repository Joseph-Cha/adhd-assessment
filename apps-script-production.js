// ADHD 테스트 - Google Apps Script (프로덕션 버전)
// 이메일 구독 기능 포함

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
    data.utm_campaign || 'not-set',
    data.utm_term || 'not-set',
    data.utm_content || 'not-set',
    data.referrer || 'none',
    data.referrer_domain || 'direct',
    data.user_agent || 'unknown',
    data.screen_width || '',
    data.screen_height || '',
    data.language || '',
    data.source_timestamp || ''
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
