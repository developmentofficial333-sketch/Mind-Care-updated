export const primaryNavLinks = [
  { label: "For You", href: "#" },
  {
    label: "For Business",
    href: "#",
    submenu: {
      // Two side-by-side column groups, each stacking two link sections —
      // matches the reference site's 2x2 layout under "For Business".
      columnGroups: [
        {
          sections: [
            {
              heading: "Who we serve",
              items: [
                { label: "Employers", href: "#" },
                { label: "Small businesses", href: "#" },
                { label: "Health plans", href: "#" },
                { label: "Consultants", href: "#" },
                { label: "Members", href: "#" },
              ],
            },
            {
              heading: "Our approach",
              items: [
                { label: "Our care model", href: "#" },
                { label: "mindcare culture", href: "#" },
              ],
            },
          ],
        },
        {
          sections: [
            {
              heading: "What we offer",
              items: [
                { label: "Full EAP replacement", href: "#" },
                { label: "Comprehensive mental health care", href: "#" },
                { label: "Meditation and mindfulness", href: "#" },
              ],
            },
            {
              heading: "Resources",
              items: [
                { label: "Customer stories", href: "#" },
                { label: "White papers and research", href: "#" },
                { label: "Events and webinars", href: "#" },
              ],
            },
          ],
        },
      ],
      promo: { title: "Request a demo", href: "/request-demo" },
    },
  },
  { label: "For Providers", href: "/providers" },
  { label: "Our Plans", href: "#" },
  { label: "Resources", href: "#" },
  { label: "About", href: "#" },
];

export const utilityNavLinks = [{ label: "Help", href: "#" }];
