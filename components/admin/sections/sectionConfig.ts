const iconOptions = [
  {
    value: "Zap",
    label: "Zap",
  },
  {
    value: "Settings",
    label: "Settings",
  },
  {
    value: "Grid3X3",
    label: "Grid 3x3",
  },
  {
    value: "Lightbulb",
    label: "Lightbulb",
  },
  {
    value: "Shield",
    label: "Shield",
  },
  {
    value: "Sparkles",
    label: "Sparkles",
  },
  {
    value: "Users",
    label: "Users",
  },
  {
    value: "Monitor",
    label: "Monitor",
  },
  {
    value: "Cpu",
    label: "CPU",
  },
  {
    value: "Globe",
    label: "Globe",
  },
  {
    value: "Building2",
    label: "Building",
  },
  {
    value: "Handshake",
    label: "Handshake",
  },
];

export const homeSectionConfig = {
  hero: {
    id: 157,
    title: "Hero Section",

    fields: [
      {
        name: "eyebrow",
        label: "Eyebrow",
        type: "text",
        acf: "hero_eyebrow",
      },
      {
        name: "title",
        label: "Title",
        type: "text",
        acf: "hero_title",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        acf: "hero_description",
      },

      {
        name: "primaryButton.text",
        label: "Primary Button Text",
        type: "text",
        acf: "primary_button_text",
      },
      {
        name: "primaryButton.url",
        label: "Primary Button Link",
        type: "link",
        acf: "primary_button_link",
      },

      {
        name: "secondaryButton.text",
        label: "Secondary Button Text",
        type: "text",
        acf: "secondary_button_text",
      },
      {
        name: "secondaryButton.url",
        label: "Secondary Button Link",
        type: "link",
        acf: "secondary_button_link",
      },

      {
        name: "stats.0.label",
        label: "Label 1",
        type: "text",
        acf: "label_1",
      },
      {
        name: "stats.0.number",
        label: "Stat 1",
        type: "text",
        acf: "stat_1",
      },

      {
        name: "stats.1.label",
        label: "Label 2",
        type: "text",
        acf: "label_2",
      },
      {
        name: "stats.1.number",
        label: "Stat 2",
        type: "text",
        acf: "stat_2",
      },

      {
        name: "stats.2.label",
        label: "Label 3",
        type: "text",
        acf: "label_3",
      },
      {
        name: "stats.2.number",
        label: "Stat 3",
        type: "text",
        acf: "stat_3",
      },
    ],
  },

  services: {
    id: 155,

    title: "Services Section",

    fields: [
      {
        name: "eyebrow",
        label: "Eyebrow",
        type: "text",
        acf: "services_eyebrow",
      },
      {
        name: "title",
        label: "Title",
        type: "text",
        acf: "services_title",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        acf: "services_description",
      },

      {
        name: "services.0.number",
        label: "Service 1 Number",
        type: "text",
        acf: "service_1_number",
      },
      {
        name: "services.0.icon",
        label: "Service 1 Icon",
        type: "select",
        acf: "service_1_icon",
        options: iconOptions,
      },
      {
        name: "services.0.title",
        label: "Service 1 Title",
        type: "text",
        acf: "service_1_title",
      },
      {
        name: "services.0.description",
        label: "Service 1 Description",
        type: "textarea",
        acf: "service_1_description",
      },

      {
        name: "services.1.number",
        label: "Service 2 Number",
        type: "text",
        acf: "service_2_number",
      },
      {
        name: "services.1.icon",
        label: "Service 2 Icon",
        type: "select",
        acf: "service_2_icon",
        options: iconOptions,
      },
      {
        name: "services.1.title",
        label: "Service 2 Title",
        type: "text",
        acf: "service_2_title",
      },
      {
        name: "services.1.description",
        label: "Service 2 Description",
        type: "textarea",
        acf: "service_2_description",
      },

      {
        name: "services.2.number",
        label: "Service 3 Number",
        type: "text",
        acf: "service_3_number",
      },
      {
        name: "services.2.icon",
        label: "Service 3 Icon",
        type: "select",
        acf: "service_3_icon",
        options: iconOptions,
      },
      {
        name: "services.2.title",
        label: "Service 3 Title",
        type: "text",
        acf: "service_3_title",
      },
      {
        name: "services.2.description",
        label: "Service 3 Description",
        type: "textarea",
        acf: "service_3_description",
      },

      {
        name: "services.3.number",
        label: "Service 4 Number",
        type: "text",
        acf: "service_4_number",
      },
      {
        name: "services.3.icon",
        label: "Service 4 Icon",
        type: "select",
        acf: "service_4_icon",
        options: iconOptions,
      },
      {
        name: "services.3.title",
        label: "Service 4 Title",
        type: "text",
        acf: "service_4_title",
      },
      {
        name: "services.3.description",
        label: "Service 4 Description",
        type: "textarea",
        acf: "service_4_description",
      },
    ],
  },

  productShowcase: {
    id: 202,

    title: "Product Showcase",

    fields: [
      {
        name: "eyebrow",
        label: "Eyebrow",
        type: "text",
        acf: "product_eyebrow",
      },
      {
        name: "title",
        label: "Title",
        type: "text",
        acf: "product_title",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        acf: "product_description",
      },
    ],
  },

  caseStudy: {
    id: 204,

    title: "Case Study",

    fields: [
      {
        name: "eyebrow",
        label: "Eyebrow",
        type: "text",
        acf: "casestudy_eyebrow",
      },
      {
        name: "title",
        label: "Title",
        type: "text",
        acf: "casestudy_title",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        acf: "casestudy_description",
      },
      {
        name: "buttonText",
        label: "Button",
        type: "text",
        acf: "casestudy_button",
      },
      {
        name: "buttonLink",
        label: "Button Link",
        type: "link",
        acf: "casestudy_link",
      },
      {
        name: "image",
        label: "Image",
        type: "image",
        acf: "casestudy_image",
      },
    ],
  },

  statSection: {
    id: 206,

    title: "Statistics",

    fields: [
      {
        name: "numbers.0",
        label: "Stat Number 1",
        type: "text",
        acf: "stat_number_1",
      },
      {
        name: "numbers.1",
        label: "Stat Number 2",
        type: "text",
        acf: "stat_number_2",
      },
      {
        name: "numbers.2",
        label: "Stat Number 3",
        type: "text",
        acf: "stat_number_3",
      },
      {
        name: "numbers.3",
        label: "Stat Number 4",
        type: "text",
        acf: "stat_number_4",
      },

      {
        name: "labels.0",
        label: "Label 1",
        type: "text",
        acf: "label_1",
      },
      {
        name: "labels.1",
        label: "Label 2",
        type: "text",
        acf: "label_2",
      },
      {
        name: "labels.2",
        label: "Label 3",
        type: "text",
        acf: "label_3",
      },
      {
        name: "labels.3",
        label: "Label 4",
        type: "text",
        acf: "label_4",
      },

      {
        name: "support",
        label: "Support",
        type: "text",
        acf: "stat_support",
      },
      {
        name: "brands",
        label: "Brand List",
        type: "brand-list",
        acf: "index_brand_list",
      },
    ],
  },

  news: {
    id: 208,

    title: "News Section",

    fields: [
      {
        name: "eyebrow",
        label: "Eyebrow",
        type: "text",
        acf: "news_eyebrow",
      },
      {
        name: "title",
        label: "Title",
        type: "text",
        acf: "news_title",
      },
    ],
  },

  cta: {
    id: 210,

    title: "CTA Section",

    fields: [
      {
        name: "title",
        label: "Title",
        type: "text",
        acf: "cta_title",
      },
      {
        name: "subtitle",
        label: "Subtitle",
        type: "textarea",
        acf: "cta_sub",
      },
      {
        name: "button.text",
        label: "Button Text",
        type: "text",
        acf: "cta_button_text",
      },
      {
        name: "button.url",
        label: "Button Link",
        type: "link",
        acf: "cta_button_link",
      },
    ],
  },
} as const;

export const aboutSectionConfig = {
  hero: {
    id: 254,

    title: "About Hero",

    fields: [
      {
        name: "eyebrow",
        label: "Eyebrow",
        type: "text",
        acf: "about_hero_eyebrow",
      },
      {
        name: "title",
        label: "Title",
        type: "text",
        acf: "about_hero_title",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        acf: "about_hero_description",
      },
      {
        name: "image",
        label: "Hero Image",
        type: "image",
        acf: "about_hero_image",
      },
      {
        name: "imageCaption",
        label: "Image Caption",
        type: "text",
        acf: "about_hero_image_caption",
      },
    ],
  },

  story: {
    id: 262,

    title: "About Story",

    fields: [
      {
        name: "title",
        label: "Section Title",
        type: "text",
        acf: "about_story_title",
      },
      {
        name: "paragraph1",
        label: "Paragraph 1",
        type: "textarea",
        acf: "about_story_paragraph_1",
      },
      {
        name: "paragraph2",
        label: "Paragraph 2",
        type: "textarea",
        acf: "about_story_paragraph_2",
      },
      {
        name: "paragraph3",
        label: "Paragraph 3",
        type: "textarea",
        acf: "about_story_paragraph_3",
      },
      {
        name: "visionBadge",
        label: "Vision Badge",
        type: "text",
        acf: "about_story_vision_title",
      },
      {
        name: "vision",
        label: "Vision",
        type: "textarea",
        acf: "about_story_vision",
      },
      {
        name: "missionBadge",
        label: "Mission Badge",
        type: "text",
        acf: "about_story_mission_title",
      },
      {
        name: "mission",
        label: "Mission",
        type: "textarea",
        acf: "about_story_mission",
      },
    ],
  },

  stats: {
    id: 260,

    title: "About Statistics",

    fields: [
      {
        name: "stats.0.number",
        label: "Stat Number 1",
        type: "text",
        acf: "about_stat_number_1",
      },
      {
        name: "stats.0.label",
        label: "Stat Label 1",
        type: "text",
        acf: "about_stat_label_1",
      },

      {
        name: "stats.1.number",
        label: "Stat Number 2",
        type: "text",
        acf: "about_stat_number_2",
      },
      {
        name: "stats.1.label",
        label: "Stat Label 2",
        type: "text",
        acf: "about_stat_label_2",
      },

      {
        name: "stats.2.number",
        label: "Stat Number 3",
        type: "text",
        acf: "about_stat_number_3",
      },
      {
        name: "stats.2.label",
        label: "Stat Label 3",
        type: "text",
        acf: "about_stat_label_3",
      },

      {
        name: "stats.3.number",
        label: "Stat Number 4",
        type: "text",
        acf: "about_stat_number_4",
      },
      {
        name: "stats.3.label",
        label: "Stat Label 4",
        type: "text",
        acf: "about_stat_label_4",
      },
    ],
  },

  values: {
    id: 264,

    title: "About Values",

    fields: [
      {
        name: "eyebrow",
        label: "Eyebrow",
        type: "text",
        acf: "about_values_eyebrow",
      },
      {
        name: "title",
        label: "Section Title",
        type: "text",
        acf: "about_values_title",
      },

      {
        name: "values.0.icon",
        label: "Value 1 Icon",
        type: "select",
        acf: "about_value_1_icon",
        options: iconOptions,
      },
      {
        name: "values.0.title",
        label: "Value 1 Title",
        type: "text",
        acf: "about_value_1_title",
      },
      {
        name: "values.0.description",
        label: "Value 1 Description",
        type: "textarea",
        acf: "about_value_1_description",
      },

      {
        name: "values.1.icon",
        label: "Value 2 Icon",
        type: "select",
        acf: "about_value_2_icon",
        options: iconOptions,
      },
      {
        name: "values.1.title",
        label: "Value 2 Title",
        type: "text",
        acf: "about_value_2_title",
      },
      {
        name: "values.1.description",
        label: "Value 2 Description",
        type: "textarea",
        acf: "about_value_2_description",
      },

      {
        name: "values.2.icon",
        label: "Value 3 Icon",
        type: "select",
        acf: "about_value_3_icon",
        options: iconOptions,
      },
      {
        name: "values.2.title",
        label: "Value 3 Title",
        type: "text",
        acf: "about_value_3_title",
      },
      {
        name: "values.2.description",
        label: "Value 3 Description",
        type: "textarea",
        acf: "about_value_3_description",
      },
    ],
  },

  journey: {
    id: 258,

    title: "About Journey",

    fields: [
      {
        name: "badge",
        label: "Badge",
        type: "text",
        acf: "about_journey_badge",
      },
      {
        name: "title",
        label: "Section Title",
        type: "text",
        acf: "about_journey_title",
      },

      {
        name: "milestones.0.year",
        label: "Year 1",
        type: "text",
        acf: "about_journey_year_1",
      },
      {
        name: "milestones.0.title",
        label: "Title 1",
        type: "text",
        acf: "about_journey_title_1",
      },
      {
        name: "milestones.0.description",
        label: "Description 1",
        type: "textarea",
        acf: "about_journey_desc_1",
      },

      {
        name: "milestones.1.year",
        label: "Year 2",
        type: "text",
        acf: "about_journey_year_2",
      },
      {
        name: "milestones.1.title",
        label: "Title 2",
        type: "text",
        acf: "about_journey_title_2",
      },
      {
        name: "milestones.1.description",
        label: "Description 2",
        type: "textarea",
        acf: "about_journey_desc_2",
      },

      {
        name: "milestones.2.year",
        label: "Year 3",
        type: "text",
        acf: "about_journey_year_3",
      },
      {
        name: "milestones.2.title",
        label: "Title 3",
        type: "text",
        acf: "about_journey_title_3",
      },
      {
        name: "milestones.2.description",
        label: "Description 3",
        type: "textarea",
        acf: "about_journey_desc_3",
      },

      {
        name: "milestones.3.year",
        label: "Year 4",
        type: "text",
        acf: "about_journey_year_4",
      },
      {
        name: "milestones.3.title",
        label: "Title 4",
        type: "text",
        acf: "about_journey_title_4",
      },
      {
        name: "milestones.3.description",
        label: "Description 4",
        type: "textarea",
        acf: "about_journey_desc_4",
      },
    ],
  },

  cta: {
    id: 256,

    title: "About CTA",

    fields: [
      {
        name: "title",
        label: "Title",
        type: "text",
        acf: "about_cta_title",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        acf: "about_cta_description",
      },
      {
        name: "button.text",
        label: "Button Text",
        type: "text",
        acf: "about_cta_button_text",
      },
      {
        name: "button.url",
        label: "Button Link",
        type: "link",
        acf: "about_cta_button_link",
      },
    ],
  },
} as const;
