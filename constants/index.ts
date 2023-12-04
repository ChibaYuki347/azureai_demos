import { SidebarLink } from "@/types";

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/star.svg",
    route: "/services",
    label: "サービスデモ",
    subSidebarLinks: [
      // {
      //   route: "/services/openai",
      //   label: "OpenAI",
      // },
      {
        route: "/services/openai-chat",
        label: "OpenAI Chat",
      },
      {
        route: "/services/aispeech",
        label: "AI Speech",
      },
    ],
  },
  {
    imgURL: "/assets/icons/star.svg",
    route: "/usecases",
    label: "ユースケース",
    subSidebarLinks: [
      {
        route: "/usecases/avatertalk",
        label: "Avatar Talk",
      },
      {
        route: "/usecases/call-center-order",
        label: "コールセンター注文",
      },
    ],
  },
];
