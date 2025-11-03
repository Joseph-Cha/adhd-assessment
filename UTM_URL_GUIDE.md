# UTM URL 생성 및 사용 가이드

## 개요
이 문서는 ADHD 진단 평가 웹사이트의 유입 경로를 추적하기 위한 UTM 파라미터 URL 생성 및 사용 방법을 설명합니다.

## UTM 파라미터란?

UTM (Urchin Tracking Module) 파라미터는 URL에 추가하는 쿼리 문자열로, 어디서 유입되었는지 추적할 수 있게 해줍니다.

### 주요 UTM 파라미터

| 파라미터 | 필수 여부 | 설명 | 예시 |
|---------|---------|------|------|
| `utm_source` | 필수 | 유입 소스 (어디서?) | youtube, kakaotalk, instagram |
| `utm_medium` | 필수 | 유입 매체 (어떤 채널?) | social, video, messaging, email |
| `utm_campaign` | 필수 | 캠페인 이름 (어떤 캠페인?) | adhd-jan-2025, mental-health-month |
| `utm_term` | 선택 | 검색 키워드 (유료 광고용) | adhd-test, 주의력결핍 |
| `utm_content` | 선택 | 콘텐츠 구분 | bio-link, post-link, story |

## 채널별 UTM URL 예시

### 1. YouTube (영상 설명란)

```
https://yourdomain.com/index.html?utm_source=youtube&utm_medium=video&utm_campaign=adhd-jan-2025&utm_content=video-description
```

**단축 URL 권장:**
```
https://bit.ly/adhd-test-yt
```

### 2. 카카오톡 (메시지/오픈채팅)

```
https://yourdomain.com/index.html?utm_source=kakaotalk&utm_medium=messaging&utm_campaign=adhd-jan-2025
```

**단축 URL:**
```
https://bit.ly/adhd-test-kakao
```

### 3. Threads (게시물)

```
https://yourdomain.com/index.html?utm_source=threads&utm_medium=social&utm_campaign=adhd-jan-2025&utm_content=post-link
```

**단축 URL:**
```
https://bit.ly/adhd-test-threads
```

### 4. Instagram (바이오 링크)

```
https://yourdomain.com/index.html?utm_source=instagram&utm_medium=social&utm_campaign=adhd-jan-2025&utm_content=bio-link
```

**단축 URL:**
```
https://bit.ly/adhd-test-ig
```

### 5. Instagram (스토리 - 1만 팔로워 이상)

```
https://yourdomain.com/index.html?utm_source=instagram&utm_medium=social&utm_campaign=adhd-jan-2025&utm_content=story-swipeup
```

### 6. Facebook (게시물)

```
https://yourdomain.com/index.html?utm_source=facebook&utm_medium=social&utm_campaign=adhd-jan-2025&utm_content=post-link
```

### 7. Twitter/X (트윗)

```
https://yourdomain.com/index.html?utm_source=twitter&utm_medium=social&utm_campaign=adhd-jan-2025&utm_content=tweet
```

### 8. 네이버 블로그

```
https://yourdomain.com/index.html?utm_source=naver&utm_medium=blog&utm_campaign=adhd-jan-2025
```

### 9. 이메일 뉴스레터

```
https://yourdomain.com/index.html?utm_source=newsletter&utm_medium=email&utm_campaign=adhd-jan-2025&utm_content=january-edition
```

## UTM 명명 규칙

### utm_source (소스)

**소셜 미디어:**
- `youtube` - YouTube
- `instagram` - Instagram
- `facebook` - Facebook
- `threads` - Threads
- `twitter` - Twitter/X
- `kakaotalk` - KakaoTalk
- `naver` - Naver (블로그/카페)
- `tiktok` - TikTok

**기타:**
- `newsletter` - 이메일 뉴스레터
- `website` - 본인 웹사이트
- `referral` - 추천 링크

### utm_medium (매체)

- `social` - 소셜 미디어 게시물
- `video` - 비디오 플랫폼
- `messaging` - 메시징 앱 (카톡, 텔레그램 등)
- `email` - 이메일
- `blog` - 블로그
- `referral` - 외부 사이트 링크
- `paid` - 유료 광고

### utm_campaign (캠페인)

**형식:** `목적-월-연도`

- `adhd-jan-2025` - 2025년 1월 ADHD 인식 캠페인
- `mental-health-month` - 정신건강의 달 캠페인
- `adhd-awareness-2025` - 2025년 ADHD 인식 확산

**규칙:**
- 항상 소문자 사용
- 공백 대신 하이픈(-) 사용
- 날짜/월 포함 권장

### utm_content (콘텐츠 구분)

같은 소스/매체에서 여러 링크를 사용할 때 구분용:

- `bio-link` - 프로필 바이오 링크
- `post-link` - 게시물 링크
- `story-swipeup` - 스토리 스와이프업
- `comment` - 댓글에 포함된 링크
- `pinned-comment` - 고정된 댓글 링크

## URL 단축 서비스 사용

긴 UTM URL은 보기 좋지 않으므로 단축 서비스를 사용하는 것을 권장합니다.

### 추천 URL 단축 서비스

1. **Bitly** (https://bitly.com)
   - 무료 계정으로 충분
   - 클릭 수 통계 제공
   - 커스텀 링크 생성 가능
   - 예: `https://bit.ly/adhd-test-yt`

2. **TinyURL** (https://tinyurl.com)
   - 완전 무료
   - 간단한 인터페이스
   - 예: `https://tinyurl.com/adhd-test`

3. **네이버 단축URL** (https://me2.do)
   - 한국 사용자에게 친숙
   - 예: `https://me2.do/adhd-test`

### Bitly 사용 방법

1. Bitly 계정 생성 (무료)
2. "Create" 버튼 클릭
3. 긴 UTM URL 붙여넣기
4. 커스텀 백 절반 입력 (예: `adhd-test-kakao`)
5. "Create" 클릭
6. 단축 URL 복사하여 사용

**중요:** 단축 URL은 원본 UTM 파라미터를 그대로 유지합니다!

## UTM URL 관리 스프레드시트

모든 UTM URL을 스프레드시트에 기록하여 관리하세요.

### 권장 컬럼

| 채널 | 캠페인 | 긴 URL | 단축 URL | 생성일 | 메모 |
|------|--------|---------|----------|--------|------|
| YouTube | adhd-jan-2025 | https://yourdomain.com/index.html?utm_source=... | https://bit.ly/adhd-test-yt | 2025-01-15 | 메인 채널 영상 설명란 |
| KakaoTalk | adhd-jan-2025 | https://yourdomain.com/index.html?utm_source=... | https://bit.ly/adhd-test-kakao | 2025-01-15 | 오픈채팅방 공지 |

## 테스트 방법

### 1. 로컬에서 테스트

브라우저에서 직접 UTM URL을 입력:
```
http://localhost:8000/index.html?utm_source=youtube&utm_medium=video&utm_campaign=test
```

### 2. 개발자 콘솔 확인

1. 페이지 로드 후 F12 (개발자 도구)
2. Console 탭 확인
3. "신규 방문자 - 유입 경로 캡처" 메시지 확인
4. trafficSourceData 객체 내용 확인:
   ```javascript
   {
     source: "youtube",
     medium: "video",
     campaign: "test",
     ...
   }
   ```

### 3. Google Sheets 확인

1. 테스트 완료
2. Google Sheets 열기
3. 마지막 행 확인:
   - utm_source: youtube
   - utm_medium: video
   - utm_campaign: test

## 실전 배포 체크리스트

### 배포 전

- [ ] 각 채널별 UTM URL 생성 완료
- [ ] URL 단축 서비스로 단축 완료
- [ ] 스프레드시트에 모든 URL 기록
- [ ] 로컬에서 각 URL 테스트 완료
- [ ] Google Sheets에 데이터 정상 저장 확인

### YouTube 배포

- [ ] 영상 설명란에 단축 URL 삽입
- [ ] 고정 댓글에도 URL 추가 (다른 utm_content 사용)
- [ ] 카드/엔드스크린에 링크 추가 (가능한 경우)

### Instagram 배포

- [ ] 바이오에 단축 URL 추가
- [ ] 스토리에 링크 스티커 추가 (1만 팔로워 이상)
- [ ] 게시물 캡션에 단축 URL 추가

### KakaoTalk 배포

- [ ] 오픈채팅방 공지에 단축 URL 추가
- [ ] 친구들에게 개인 메시지로 전송
- [ ] 프로필 상태메시지에 추가 (가능한 경우)

### 기타 채널

- [ ] Facebook 페이지/그룹 게시
- [ ] Threads 게시물 작성
- [ ] Twitter/X 트윗
- [ ] 네이버 블로그/카페 게시
- [ ] 이메일 뉴스레터 발송

## 주의사항

### ❌ 하지 말아야 할 것

1. **내부 링크에 UTM 사용 금지**
   - 같은 도메인 내 페이지 이동 시 UTM 사용 X
   - 유입 경로가 왜곡됩니다

2. **대문자 사용 금지**
   - `utm_source=YouTube` ❌
   - `utm_source=youtube` ✅

3. **공백 사용 금지**
   - `utm_campaign=adhd test` ❌
   - `utm_campaign=adhd-test` ✅

4. **특수문자 사용 금지**
   - `utm_source=instagram!` ❌
   - `utm_source=instagram` ✅

### ✅ 권장 사항

1. **일관된 명명 규칙**
   - 모든 팀원이 같은 규칙 사용
   - 스프레드시트에 규칙 문서화

2. **의미 있는 이름 사용**
   - `utm_campaign=campaign1` ❌
   - `utm_campaign=adhd-jan-2025` ✅

3. **단축 URL 사용**
   - 긴 URL은 클릭률이 낮습니다
   - 단축 URL이 더 전문적으로 보입니다

4. **주기적인 확인**
   - 주 1회 Google Sheets 데이터 확인
   - 어떤 채널이 가장 효과적인지 분석

## 분석 및 인사이트

### Google Sheets에서 확인할 수 있는 데이터

1. **유입 소스별 방문자 수**
   - YouTube: 50명
   - Instagram: 30명
   - KakaoTalk: 20명

2. **캠페인별 성과**
   - adhd-jan-2025: 100명
   - mental-health-month: 50명

3. **매체별 전환율**
   - social: 30%
   - video: 50%
   - messaging: 40%

### 분석 팁

- 정기적으로 데이터를 피벗 테이블로 분석
- 가장 효과적인 채널에 집중
- 성과가 낮은 채널은 전략 수정 또는 중단

## 자주 묻는 질문 (FAQ)

### Q1: UTM 파라미터가 없으면 어떻게 되나요?
A: `document.referrer`를 통해 자동으로 추적하지만, 카카오톡/인스타그램 등 앱에서는 referrer가 차단되어 "direct"로 기록됩니다. 따라서 UTM 파라미터 사용이 필수입니다.

### Q2: 단축 URL을 사용하면 UTM 파라미터가 사라지나요?
A: 아니요! 단축 URL은 단순히 리디렉션만 하므로 UTM 파라미터가 그대로 유지됩니다.

### Q3: 같은 사람이 여러 번 방문하면 어떻게 되나요?
A: sessionStorage를 사용하므로 같은 브라우저 세션 내에서는 최초 유입 경로가 유지됩니다. 브라우저를 닫고 다시 열면 새로운 세션으로 간주됩니다.

### Q4: UTM 파라미터를 사용자가 수정하면 어떻게 되나요?
A: 사용자가 수동으로 수정할 수 있지만, 대부분의 사용자는 그렇게 하지 않습니다. 데이터의 95% 이상은 정확합니다.

### Q5: 여러 캠페인을 동시에 진행할 수 있나요?
A: 네! 각 캠페인마다 다른 utm_campaign 값을 사용하면 됩니다.

## 추가 리소스

- Google UTM Builder: https://ga-dev-tools.google/campaign-url-builder/
- Bitly 공식 사이트: https://bitly.com
- UTM 파라미터 베스트 프랙티스: https://support.google.com/analytics/answer/1033863

---

**생성일:** 2025-01-15
**버전:** 1.0
**업데이트:** 필요 시 이 문서를 업데이트하여 팀과 공유하세요.
