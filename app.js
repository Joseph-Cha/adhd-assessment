// 12가지 질문 데이터
const questions = [
    "실수가 잦고 세심한 부분을 자주 놓친다",
    "집중이 오래 안 가고 쉽게 지루해진다",
    "대화할 때 딴 생각을 하거나 멍한 경우가 많다",
    "지시를 끝까지 따라하기 어렵고 일을 체계적으로 못한다",
    "귀찮거나 복잡한 일은 미루거나 시작하기 힘들다",
    "물건을 자주 잃어버리거나 약속을 깜빡한다",
    "가만히 있어야 할 때도 계속 움직이거나 꼼지락거린다",
    "쉴 새 없이 움직이고 가만히 쉬는 게 어렵다",
    "말이 많거나 생각이 끊임없이 이어진다",
    "질문이 끝나기 전에 대답하거나 내 차례를 못 기다린다",
    "대화나 활동에 자주 끼어들거나 방해한다",
    "급하게 화내거나 감정 조절이 안 될 때가 많다"
];

// 결과 메시지 데이터 (12문항 기준)
const results = {
    low: {
        range: [0, 3],
        title: "와, 집중력 갑 👏",
        message: `대부분 '아니다'라고 하셨네요! 지금 집중력이나 감정 조절 면에서 <strong>별다른 어려움 없이</strong> 잘 지내고 계신 것 같아요. 요즘 바쁘고 피곤한 건 다들 그래요~ 지금처럼 건강한 패턴 유지하시면 됩니다!<br><br><strong>💡 그래도 뭔가 이상하다 싶으면 언제든 전문가한테 물어보는 게 제일 정확해요!</strong>`,
        ctaType: "low"
    },
    mild: {
        range: [4, 6],
        title: "요즘 좀 힘들죠? 😥",
        message: `몇 가지 항목에 '그렇다'고 하셨어요. 최근에 <strong>야근 많이 하거나, 멘탈이 힘들거나, 잠을 제대로 못 자거나</strong> 그러지 않았나요? 그럴 때 집중력 떨어지는 건 당연해요!<br><br>일단은 좀 쉬어보고, 할 일 목록도 줄여보세요. <strong>근데 이런 게 어릴 때부터 계속 그랬다면?</strong> 그땐 한 번쯤 전문가 상담 받아보는 것도 좋을 것 같아요!`,
        ctaType: "mild"
    },
    moderate: {
        range: [7, 8],
        title: "혹시... 나도? 🤔",
        message: `꽤 많은 항목에 '그렇다'고 하셨네요. <strong>일 자꾸 미루고, 실수 많고, 감정 기복 심하고...</strong> 이런 게 반복되고 있다면 그냥 '성격'이 아닐 수도 있어요.<br><br><strong>'단순히 게으른 게 아니라 ADHD로 인한 문제'</strong>일 수도 있어요. 혼자 고민하지 말고 정신건강의학과 가서 정확하게 진단받아보세요. 생각보다 많은 사람들이 이런 어려움을 겪고 있답니다!`,
        ctaType: "moderate"
    },
    high: {
        range: [9, 12],
        title: " 🚨",
        message: `거의 모든 항목에 '그렇다'고 하셨네요. 지금 겪고 있는 <strong>집중력 문제, 충동성, 감정 조절 어려움</strong>이 일상생활을 많이 힘들게 하고 있을 것 같아요.<br><br>ADHD는 <strong>방치하면 점점 더 힘들어져요.</strong> 약물치료랑 행동 전략으로 충분히 나아질 수 있어요! <strong>제발 미루지 말고 정신건강의학과 예약하세요.</strong> 빨리 치료 시작할수록 삶의 질이 확 달라집니다!`,
        ctaType: "high"
    }
};

// 구글 시트 연동 URL
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxt07-OoDhRFKBzfXSy0rfYFTh-5XWzIccby4aNh3kXT17S3bSSClCk93dsAI9x4V9oog/exec';

// ============================================
// 유입 경로 추적 (TRAFFIC SOURCE TRACKING)
// ============================================

// 알려진 referrer 도메인을 소스명으로 변환
function categorizeReferrer(domain) {
    const knownSources = {
        'instagram.com': 'instagram',
        'l.instagram.com': 'instagram',
        'threads.net': 'threads',
        't.co': 'twitter',
        'twitter.com': 'twitter',
        'x.com': 'twitter',
        'facebook.com': 'facebook',
        'fb.com': 'facebook',
        'youtube.com': 'youtube',
        'youtu.be': 'youtube',
        'kakaotalk.com': 'kakaotalk',
        'naver.com': 'naver',
        'google.com': 'google',
        'bing.com': 'bing',
        'daum.net': 'daum',
        'spartacodingclub.kr': 'sparta',
        'sparta.com': 'sparta',
        'scc.spartacodingclub.kr': 'sparta'
    };

    // 정확히 일치하는지 확인
    if (knownSources[domain]) {
        return knownSources[domain];
    }

    // 부분 일치 확인 (예: m.facebook.com)
    for (const [key, value] of Object.entries(knownSources)) {
        if (domain.includes(key.split('.')[0])) {
            return value;
        }
    }

    return domain; // 알 수 없는 경우 원본 도메인 반환
}

// 유입 경로 정보 가져오기
function getTrafficSource() {
    const urlParams = new URLSearchParams(window.location.search);

    // 1. UTM 파라미터 확인 (최우선)
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmTerm = urlParams.get('utm_term');
    const utmContent = urlParams.get('utm_content');

    // 2. Referrer 정보 가져오기
    let referrer = document.referrer;
    let referrerDomain = 'direct';

    if (referrer) {
        try {
            const url = new URL(referrer);
            referrerDomain = url.hostname;
        } catch (e) {
            referrerDomain = 'parse-error';
        }
    }

    // 3. 최종 소스 결정
    let source, medium, campaign;

    if (utmSource) {
        // UTM 파라미터가 있으면 사용 (가장 신뢰도 높음)
        source = utmSource;
        medium = utmMedium || 'unknown';
        campaign = utmCampaign || 'not-set';
    } else if (referrer && referrerDomain !== window.location.hostname) {
        // 외부 referrer가 있으면 분류
        source = categorizeReferrer(referrerDomain);
        medium = 'referral';
        campaign = 'organic';
    } else {
        // UTM도 없고 referrer도 없으면 직접 유입
        source = 'direct';
        medium = 'none';
        campaign = 'not-set';
    }

    return {
        source: source,
        medium: medium,
        campaign: campaign,
        term: utmTerm || 'not-set',
        content: utmContent || 'not-set',
        referrer: referrer || 'none',
        referrerDomain: referrerDomain
    };
}

// 전역 변수
let currentQuestionIndex = 0;
let yesCount = 0;
let userGender = null; // 'male', 'female', 또는 'skip'
let userAnswers = []; // 각 문항별 답변 저장 (true: 그렇다, false: 아니다)
let trafficSourceData = null; // 유입 경로 데이터 (최초 방문 시 1회 저장)
let isTestMode = false; // 테스트 모드 여부 (URL에 ?test=true 또는 ?debug=true가 있으면 활성화)

// 테스트 모드 확인 함수
function checkTestMode() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('test') === 'true' || urlParams.get('debug') === 'true';
}

// 테스트 모드 배너 표시
function showTestModeBanner() {
    const banner = document.createElement('div');
    banner.id = 'test-mode-banner';
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
        color: white;
        padding: 10px 20px;
        text-align: center;
        font-weight: 600;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        animation: slideDown 0.3s ease-out;
    `;
    banner.innerHTML = '🧪 테스트 모드 활성화 - 데이터가 엑셀 시트에 저장되지 않습니다';
    document.body.prepend(banner);

    // body에 padding 추가하여 배너에 가려지지 않도록
    document.body.style.paddingTop = '40px';

    console.log('%c🧪 테스트 모드 활성화', 'background: #ff6b6b; color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold;');
    console.log('데이터가 Google Sheets에 저장되지 않습니다.');
}

// 페이지 전환 함수
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// 테스트 시작 - 성별 선택 페이지로 이동
function startTest() {
    showPage('gender-page');
}

// 성별 선택 처리
function selectGender(gender) {
    userGender = gender;
    console.log('선택된 성별:', gender); // 향후 분석을 위한 로그

    // 질문 테스트 페이지로 이동
    currentQuestionIndex = 0;
    yesCount = 0;
    showPage('test-page');
    displayQuestion();
}

// 질문 표시
function displayQuestion() {
    const questionText = document.getElementById('question-text');
    const currentQuestion = document.getElementById('current-question');
    const totalQuestions = document.getElementById('total-questions');
    const progressBar = document.getElementById('progress-bar');

    questionText.textContent = questions[currentQuestionIndex];
    currentQuestion.textContent = currentQuestionIndex + 1;
    totalQuestions.textContent = questions.length;

    // 진행률 바 업데이트
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = progress + '%';
}

// 답변 처리
function answer(isYes) {
    // 개별 답변 저장
    userAnswers.push(isYes);

    if (isYes) {
        yesCount++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        // 다음 질문으로
        displayQuestion();
    } else {
        // 테스트 완료 - 결과 표시
        showResult();
    }
}

// 구글 시트에 결과 전송 (유입 경로 정보 포함)
async function submitToGoogleSheets() {
    // 테스트 모드일 때는 제출하지 않음
    if (isTestMode) {
        console.log('%c🧪 테스트 모드: Google Sheets 제출 건너뛰기', 'background: #fbbf24; color: #000; padding: 8px 12px; border-radius: 4px; font-weight: bold;');
        console.log('제출될 예정이었던 데이터:', {
            gender: userGender,
            answers: userAnswers,
            score: yesCount,
            utm_source: trafficSourceData.source,
            utm_medium: trafficSourceData.medium,
            utm_campaign: trafficSourceData.campaign
        });
        return; // 제출하지 않고 종료
    }

    const data = {
        // 기존 테스트 결과 데이터
        gender: userGender,
        answers: userAnswers,
        score: yesCount,

        // 유입 경로 추적 데이터
        utm_source: trafficSourceData.source,
        utm_medium: trafficSourceData.medium,
        utm_campaign: trafficSourceData.campaign,
        utm_term: trafficSourceData.term,
        utm_content: trafficSourceData.content,
        referrer: trafficSourceData.referrer,
        referrer_domain: trafficSourceData.referrerDomain,

        // 추가 메타데이터
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        language: navigator.language,

        // 소스 캡처 시각 (최초 방문 시각)
        source_timestamp: trafficSourceData.timestamp
    };

    try {
        await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors', // 구글 Apps Script 웹 앱은 CORS 제한이 있음
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        console.log('데이터가 구글 시트에 성공적으로 저장되었습니다.');
        console.log('전송된 데이터:', data);
    } catch (error) {
        console.error('데이터 전송 중 오류 발생:', error);
        // 전송 실패해도 결과는 사용자에게 보여줌
    }
}

// 점수 시각화 업데이트
function updateScoreVisualization(score, riskLevel) {
    // 모든 세그먼트의 active 클래스 제거
    const segments = document.querySelectorAll('.score-bar-segment');
    segments.forEach(seg => seg.classList.remove('active'));

    // 현재 위험도에 해당하는 세그먼트 활성화
    const activeSegment = document.querySelector(`.score-bar-segment.${riskLevel}-risk`);
    if (activeSegment) {
        activeSegment.classList.add('active');
    }

    // 점수 인디케이터 위치 계산
    const indicator = document.getElementById('score-indicator');
    const container = document.querySelector('.score-bar-container');

    if (indicator && container) {
        // 각 범위의 비율 계산 (0-3: 25%, 4-6: 25%, 7-8: 16.7%, 9-12: 33.3%)
        let position = 0;

        if (score <= 3) {
            // 저위험군: 0-25%
            position = (score / 3) * 25;
        } else if (score <= 6) {
            // 경도: 25-50%
            position = 25 + ((score - 3) / 3) * 25;
        } else if (score <= 8) {
            // 중등도: 50-66.7%
            position = 50 + ((score - 6) / 2) * 16.7;
        } else {
            // 고위험: 66.7-100%
            position = 66.7 + ((score - 8) / 4) * 33.3;
        }

        indicator.style.left = position + '%';
    }
}

// 결과 표시
function showResult() {
    const scoreNumber = document.getElementById('score-number');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const ctaContainer = document.getElementById('cta-container');

    // 점수 표시
    scoreNumber.textContent = yesCount;

    // 결과 범위 결정
    let resultData, riskLevel, riskLevelText, scoreRangeText;
    if (yesCount >= results.low.range[0] && yesCount <= results.low.range[1]) {
        resultData = results.low;
        riskLevel = 'low';
        riskLevelText = '저위험군';
        scoreRangeText = '0-3점 범위';
    } else if (yesCount >= results.mild.range[0] && yesCount <= results.mild.range[1]) {
        resultData = results.mild;
        riskLevel = 'mild';
        riskLevelText = '경도 위험군';
        scoreRangeText = '4-6점 범위';
    } else if (yesCount >= results.moderate.range[0] && yesCount <= results.moderate.range[1]) {
        resultData = results.moderate;
        riskLevel = 'moderate';
        riskLevelText = '중등도 위험군';
        scoreRangeText = '7-8점 범위';
    } else {
        resultData = results.high;
        riskLevel = 'high';
        riskLevelText = '고위험군';
        scoreRangeText = '9-12점 범위';
    }

    // 결과 메시지 표시
    resultTitle.textContent = resultData.title;
    resultMessage.innerHTML = resultData.message;

    // 위험도 레벨 배지 업데이트
    const riskLevelBadge = document.getElementById('risk-level-badge');
    const riskLevelTextElement = document.getElementById('risk-level-text');
    const scoreRangeTextElement = document.getElementById('score-range-text');

    riskLevelBadge.className = 'risk-level-badge ' + riskLevel;
    riskLevelTextElement.textContent = riskLevelText;
    scoreRangeTextElement.textContent = scoreRangeText;

    // 점수 시각화 업데이트
    updateScoreVisualization(yesCount, riskLevel);

    // CTA 버튼 생성 (9~12점일 때만 설문조사 버튼 표시)
    ctaContainer.innerHTML = '';

    if (yesCount >= 9 && yesCount <= 12) {
        // ========================================
        // 설문조사 CTA 버전 선택
        // ========================================
        // 아래 버전 중 하나를 선택하여 테스트하세요!
        // 원하는 버전의 주석을 해제하고, 나머지는 주석 처리하세요.

        // 현재 버전 (기본)
        // renderSurveyVersion_Original(ctaContainer);

        // 버전 A: 짧고 강력한 카피 + 긴급성
        // renderSurveyVersion_A(ctaContainer);

        // 버전 B: 설명 박스 + 혜택 명확화
        // renderSurveyVersion_B(ctaContainer);

        // 버전 C: 감성적 접근 + 사회적 기여
        // renderSurveyVersion_C(ctaContainer);

        // 버전 D: 희소성 + 시간 제한 강조
        renderSurveyVersion_D(ctaContainer);
    }

    showPage('result-page');

    // 결과를 구글 시트에 자동으로 저장
    submitToGoogleSheets();
}

// 테스트 다시 시작
function restartTest() {
    currentQuestionIndex = 0;
    yesCount = 0;
    userGender = null;
    userAnswers = []; // 답변 배열 초기화
    showPage('landing-page');
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 테스트 모드 확인
    isTestMode = checkTestMode();
    if (isTestMode) {
        showTestModeBanner();
    }

    // 유입 경로 추적 (세션 기반 - 최초 방문 시 1회만 저장)
    const SESSION_KEY = 'adhd_traffic_source';
    const existingSource = sessionStorage.getItem(SESSION_KEY);

    if (existingSource) {
        // 재방문 - 저장된 소스 사용
        trafficSourceData = JSON.parse(existingSource);
        console.log('재방문자 - 기존 유입 경로 사용:', trafficSourceData);
    } else {
        // 최초 방문 - 유입 경로 캡처
        trafficSourceData = getTrafficSource();
        trafficSourceData.timestamp = new Date().toISOString();
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(trafficSourceData));
        console.log('신규 방문자 - 유입 경로 캡처:', trafficSourceData);
    }

    showPage('landing-page');
});

// ============================================
// 결과 이미지 저장 및 공유 기능
// ============================================

// 결과 화면을 이미지로 캡처
async function captureResultAsCanvas() {
    try {
        // html2canvas가 로드되었는지 확인
        if (typeof html2canvas === 'undefined') {
            throw new Error('html2canvas 라이브러리가 로드되지 않았습니다.');
        }

        // 결과 페이지 전체를 캡처
        const resultPage = document.getElementById('result-page');
        const canvas = await html2canvas(resultPage, {
            backgroundColor: '#ffffff',
            scale: 2, // 고해상도
            logging: false,
            useCORS: true
        });

        return canvas;
    } catch (error) {
        console.error('이미지 캡처 중 오류 발생:', error);
        alert('이미지 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
        throw error;
    }
}

// 결과 공유하기 (Web Share API)
async function shareResult() {
    try {
        // 공유 텍스트 생성
        const shareText = `나는 ADHD 자가진단에서 12점 중 ${yesCount}점!\n혹시 당신도 해당될까요? 지금 바로 확인해 보세요! 🤔`;
        const shareUrl = window.location.origin + window.location.pathname;

        // Web Share API 지원 확인
        if (navigator.share) {
            // 이미지 캡처
            const canvas = await captureResultAsCanvas();

            // Canvas를 Blob으로 변환
            canvas.toBlob(async function(blob) {
                try {
                    // 파일명 생성
                    const date = new Date().toISOString().split('T')[0];
                    const file = new File([blob], `ADHD-테스트-결과-${date}.png`, { type: 'image/png' });

                    // 파일 공유 가능 여부 확인
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        // 이미지와 함께 공유
                        await navigator.share({
                            title: 'ADHD 자가진단 테스트 결과',
                            text: shareText,
                            url: shareUrl,
                            files: [file]
                        });
                        console.log('공유가 성공적으로 완료되었습니다.');
                    } else {
                        // 이미지 없이 텍스트만 공유
                        await navigator.share({
                            title: 'ADHD 자가진단 테스트',
                            text: shareText,
                            url: shareUrl
                        });
                        console.log('텍스트 공유가 완료되었습니다.');
                    }
                } catch (shareError) {
                    // 사용자가 공유를 취소한 경우
                    if (shareError.name === 'AbortError') {
                        console.log('공유가 취소되었습니다.');
                    } else {
                        console.error('공유 중 오류 발생:', shareError);
                        // 폴백: URL 복사
                        fallbackCopyUrl(shareUrl);
                    }
                }
            }, 'image/png');
        } else {
            // Web Share API 미지원 - URL 복사로 폴백
            fallbackCopyUrl(shareUrl);
        }
    } catch (error) {
        console.error('공유 기능 실행 중 오류 발생:', error);
        fallbackCopyUrl(window.location.origin + window.location.pathname);
    }
}

// 결과 등급 텍스트 가져오기
function getResultLevel() {
    if (yesCount >= results.low.range[0] && yesCount <= results.low.range[1]) {
        return results.low.title;
    } else if (yesCount >= results.mild.range[0] && yesCount <= results.mild.range[1]) {
        return results.mild.title;
    } else if (yesCount >= results.moderate.range[0] && yesCount <= results.moderate.range[1]) {
        return results.moderate.title;
    } else {
        return results.high.title;
    }
}

// 폴백: URL을 클립보드에 복사
function fallbackCopyUrl(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => {
                alert('테스트 링크가 클립보드에 복사되었습니다!\n원하는 곳에 붙여넣기 해주세요.');
            })
            .catch(err => {
                console.error('클립보드 복사 실패:', err);
                // 최종 폴백: 프롬프트로 URL 표시
                prompt('이 링크를 복사하여 공유하세요:', url);
            });
    } else {
        // 클립보드 API 미지원 - 프롬프트로 표시
        prompt('이 링크를 복사하여 공유하세요:', url);
    }
}

// 링크 복사 기능
function copyLink() {
    const url = window.location.href;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => {
                alert('✅ 링크가 클립보드에 복사되었습니다!\n원하는 곳에 붙여넣기 해주세요.');
                console.log('링크 복사 완료:', url);
            })
            .catch(err => {
                console.error('클립보드 복사 실패:', err);
                // 폴백: 프롬프트로 URL 표시
                prompt('링크를 복사하세요:', url);
            });
    } else {
        // 클립보드 API 미지원 - 프롬프트로 표시
        prompt('링크를 복사하세요:', url);
    }
}

// ============================================
// 설문조사 CTA 버전들
// ============================================

// 설문조사 URL
const SURVEY_URL = 'https://forms.gle/9UHr4v179EKxnUcC9';

// 현재 버전 (기본)
function renderSurveyVersion_Original(container) {
    const btn = document.createElement('button');
    btn.className = 'cta-btn cta-primary';
    btn.textContent = '📝 설문조사 참여하고 리워드 받기(배민 쿠폰 5천원)';
    btn.onclick = function() {
        window.open(SURVEY_URL, '_blank');
    };
    container.appendChild(btn);
}

// 버전 A: 짧고 강력한 카피 + 긴급성
function renderSurveyVersion_A(container) {
    const btn = document.createElement('button');
    btn.className = 'cta-btn cta-primary';
    btn.style.fontSize = '18px';
    btn.style.padding = '20px 30px';
    btn.style.animation = 'pulse 2s infinite';
    btn.innerHTML = '🎁 지금 참여하면 배민 쿠폰 5천원 (추첨)!<br><small style="font-size: 14px; opacity: 0.9;">3분이면 끝</small>';
    btn.onclick = function() {
        window.open(SURVEY_URL, '_blank');
    };
    container.appendChild(btn);
}

// 버전 B: 설명 박스 + 혜택 명확화
function renderSurveyVersion_B(container) {
    // 설명 박스
    const infoBox = document.createElement('div');
    infoBox.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 15px;
        text-align: center;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    `;
    infoBox.innerHTML = `
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">
            💝 ADHD 지원 서비스 개발 설문조사
        </div>
        <div style="font-size: 14px; line-height: 1.6; opacity: 0.95;">
            ✓ 소요 시간: 약 3분<br>
            ✓ 리워드: 배민 쿠폰 5천원 (추첨)<br>
            ✓ 마감: 11월 7일 (목)까지
        </div>
    `;

    const btn = document.createElement('button');
    btn.className = 'cta-btn cta-primary';
    btn.style.fontSize = '17px';
    btn.textContent = '📝 설문조사 참여하기';
    btn.onclick = function() {
        window.open(SURVEY_URL, '_blank');
    };

    container.appendChild(infoBox);
    container.appendChild(btn);
}

// 버전 C: 감성적 접근 + 사회적 기여
function renderSurveyVersion_C(container) {
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        background: #f8f9ff;
        border-left: 4px solid #6366f1;
        padding: 18px;
        border-radius: 8px;
        margin-bottom: 15px;
        line-height: 1.7;
    `;
    messageBox.innerHTML = `
        <div style="font-size: 15px; color: #333; margin-bottom: 12px;">
            <strong style="color: #6366f1;">💬 당신의 이야기가 필요합니다</strong>
        </div>
        <div style="font-size: 14px; color: #555;">
            당신의 솔직한 경험이 비슷한 어려움을 겪는 분들을 위한 <strong>실질적인 서비스</strong>를 만드는 데 큰 힘이 됩니다.
        </div>
        <div style="font-size: 13px; color: #888; margin-top: 10px;">
            📋 3분 소요 | 🎁 감사 리워드: 배민 쿠폰 5천원 (추첨)
        </div>
    `;

    const btn = document.createElement('button');
    btn.className = 'cta-btn cta-primary';
    btn.style.fontSize = '16px';
    btn.textContent = '내 경험 나누고 서비스 개발 돕기';
    btn.onclick = function() {
        window.open(SURVEY_URL, '_blank');
    };

    container.appendChild(messageBox);
    container.appendChild(btn);
}

// 버전 D: 희소성 + 시간 제한 강조
function renderSurveyVersion_D(container) {
    // 긴급 배너
    const urgencyBanner = document.createElement('div');
    urgencyBanner.style.cssText = `
        background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        margin-bottom: 12px;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    `;
    urgencyBanner.innerHTML = '⏰ 마감 임박! 11월 7일(목)까지만 참여 가능';

    const infoBox = document.createElement('div');
    infoBox.style.cssText = `
        background: #fff9e6;
        border: 2px solid #fbbf24;
        padding: 18px;
        border-radius: 10px;
        margin-bottom: 15px;
    `;
    infoBox.innerHTML = `
        <div style="font-size: 15px; font-weight: 600; color: #92400e; margin-bottom: 10px;">
            🎁 선착순 설문 참여 혜택
        </div>
        <div style="font-size: 14px; color: #78350f; line-height: 1.6;">
            ✓ 배민 쿠폰 5천원 (추첨)<br>
            ✓ 심층 인터뷰 참여 시 배민 쿠폰 2만원 추가 증정<br>
            ✓ 소요시간 단 3분
        </div>
    `;

    const btn = document.createElement('button');
    btn.className = 'cta-btn cta-primary';
    btn.style.cssText = `
        font-size: 17px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        padding: 18px 30px;
        font-weight: 700;
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    `;
    btn.innerHTML = '지금 바로 참여하기 →';
    btn.onclick = function() {
        window.open(SURVEY_URL, '_blank');
    };

    container.appendChild(urgencyBanner);
    container.appendChild(infoBox);
    container.appendChild(btn);
}

// ============================================
// 설문조사 안내 기능
// ============================================

// 설문조사 참여 안내
function showSurveyInfo() {
    const message = `📝 성인 ADHD 지원 서비스 개발을 위한 설문조사 안내

안녕하세요! 성인 ADHD 지원 서비스 개발팀입니다.

저희 팀은 성인 ADHD로 인해 일상, 업무, 관계에서 힘든 시간을 보내고 계신 분들을 위한 실질적이고 효과적인 지원 서비스를 기획 중입니다.

현재 ADHD를 겪는 분들이 어떤 부분에서 가장 큰 어려움을 느끼시는지, 그리고 어떤 종류의 도움이 절실한지에 대한 솔직한 인사이트를 얻고자 본 설문을 진행하게 되었습니다.

여러분의 귀한 경험이 실제 문제를 해결하는 웹/앱 서비스를 만드는 데 결정적인 힘이 됩니다! 💖

━━━━━━━━━━━━━━━━━━━━

🎁 참여 혜택 & 개인정보 보호 약속

✓ 참여 대상
  성인 ADHD 진단(또는 의심) 후 일상생활에서 어려움을 겪고 계신 분

✓ 감사 보상
  설문에 참여해 주신 모든 분께 추첨을 통해 스타벅스 아이스 아메리카노 기프티콘 (3명)을 전해드립니다! ☕

✓ 개인정보 수집 및 파기
  • 남겨주신 핸드폰 번호는 오직 기프티콘 추첨 및 발송에만 사용됩니다.
  • 조사 종료 및 기프티콘 발송 완료 후 즉시 파기됩니다. 안심하고 참여해 주세요!

✓ 심층 인터뷰 참여 기회
  • 추후 서비스 기획을 위한 심층 인터뷰(FGI) 참여자를 모집합니다.
  • 주관식 답변 내용을 바탕으로 대상자를 선정하며, 참여 의사가 있으신 분은 설문 마지막 장에 꼭 체크해 주세요!
  • 선정 후 인터뷰 참여 시 배달의 민족 2만원 쿠폰을 추가 증정합니다. 🍴

━━━━━━━━━━━━━━━━━━━━

📅 설문 기간 및 보상 발송 일정

• 설문기간: 2025. 11. 4 (월) ~ 2025. 11. 7 (목) (총 4일간 진행)
• 기프티콘 발송일: 2025. 11. 11 (월)

※ 기프티콘은 당첨자분들께만 발송되며, 미당첨자분들께는 별도 연락이 가지 않으니 양해 부탁드립니다.

━━━━━━━━━━━━━━━━━━━━

설문조사에 참여하시겠습니까?`;

    // 사용자 확인
    const confirmed = confirm(message);

    if (confirmed) {
        // 설문 링크로 이동
        window.open(SURVEY_URL, '_blank');
        console.log('설문조사 페이지로 이동합니다.');
    } else {
        console.log('설문조사 참여를 취소했습니다.');
    }
}
