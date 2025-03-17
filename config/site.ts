export const siteConfig = {
  name: "Event Duration Calculator",
  description:
    "A user-friendly web app to effortlessly calculate and sum the durations of multiple scheduled events.",
  url: "https://calculator.findmalek.com",
  images: {
    default: "https://calculator.findmalek.com/og.png",
    notFound: "https://calculator.findmalek.com/not-found.png",
    logo: "https://emojicdn.elk.sh/🕒?style=twitter",
  },
  links: {
    twitter: "https://twitter.com/foundmalek",
    github: "https://github.com/FindMalek/event-duration-calculator",
  },
  author: {
    name: "findmalek",
    url: "https://www.findmalek.com",
    email: "hi@findmalek.com",
    github: "https://github.com/findmalek",
  },
  keywords: [
    "Event Calculator",
    "Duration Calculator",
    "Time Management",
    "Event Planning",
    "Productivity Tools",
    "Web Application",
    "Time Tracking",
    "Calendar Management",
    "Efficiency Tools",
    "Next.js",
    "React",
    "TypeScript",
  ],
}

export const notFoundMetadata = () => {
  return {
    title: "Page not found",
    description: "Page not found",
    openGraph: {
      title: `${siteConfig.name} | Page not found`,
      description: "Page not found",
      images: [
        {
          url: siteConfig.images.notFound,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} | Page not found`,
      description: "Page not found",
      images: [siteConfig.images.notFound],
      creator: "@findmalek",
    },
  }
}
