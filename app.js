// 12가지 질문 데이터
const questions = [
    "정밀한 일에 세심한 주의를 기울이지 못하거나 실수하여 업무 또는 학업에서 문제를 일으키는 경우가 자주 있다.",
    "작업이나 과제에 계속해서 집중하는 것이 어렵고, 쉽게 지루해지거나 멍해지는 경향이 있다.",
    "다른 사람이 직접 말하는 것을 귀 기울여서 듣지 못하는 것 같다(넋 놓고 있는 것 같다).",
    "지시대로 따라하지 못하거나, 작업 및 활동을 조직적으로 처리하기 어렵다.",
    "지속적인 정신력을 요하는 어렵고 귀찮은 일을 피하거나, 시작하는 것이 힘들다.",
    "작업이나 활동에 필요한 물건이나 약속 등 일상적인 것을 자주 잃어버리거나 잊어버린다.",
    "가만히 앉아있어야 하는 상황에서도 몸을 뒤틀거나(꼼지락), 안절부절못하는 느낌이 든다.",
    "마치 모터가 달린 듯이 쉴 새 없이 움직이는 느낌이 들고, 놀이나 여가활동을 평온하게 즐기기 어렵다.",
    "말을 지나치게 많이 하거나, 생각이 꼬리에 꼬리를 물고 이어진다.",
    "질문이 다 끝나기도 전에 불쑥 대답하거나, 내 차례를 기다리는 것이 매우 힘들다.",
    "다른 사람들이 대화나 활동을 할 때 자주 방해하거나 간섭하고 끼어든다.",
    "성미가 급하고 와락 화를 내거나 울화통을 터뜨리는 등 감정 조절이 어렵다."
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
        range: [7, 9],
        title: "혹시... 나도? 🤔",
        message: `꽤 많은 항목에 '그렇다'고 하셨네요. <strong>일 자꾸 미루고, 실수 많고, 감정 기복 심하고...</strong> 이런 게 반복되고 있다면 그냥 '성격'이 아닐 수도 있어요.<br><br><strong>'단순히 게으른 게 아니라 ADHD로 인한 문제'</strong>일 수도 있어요. 혼자 고민하지 말고 정신건강의학과 가서 정확하게 진단받아보세요. 생각보다 많은 사람들이 이런 어려움을 겪고 있답니다!`,
        ctaType: "moderate"
    },
    high: {
        range: [10, 12],
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
        'daum.net': 'daum'
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

// 결과 표시
function showResult() {
    const scoreNumber = document.getElementById('score-number');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const ctaContainer = document.getElementById('cta-container');

    // 점수 표시
    scoreNumber.textContent = yesCount;

    // 결과 범위 결정
    let resultData;
    if (yesCount >= results.low.range[0] && yesCount <= results.low.range[1]) {
        resultData = results.low;
    } else if (yesCount >= results.mild.range[0] && yesCount <= results.mild.range[1]) {
        resultData = results.mild;
    } else if (yesCount >= results.moderate.range[0] && yesCount <= results.moderate.range[1]) {
        resultData = results.moderate;
    } else {
        resultData = results.high;
    }

    // 결과 메시지 표시
    resultTitle.textContent = resultData.title;
    resultMessage.innerHTML = resultData.message;

    // CTA 버튼 생성 (12문항 기준)
    ctaContainer.innerHTML = '';

    if (yesCount >= 7) {
        // N >= 7: 전문가 찾기 버튼 강조
        const btn = document.createElement('button');
        btn.className = 'cta-btn cta-primary';
        btn.textContent = '가까운 병원 찾아보기 🏥';
        btn.onclick = function() {
            alert('💡 병원 찾기 기능은 실제 서비스에서 제공될 예정이에요.\n지금은 네이버/카카오맵에서 "정신건강의학과"를 검색해보세요!');
        };
        ctaContainer.appendChild(btn);
    } else {
        // N < 7: 집중력 팁 버튼
        const btn = document.createElement('button');
        btn.className = 'cta-btn cta-secondary';
        btn.textContent = '집중력 높이는 꿀팁 보기 💡';
        btn.onclick = function() {
            alert('🎯 집중력 높이는 꿀팁!\n\n1. 25분 집중 + 5분 휴식 (뽀모도로)\n2. 스마트폰 알림 다 꺼버리기\n3. 잠 잘 자기 (진짜 중요)\n4. 꾸준히 운동하기\n5. 명상 앱 써보기 (헤드스페이스, 마보 등)');
        };
        ctaContainer.appendChild(btn);
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
