export type PortfolioProject = {
  title: string;
  url: string;
  image: string;
  description?: string;
};

export const portfolioProjects: PortfolioProject[] = [
  {
    title: "Atlas of Change",
    url: "https://climate-change-smorrison.vercel.app/",
    image: "/images/climatechange.png",
    description: "Interactive climate data experience.",
  },
  {
    title: "Stefan Časić",
    url: "https://bid-website.vercel.app/",
    image: "/images/stefancasic.png",
    description: "Athlete portfolio and e-commerce site.",
  },
  {
    title: "Mood Fuel",
    url: "https://mood-fuel.vercel.app/",
    image: "/images/moodfuel.png",
    description: "Digital wellbeing campaign microsite.",
  },
  {
    title: "Props Theatre",
    url: "https://props-theatre.vercel.app/",
    image: "/images/propstheatre.png",
    description: "Theatre company event website.",
  },
  {
    title: "Celebrate Hairdressing",
    url: "https://hairdressingbrochure.vercel.app/",
    image: "/images/hairatagecelebration.png",
    description: "Bendigo TAFE hairdressing brochure.",
  },
  {
    title: "INU",
    url: "https://inushereem.vercel.app/",
    image: "/images/inu.png",
    description: "Brand site — the future of canines.",
  },
];
