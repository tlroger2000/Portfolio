// -----------------------------------------------------------------------------
// i18n — traduccions de tota la web (Català / Castellà / Anglès).
// Els textos traduïbles viuen aquí; les dades estructurals (slugs, imatges,
// galeries) segueixen a lib/content.ts.
// -----------------------------------------------------------------------------

export type Lang = "ca" | "es" | "en";

export const LANGS: { code: Lang; label: string; name: string }[] = [
  { code: "ca", label: "CA", name: "Català" },
  { code: "es", label: "ES", name: "Castellano" },
  { code: "en", label: "EN", name: "English" },
];

export interface HeroSectionT {
  title: string;
  line1: string;
  line2: string;
}

export interface DisciplineT {
  label: string;
  tagline: string;
  kicker: string;
  overview: string;
  conclusion: string;
}

export interface Dict {
  nav: { work: string; contact: string };
  menu: { home: string; contact: string };
  hero: { role: string; tagline: string; sections: HeroSectionT[] };
  disciplines: { heading: string; sub: string };
  skills: { kicker: string; heading: string; sub: string; hint: string };
  gallery: { heading: string; sub: string };
  work: { backToAll: string; scrollToExpand: string };
  footer: { headingHome: string; headingWork: string; rights: string };
  slides: string[][];
  disciplineById: Record<string, DisciplineT>;
}

export const translations: Record<Lang, Dict> = {
  ca: {
    nav: { work: "Treball", contact: "Contacte" },
    menu: { home: "Inici", contact: "Contacte" },
    hero: {
      role: "Creador visual multidisciplinari",
      tagline: "Vídeo · Foto · Disseny gràfic · Web · 3D",
      sections: [
        { title: "", line1: "", line2: "" }, // index 0 = nom (constant, gestionat a la pàgina)
        { title: "OFICI", line1: "Cada projecte, una mirada pròpia,", line2: "del concepte a l'última capa" },
        { title: "VISIÓ", line1: "Entre el pensament i la creació,", line2: "donem forma a les teves idees" },
      ],
    },
    disciplines: {
      heading: "Disciplines",
      sub: "Cinc maneres de donar forma a una idea. Tria una disciplina per veure els projectes.",
    },
    skills: {
      kicker: "Software",
      heading: "Eines i programari",
      sub: "El programari amb què treballo cada dia.",
      hint: "Passa el cursor per explorar",
    },
    gallery: {
      heading: "Selecció visual",
      sub: "Un recorregut per algunes imatges. Fes servir les fletxes per navegar.",
    },
    work: { backToAll: "Totes les disciplines", scrollToExpand: "Desplaça per ampliar" },
    footer: {
      headingHome: "Treballem junts?",
      headingWork: "T'agrada el que veus?",
      rights: "Tots els drets reservats.",
    },
    slides: [
      ["ENTRE L'OMBRA", "I LA LLUM"],
      ["EL SILENCI", "PARLA EN FORMA"],
      ["ESSÈNCIA MÉS ENLLÀ", "DE LA PERCEPCIÓ"],
      ["VERITAT EN", "EL BUIT"],
      ["RENDIR-SE A", "L'INFINIT"],
    ],
    disciplineById: {
      video: {
        label: "Vídeo",
        tagline: "Narrativa en moviment",
        kicker: "Producció audiovisual",
        overview:
          "Producció i postproducció de vídeo: peces de marca, videoclips, documentals i contingut per a xarxes. Cada projecte busca un to visual propi, des del concepte fins al color grading final.",
        conclusion:
          "Del guió a l'entrega: rodatge, muntatge, motion graphics i so. Explica'm la teva idea i la convertim en imatge en moviment.",
      },
      foto: {
        label: "Fotografia",
        tagline: "Capturar l'instant",
        kicker: "Fotografia",
        overview:
          "Fotografia de producte, retrat, esdeveniment i paisatge. Una mirada que treballa la llum, la composició i el moment per crear imatges amb intenció.",
        conclusion:
          "Sessions a mida, retoc i direcció d'art. Imatges pensades per a la teva marca, projecte o història personal.",
      },
      disseny: {
        label: "Disseny gràfic",
        tagline: "Identitat i forma",
        kicker: "Disseny gràfic",
        overview:
          "Identitats visuals, branding, editorial i disseny per a impressió i digital. Sistemes coherents que comuniquen amb claredat i personalitat.",
        conclusion:
          "Logotips, guies d'estil, packaging i peces gràfiques. Construïm una marca que es reconegui a primer cop d'ull.",
      },
      web: {
        label: "Web",
        tagline: "Experiències digitals",
        kicker: "Desenvolupament web",
        overview:
          "Disseny i desenvolupament de webs i aplicacions modernes amb React, Next.js i animacions interactives. Rendiment, accessibilitat i una estètica acurada.",
        conclusion:
          "Des de la landing fins a la plataforma completa: codi net, responsive i pensat per convertir. Donem vida a la teva presència digital.",
      },
      "3d": {
        label: "3D",
        tagline: "Volum i textura",
        kicker: "Disseny 3D",
        overview:
          "Modelatge, render i animació 3D per a producte, art conceptual i experiències immersives. Materials, il·luminació i composició cuidats al detall.",
        conclusion:
          "Visualitzacions realistes o abstractes, llestes per a web, vídeo o impressió. Donem profunditat i textura a les teves idees.",
      },
    },
  },

  es: {
    nav: { work: "Trabajo", contact: "Contacto" },
    menu: { home: "Inicio", contact: "Contacto" },
    hero: {
      role: "Creador visual multidisciplinar",
      tagline: "Vídeo · Foto · Diseño gráfico · Web · 3D",
      sections: [
        { title: "", line1: "", line2: "" },
        { title: "OFICIO", line1: "Cada proyecto, una mirada propia,", line2: "del concepto a la última capa" },
        { title: "VISIÓN", line1: "Entre el pensamiento y la creación,", line2: "damos forma a tus ideas" },
      ],
    },
    disciplines: {
      heading: "Disciplinas",
      sub: "Cinco maneras de dar forma a una idea. Elige una disciplina para ver los proyectos.",
    },
    skills: {
      kicker: "Software",
      heading: "Herramientas y software",
      sub: "El software con el que trabajo cada día.",
      hint: "Pasa el cursor para explorar",
    },
    gallery: {
      heading: "Selección visual",
      sub: "Un recorrido por algunas imágenes. Usa las flechas para navegar.",
    },
    work: { backToAll: "Todas las disciplinas", scrollToExpand: "Desplázate para ampliar" },
    footer: {
      headingHome: "¿Trabajamos juntos?",
      headingWork: "¿Te gusta lo que ves?",
      rights: "Todos los derechos reservados.",
    },
    slides: [
      ["ENTRE LA SOMBRA", "Y LA LUZ"],
      ["EL SILENCIO", "HABLA EN FORMA"],
      ["ESENCIA MÁS ALLÁ", "DE LA PERCEPCIÓN"],
      ["VERDAD EN", "EL VACÍO"],
      ["RENDIRSE AL", "INFINITO"],
    ],
    disciplineById: {
      video: {
        label: "Vídeo",
        tagline: "Narrativa en movimiento",
        kicker: "Producción audiovisual",
        overview:
          "Producción y postproducción de vídeo: piezas de marca, videoclips, documentales y contenido para redes. Cada proyecto busca un tono visual propio, desde el concepto hasta el color grading final.",
        conclusion:
          "Del guion a la entrega: rodaje, montaje, motion graphics y sonido. Cuéntame tu idea y la convertimos en imagen en movimiento.",
      },
      foto: {
        label: "Fotografía",
        tagline: "Capturar el instante",
        kicker: "Fotografía",
        overview:
          "Fotografía de producto, retrato, evento y paisaje. Una mirada que trabaja la luz, la composición y el momento para crear imágenes con intención.",
        conclusion:
          "Sesiones a medida, retoque y dirección de arte. Imágenes pensadas para tu marca, proyecto o historia personal.",
      },
      disseny: {
        label: "Diseño gráfico",
        tagline: "Identidad y forma",
        kicker: "Diseño gráfico",
        overview:
          "Identidades visuales, branding, editorial y diseño para impresión y digital. Sistemas coherentes que comunican con claridad y personalidad.",
        conclusion:
          "Logotipos, guías de estilo, packaging y piezas gráficas. Construimos una marca que se reconozca a primera vista.",
      },
      web: {
        label: "Web",
        tagline: "Experiencias digitales",
        kicker: "Desarrollo web",
        overview:
          "Diseño y desarrollo de webs y aplicaciones modernas con React, Next.js y animaciones interactivas. Rendimiento, accesibilidad y una estética cuidada.",
        conclusion:
          "Desde la landing hasta la plataforma completa: código limpio, responsive y pensado para convertir. Damos vida a tu presencia digital.",
      },
      "3d": {
        label: "3D",
        tagline: "Volumen y textura",
        kicker: "Diseño 3D",
        overview:
          "Modelado, render y animación 3D para producto, arte conceptual y experiencias inmersivas. Materiales, iluminación y composición cuidados al detalle.",
        conclusion:
          "Visualizaciones realistas o abstractas, listas para web, vídeo o impresión. Damos profundidad y textura a tus ideas.",
      },
    },
  },

  en: {
    nav: { work: "Work", contact: "Contact" },
    menu: { home: "Home", contact: "Contact" },
    hero: {
      role: "Multidisciplinary visual creator",
      tagline: "Video · Photo · Graphic design · Web · 3D",
      sections: [
        { title: "", line1: "", line2: "" },
        { title: "CRAFT", line1: "Every project, its own vision,", line2: "from concept to the final layer" },
        { title: "VISION", line1: "Between thought and creation,", line2: "we shape your ideas" },
      ],
    },
    disciplines: {
      heading: "Disciplines",
      sub: "Five ways to shape an idea. Pick a discipline to see the projects.",
    },
    skills: {
      kicker: "Software",
      heading: "Tools & software",
      sub: "The software I work with every day.",
      hint: "Hover to explore",
    },
    gallery: {
      heading: "Visual selection",
      sub: "A walk through a few images. Use the arrows to navigate.",
    },
    work: { backToAll: "All disciplines", scrollToExpand: "Scroll to expand" },
    footer: {
      headingHome: "Let's work together?",
      headingWork: "Like what you see?",
      rights: "All rights reserved.",
    },
    slides: [
      ["BETWEEN SHADOW", "AND LIGHT"],
      ["SILENCE SPEAKS", "THROUGH FORM"],
      ["ESSENCE BEYOND", "PERCEPTION"],
      ["TRUTH IN", "EMPTINESS"],
      ["SURRENDER TO", "THE VOID"],
    ],
    disciplineById: {
      video: {
        label: "Video",
        tagline: "Storytelling in motion",
        kicker: "Audiovisual production",
        overview:
          "Video production and post-production: brand pieces, music videos, documentaries and social content. Each project chases its own visual tone, from concept to the final color grade.",
        conclusion:
          "From script to delivery: shooting, editing, motion graphics and sound. Tell me your idea and we'll turn it into moving image.",
      },
      foto: {
        label: "Photography",
        tagline: "Capturing the moment",
        kicker: "Photography",
        overview:
          "Product, portrait, event and landscape photography. An eye that works light, composition and timing to create images with intent.",
        conclusion:
          "Tailored sessions, retouching and art direction. Images crafted for your brand, project or personal story.",
      },
      disseny: {
        label: "Graphic design",
        tagline: "Identity and form",
        kicker: "Graphic design",
        overview:
          "Visual identities, branding, editorial and design for print and digital. Coherent systems that communicate with clarity and personality.",
        conclusion:
          "Logos, style guides, packaging and graphic pieces. We build a brand that's recognised at a glance.",
      },
      web: {
        label: "Web",
        tagline: "Digital experiences",
        kicker: "Web development",
        overview:
          "Design and development of modern websites and apps with React, Next.js and interactive animation. Performance, accessibility and a polished aesthetic.",
        conclusion:
          "From landing page to full platform: clean, responsive code built to convert. We bring your digital presence to life.",
      },
      "3d": {
        label: "3D",
        tagline: "Volume and texture",
        kicker: "3D design",
        overview:
          "3D modelling, rendering and animation for product, concept art and immersive experiences. Materials, lighting and composition cared for in detail.",
        conclusion:
          "Realistic or abstract visuals, ready for web, video or print. We give your ideas depth and texture.",
      },
    },
  },
};
