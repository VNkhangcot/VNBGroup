export type Language = 'vi' | 'en' | 'zh';

export interface TranslationSchema {
  nav: {
    brandSub: string;
    ecosystem: string;
    techMatrix: string;
    stats: string;
    about: string;
    consultBtn: string;
  };
  hud: {
    hero: string;
    services: string;
    techMatrix: string;
    about: string;
    contact: string;
  };
  hero: {
    badge: string;
    title1: string;
    titleHighlight: string;
    title2: string;
    descPart1: string;
    highlightSoftware: string;
    highlightAI: string;
    highlightCloud: string;
    highlightSecurity: string;
    descPart2: string;
    exploreBtn: string;
    consultBtn: string;
    telemetry: {
      slaLabel: string;
      slaValue: string;
      slaDesc: string;
      isoLabel: string;
      isoValue: string;
      isoDesc: string;
      aiLabel: string;
      aiValue: string;
      aiDesc: string;
      projectLabel: string;
      projectValue: string;
      projectDesc: string;
    };
  };
  services: {
    tag: string;
    title: string;
    titleHighlight: string;
    desc: string;
    businessImpact: string;
    items: {
      id: string;
      tag: string;
      title: string;
      desc: string;
      features: string[];
      stats: string;
    }[];
  };
  techMatrix: {
    tag: string;
    title: string;
    titleHighlight: string;
    desc: string;
    tabs: {
      backend: string;
      aiData: string;
      cloudSre: string;
      frontend: string;
    };
    categories: {
      id: string;
      name: string;
      description: string;
      skills: { name: string; tag: string; level: string }[];
    }[];
  };
  stats: {
    tag: string;
    title: string;
    titleHighlight: string;
    p1: string;
    p2: string;
    quoteTag: string;
    quote: string;
    boardTitle: string;
    boardDesc: string;
    metrics: {
      value: string;
      label: string;
      sublabel: string;
    }[];
  };
  contact: {
    tag: string;
    title: string;
    titleHighlight: string;
    desc: string;
    emailLabel: string;
    hotlineLabel: string;
    hqLabel: string;
    hqValue: string;
    slaTitle: string;
    slaDesc: string;
    formTitle: string;
    formDesc: string;
    serviceLabel: string;
    serviceOptions: string[];
    nameLabel: string;
    namePlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    emailLabelInput: string;
    emailPlaceholder: string;
    phoneLabelInput: string;
    phonePlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitBtn: string;
    submittingBtn: string;
    successTitle: string;
    successDesc: string;
  };
  footer: {
    desc: string;
    isoBadge: string;
    socBadge: string;
    colEcosystemTitle: string;
    colCoreTechTitle: string;
    colCorporateTitle: string;
    links: {
      enterpriseSoftware: string;
      aiLlm: string;
      cloudSre: string;
      cybersecurity: string;
      fintech: string;
      bigData: string;
      microservices: string;
      ragAgentic: string;
      k8s: string;
      zeroTrust: string;
      tddCleanCode: string;
      aboutUs: string;
      milestones: string;
      contactSchedule: string;
      privacyPolicy: string;
      termsOfService: string;
    };
    rights: string;
    operational: string;
    locations: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  vi: {
    nav: {
      brandSub: 'Enterprise IT Architecture',
      ecosystem: 'Hệ Sinh Thái',
      techMatrix: 'Công Nghệ',
      stats: 'Chỉ Số',
      about: 'Về VNBGroup',
      consultBtn: 'Tư Vấn Ngay',
    },
    hud: {
      hero: 'Khởi Đầu',
      services: 'Hệ Sinh Thái 3D',
      techMatrix: 'Năng Lực Kỹ Thuật',
      about: 'Về VNBGroup',
      contact: 'Tư Vấn',
    },
    hero: {
      badge: 'VNBGroup // KIẾN TRÚC SỐ DOANH NGHIỆP TOÀN DIỆN',
      title1: 'Kiến Tạo Tương Lai Số',
      titleHighlight: 'Đột Phá',
      title2: '& Bền Vững',
      descPart1: 'Tập đoàn công nghệ thông tin toàn diện. Chúng tôi định hình chuẩn mực mới với',
      highlightSoftware: 'Phần Mềm Doanh Nghiệp',
      highlightAI: 'Trí Tuệ Nhân Tạo (AI)',
      highlightCloud: 'Hạ Tầng Đám Mây SRE',
      highlightSecurity: 'An Ninh Mạng Đa Tầng',
      descPart2: 'cho các tập đoàn quy mô triệu người dùng.',
      exploreBtn: 'Khám Phá Hệ Sinh Thái 3D',
      consultBtn: 'Tư Vấn Kiến Trúc Hệ Thống',
      telemetry: {
        slaLabel: 'SLA CAM KẾT',
        slaValue: '99.99%',
        slaDesc: 'Uptime chuẩn Enterprise',
        isoLabel: 'TIÊU CHUẨN',
        isoValue: 'ISO 27001',
        isoDesc: 'Bảo mật đa tầng Zero-Trust',
        aiLabel: 'AI ACCELERATION',
        aiValue: '10x Speed',
        aiDesc: 'Tối ưu hiệu năng vận hành',
        projectLabel: 'DỰ ÁN TRIỂN KHAI',
        projectValue: '250+ Khách hàng',
        projectDesc: 'Tập đoàn & Fintech đa quốc gia',
      },
    },
    services: {
      tag: '// HỆ SINH THÁI DỊCH VỤ TOÀN DIỆN',
      title: 'Giải Pháp IT Trọng Yếu',
      titleHighlight: 'cho Kỷ Nguyên Mới',
      desc: 'Từ hạ tầng lõi đến trải nghiệm người dùng, VNBGroup đồng hành cùng doanh nghiệp số hóa toàn diện với tiêu chuẩn kỹ thuật quốc tế vững chắc.',
      businessImpact: 'Hiệu Quả Doanh Nghiệp',
      items: [
        {
          id: 'software',
          tag: 'ENTERPRISE ARCHITECTURE',
          title: 'Phần Mềm Doanh Nghiệp Lõi',
          desc: 'Xây dựng các giải pháp phần mềm lõi quy mô lớn (ERP, CRM, Core Banking, Logistics) với kiến trúc Microservices và Event-Driven chịu tải cao.',
          features: ['Microservices & Event-Driven', 'Tải cao hàng triệu CCU', 'Clean Code & TDD 80%+'],
          stats: '99.99% SLA Performance',
        },
        {
          id: 'ai',
          tag: 'INTELLIGENT AUTOMATION',
          title: 'Giải Pháp AI & Agentic Tự Động Hóa',
          desc: 'Tích hợp mô hình ngôn ngữ lớn (Private LLM Fine-tuning), hệ thống Agentic AI tự hành, thị giác máy tính và phân tích dữ liệu dự đoán chuyên sâu.',
          features: ['Private LLM & RAG Systems', 'Agentic Workflow Automation', 'Predictive Big Data'],
          stats: 'Tiết kiệm 70% chi phí vận hành',
        },
        {
          id: 'cloud',
          tag: 'CLOUD & SRE OPERATIONS',
          title: 'Hạ Tầng Đám Mây & Kubernetes HA',
          desc: 'Thiết kế hạ tầng Multi-Cloud (AWS, Azure, GCP) tự động co giãn, tối ưu chi phí hạ tầng và thiết lập quy trình CI/CD chuẩn quốc tế.',
          features: ['Infrastructure as Code (Terraform)', 'Kubernetes Cluster HA', 'Zero-Downtime Migration'],
          stats: 'Tối ưu 40% chi phí Cloud',
        },
        {
          id: 'security',
          tag: 'CYBERSECURITY & ZERO-TRUST',
          title: 'Bảo Mật & An Ninh Mạng Đa Tầng',
          desc: 'Bảo vệ toàn diện hệ thống với trung tâm SOC 24/7, kiểm thử thâm nhập (Pen-test), mã hóa dữ liệu đầu cuối và tuân thủ các chuẩn quốc tế ISO 27001.',
          features: ['24/7 Threat Hunting & SOC', 'Penetration Testing Red-Team', 'ISO 27001 & SOC 2 Compliance'],
          stats: 'Tuyệt đối an toàn dữ liệu',
        },
        {
          id: 'fintech',
          tag: 'FINTECH & DIGITAL ASSETS',
          title: 'Chuyển Đổi Số FinTech & Blockchain',
          desc: 'Nền tảng thanh toán điện tử tốc độ cao, giải pháp Smart Contracts, định danh số eKYC và số hóa tài sản cho các tổ chức tài chính hàng đầu.',
          features: ['Smart Contracts Audit', 'High-throughput Payment Gateway', 'Decentralized Architecture'],
          stats: 'Xử lý triệu transaction/ngày',
        },
        {
          id: 'data',
          tag: 'BIG DATA & REAL-TIME ANALYTICS',
          title: 'Kỹ Thuật Dữ Liệu & Nền Tảng Big Data',
          desc: 'Xây dựng Data Warehouse, Data Lakehouse và đường ống streaming dữ liệu quy mô lớn phục vụ phân tích dự báo và ra quyết định kinh doanh thời gian thực.',
          features: ['Data Lakehouse Architecture', 'Real-Time Streaming (Kafka/Flink)', 'BI & Predictive Analytics'],
          stats: 'Xử lý 10TB+ dữ liệu/ngày',
        },
      ],
    },
    techMatrix: {
      tag: '// NĂNG LỰC KỸ THUẬT CỐT LÕI',
      title: 'Ma Trận Công Nghệ Tiên Phong',
      titleHighlight: 'Chuẩn Toàn Cầu',
      desc: 'Chúng tôi chỉ làm chủ những công nghệ hiện đại, ổn định và có khả năng mở rộng quy mô lớn nhất trong ngành công nghệ thông tin toàn cầu.',
      tabs: {
        backend: 'Backend & High-Load Architecture',
        aiData: 'AI, LLM & Data Engineering',
        cloudSre: 'Cloud Native & DevSecOps',
        frontend: 'Modern Web & Cross-Platform Mobile',
      },
      categories: [
        {
          id: 'backend',
          name: 'Backend & High-Load Architecture',
          description: 'Xử lý hàng triệu yêu cầu đồng thời với độ trễ tối thiểu (sub-millisecond latency).',
          skills: [
            { name: 'Golang', tag: 'Concurrency & Microservices', level: 'Core' },
            { name: 'Rust', tag: 'Memory-Safe High-Performance', level: 'Speed' },
            { name: 'Java / Spring Boot', tag: 'Enterprise Banking Core', level: 'Enterprise' },
            { name: 'Node.js / TypeScript', tag: 'Realtime & API Gateways', level: 'Core' },
            { name: 'Apache Kafka', tag: 'Event-Streaming Pipeline', level: 'Scalable' },
            { name: 'gRPC & Protobuf', tag: 'Inter-service High-Throughput RPC', level: 'Ultra-fast' },
          ],
        },
        {
          id: 'ai-data',
          name: 'AI, LLM & Data Engineering',
          description: 'Ứng dụng các thuật toán Deep Learning và kiến trúc RAG chuyên biệt cho dữ liệu doanh nghiệp.',
          skills: [
            { name: 'PyTorch & TensorFlow', tag: 'Deep Learning Models', level: 'AI Core' },
            { name: 'LangChain & LangGraph', tag: 'Multi-Agent Automation', level: 'Advanced' },
            { name: 'Vector DBs (Qdrant/Milvus)', tag: 'Embedding & Semantic Search', level: 'Vector' },
            { name: 'Apache Spark', tag: 'Distributed Big Data Processing', level: 'ETL' },
            { name: 'PostgreSQL & pgvector', tag: 'ACID & High-Performance Storage', level: 'Robust' },
            { name: 'MLOps Pipeline', tag: 'CI/CD Model Deployment & Monitor', level: 'Production' },
          ],
        },
        {
          id: 'cloud-sre',
          name: 'Cloud Native & DevSecOps',
          description: 'Chuẩn hóa quy trình vận hành hạ tầng tự động, an toàn và sẵn sàng phục hồi thảm họa.',
          skills: [
            { name: 'Kubernetes (K8s)', tag: 'Container Orchestration & Mesh', level: 'Native' },
            { name: 'Terraform IaC', tag: 'Automated Multi-Cloud Provisioning', level: 'Infra' },
            { name: 'AWS & Azure & GCP', tag: 'Hybrid Multi-Cloud Architecture', level: 'Certified' },
            { name: 'GitOps (ArgoCD)', tag: 'Automated Continuous Delivery', level: 'GitOps' },
            { name: 'Istio Service Mesh', tag: 'mTLS & Traffic Management', level: 'Mesh' },
            { name: 'Prometheus & Grafana', tag: 'Full-Stack Observability & SRE', level: 'Monitoring' },
          ],
        },
        {
          id: 'frontend',
          name: 'Modern Web & Cross-Platform Mobile',
          description: 'Trải nghiệm giao diện chuẩn 60fps mượt mà, tối ưu SEO và thời gian phản hồi tương tác.',
          skills: [
            { name: 'React 19 & Next.js 15', tag: 'Server Components & Edge SSR', level: 'Modern' },
            { name: 'TypeScript Strict', tag: 'Complete Type-Safety Architecture', level: 'Standard' },
            { name: 'Flutter & React Native', tag: 'Cross-Platform Mobile Ecosystem', level: 'Native-feel' },
            { name: 'Three.js & WebGL', tag: '3D Interactive Experience', level: 'Visuals' },
            { name: 'Tailwind CSS', tag: 'Enterprise Design Systems', level: 'Fast' },
            { name: 'PWA & Micro-Frontends', tag: 'Decoupled Scalable Frontends', level: 'Scale' },
          ],
        },
      ],
    },
    stats: {
      tag: '// VỀ TẬP ĐOÀN VNBGROUP',
      title: 'Định Hình Chuẩn Mực',
      titleHighlight: 'Công Nghệ Số',
      p1: 'VNBGroup được thành lập với tầm nhìn trở thành đối tác công nghệ chiến lược toàn cầu. Chúng tôi không chỉ viết phần mềm, chúng tôi giải quyết các bài toán hóc búa nhất về vận hành, bảo mật và mở rộng quy mô kinh doanh cho doanh nghiệp.',
      p2: 'Từ nghiên cứu chuyên sâu AI đến triển khai hạ tầng đám mây siêu phân tán, mọi giải pháp của VNBGroup đều tuân thủ các nguyên tắc kỹ thuật nghiêm ngặt nhất: độ sẵn sàng cao, mã hóa tối mật và khả năng mở rộng không giới hạn.',
      quoteTag: '// TRIẾT LÝ VẬN HÀNH VNBGROUP',
      quote: '“Công nghệ mạnh nhất là công nghệ phục vụ con người một cách thầm lặng nhưng tạo ra sức bật tăng trưởng phi thường.”',
      boardTitle: 'Hội Đồng Quản Trị VNBGroup',
      boardDesc: 'Ban Lãnh Đạo & Cố Vấn Kỹ Thuật',
      metrics: [
        {
          value: '250+',
          label: 'Khách Hàng Doanh Nghiệp',
          sublabel: 'Bao gồm các ngân hàng, tập đoàn viễn thông và chuỗi bán lẻ hàng đầu',
        },
        {
          value: '99.99%',
          label: 'SLA Uptime Hệ Thống',
          sublabel: 'Kiến trúc Multi-Region Active-Active phục hồi thảm họa tức thì',
        },
        {
          value: '50M+',
          label: 'Giao Dịch Mỗi Ngày',
          sublabel: 'Hệ thống chịu tải cao với thông lượng siêu lớn không độ trễ',
        },
        {
          value: '15+',
          label: 'Năm Kinh Nghiệm',
          sublabel: 'Đội ngũ chuyên gia kiến trúc sư giải pháp đạt chuẩn quốc tế',
        },
      ],
    },
    contact: {
      tag: '// KHỞI ĐỘNG DỰ ÁN',
      title: 'Sẵn Sàng Kiến Tạo',
      titleHighlight: 'Đột Phá Số?',
      desc: 'Hãy kết nối với các kiến trúc sư trưởng của VNBGroup. Chúng tôi sẽ phân tích bài toán thực tế của doanh nghiệp và đề xuất lộ trình công nghệ tối ưu trong vòng 24 giờ.',
      emailLabel: 'Email Khách Hàng',
      hotlineLabel: 'Hotline Doanh Nghiệp 24/7',
      hqLabel: 'Trụ Sở Chính',
      hqValue: 'Hà Nội • TP. Hồ Chí Minh • Singapore',
      slaTitle: 'Phản hồi thần tốc:',
      slaDesc: 'Đội ngũ kỹ thuật cam kết tư vấn kiến trúc giải pháp sơ bộ trong 24 giờ làm việc.',
      formTitle: 'Đăng Ký Tư Vấn Doanh Nghiệp',
      formDesc: 'Điền thông tin dự án để nhận tài liệu phân tích kỹ thuật và demo giải pháp từ VNBGroup.',
      serviceLabel: 'Lĩnh vực doanh nghiệp quan tâm',
      serviceOptions: [
        'Phần Mềm Doanh Nghiệp (ERP/CRM/Core)',
        'Trí Tuệ Nhân Tạo & Agentic AI',
        'Hạ Tầng Cloud & DevOps SRE',
        'Bảo Mật & An Ninh Mạng SOC',
        'Chuyển Đổi Số FinTech & Blockchain',
        'Tư Vấn Kiến Trúc Tổng Thể',
      ],
      nameLabel: 'Họ và tên *',
      namePlaceholder: 'Nguyễn Văn A',
      companyLabel: 'Tên Doanh Nghiệp / Tập Đoàn *',
      companyPlaceholder: 'Công ty Cổ phần ABC',
      emailLabelInput: 'Email công việc *',
      emailPlaceholder: 'name@company.com',
      phoneLabelInput: 'Số điện thoại liên hệ *',
      phonePlaceholder: '0912 345 678',
      messageLabel: 'Mô tả mục tiêu hoặc bài toán hệ thống',
      messagePlaceholder: 'Mô tả sơ lược quy mô người dùng, hạ tầng hiện tại hoặc bài toán mong muốn giải quyết...',
      submitBtn: 'Gửi Yêu Cầu Tư Vấn Ngay',
      submittingBtn: 'Đang gửi yêu cầu...',
      successTitle: 'Gửi Yêu Cầu Thành Công!',
      successDesc: 'Cảm ơn quý đối tác. Trưởng bộ phận kỹ thuật VNBGroup sẽ liên hệ trực tiếp qua email và điện thoại trong vòng 24h.',
    },
    footer: {
      desc: 'Tập đoàn Công nghệ Thông tin Toàn diện. Tiên phong cung cấp giải pháp Phần Mềm Doanh Nghiệp, Trí Tuệ Nhân Tạo (AI), Hạ Tầng Cloud và An Ninh Mạng thế hệ mới.',
      isoBadge: 'ISO 27001 Certified',
      socBadge: 'SOC 2 Type II',
      colEcosystemTitle: 'Hệ Sinh Thái',
      colCoreTechTitle: 'Công Nghệ Lõi',
      colCorporateTitle: 'Tập Đoàn',
      links: {
        enterpriseSoftware: 'Phần Mềm Doanh Nghiệp',
        aiLlm: 'Trí Tuệ Nhân Tạo & LLM',
        cloudSre: 'Cloud Infrastructure & SRE',
        cybersecurity: 'Bảo Mật An Ninh Mạng SOC',
        fintech: 'FinTech & Smart Contracts',
        bigData: 'Nền Tảng Dữ Liệu & Big Data',
        microservices: 'Microservices Architecture',
        ragAgentic: 'Private RAG & Agentic AI',
        k8s: 'Kubernetes Multi-Cluster',
        zeroTrust: 'Zero-Trust Network Access',
        tddCleanCode: 'Tiêu Chuẩn TDD & Clean Code',
        aboutUs: 'Về VNBGroup',
        milestones: 'Năng Lực & Thành Tựu',
        contactSchedule: 'Liên Hệ & Đặt Lịch',
        privacyPolicy: 'Chính Sách Bảo Mật',
        termsOfService: 'Điều Khoản Dịch Vụ',
      },
      rights: 'Tất cả các quyền được bảo lưu.',
      operational: 'Hệ Thống Đang Vận Hành 100%',
      locations: 'Hà Nội • TP. HCM • Singapore',
    },
  },

  en: {
    nav: {
      brandSub: 'Enterprise IT Architecture',
      ecosystem: 'Ecosystem',
      techMatrix: 'Technology',
      stats: 'Metrics',
      about: 'About VNBGroup',
      consultBtn: 'Consult Now',
    },
    hud: {
      hero: 'Start',
      services: '3D Ecosystem',
      techMatrix: 'Tech Matrix',
      about: 'About VNBGroup',
      contact: 'Consultation',
    },
    hero: {
      badge: 'VNBGroup // COMPREHENSIVE ENTERPRISE DIGITAL ARCHITECTURE',
      title1: 'Architecting Next-Gen',
      titleHighlight: 'Breakthrough',
      title2: '& Sustainable Systems',
      descPart1: 'Comprehensive enterprise IT corporation. We redefine industry benchmarks with mission-critical',
      highlightSoftware: 'Enterprise Software',
      highlightAI: 'Artificial Intelligence (AI)',
      highlightCloud: 'Cloud Infrastructure & SRE',
      highlightSecurity: 'Multi-Layer Cybersecurity',
      descPart2: 'engineered for millions of concurrent users.',
      exploreBtn: 'Explore 3D Ecosystem',
      consultBtn: 'Architecture Advisory',
      telemetry: {
        slaLabel: 'ENTERPRISE SLA',
        slaValue: '99.99%',
        slaDesc: 'High-availability uptime guarantee',
        isoLabel: 'COMPLIANCE',
        isoValue: 'ISO 27001',
        isoDesc: 'Zero-Trust multi-layered security',
        aiLabel: 'AI ACCELERATION',
        aiValue: '10x Speed',
        aiDesc: 'Operational velocity multiplied',
        projectLabel: 'GLOBAL DEPLOYMENTS',
        projectValue: '250+ Clients',
        projectDesc: 'Multinational corporations & FinTech',
      },
    },
    services: {
      tag: '// COMPREHENSIVE SERVICE ECOSYSTEM',
      title: 'Mission-Critical IT Solutions',
      titleHighlight: 'for the New Era',
      desc: 'From core backbone infrastructure to seamless digital customer experiences, VNBGroup empowers enterprises with resilient global engineering standards.',
      businessImpact: 'Enterprise Impact',
      items: [
        {
          id: 'software',
          tag: 'ENTERPRISE ARCHITECTURE',
          title: 'Core Enterprise Software',
          desc: 'Engineering large-scale core business platforms (ERP, CRM, Core Banking, Logistics) powered by resilient Microservices and Event-Driven architecture.',
          features: ['Microservices & Event-Driven', 'Millions of CCU Scalability', 'Clean Code & TDD 80%+'],
          stats: '99.99% SLA Performance',
        },
        {
          id: 'ai',
          tag: 'INTELLIGENT AUTOMATION',
          title: 'Enterprise AI & Agentic Automation',
          desc: 'Custom Private LLM fine-tuning, autonomous Agentic AI workflows, computer vision, and predictive big data analytics for high-stakes decisions.',
          features: ['Private LLM & RAG Systems', 'Agentic Workflow Automation', 'Predictive Big Data'],
          stats: 'Up to 70% Operational Savings',
        },
        {
          id: 'cloud',
          tag: 'CLOUD & SRE OPERATIONS',
          title: 'Cloud Infrastructure & Kubernetes HA',
          desc: 'Designing auto-scaling Multi-Cloud infrastructure (AWS, Azure, GCP), FinOps cost governance, and automated zero-downtime CI/CD pipelines.',
          features: ['Infrastructure as Code (Terraform)', 'Kubernetes Cluster HA', 'Zero-Downtime Migration'],
          stats: '40% Cloud Cost Optimization',
        },
        {
          id: 'security',
          tag: 'CYBERSECURITY & ZERO-TRUST',
          title: 'Multi-Layer Cybersecurity & SOC',
          desc: 'End-to-end cyber defense with 24/7 Threat Hunting SOC, Red-Team penetration testing, end-to-end encryption, and rigorous ISO 27001 compliance.',
          features: ['24/7 Threat Hunting & SOC', 'Penetration Testing Red-Team', 'ISO 27001 & SOC 2 Compliance'],
          stats: 'Absolute Data Integrity',
        },
        {
          id: 'fintech',
          tag: 'FINTECH & DIGITAL ASSETS',
          title: 'FinTech & Blockchain Modernization',
          desc: 'Ultra-low latency electronic payment gateways, smart contracts verification, automated eKYC, and asset tokenization for tier-1 financial institutions.',
          features: ['Smart Contracts Audit', 'High-throughput Payment Gateway', 'Decentralized Architecture'],
          stats: 'Millions of daily transactions',
        },
        {
          id: 'data',
          tag: 'BIG DATA & REAL-TIME ANALYTICS',
          title: 'Data Engineering & Big Data Platform',
          desc: 'Designing enterprise Data Warehouses, Lakehouse architectures, and streaming pipelines for real-time predictive analytics and high-stakes decisions.',
          features: ['Data Lakehouse Architecture', 'Real-Time Streaming (Kafka/Flink)', 'BI & Predictive Analytics'],
          stats: '10TB+ Daily Data Processing',
        },
      ],
    },
    techMatrix: {
      tag: '// CORE TECHNICAL CAPABILITIES',
      title: 'Pioneering Tech Matrix',
      titleHighlight: 'Global Standards',
      desc: 'We master the most resilient, modern, and horizontally scalable technologies in the global enterprise computing landscape.',
      tabs: {
        backend: 'Backend & High-Load Architecture',
        aiData: 'AI, LLM & Data Engineering',
        cloudSre: 'Cloud Native & DevSecOps',
        frontend: 'Modern Web & Cross-Platform Mobile',
      },
      categories: [
        {
          id: 'backend',
          name: 'Backend & High-Load Architecture',
          description: 'Processing millions of concurrent requests with sub-millisecond latency guarantees.',
          skills: [
            { name: 'Golang', tag: 'Concurrency & Microservices', level: 'Core' },
            { name: 'Rust', tag: 'Memory-Safe High-Performance', level: 'Speed' },
            { name: 'Java / Spring Boot', tag: 'Enterprise Banking Core', level: 'Enterprise' },
            { name: 'Node.js / TypeScript', tag: 'Realtime & API Gateways', level: 'Core' },
            { name: 'Apache Kafka', tag: 'Event-Streaming Pipeline', level: 'Scalable' },
            { name: 'gRPC & Protobuf', tag: 'Inter-service High-Throughput RPC', level: 'Ultra-fast' },
          ],
        },
        {
          id: 'ai-data',
          name: 'AI, LLM & Data Engineering',
          description: 'State-of-the-art Deep Learning models and enterprise-grade Retrieval-Augmented Generation (RAG).',
          skills: [
            { name: 'PyTorch & TensorFlow', tag: 'Deep Learning Models', level: 'AI Core' },
            { name: 'LangChain & LangGraph', tag: 'Multi-Agent Automation', level: 'Advanced' },
            { name: 'Vector DBs (Qdrant/Milvus)', tag: 'Embedding & Semantic Search', level: 'Vector' },
            { name: 'Apache Spark', tag: 'Distributed Big Data Processing', level: 'ETL' },
            { name: 'PostgreSQL & pgvector', tag: 'ACID & High-Performance Storage', level: 'Robust' },
            { name: 'MLOps Pipeline', tag: 'CI/CD Model Deployment & Monitor', level: 'Production' },
          ],
        },
        {
          id: 'cloud-sre',
          name: 'Cloud Native & DevSecOps',
          description: 'Automated, immutable infrastructure orchestration with proactive disaster recovery.',
          skills: [
            { name: 'Kubernetes (K8s)', tag: 'Container Orchestration & Mesh', level: 'Native' },
            { name: 'Terraform IaC', tag: 'Automated Multi-Cloud Provisioning', level: 'Infra' },
            { name: 'AWS & Azure & GCP', tag: 'Hybrid Multi-Cloud Architecture', level: 'Certified' },
            { name: 'GitOps (ArgoCD)', tag: 'Automated Continuous Delivery', level: 'GitOps' },
            { name: 'Istio Service Mesh', tag: 'mTLS & Traffic Management', level: 'Mesh' },
            { name: 'Prometheus & Grafana', tag: 'Full-Stack Observability & SRE', level: 'Monitoring' },
          ],
        },
        {
          id: 'frontend',
          name: 'Modern Web & Cross-Platform Mobile',
          description: 'Consistent 60+ FPS performance, fluid motion, and optimized edge rendering.',
          skills: [
            { name: 'React 19 & Next.js 15', tag: 'Server Components & Edge SSR', level: 'Modern' },
            { name: 'TypeScript Strict', tag: 'Complete Type-Safety Architecture', level: 'Standard' },
            { name: 'Flutter & React Native', tag: 'Cross-Platform Mobile Ecosystem', level: 'Native-feel' },
            { name: 'Three.js & WebGL', tag: '3D Interactive Experience', level: 'Visuals' },
            { name: 'Tailwind CSS', tag: 'Enterprise Design Systems', level: 'Fast' },
            { name: 'PWA & Micro-Frontends', tag: 'Decoupled Scalable Frontends', level: 'Scale' },
          ],
        },
      ],
    },
    stats: {
      tag: '// ABOUT VNBGROUP',
      title: 'Setting the Standard for',
      titleHighlight: 'Digital Excellence',
      p1: 'VNBGroup was founded with a mission to serve as a strategic technology partner for global enterprises. We go beyond traditional software development to solve complex operational, security, and scalability challenges.',
      p2: 'From cutting-edge generative AI research to distributed multi-cloud architectures, every solution from VNBGroup adheres to rigorous standards: ultra-high availability, zero-trust encryption, and infinite scalability.',
      quoteTag: '// OPERATING PHILOSOPHY',
      quote: '“The greatest technology works silently in the background, unleashing extraordinary exponential growth for humanity.”',
      boardTitle: 'VNBGroup Board of Directors',
      boardDesc: 'Executive Leadership & Chief Architects',
      metrics: [
        {
          value: '250+',
          label: 'Enterprise Clients',
          sublabel: 'Partnered with premier banks, telecom giants, and multinational retailers',
        },
        {
          value: '99.99%',
          label: 'System SLA Uptime',
          sublabel: 'Multi-Region Active-Active failover with instantaneous recovery',
        },
        {
          value: '50M+',
          label: 'Daily Transactions',
          sublabel: 'Engineered for extreme throughput with sub-millisecond response latency',
        },
        {
          value: '15+',
          label: 'Years of Excellence',
          sublabel: 'Team of internationally certified solution architects and engineers',
        },
      ],
    },
    contact: {
      tag: '// INITIATE PROJECT',
      title: 'Ready to Build',
      titleHighlight: 'Digital Breakthroughs?',
      desc: 'Connect directly with VNBGroup chief solution architects. We analyze your corporate landscape and deliver a tailored technological blueprint within 24 hours.',
      emailLabel: 'Enterprise Email',
      hotlineLabel: '24/7 Corporate Hotline',
      hqLabel: 'Global Headquarters',
      hqValue: 'Hanoi • Ho Chi Minh City • Singapore',
      slaTitle: 'Rapid Turnaround:',
      slaDesc: 'Our engineering leadership provides an initial technical architecture analysis within 24 business hours.',
      formTitle: 'Enterprise Consultation Request',
      formDesc: 'Submit your requirements to receive executive solution briefs and dedicated technical demos.',
      serviceLabel: 'Areas of Interest',
      serviceOptions: [
        'Enterprise Core Software (ERP/CRM)',
        'Artificial Intelligence & Agentic AI',
        'Cloud Infrastructure & SRE',
        'Cybersecurity & SOC Operations',
        'FinTech & Blockchain Modernization',
        'Full Enterprise Architecture Review',
      ],
      nameLabel: 'Full Name *',
      namePlaceholder: 'Alexander Wright',
      companyLabel: 'Enterprise / Corporation *',
      companyPlaceholder: 'Global Enterprises Inc.',
      emailLabelInput: 'Corporate Email *',
      emailPlaceholder: 'name@corporation.com',
      phoneLabelInput: 'Phone / Mobile *',
      phonePlaceholder: '+1 (555) 019-2834',
      messageLabel: 'System Requirements or Architecture Goals',
      messagePlaceholder: 'Outline user scale, current infrastructure constraints, or key technical challenges...',
      submitBtn: 'Submit Consultation Request',
      submittingBtn: 'Transmitting Request...',
      successTitle: 'Inquiry Transmitted Successfully!',
      successDesc: 'Thank you for reaching out. A VNBGroup Principal Architect will contact you directly within 24 hours.',
    },
    footer: {
      desc: 'Comprehensive Enterprise IT Corporation. Leading the future of Core Software, Artificial Intelligence (AI), Cloud SRE, and Multi-Layer Cybersecurity.',
      isoBadge: 'ISO 27001 Certified',
      socBadge: 'SOC 2 Type II',
      colEcosystemTitle: 'Ecosystem',
      colCoreTechTitle: 'Core Technology',
      colCorporateTitle: 'Corporate',
      links: {
        enterpriseSoftware: 'Enterprise Core Software',
        aiLlm: 'AI & Large Language Models',
        cloudSre: 'Cloud Infrastructure & SRE',
        cybersecurity: 'Cybersecurity SOC',
        fintech: 'FinTech & Smart Contracts',
        bigData: 'Big Data & Data Platform',
        microservices: 'Microservices Architecture',
        ragAgentic: 'Private RAG & Agentic AI',
        k8s: 'Kubernetes Multi-Cluster',
        zeroTrust: 'Zero-Trust Network Access',
        tddCleanCode: 'TDD & Clean Code Standards',
        aboutUs: 'About VNBGroup',
        milestones: 'Capabilities & Milestones',
        contactSchedule: 'Contact & Consultation',
        privacyPolicy: 'Privacy Policy',
        termsOfService: 'Terms of Service',
      },
      rights: 'All rights reserved.',
      operational: 'All Systems Operational 100%',
      locations: 'Hanoi • HCMC • Singapore',
    },
  },

  zh: {
    nav: {
      brandSub: '企业级IT架构核心',
      ecosystem: '业务生态',
      techMatrix: '技术实力',
      stats: '核心指标',
      about: '关于VNBGroup',
      consultBtn: '立即咨询',
    },
    hud: {
      hero: '起始',
      services: '3D生态',
      techMatrix: '技术矩阵',
      about: '关于VNB',
      contact: '商务咨询',
    },
    hero: {
      badge: 'VNBGroup // 企业级全栈数字化科技架构',
      title1: '构建突破性',
      titleHighlight: '卓越',
      title2: '且可持续的数字未来',
      descPart1: '全栈式企业级IT科技集团。我们以全球一流工程标准定义关键领域：',
      highlightSoftware: '企业核心软件',
      highlightAI: '人工智能(AI)',
      highlightCloud: '云原生SRE高可用架构',
      highlightSecurity: '多层纵深网络安全',
      descPart2: '全力护航数百万级高并发企业业务。',
      exploreBtn: '探索3D生态系统',
      consultBtn: '系统架构咨询',
      telemetry: {
        slaLabel: '企业级SLA保障',
        slaValue: '99.99%',
        slaDesc: '多活高可用容灾标准',
        isoLabel: '权威安全合规',
        isoValue: 'ISO 27001',
        isoDesc: '零信任多层级防御体系',
        aiLabel: 'AI智能化赋能',
        aiValue: '10x Speed',
        aiDesc: '企业运营效能全面倍增',
        projectLabel: '全球标杆案例',
        projectValue: '250+ 大型客户',
        projectDesc: '跨国集团与金融科技机构',
      },
    },
    services: {
      tag: '// 全方位企业级服务生态',
      title: '关键核心IT解决方案',
      titleHighlight: '赋能数字新纪元',
      desc: '从底层核心基础设施到极致数字用户体验，VNBGroup以国际顶级技术标准全方位助力企业实现数字化跃升。',
      businessImpact: '企业业务效能',
      items: [
        {
          id: 'software',
          tag: 'ENTERPRISE ARCHITECTURE',
          title: '企业核心业务软件',
          desc: '打造超大规模企业核心系统（ERP、CRM、核心银行系统、智慧物流），基于微服务与事件驱动高并发架构。',
          features: ['微服务与事件驱动架构', '支持数百万CCU极速并发', '严苛Clean Code与80%+ TDD'],
          stats: '99.99% SLA可用性保障',
        },
        {
          id: 'ai',
          tag: 'INTELLIGENT AUTOMATION',
          title: '企业级AI与智能体自动化',
          desc: '专属私有化大语言模型（Private LLM）微调、自主智能体（Agentic AI）工作流、计算机视觉与预测性大数据深度分析。',
          features: ['私有化LLM与企业级RAG', '多智能体协同自动化流程', '深度大数据预测分析'],
          stats: '降低高达70%运营运维成本',
        },
        {
          id: 'cloud',
          tag: 'CLOUD & SRE OPERATIONS',
          title: '云原生架构与高可用K8s',
          desc: '构建自动弹性伸缩的多云架构（AWS、Azure、GCP），实施FinOps云成本优化治理并落地零停机CI/CD标准流水线。',
          features: ['基础设施即代码(Terraform)', 'Kubernetes高可用多集群', '业务零中断平滑迁移'],
          stats: '优化节省40%云端基础设施开支',
        },
        {
          id: 'security',
          tag: 'CYBERSECURITY & ZERO-TRUST',
          title: '多层网络安全与SOC态势感知',
          desc: '7x24小时全天候安全态势监控SOC、红队渗透测试、端到端高强度数据加密，全面符合国际ISO 27001与SOC 2安全合规标准。',
          features: ['24/7安全威胁猎捕与SOC', '专业红队渗透测试演练', 'ISO 27001与SOC 2严格认证'],
          stats: '保障核心数据绝对安全',
        },
        {
          id: 'fintech',
          tag: 'FINTECH & DIGITAL ASSETS',
          title: '金融科技与数字资产转型',
          desc: '超低时延电子支付清算网关、智能合约权威审计、生物识别eKYC及数字资产化方案，赋能顶尖金融机构。',
          features: ['智能合约安全审计', '高吞吐量金融级支付网关', '去中心化可靠架构'],
          stats: '每日承载数千万级交易吞吐',
        },
        {
          id: 'data',
          tag: 'BIG DATA & REAL-TIME ANALYTICS',
          title: '大数据工程与实时分析平台',
          desc: '构建企业级数据仓库、现代湖仓一体架构及流处理管道，驱动高价值即时商业决策与智能预测。',
          features: ['现代湖仓一体架构', '实时流计算 (Kafka/Flink)', '智能BI与预测分析引擎'],
          stats: '日均处理10TB+海量数据',
        },
      ],
    },
    techMatrix: {
      tag: '// 核心技术实力矩阵',
      title: '前沿技术栈矩阵',
      titleHighlight: '符合国际技术标准',
      desc: '我们专注深耕全球企业计算领域中最稳定、高性能且具备无限横向扩展能力的现代技术栈。',
      tabs: {
        backend: '后端高并发与分布式架构',
        aiData: 'AI大模型与数据工程',
        cloudSre: '云原生与DevSecOps',
        frontend: '现代Web与全平台移动端',
      },
      categories: [
        {
          id: 'backend',
          name: '后端高并发与分布式架构',
          description: '以亚毫秒级（Sub-millisecond）超低时延并发处理数百万级请求。',
          skills: [
            { name: 'Golang', tag: '高并发协程与微服务', level: 'Core' },
            { name: 'Rust', tag: '内存安全超高性能计算', level: 'Speed' },
            { name: 'Java / Spring Boot', tag: '金融级银行核心系统', level: 'Enterprise' },
            { name: 'Node.js / TypeScript', tag: '实时网络与API网关', level: 'Core' },
            { name: 'Apache Kafka', tag: '分布式事件流处理管道', level: 'Scalable' },
            { name: 'gRPC & Protobuf', tag: '微服务间高吞吐RPC通信', level: 'Ultra-fast' },
          ],
        },
        {
          id: 'ai-data',
          name: 'AI大模型与数据工程',
          description: '落地前沿深度学习算法与针对企业垂直数据的RAG知识增强架构。',
          skills: [
            { name: 'PyTorch & TensorFlow', tag: '前沿深度学习模型构建', level: 'AI Core' },
            { name: 'LangChain & LangGraph', tag: '多智能体自主协同工作流', level: 'Advanced' },
            { name: 'Vector DBs (Qdrant/Milvus)', tag: '向量检索与语义Embedding', level: 'Vector' },
            { name: 'Apache Spark', tag: '分布式大数据极速ETL', level: 'ETL' },
            { name: 'PostgreSQL & pgvector', tag: 'ACID事务与高可靠存储', level: 'Robust' },
            { name: 'MLOps Pipeline', tag: '模型持续部署与监控', level: 'Production' },
          ],
        },
        {
          id: 'cloud-sre',
          name: '云原生与DevSecOps',
          description: '全自动化基础设施交付，构建具备分钟级灾难自愈能力的高韧性系统。',
          skills: [
            { name: 'Kubernetes (K8s)', tag: '容器编排与服务网格', level: 'Native' },
            { name: 'Terraform IaC', tag: '多云自动化IaC配置管理', level: 'Infra' },
            { name: 'AWS & Azure & GCP', tag: '混合多云架构落地与认证', level: 'Certified' },
            { name: 'GitOps (ArgoCD)', tag: '声明式自动化持续交付', level: 'GitOps' },
            { name: 'Istio Service Mesh', tag: '双向mTLS与精细化流量控制', level: 'Mesh' },
            { name: 'Prometheus & Grafana', tag: '全链路可观测性与SRE', level: 'Monitoring' },
          ],
        },
        {
          id: 'frontend',
          name: '现代Web与全平台移动端',
          description: '提供60+ FPS极致丝滑交互，深度SEO优化及边缘节点毫秒级响应。',
          skills: [
            { name: 'React 19 & Next.js 15', tag: '服务端组件与Edge SSR', level: 'Modern' },
            { name: 'TypeScript Strict', tag: '全栈严苛类型安全体系', level: 'Standard' },
            { name: 'Flutter & React Native', tag: '全平台原生质感移动端', level: 'Native-feel' },
            { name: 'Three.js & WebGL', tag: '3D交互式视觉震撼体验', level: 'Visuals' },
            { name: 'Tailwind CSS', tag: '企业级规范设计系统', level: 'Fast' },
            { name: 'PWA & 微前端', tag: '解耦可扩展前端工程架构', level: 'Scale' },
          ],
        },
      ],
    },
    stats: {
      tag: '// 关于VNB集团',
      title: '确立数字科技',
      titleHighlight: '新标杆',
      p1: 'VNBGroup创立之初即确立了成为全球企业可信赖技术战略伙伴的宏伟愿景。我们不仅交付软件，更专注于为大型企业解决业务运作、数据安全与规模化扩展中最具挑战性的核心难题。',
      p2: '从前沿生成式AI研发到超大规模分布式多云基础设施，VNBGroup的每一套解决方案均恪守最严苛的工程标准：极高可用性、零信任加密以及无缝横向弹性扩展能力。',
      quoteTag: '// 运营核心哲学',
      quote: '“最强大的科技是无形中赋能人类，并在寂静中释放非凡的爆发式增长动力。”',
      boardTitle: 'VNBGroup董事会',
      boardDesc: '领导管理层 & 首席技术架构师',
      metrics: [
        {
          value: '250+',
          label: '全球企业级客户',
          sublabel: '涵盖顶级金融银行、大型电信运营商与跨国连锁零售集团',
        },
        {
          value: '99.99%',
          label: '系统可用性SLA',
          sublabel: '跨区域双活Active-Active部署，具备毫秒级灾备切换能力',
        },
        {
          value: '50M+',
          label: '每日处理交易吞吐',
          sublabel: '专为超高通量、极低时延金融级业务负载精心设计',
        },
        {
          value: '15+',
          label: '年深厚行业经验',
          sublabel: '汇聚获得国际权威认证的资深系统架构师与工程团队',
        },
      ],
    },
    contact: {
      tag: '// 启动数字化合作',
      title: '准备开启',
      titleHighlight: '数字化飞跃？',
      desc: '欢迎直接对接VNBGroup首席架构师团队。我们将深入剖析贵企业的实际业务痛点，并在24小时内提供定制化技术演进路线蓝图。',
      emailLabel: '企业专属邮箱',
      hotlineLabel: '7x24小时商务专线',
      hqLabel: '集团总部',
      hqValue: '河内 • 胡志明市 • 新加坡',
      slaTitle: '闪电响应承诺：',
      slaDesc: '我们的资深技术团队承诺在24个工作小时内出具初步系统架构分析建议。',
      formTitle: '预约企业级专属咨询',
      formDesc: '填写您的项目概况，获取VNBGroup技术白皮书与一对一专业解决方案演示。',
      serviceLabel: '企业关注的核心业务方向',
      serviceOptions: [
        '企业核心软件 (ERP/CRM/核心系统)',
        '人工智能与智能体自动化 (Agentic AI)',
        '云原生基础设施与DevOps SRE',
        '网络安全与SOC安全态势感知',
        '金融科技与区块链数字资产化',
        '全栈企业级技术架构整体规划',
      ],
      nameLabel: '联系人姓名 *',
      namePlaceholder: '张明远',
      companyLabel: '企业 / 集团名称 *',
      companyPlaceholder: '某某跨国集团股份有限公司',
      emailLabelInput: '企业工作邮箱 *',
      emailPlaceholder: 'name@company.com',
      phoneLabelInput: '联系电话 / 手机 *',
      phonePlaceholder: '+86 138 0000 0000',
      messageLabel: '系统架构需求或面临的技术挑战',
      messagePlaceholder: '简要说明用户并发规模、当前基础设施痛点或希望攻克的核心业务需求...',
      submitBtn: '立即提交商务咨询',
      submittingBtn: '正在提交需求...',
      successTitle: '需求提交成功！',
      successDesc: '感谢您的信任。VNBGroup首席技术负责人将在24小时内通过邮件及电话与您取得直接联系。',
    },
    footer: {
      desc: '全栈式企业级IT科技集团。引领企业核心软件、人工智能(AI)、云原生SRE高可用架构及多层网络安全新未来。',
      isoBadge: 'ISO 27001安全认证',
      socBadge: 'SOC 2 Type II合规',
      colEcosystemTitle: '业务生态',
      colCoreTechTitle: '核心技术',
      colCorporateTitle: '集团概况',
      links: {
        enterpriseSoftware: '企业核心业务软件',
        aiLlm: '人工智能与大语言模型',
        cloudSre: '云基础设施与SRE工程',
        cybersecurity: '网络安全态势SOC',
        fintech: '金融科技与智能合约',
        bigData: '大数据平台与流计算',
        microservices: '微服务分布式架构',
        ragAgentic: '私有化RAG与智能体',
        k8s: 'Kubernetes高可用多集群',
        zeroTrust: '零信任网络安全访问',
        tddCleanCode: '严谨TDD与Clean Code规范',
        aboutUs: '关于VNBGroup',
        milestones: '实力荣誉与发展里程碑',
        contactSchedule: '联系我们与预约咨询',
        privacyPolicy: '用户隐私政策',
        termsOfService: '服务使用条款',
      },
      rights: '保留所有权利。',
      operational: '全系统运行状态 100% 正常',
      locations: '河内 • 胡志明市 • 新加坡',
    },
  },
};
