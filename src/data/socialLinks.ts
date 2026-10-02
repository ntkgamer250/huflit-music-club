export interface ContactInfo {
  email: string
  facebook: {
    handle: string
    url: string
  }
  instagram: {
    handle: string
    url: string
  }
  tiktok: {
    handle: string
    url: string
  }
  location: string
  clubName: string
  establishedYear: string
  memberCount: string
  eventCount: string
  performanceCount: string
}

export const clubData: ContactInfo = {
  clubName: "Huflit Music Club",
  establishedYear: "2020",
  memberCount: "50+",
  eventCount: "20+",
  performanceCount: "100+",
  email: "clbamnhac.huflit@gmail.com",
  facebook: {
    handle: "fb.com/clbamnhac.huflit",
    url: "https://facebook.com",
  },
  instagram: {
    handle: "@clbamnhac.huflit",
    url: "https://instagram.com",
  },
  tiktok: {
    handle: "@clbamnhac.huflit",
    url: "https://tiktok.com",
  },
  location: "Phòng hội thảo lầu 1, 828 Sư Vạn Hạnh, Hòa Hưng, HCM",
}

export const navItems = [
  { label: "Trang chủ", href: "#hero" },
  { label: "Giới thiệu", href: "#about" },
  { label: "Casting", href: "#family" },
  { label: "Mini game", href: "#minigame" },
  { label: "Liên hệ", href: "#contact" },
]
