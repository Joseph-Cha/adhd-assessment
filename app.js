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
        range: [0, 2],
        title: "와, 집중력 갑 👏",
        message: `대부분 '아니다'라고 하셨네요! 지금 집중력이나 감정 조절 면에서 <strong>별다른 어려움 없이</strong> 잘 지내고 계신 것 같아요. 요즘 바쁘고 피곤한 건 다들 그래요~ 지금처럼 건강한 패턴 유지하시면 됩니다!<br><br><strong>💡 그래도 뭔가 이상하다 싶으면 언제든 전문가한테 물어보는 게 제일 정확해요!</strong>`,
        ctaType: "low"
    },
    mild: {
        range: [3, 5],
        title: "요즘 좀 힘들죠? 😥",
        message: `몇 가지 항목에 '그렇다'고 하셨어요. 최근에 <strong>야근 많이 하거나, 멘탈이 힘들거나, 잠을 제대로 못 자거나</strong> 그러지 않았나요? 그럴 때 집중력 떨어지는 건 당연해요!<br><br>일단은 좀 쉬어보고, 할 일 목록도 줄여보세요. <strong>근데 이런 게 어릴 때부터 계속 그랬다면?</strong> 그땐 한 번쯤 전문가 상담 받아보는 것도 좋을 것 같아요!`,
        ctaType: "mild"
    },
    moderate: {
        range: [6, 8],
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
        // 각 범위의 비율 계산 (각 구간에 여백을 두어 자연스러운 위치 표시)
        let position = 0;

        if (score <= 2) {
            // 저위험군: 5-22% (0-2점, 각 구간에서 적절한 위치)
            if (score === 0) {
                position = 8;
            } else if (score === 1) {
                position = 15;
            } else {
                position = 22;
            }
        } else if (score <= 5) {
            // 경도: 28-47% (3-5점)
            if (score === 3) {
                position = 30;
            } else if (score === 4) {
                position = 38;
            } else {
                position = 47;
            }
        } else if (score <= 8) {
            // 중등도: 53-72% (6-8점)
            if (score === 6) {
                position = 55;
            } else if (score === 7) {
                position = 63;
            } else {
                position = 72;
            }
        } else {
            // 고위험: 77-95% (9-12점, 끝이 100%를 넘지 않도록)
            if (score === 9) {
                position = 78;
            } else if (score === 10) {
                position = 84;
            } else if (score === 11) {
                position = 90;
            } else {
                position = 95; // 12점은 95%에 위치 (끝에서 약간 여유)
            }
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
        scoreRangeText = '0-2점 범위';
    } else if (yesCount >= results.mild.range[0] && yesCount <= results.mild.range[1]) {
        resultData = results.mild;
        riskLevel = 'mild';
        riskLevelText = '경도 위험군';
        scoreRangeText = '3-5점 범위';
    } else if (yesCount >= results.moderate.range[0] && yesCount <= results.moderate.range[1]) {
        resultData = results.moderate;
        riskLevel = 'moderate';
        riskLevelText = '중등도 위험군';
        scoreRangeText = '6-8점 범위';
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

    // CTA 버튼 생성 (9~12점일 때만 이메일 수집 폼 표시)
    ctaContainer.innerHTML = '';

    if (yesCount >= 9 && yesCount <= 12) {
        // 고위험군 대상 이메일 수집 기능
        renderEmailCollectionForm(ctaContainer);
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
// 이메일 수집 기능 (고위험군 대상)
// ============================================

// 이메일 수집 폼 렌더링
function renderEmailCollectionForm(container) {
    // 정보 제공 안내 박스
    const infoBox = document.createElement('div');
    infoBox.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 20px;
        text-align: center;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    `;
    infoBox.innerHTML = `
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">
            📬 성인 ADHD 관련 유용한 정보를 받아보세요
        </div>
        <div style="font-size: 14px; line-height: 1.6; opacity: 0.95;">
            ✓ ADHD 관리 팁과 전략<br>
            ✓ 최신 연구 및 치료 정보<br>
            ✓ 실용적인 생활 가이드
        </div>
    `;

    // 이메일 입력 폼
    const formContainer = document.createElement('div');
    formContainer.style.cssText = `
        background: #f8f9ff;
        border: 2px solid #e0e7ff;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 15px;
    `;

    const emailLabel = document.createElement('label');
    emailLabel.style.cssText = `
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #4c51bf;
        margin-bottom: 8px;
    `;
    emailLabel.textContent = '이메일 주소';

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.id = 'email-input';
    emailInput.placeholder = 'your-email@example.com';
    emailInput.required = true;
    emailInput.style.cssText = `
        width: 100%;
        padding: 12px 15px;
        font-size: 15px;
        border: 2px solid #cbd5e0;
        border-radius: 8px;
        margin-bottom: 15px;
        box-sizing: border-box;
        transition: border-color 0.3s ease;
    `;
    emailInput.onfocus = function() {
        this.style.borderColor = '#6366f1';
    };
    emailInput.onblur = function() {
        this.style.borderColor = '#cbd5e0';
    };

    // 개인정보 수집 동의 체크박스
    const consentContainer = document.createElement('div');
    consentContainer.style.cssText = `
        background: #fff;
        border: 1px solid #e2e8f0;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 15px;
    `;

    const consentCheckboxWrapper = document.createElement('label');
    consentCheckboxWrapper.style.cssText = `
        display: flex;
        align-items: flex-start;
        cursor: pointer;
        font-size: 14px;
        line-height: 1.5;
        color: #2d3748;
    `;

    const consentCheckbox = document.createElement('input');
    consentCheckbox.type = 'checkbox';
    consentCheckbox.id = 'privacy-consent';
    consentCheckbox.required = true;
    consentCheckbox.style.cssText = `
        margin-right: 10px;
        margin-top: 3px;
        width: 18px;
        height: 18px;
        cursor: pointer;
        flex-shrink: 0;
    `;

    const consentText = document.createElement('span');
    consentText.innerHTML = `
        <strong>[필수]</strong> 개인정보 수집 및 이용에 동의합니다
        <a href="#" id="view-privacy-details" style="color: #6366f1; text-decoration: underline; margin-left: 5px;">상세보기</a>
    `;

    consentCheckboxWrapper.appendChild(consentCheckbox);
    consentCheckboxWrapper.appendChild(consentText);
    consentContainer.appendChild(consentCheckboxWrapper);

    // 개인정보 수집 동의 상세 내용 (처음에는 숨김)
    const privacyDetails = document.createElement('div');
    privacyDetails.id = 'privacy-details';
    privacyDetails.style.cssText = `
        display: none;
        background: #f7fafc;
        border: 1px solid #e2e8f0;
        padding: 15px;
        border-radius: 8px;
        margin-top: 12px;
        font-size: 13px;
        line-height: 1.7;
        color: #4a5568;
    `;
    privacyDetails.innerHTML = `
        <strong style="color: #2d3748; display: block; margin-bottom: 10px;">📋 개인정보 수집 및 이용 동의</strong>
        <div style="margin-bottom: 8px;">
            <strong>• 수집 항목:</strong> 이메일 주소
        </div>
        <div style="margin-bottom: 8px;">
            <strong>• 수집 목적:</strong> 성인 ADHD 관련 유용한 정보 제공
        </div>
        <div style="margin-bottom: 8px;">
            <strong>• 보유 및 이용 기간:</strong> 정보 제공 목적 달성 후 또는 이용자의 삭제 요청 시까지 보관됩니다. (최대 1년)
        </div>
        <div style="margin-bottom: 8px;">
            <strong>• 제3자 제공 (위탁):</strong> 원칙적으로 제공하지 않습니다. 다만, 이메일 발송을 위해 외부 대행 업체를 이용할 경우, 발송 목적으로 이메일 주소를 해당 업체에 한시적으로 전달할 수 있습니다. (발송 목적 외 사용 엄격 금지)
        </div>
        <div style="color: #718096; font-size: 12px; margin-top: 10px;">
            * 귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 동의를 거부할 경우 정보 제공 서비스를 이용하실 수 없습니다.
        </div>
    `;
    consentContainer.appendChild(privacyDetails);

    // 제출 버튼
    const submitBtn = document.createElement('button');
    submitBtn.className = 'cta-btn cta-primary';
    submitBtn.style.cssText = `
        font-size: 16px;
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        padding: 15px 30px;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        width: 100%;
    `;
    submitBtn.textContent = '정보 받아보기 ✉️';
    submitBtn.onclick = function() {
        submitEmailToGoogleSheets();
    };

    // 요소들을 폼 컨테이너에 추가
    formContainer.appendChild(emailLabel);
    formContainer.appendChild(emailInput);
    formContainer.appendChild(consentContainer);
    formContainer.appendChild(submitBtn);

    // 최종적으로 컨테이너에 추가
    container.appendChild(infoBox);
    container.appendChild(formContainer);

    // 상세보기 링크 클릭 이벤트
    setTimeout(() => {
        const viewDetailsLink = document.getElementById('view-privacy-details');
        if (viewDetailsLink) {
            viewDetailsLink.onclick = function(e) {
                e.preventDefault();
                const details = document.getElementById('privacy-details');
                if (details.style.display === 'none') {
                    details.style.display = 'block';
                    this.textContent = '닫기';
                } else {
                    details.style.display = 'none';
                    this.textContent = '상세보기';
                }
            };
        }
    }, 100);
}

// 이메일 데이터를 Google Sheets에 전송
async function submitEmailToGoogleSheets() {
    const emailInput = document.getElementById('email-input');
    const consentCheckbox = document.getElementById('privacy-consent');

    // 유효성 검사
    if (!emailInput || !emailInput.value.trim()) {
        alert('이메일 주소를 입력해 주세요.');
        emailInput?.focus();
        return;
    }

    if (!consentCheckbox || !consentCheckbox.checked) {
        alert('개인정보 수집 및 이용에 동의해 주세요.');
        return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        alert('올바른 이메일 주소를 입력해 주세요.');
        emailInput.focus();
        return;
    }

    // 테스트 모드일 때는 제출하지 않음
    if (isTestMode) {
        console.log('%c🧪 테스트 모드: 이메일 제출 건너뛰기', 'background: #fbbf24; color: #000; padding: 8px 12px; border-radius: 4px; font-weight: bold;');
        console.log('제출될 예정이었던 이메일 데이터:', {
            email: emailInput.value.trim(),
            consent: consentCheckbox.checked,
            score: yesCount
        });
        alert('✅ 테스트 모드: 이메일이 등록되었습니다!\n(실제로는 저장되지 않습니다)');
        return;
    }

    const data = {
        type: 'email_subscription', // 이메일 구독 타입 명시
        email: emailInput.value.trim(),
        consent: consentCheckbox.checked,
        score: yesCount,
        gender: userGender,

        // 유입 경로 추적 데이터
        utm_source: trafficSourceData.source,
        utm_medium: trafficSourceData.medium,
        utm_campaign: trafficSourceData.campaign,

        // 추가 메타데이터
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent
    };

    try {
        // 버튼 비활성화
        const submitBtn = document.querySelector('.cta-btn.cta-primary');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = '처리 중...';
        }

        await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        console.log('이메일 데이터가 구글 시트에 성공적으로 저장되었습니다.');
        console.log('전송된 데이터:', data);

        // 성공 메시지 표시
        alert('✅ 이메일이 성공적으로 등록되었습니다!\n성인 ADHD 관련 유용한 정보를 이메일로 보내드리겠습니다.');

        // 폼 숨기기 및 성공 메시지 표시
        const formContainer = emailInput.closest('div');
        if (formContainer) {
            formContainer.innerHTML = `
                <div style="
                    background: #d1fae5;
                    border: 2px solid #10b981;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    color: #065f46;
                ">
                    <div style="font-size: 40px; margin-bottom: 10px;">✅</div>
                    <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">
                        등록 완료!
                    </div>
                    <div style="font-size: 14px; line-height: 1.6;">
                        입력하신 이메일로 유용한 정보를 보내드리겠습니다.
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('이메일 데이터 전송 중 오류 발생:', error);
        alert('❌ 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');

        // 버튼 재활성화
        const submitBtn = document.querySelector('.cta-btn.cta-primary');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '정보 받아보기 ✉️';
        }
    }
}
