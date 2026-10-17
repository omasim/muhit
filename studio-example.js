/* Local fixture; no remote model. */
globalThis.MuhitStudioExample = {
  schemaVersion: "1.0.0",
  theme: {
    preset: "grove",
    mode: "light",
    font: "editorial",
    density: "comfortable",
  },
  components: [
    {
      type: "notice",
      id: "fictional-scenario",
      title: "Birlikte düşünmek için örnek görünüm",
      message:
        "Bu insan ve doğa odaklı proje senaryosu bütünüyle kurgusaldır. İsimler ve sayılar gerçek bir programın ya da çevresel performansın kanıtı değildir.",
      tone: "info",
    },
    {
      type: "card",
      id: "shared-garden",
      title: "Ortak bahçede yeni karşılaşmalar",
      description:
        "Mahallede erişilebilir bir buluşma alanını birlikte tasarlamak için soruları görünür kılan örnek çalışma. İlk adım, katılım ve bakım ihtiyaçlarını dinlemek.",
      action: {
        id: "review-project",
        label: "Örnek çalışma notunu aç",
      },
    },
    {
      type: "metric",
      id: "planned-conversations",
      label: "Planlanan örnek görüşme",
      value: "12 kişi",
      note: "Kurgusal planlama sayısıdır; gerçekleşmiş katılım veya ölçülmüş etki değildir.",
    },
    {
      type: "table",
      id: "project-notes",
      title: "Kurgusal çalışma kayıtları",
      rows: [
        {
          id: "TL-101",
          title: "Alanı birlikte dinlemek",
          status: "planned",
          theme: "İnsan · Erişilebilir katılım",
          owner: "Ada Deniz",
          initials: "AD",
          updated: "2026-10-09",
          note: "Örnek kişi ve kayıt. Katılım engellerini anlamak için görüşme çerçevesi.",
          next: "Gönüllü katılım biçimini birlikte değerlendirmek.",
        },
        {
          id: "TL-102",
          title: "Su kullanımını anlamak",
          status: "review",
          theme: "Doğa · Ortak bakım",
          owner: "Ekin Yalın",
          initials: "EY",
          updated: "2026-10-08",
          note: "Örnek kişi ve kayıt. Tüketim iddiası içermez; yalnız araştırma planı.",
          next: "Ölçüm sınırını ve veri kaynağını tanımlamak.",
        },
        {
          id: "TL-103",
          title: "Malzemeyi yeniden düşünmek",
          status: "active",
          theme: "Kaynak · Onarım",
          owner: "Mira Aydın",
          initials: "MA",
          updated: "2026-10-07",
          note: "Kurgusal tasarım çalışması. Gerçek tasarruf verisi değildir.",
          next: "Bakım seçeneklerini farklı ihtiyaçlarla karşılaştırmak.",
        },
      ],
    },
    {
      type: "chart",
      id: "example-research",
      title: "Örnek araştırma akışı",
      data: {
        period: 6,
        year: "2026",
        label: "Ocak–Haziran 2026 · Kurgusal senaryo",
        isExample: true,
        source:
          "Yalnız bileşen gösterimi için üretilmiş sayımlar; gerçek kullanım, toplumsal etki veya çevresel performans verisi değildir.",
        rows: [
          {
            date: "2026-01",
            month: "Ocak",
            shortMonth: "Oca",
            sources: 8,
            actions: 3,
            connections: 4,
          },
          {
            date: "2026-02",
            month: "Şubat",
            shortMonth: "Şub",
            sources: 12,
            actions: 5,
            connections: 7,
          },
          {
            date: "2026-03",
            month: "Mart",
            shortMonth: "Mar",
            sources: 10,
            actions: 4,
            connections: 6,
          },
          {
            date: "2026-04",
            month: "Nisan",
            shortMonth: "Nis",
            sources: 16,
            actions: 7,
            connections: 9,
          },
          {
            date: "2026-05",
            month: "Mayıs",
            shortMonth: "May",
            sources: 18,
            actions: 9,
            connections: 11,
          },
          {
            date: "2026-06",
            month: "Haziran",
            shortMonth: "Haz",
            sources: 20,
            actions: 10,
            connections: 12,
          },
        ],
        categories: [
          {
            name: "Ortak yaşam",
            value: 18,
          },
          {
            name: "Bakım",
            value: 12,
          },
          {
            name: "Onarım",
            value: 8,
          },
        ],
        types: [
          {
            name: "Görüşme notu",
            value: 36,
          },
          {
            name: "Araştırma notu",
            value: 30,
          },
          {
            name: "Atölye notu",
            value: 18,
          },
        ],
      },
    },
  ],
};
