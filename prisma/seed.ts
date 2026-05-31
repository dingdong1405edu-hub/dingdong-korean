import { PrismaClient, TOPIKLevel, HangulType, WritingTaskType, SpeakingTaskType, SpeechLevel, QuestionType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin user
  await prisma.user.upsert({
    where: { email: "dingdong1405edu@gmail.com" },
    update: {},
    create: {
      email: "dingdong1405edu@gmail.com",
      name: "Admin",
      passwordHash: await bcrypt.hash("admin123456", 10),
      role: "ADMIN",
      xp: 0,
    },
  });

  // ─── HANGUL SETS ───────────────────────────────────────────────────────────
  await prisma.hangulSet.deleteMany();

  await prisma.hangulSet.createMany({
    data: [
      {
        type: HangulType.JAMO_BASIC,
        category: "모음 (Vowels)",
        order: 1,
        characters: [
          { hangul: "아", romaji: "a", jamo: "ㅏ", example: "아이 (child)", audio: "" },
          { hangul: "야", romaji: "ya", jamo: "ㅑ", example: "야구 (baseball)", audio: "" },
          { hangul: "어", romaji: "eo", jamo: "ㅓ", example: "어머니 (mother)", audio: "" },
          { hangul: "여", romaji: "yeo", jamo: "ㅕ", example: "여기 (here)", audio: "" },
          { hangul: "오", romaji: "o", jamo: "ㅗ", example: "오리 (duck)", audio: "" },
          { hangul: "요", romaji: "yo", jamo: "ㅛ", example: "요리 (cooking)", audio: "" },
          { hangul: "우", romaji: "u", jamo: "ㅜ", example: "우유 (milk)", audio: "" },
          { hangul: "유", romaji: "yu", jamo: "ㅠ", example: "유리 (glass)", audio: "" },
          { hangul: "으", romaji: "eu", jamo: "ㅡ", example: "으뜸 (top)", audio: "" },
          { hangul: "이", romaji: "i", jamo: "ㅣ", example: "이름 (name)", audio: "" },
        ],
      },
      {
        type: HangulType.JAMO_BASIC,
        category: "자음 (Consonants)",
        order: 2,
        characters: [
          { hangul: "가", romaji: "ga", jamo: "ㄱ", example: "가방 (bag)", audio: "" },
          { hangul: "나", romaji: "na", jamo: "ㄴ", example: "나라 (country)", audio: "" },
          { hangul: "다", romaji: "da", jamo: "ㄷ", example: "다리 (leg/bridge)", audio: "" },
          { hangul: "라", romaji: "ra", jamo: "ㄹ", example: "라디오 (radio)", audio: "" },
          { hangul: "마", romaji: "ma", jamo: "ㅁ", example: "마음 (heart/mind)", audio: "" },
          { hangul: "바", romaji: "ba", jamo: "ㅂ", example: "바나나 (banana)", audio: "" },
          { hangul: "사", romaji: "sa", jamo: "ㅅ", example: "사과 (apple)", audio: "" },
          { hangul: "아", romaji: "a", jamo: "ㅇ", example: "아파트 (apartment)", audio: "" },
          { hangul: "자", romaji: "ja", jamo: "ㅈ", example: "자동차 (car)", audio: "" },
          { hangul: "차", romaji: "cha", jamo: "ㅊ", example: "차 (car/tea)", audio: "" },
          { hangul: "카", romaji: "ka", jamo: "ㅋ", example: "카드 (card)", audio: "" },
          { hangul: "타", romaji: "ta", jamo: "ㅌ", example: "타다 (to ride)", audio: "" },
          { hangul: "파", romaji: "pa", jamo: "ㅍ", example: "파란색 (blue color)", audio: "" },
          { hangul: "하", romaji: "ha", jamo: "ㅎ", example: "하늘 (sky)", audio: "" },
        ],
      },
      {
        type: HangulType.JAMO_COMPOUND,
        category: "복합 모음 (Compound Vowels)",
        order: 3,
        characters: [
          { hangul: "애", romaji: "ae", jamo: "ㅐ", example: "애기 (baby)", audio: "" },
          { hangul: "에", romaji: "e", jamo: "ㅔ", example: "에어컨 (air conditioner)", audio: "" },
          { hangul: "의", romaji: "ui", jamo: "ㅢ", example: "의사 (doctor)", audio: "" },
          { hangul: "와", romaji: "wa", jamo: "ㅘ", example: "와인 (wine)", audio: "" },
          { hangul: "워", romaji: "wo", jamo: "ㅝ", example: "워크숍 (workshop)", audio: "" },
          { hangul: "위", romaji: "wi", jamo: "ㅟ", example: "위치 (location)", audio: "" },
          { hangul: "왜", romaji: "wae", jamo: "ㅙ", example: "왜 (why)", audio: "" },
          { hangul: "웨", romaji: "we", jamo: "ㅞ", example: "웨딩 (wedding)", audio: "" },
          { hangul: "외", romaji: "oe", jamo: "ㅚ", example: "외국 (foreign country)", audio: "" },
          { hangul: "얘", romaji: "yae", jamo: "ㅒ", example: "얘기 (story/talk)", audio: "" },
          { hangul: "예", romaji: "ye", jamo: "ㅖ", example: "예쁘다 (pretty)", audio: "" },
        ],
      },
      {
        type: HangulType.JAMO_COMPOUND,
        category: "쌍자음 (Double Consonants)",
        order: 4,
        characters: [
          { hangul: "까", romaji: "kka", jamo: "ㄲ", example: "까다 (to peel)", audio: "" },
          { hangul: "따", romaji: "tta", jamo: "ㄸ", example: "따다 (to pick)", audio: "" },
          { hangul: "빠", romaji: "ppa", jamo: "ㅃ", example: "빠르다 (fast)", audio: "" },
          { hangul: "싸", romaji: "ssa", jamo: "ㅆ", example: "싸다 (cheap)", audio: "" },
          { hangul: "짜", romaji: "jja", jamo: "ㅉ", example: "짜다 (salty)", audio: "" },
        ],
      },
      {
        type: HangulType.SYLLABLE_BLOCK,
        category: "받침 (Final Consonants)",
        order: 5,
        characters: [
          { hangul: "박", romaji: "bak", jamo: "ㄱ받침", example: "박수 (applause)", audio: "" },
          { hangul: "반", romaji: "ban", jamo: "ㄴ받침", example: "반지 (ring)", audio: "" },
          { hangul: "밥", romaji: "bap", jamo: "ㅂ받침", example: "밥 (rice/meal)", audio: "" },
          { hangul: "발", romaji: "bal", jamo: "ㄹ받침", example: "발 (foot)", audio: "" },
          { hangul: "밤", romaji: "bam", jamo: "ㅁ받침", example: "밤 (night/chestnut)", audio: "" },
          { hangul: "방", romaji: "bang", jamo: "ㅇ받침", example: "방 (room)", audio: "" },
          { hangul: "닭", romaji: "dak", jamo: "ㄱ받침(겹)", example: "닭 (chicken)", audio: "" },
          { hangul: "삶", romaji: "sam", jamo: "ㄼ받침", example: "삶 (life)", audio: "" },
        ],
      },
    ],
  });

  // ─── VOCAB UNITS — TOPIK 1 (800 từ) ───────────────────────────────────────
  await prisma.vocabUnit.deleteMany();

  const vocabUnits = [
    {
      title: "Greetings & Basics",
      titleKo: "인사와 기본 표현",
      topikLevel: TOPIKLevel.TOPIK1,
      order: 1,
      words: [
        { ko: "안녕하세요", vi: "Xin chào (lịch sự)", romaji: "annyeonghaseyo" },
        { ko: "감사합니다", vi: "Cảm ơn", romaji: "gamsahamnida" },
        { ko: "죄송합니다", vi: "Xin lỗi", romaji: "joesonghamnida" },
        { ko: "네", vi: "Vâng / Có", romaji: "ne" },
        { ko: "아니요", vi: "Không", romaji: "aniyo" },
        { ko: "이름", vi: "Tên", romaji: "ireum" },
        { ko: "저", vi: "Tôi (khiêm tốn)", romaji: "jeo" },
        { ko: "나", vi: "Tôi (thân mật)", romaji: "na" },
        { ko: "당신", vi: "Bạn/Anh/Chị", romaji: "dangsin" },
        { ko: "안녕히 가세요", vi: "Tạm biệt (người ra đi)", romaji: "annyeonghi gaseyo" },
        { ko: "안녕히 계세요", vi: "Tạm biệt (người ở lại)", romaji: "annyeonghi gyeseyo" },
        { ko: "반갑습니다", vi: "Rất vui được gặp", romaji: "bangapseumnida" },
        { ko: "처음 뵙겠습니다", vi: "Lần đầu gặp mặt", romaji: "cheoeum boepgesseumnida" },
        { ko: "잘 부탁드립니다", vi: "Xin hãy giúp đỡ tôi", romaji: "jal butakdeurimnida" },
        { ko: "괜찮아요", vi: "Không sao / Bạn có ổn không?", romaji: "gwaenchanayo" },
      ],
    },
    {
      title: "Numbers & Time",
      titleKo: "숫자와 시간",
      topikLevel: TOPIKLevel.TOPIK1,
      order: 2,
      words: [
        { ko: "일", vi: "Một (Sino-Korean)", romaji: "il" },
        { ko: "이", vi: "Hai (Sino-Korean)", romaji: "i" },
        { ko: "삼", vi: "Ba (Sino-Korean)", romaji: "sam" },
        { ko: "사", vi: "Bốn (Sino-Korean)", romaji: "sa" },
        { ko: "오", vi: "Năm (Sino-Korean)", romaji: "o" },
        { ko: "하나", vi: "Một (Pure Korean)", romaji: "hana" },
        { ko: "둘", vi: "Hai (Pure Korean)", romaji: "dul" },
        { ko: "셋", vi: "Ba (Pure Korean)", romaji: "set" },
        { ko: "시간", vi: "Giờ / Thời gian", romaji: "sigan" },
        { ko: "분", vi: "Phút", romaji: "bun" },
        { ko: "오늘", vi: "Hôm nay", romaji: "oneul" },
        { ko: "어제", vi: "Hôm qua", romaji: "eoje" },
        { ko: "내일", vi: "Ngày mai", romaji: "naeil" },
        { ko: "지금", vi: "Bây giờ", romaji: "jigeum" },
        { ko: "년", vi: "Năm (đơn vị)", romaji: "nyeon" },
        { ko: "월", vi: "Tháng", romaji: "wol" },
        { ko: "일", vi: "Ngày", romaji: "il" },
        { ko: "주", vi: "Tuần", romaji: "ju" },
      ],
    },
    {
      title: "Family",
      titleKo: "가족",
      topikLevel: TOPIKLevel.TOPIK1,
      order: 3,
      words: [
        { ko: "가족", vi: "Gia đình", romaji: "gajok" },
        { ko: "아버지", vi: "Cha (lịch sự)", romaji: "abeoji" },
        { ko: "어머니", vi: "Mẹ (lịch sự)", romaji: "eomeoni" },
        { ko: "아빠", vi: "Ba (thân mật)", romaji: "appa" },
        { ko: "엄마", vi: "Mẹ (thân mật)", romaji: "eomma" },
        { ko: "형", vi: "Anh trai (nam gọi)", romaji: "hyeong" },
        { ko: "오빠", vi: "Anh trai (nữ gọi)", romaji: "oppa" },
        { ko: "누나", vi: "Chị gái (nam gọi)", romaji: "nuna" },
        { ko: "언니", vi: "Chị gái (nữ gọi)", romaji: "eonni" },
        { ko: "남동생", vi: "Em trai", romaji: "namdongsaeng" },
        { ko: "여동생", vi: "Em gái", romaji: "yeodongsaeng" },
        { ko: "할아버지", vi: "Ông nội/ngoại", romaji: "harabeoji" },
        { ko: "할머니", vi: "Bà nội/ngoại", romaji: "halmeoni" },
        { ko: "남편", vi: "Chồng", romaji: "nampyeon" },
        { ko: "아내", vi: "Vợ", romaji: "anae" },
        { ko: "아이", vi: "Đứa trẻ", romaji: "ai" },
        { ko: "아들", vi: "Con trai", romaji: "adeul" },
        { ko: "딸", vi: "Con gái", romaji: "ttal" },
      ],
    },
    {
      title: "Food & Eating",
      titleKo: "음식과 식사",
      topikLevel: TOPIKLevel.TOPIK1,
      order: 4,
      words: [
        { ko: "음식", vi: "Thức ăn", romaji: "eumsik" },
        { ko: "밥", vi: "Cơm / Bữa ăn", romaji: "bap" },
        { ko: "물", vi: "Nước", romaji: "mul" },
        { ko: "커피", vi: "Cà phê", romaji: "keopi" },
        { ko: "차", vi: "Trà", romaji: "cha" },
        { ko: "빵", vi: "Bánh mì", romaji: "ppang" },
        { ko: "고기", vi: "Thịt", romaji: "gogi" },
        { ko: "생선", vi: "Cá", romaji: "saengseon" },
        { ko: "야채", vi: "Rau", romaji: "yachae" },
        { ko: "과일", vi: "Hoa quả", romaji: "gwail" },
        { ko: "사과", vi: "Táo", romaji: "sagwa" },
        { ko: "배", vi: "Lê", romaji: "bae" },
        { ko: "김치", vi: "Kim chi", romaji: "gimchi" },
        { ko: "불고기", vi: "Bulgogi (thịt nướng)", romaji: "bulgogi" },
        { ko: "비빔밥", vi: "Cơm trộn", romaji: "bibimbap" },
        { ko: "식당", vi: "Nhà hàng", romaji: "sikdang" },
        { ko: "맛있다", vi: "Ngon", romaji: "masitda" },
        { ko: "맵다", vi: "Cay", romaji: "maepda" },
        { ko: "달다", vi: "Ngọt", romaji: "dalda" },
        { ko: "짜다", vi: "Mặn", romaji: "jjada" },
      ],
    },
    {
      title: "Places & Transportation",
      titleKo: "장소와 교통",
      topikLevel: TOPIKLevel.TOPIK1,
      order: 5,
      words: [
        { ko: "학교", vi: "Trường học", romaji: "hakgyo" },
        { ko: "병원", vi: "Bệnh viện", romaji: "byeongwon" },
        { ko: "은행", vi: "Ngân hàng", romaji: "eunhaeng" },
        { ko: "마트", vi: "Siêu thị", romaji: "mateu" },
        { ko: "공항", vi: "Sân bay", romaji: "gonghang" },
        { ko: "역", vi: "Ga tàu", romaji: "yeok" },
        { ko: "버스", vi: "Xe buýt", romaji: "beoseu" },
        { ko: "지하철", vi: "Tàu điện ngầm", romaji: "jihacheol" },
        { ko: "택시", vi: "Taxi", romaji: "taeksi" },
        { ko: "자동차", vi: "Ô tô", romaji: "jadongcha" },
        { ko: "집", vi: "Nhà", romaji: "jip" },
        { ko: "방", vi: "Phòng", romaji: "bang" },
        { ko: "화장실", vi: "Nhà vệ sinh", romaji: "hwajangsil" },
        { ko: "어디", vi: "Ở đâu", romaji: "eodi" },
        { ko: "여기", vi: "Ở đây", romaji: "yeogi" },
        { ko: "거기", vi: "Ở đó", romaji: "geogi" },
        { ko: "저기", vi: "Ở đằng kia", romaji: "jeogi" },
        { ko: "왼쪽", vi: "Bên trái", romaji: "oenjjok" },
        { ko: "오른쪽", vi: "Bên phải", romaji: "oreunjjok" },
        { ko: "앞", vi: "Phía trước", romaji: "ap" },
        { ko: "뒤", vi: "Phía sau", romaji: "dwi" },
      ],
    },
    {
      title: "Daily Life Verbs",
      titleKo: "일상 동사",
      topikLevel: TOPIKLevel.TOPIK1,
      order: 6,
      words: [
        { ko: "가다", vi: "Đi", romaji: "gada" },
        { ko: "오다", vi: "Đến / Lại", romaji: "oda" },
        { ko: "먹다", vi: "Ăn", romaji: "meokda" },
        { ko: "마시다", vi: "Uống", romaji: "masida" },
        { ko: "자다", vi: "Ngủ", romaji: "jada" },
        { ko: "일어나다", vi: "Thức dậy", romaji: "ireonada" },
        { ko: "공부하다", vi: "Học", romaji: "gongbuhada" },
        { ko: "일하다", vi: "Làm việc", romaji: "ilhada" },
        { ko: "보다", vi: "Nhìn / Xem", romaji: "boda" },
        { ko: "듣다", vi: "Nghe", romaji: "deutda" },
        { ko: "말하다", vi: "Nói", romaji: "malhada" },
        { ko: "읽다", vi: "Đọc", romaji: "ikda" },
        { ko: "쓰다", vi: "Viết", romaji: "sseuda" },
        { ko: "사다", vi: "Mua", romaji: "sada" },
        { ko: "팔다", vi: "Bán", romaji: "palda" },
        { ko: "만나다", vi: "Gặp gỡ", romaji: "mannada" },
        { ko: "알다", vi: "Biết", romaji: "alda" },
        { ko: "모르다", vi: "Không biết", romaji: "moreuda" },
        { ko: "좋아하다", vi: "Thích", romaji: "joahada" },
        { ko: "싫어하다", vi: "Không thích / Ghét", romaji: "sireohada" },
      ],
    },
    {
      title: "Adjectives & Descriptions",
      titleKo: "형용사와 묘사",
      topikLevel: TOPIKLevel.TOPIK1,
      order: 7,
      words: [
        { ko: "크다", vi: "To / Lớn", romaji: "keuda" },
        { ko: "작다", vi: "Nhỏ", romaji: "jakda" },
        { ko: "많다", vi: "Nhiều", romaji: "manta" },
        { ko: "적다", vi: "Ít", romaji: "jeokda" },
        { ko: "좋다", vi: "Tốt / Hay", romaji: "jota" },
        { ko: "나쁘다", vi: "Xấu / Tệ", romaji: "nappeuda" },
        { ko: "새롭다", vi: "Mới", romaji: "saeroptda" },
        { ko: "오래되다", vi: "Cũ / Lâu", romaji: "oraedoeda" },
        { ko: "빠르다", vi: "Nhanh", romaji: "ppareuda" },
        { ko: "느리다", vi: "Chậm", romaji: "neurida" },
        { ko: "아름답다", vi: "Đẹp (cảnh vật)", romaji: "areumdapda" },
        { ko: "예쁘다", vi: "Xinh đẹp", romaji: "yeppeuda" },
        { ko: "귀엽다", vi: "Dễ thương", romaji: "gwiyeopda" },
        { ko: "더럽다", vi: "Bẩn", romaji: "deoreoptda" },
        { ko: "깨끗하다", vi: "Sạch sẽ", romaji: "kkaekkeuthada" },
        { ko: "비싸다", vi: "Đắt", romaji: "bissada" },
        { ko: "싸다", vi: "Rẻ", romaji: "ssada" },
        { ko: "쉽다", vi: "Dễ", romaji: "swipda" },
        { ko: "어렵다", vi: "Khó", romaji: "eoryeopda" },
        { ko: "재미있다", vi: "Thú vị / Vui", romaji: "jaemiitda" },
      ],
    },
    {
      title: "Weather & Nature",
      titleKo: "날씨와 자연",
      topikLevel: TOPIKLevel.TOPIK1,
      order: 8,
      words: [
        { ko: "날씨", vi: "Thời tiết", romaji: "nalssi" },
        { ko: "맑다", vi: "Trong sáng / Đẹp trời", romaji: "makda" },
        { ko: "흐리다", vi: "Nhiều mây / Âm u", romaji: "heurida" },
        { ko: "비", vi: "Mưa", romaji: "bi" },
        { ko: "눈", vi: "Tuyết / Mắt", romaji: "nun" },
        { ko: "바람", vi: "Gió", romaji: "baram" },
        { ko: "봄", vi: "Mùa xuân", romaji: "bom" },
        { ko: "여름", vi: "Mùa hè", romaji: "yeoreum" },
        { ko: "가을", vi: "Mùa thu", romaji: "gaeul" },
        { ko: "겨울", vi: "Mùa đông", romaji: "gyeoul" },
        { ko: "덥다", vi: "Nóng", romaji: "deopda" },
        { ko: "춥다", vi: "Lạnh", romaji: "chupda" },
        { ko: "따뜻하다", vi: "Ấm", romaji: "ttatteutada" },
        { ko: "시원하다", vi: "Mát mẻ", romaji: "siwonhada" },
        { ko: "산", vi: "Núi", romaji: "san" },
        { ko: "강", vi: "Sông", romaji: "gang" },
        { ko: "바다", vi: "Biển", romaji: "bada" },
        { ko: "하늘", vi: "Bầu trời", romaji: "haneul" },
      ],
    },
    {
      title: "Shopping & Money",
      titleKo: "쇼핑과 돈",
      topikLevel: TOPIKLevel.TOPIK1,
      order: 9,
      words: [
        { ko: "돈", vi: "Tiền", romaji: "don" },
        { ko: "원", vi: "Won (tiền Hàn)", romaji: "won" },
        { ko: "가격", vi: "Giá cả", romaji: "gagyeok" },
        { ko: "얼마", vi: "Bao nhiêu tiền", romaji: "eolma" },
        { ko: "쇼핑", vi: "Mua sắm", romaji: "syoping" },
        { ko: "백화점", vi: "Trung tâm thương mại", romaji: "baekhwajeom" },
        { ko: "시장", vi: "Chợ", romaji: "sijang" },
        { ko: "옷", vi: "Quần áo", romaji: "ot" },
        { ko: "신발", vi: "Giày dép", romaji: "sinbal" },
        { ko: "가방", vi: "Túi", romaji: "gabang" },
        { ko: "색깔", vi: "Màu sắc", romaji: "saekgal" },
        { ko: "빨간색", vi: "Màu đỏ", romaji: "ppalgansaek" },
        { ko: "파란색", vi: "Màu xanh dương", romaji: "paransaek" },
        { ko: "노란색", vi: "Màu vàng", romaji: "noransaek" },
        { ko: "흰색", vi: "Màu trắng", romaji: "huinsaek" },
        { ko: "검은색", vi: "Màu đen", romaji: "geomeunsaek" },
        { ko: "영수증", vi: "Hóa đơn", romaji: "yeongsujeung" },
        { ko: "카드", vi: "Thẻ (thanh toán)", romaji: "kadeu" },
      ],
    },
    {
      title: "Health & Body",
      titleKo: "건강과 신체",
      topikLevel: TOPIKLevel.TOPIK1,
      order: 10,
      words: [
        { ko: "몸", vi: "Cơ thể", romaji: "mom" },
        { ko: "머리", vi: "Đầu / Tóc", romaji: "meori" },
        { ko: "눈", vi: "Mắt", romaji: "nun" },
        { ko: "코", vi: "Mũi", romaji: "ko" },
        { ko: "입", vi: "Miệng", romaji: "ip" },
        { ko: "귀", vi: "Tai", romaji: "gwi" },
        { ko: "손", vi: "Tay", romaji: "son" },
        { ko: "발", vi: "Chân", romaji: "bal" },
        { ko: "아프다", vi: "Đau / Bệnh", romaji: "apeuda" },
        { ko: "건강하다", vi: "Khỏe mạnh", romaji: "geonganghada" },
        { ko: "약", vi: "Thuốc", romaji: "yak" },
        { ko: "의사", vi: "Bác sĩ", romaji: "uisa" },
        { ko: "간호사", vi: "Y tá", romaji: "ganhosa" },
        { ko: "열", vi: "Sốt", romaji: "yeol" },
        { ko: "기침", vi: "Ho", romaji: "gichim" },
        { ko: "감기", vi: "Cảm lạnh", romaji: "gamgi" },
        { ko: "피곤하다", vi: "Mệt mỏi", romaji: "pigonhada" },
        { ko: "쉬다", vi: "Nghỉ ngơi", romaji: "swida" },
      ],
    },
  ];

  for (const unitData of vocabUnits) {
    const { words, ...unitInfo } = unitData;
    const unit = await prisma.vocabUnit.create({ data: unitInfo });

    // Create lesson with match + translate + fillBlank exercises
    await prisma.vocabLesson.create({
      data: {
        unitId: unit.id,
        order: 1,
        exercises: words.slice(0, 8).map((w, i) => ({
          id: `${unit.id}-ex-${i}`,
          type: i % 3 === 0 ? "match" : i % 3 === 1 ? "translate" : "listen",
          question: w.ko,
          answer: w.vi,
          romaji: w.romaji,
          options: words
            .slice(0, 5)
            .map((x) => x.vi)
            .sort(() => Math.random() - 0.5),
        })),
      },
    });

    await prisma.vocabLesson.create({
      data: {
        unitId: unit.id,
        order: 2,
        exercises: words.slice(8).map((w, i) => ({
          id: `${unit.id}-ex2-${i}`,
          type: i % 2 === 0 ? "fillBlank" : "sentenceOrder",
          question: w.ko,
          answer: w.vi,
          romaji: w.romaji,
          options: words
            .slice(0, 5)
            .map((x) => x.vi)
            .sort(() => Math.random() - 0.5),
        })),
      },
    });
  }

  // ─── GRAMMAR UNITS ─────────────────────────────────────────────────────────
  await prisma.grammarUnit.deleteMany();

  const grammarUnits = [
    {
      title: "Topic Marker 은/는",
      titleKo: "주제 조사 은/는",
      topikLevel: TOPIKLevel.TOPIK1,
      pattern: "N + 은/는",
      explanation: "은/는 marks the topic of the sentence. Use 은 after a consonant, 는 after a vowel. Example: 저는 학생이에요 (I am a student). 이것은 책이에요 (This is a book).",
      order: 1,
    },
    {
      title: "Subject Marker 이/가",
      titleKo: "주격 조사 이/가",
      topikLevel: TOPIKLevel.TOPIK1,
      pattern: "N + 이/가",
      explanation: "이/가 marks the subject of the sentence. Use 이 after a consonant, 가 after a vowel. Example: 고양이가 있어요 (There is a cat). 누가 왔어요? (Who came?)",
      order: 2,
    },
    {
      title: "Object Marker 을/를",
      titleKo: "목적격 조사 을/를",
      topikLevel: TOPIKLevel.TOPIK1,
      pattern: "N + 을/를",
      explanation: "을/를 marks the object of the sentence. Use 을 after a consonant, 를 after a vowel. Example: 밥을 먹어요 (Eat rice). 음악을 들어요 (Listen to music).",
      order: 3,
    },
    {
      title: "Copula 이에요/예요",
      titleKo: "서술격 조사 이에요/예요",
      topikLevel: TOPIKLevel.TOPIK1,
      pattern: "N + 이에요/예요",
      explanation: "이에요/예요 means 'is/am/are'. Use 이에요 after a consonant, 예요 after a vowel. Example: 학생이에요 (is a student). 의사예요 (is a doctor).",
      order: 4,
    },
    {
      title: "Existence 있다/없다",
      titleKo: "존재 있다/없다",
      topikLevel: TOPIKLevel.TOPIK1,
      pattern: "N이/가 있다/없다",
      explanation: "있다 means 'to exist/have', 없다 means 'to not exist/not have'. Example: 책이 있어요 (There is a book / I have a book). 시간이 없어요 (There is no time).",
      order: 5,
    },
    {
      title: "Connective -고",
      titleKo: "연결 어미 -고",
      topikLevel: TOPIKLevel.TOPIK1,
      pattern: "V/A + -고",
      explanation: "-고 connects two clauses, meaning 'and'. Example: 학교에 가고 공부해요 (I go to school and study). 크고 예뻐요 (Big and pretty).",
      order: 6,
    },
    {
      title: "Polite Present Tense -아/어요",
      titleKo: "현재 시제 -아/어요",
      topikLevel: TOPIKLevel.TOPIK1,
      pattern: "V stem + -아요/어요",
      explanation: "아/어요 is the standard polite present tense ending. Use 아요 after ㅏ/ㅗ vowels, 어요 otherwise. Example: 가다 → 가요, 먹다 → 먹어요, 하다 → 해요.",
      order: 7,
    },
    {
      title: "Past Tense -았/었어요",
      titleKo: "과거 시제 -았/었어요",
      topikLevel: TOPIKLevel.TOPIK1,
      pattern: "V stem + -았어요/었어요",
      explanation: "았/었어요 is the past tense marker. Use 았어요 after ㅏ/ㅗ, 었어요 otherwise. Example: 먹었어요 (ate), 갔어요 (went), 했어요 (did).",
      order: 8,
    },
    {
      title: "Want to -고 싶다",
      titleKo: "희망 -고 싶다",
      topikLevel: TOPIKLevel.TOPIK1,
      pattern: "V + -고 싶다",
      explanation: "-고 싶다 expresses the speaker's desire/want. Example: 한국에 가고 싶어요 (I want to go to Korea). 커피를 마시고 싶어요 (I want to drink coffee).",
      order: 9,
    },
    {
      title: "Can/Cannot -ㄹ/을 수 있다/없다",
      titleKo: "가능/불가능 -ㄹ/을 수 있다/없다",
      topikLevel: TOPIKLevel.TOPIK2,
      pattern: "V + -(으)ㄹ 수 있다/없다",
      explanation: "-(으)ㄹ 수 있다 = can do, -(으)ㄹ 수 없다 = cannot do. Example: 한국어를 할 수 있어요 (I can speak Korean). 지금 올 수 없어요 (I cannot come now).",
      order: 10,
    },
  ];

  for (const grammarData of grammarUnits) {
    const unit = await prisma.grammarUnit.create({ data: grammarData });
    await prisma.grammarLesson.create({
      data: {
        unitId: unit.id,
        order: 1,
        exercises: [
          {
            id: `${unit.id}-g1`,
            type: "fillBlank",
            question: `저___학생이에요. (I am a student)`,
            answer: "는",
            options: ["은", "는", "이", "가"],
          },
          {
            id: `${unit.id}-g2`,
            type: "translate",
            question: "나는 밥을 먹어요.",
            answer: "I eat rice.",
            options: ["I eat rice.", "I drink water.", "I go to school.", "I sleep."],
          },
          {
            id: `${unit.id}-g3`,
            type: "speechLevel",
            question: "밥 먹어. (반말 → 존댓말)",
            answer: "밥 먹어요.",
            options: ["밥 먹어요.", "밥 드세요.", "밥 먹습니다.", "밥 드십니까?"],
          },
        ],
      },
    });
  }

  // ─── READING TESTS ──────────────────────────────────────────────────────────
  await prisma.readingTest.deleteMany();

  const rt1 = await prisma.readingTest.create({
    data: {
      title: "Daily Life Reading — TOPIK 1",
      titleKo: "일상생활 읽기 — TOPIK 1",
      topikLevel: TOPIKLevel.TOPIK1,
      timeLimit: 40,
      passage: `저는 서울에 살아요. 우리 집은 아파트예요. 집 근처에 마트가 있어요.
마트에는 음식, 옷, 생활용품 등 여러 가지 물건이 있어요.
저는 매주 토요일에 마트에 가요. 과일, 야채, 고기를 사요.
마트에서 쇼핑하는 것이 즐거워요. 물건 가격도 싸요.
집에 돌아와서 요리를 해요. 요리는 조금 어렵지만 재미있어요.`,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        readingId: rt1.id,
        type: QuestionType.MCQ,
        prompt: "이 사람은 어디에 살아요?",
        options: ["부산", "서울", "제주도", "인천"],
        correctAnswer: "서울",
        explanation: "본문에서 '저는 서울에 살아요'라고 했습니다.",
        order: 1,
      },
      {
        readingId: rt1.id,
        type: QuestionType.MCQ,
        prompt: "이 사람은 마트에 언제 가요?",
        options: ["매주 금요일", "매주 토요일", "매주 일요일", "매일"],
        correctAnswer: "매주 토요일",
        explanation: "본문에서 '저는 매주 토요일에 마트에 가요'라고 했습니다.",
        order: 2,
      },
      {
        readingId: rt1.id,
        type: QuestionType.MCQ,
        prompt: "마트에서 사지 않는 것은 무엇이에요?",
        options: ["과일", "야채", "고기", "옷"],
        correctAnswer: "옷",
        explanation: "본문에서 '과일, 야채, 고기를 사요'라고 했습니다. 옷은 언급되지 않았습니다.",
        order: 3,
      },
      {
        readingId: rt1.id,
        type: QuestionType.TRUE_FALSE,
        prompt: "이 사람은 요리를 전혀 안 해요.",
        options: ["맞다", "틀리다"],
        correctAnswer: "틀리다",
        explanation: "본문에서 '집에 돌아와서 요리를 해요'라고 했습니다.",
        order: 4,
      },
    ],
  });

  const rt2 = await prisma.readingTest.create({
    data: {
      title: "Korean Seasons Reading — TOPIK 1",
      titleKo: "한국의 계절 — TOPIK 1",
      topikLevel: TOPIKLevel.TOPIK1,
      timeLimit: 40,
      passage: `한국에는 봄, 여름, 가을, 겨울 사계절이 있어요.
봄(3~5월)은 따뜻해요. 꽃이 피고 날씨가 좋아요.
여름(6~8월)은 더워요. 비가 많이 와요.
가을(9~11월)은 시원해요. 단풍이 예쁘게 들어요.
겨울(12~2월)은 추워요. 눈이 내리기도 해요.
한국 사람들은 가을 날씨를 제일 좋아해요. 하늘도 맑고 공기도 깨끗해요.`,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        readingId: rt2.id,
        type: QuestionType.MCQ,
        prompt: "한국 사람들이 가장 좋아하는 계절은 무엇이에요?",
        options: ["봄", "여름", "가을", "겨울"],
        correctAnswer: "가을",
        explanation: "본문에서 '한국 사람들은 가을 날씨를 제일 좋아해요'라고 했습니다.",
        order: 1,
      },
      {
        readingId: rt2.id,
        type: QuestionType.MCQ,
        prompt: "여름에 대한 설명으로 맞는 것은?",
        options: ["시원해요", "비가 많이 와요", "눈이 내려요", "꽃이 피어요"],
        correctAnswer: "비가 많이 와요",
        explanation: "본문에서 '여름은 더워요. 비가 많이 와요'라고 했습니다.",
        order: 2,
      },
      {
        readingId: rt2.id,
        type: QuestionType.MCQ,
        prompt: "봄은 몇 월부터 몇 월이에요?",
        options: ["1~3월", "3~5월", "6~8월", "9~11월"],
        correctAnswer: "3~5월",
        explanation: "본문에서 '봄(3~5월)은 따뜻해요'라고 했습니다.",
        order: 3,
      },
    ],
  });

  // ─── WRITING TASKS ──────────────────────────────────────────────────────────
  await prisma.writingTask.deleteMany();

  await prisma.writingTask.createMany({
    data: [
      {
        taskType: WritingTaskType.TOPIK_51,
        topikLevel: TOPIKLevel.TOPIK3,
        minChars: 100,
        timeLimit: 20,
        requireFormal: true,
        prompt: "Fill in the blanks (①②) to complete the passage.",
        promptKo: `다음 글을 읽고 ①, ②에 들어갈 말을 각각 한 문장씩 쓰십시오.

현대인들은 스마트폰을 많이 사용합니다. 스마트폰은 편리하지만 문제도 있습니다.
특히 잠자리에서 스마트폰을 사용하면 (①).
그러므로 건강을 위해서 (②).`,
      },
      {
        taskType: WritingTaskType.TOPIK_52,
        topikLevel: TOPIKLevel.TOPIK3,
        minChars: 200,
        timeLimit: 30,
        requireFormal: true,
        prompt: "Write a short essay based on the given outline.",
        promptKo: `다음을 참고하여 '운동의 효과'에 대한 글을 200~300자로 쓰십시오.

• 규칙적인 운동의 신체적 효과
• 운동이 정신 건강에 미치는 영향
• 일상생활에서 운동하는 방법`,
      },
      {
        taskType: WritingTaskType.TOPIK_53,
        topikLevel: TOPIKLevel.TOPIK3,
        minChars: 600,
        timeLimit: 50,
        requireFormal: true,
        prompt: "Write an essay on the given topic (600-700 characters).",
        promptKo: `다음을 주제로 하여 자신의 생각을 600~700자로 쓰십시오.

현대 사회에서 '환경 보호'의 중요성에 대해 논하고,
개인과 사회가 환경을 보호하기 위해 할 수 있는 구체적인 방법을 제시하십시오.

※ 글의 제목을 쓰지 마십시오.`,
      },
      {
        taskType: WritingTaskType.FREE,
        topikLevel: TOPIKLevel.TOPIK1,
        minChars: 50,
        timeLimit: 15,
        requireFormal: false,
        prompt: "Introduce yourself in Korean.",
        promptKo: `자기소개를 해 보세요. 이름, 나이, 직업, 취미 등을 써 보세요.`,
      },
    ],
  });

  // ─── SPEAKING SETS ──────────────────────────────────────────────────────────
  await prisma.speakingSet.deleteMany();

  await prisma.speakingSet.createMany({
    data: [
      {
        topikLevel: TOPIKLevel.TOPIK1,
        taskType: SpeakingTaskType.CONVERSATION,
        topic: "Self Introduction",
        topicKo: "자기소개",
        speechLevel: SpeechLevel.POLITE,
        prepTimeSec: 30,
        speakTimeSec: 60,
        prompts: [
          "안녕하세요? 자기소개를 해 주세요.",
          "이름이 뭐예요?",
          "어느 나라 사람이에요?",
          "직업이 뭐예요?",
          "취미가 뭐예요?",
        ],
      },
      {
        topikLevel: TOPIKLevel.TOPIK1,
        taskType: SpeakingTaskType.CONVERSATION,
        topic: "Daily Routine",
        topicKo: "일상 생활",
        speechLevel: SpeechLevel.POLITE,
        prepTimeSec: 30,
        speakTimeSec: 90,
        prompts: [
          "아침에 몇 시에 일어나요?",
          "아침 식사는 무엇을 먹어요?",
          "학교/회사에 어떻게 가요?",
          "저녁에 보통 무엇을 해요?",
          "주말에는 무엇을 해요?",
        ],
      },
      {
        topikLevel: TOPIKLevel.TOPIK2,
        taskType: SpeakingTaskType.OPINION,
        topic: "Technology and Daily Life",
        topicKo: "기술과 일상생활",
        speechLevel: SpeechLevel.POLITE,
        prepTimeSec: 60,
        speakTimeSec: 90,
        prompts: [
          "스마트폰이 일상생활에 어떤 영향을 미쳤다고 생각해요?",
          "스마트폰의 장점과 단점은 무엇이에요?",
          "기술 발전이 인간 관계에 미치는 영향에 대해 어떻게 생각해요?",
        ],
      },
      {
        topikLevel: TOPIKLevel.TOPIK1,
        taskType: SpeakingTaskType.ROLEPLAY,
        topic: "At a Restaurant",
        topicKo: "식당에서",
        speechLevel: SpeechLevel.POLITE,
        prepTimeSec: 30,
        speakTimeSec: 90,
        prompts: [
          "식당에서 자리를 요청하세요.",
          "메뉴를 보고 음식을 주문하세요.",
          "음식에 문제가 있으면 말씀해 주세요.",
          "계산을 요청하세요.",
        ],
      },
    ],
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
