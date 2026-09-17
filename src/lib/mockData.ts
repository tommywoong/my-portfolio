import { Project, Post, SiteSettings, SkillCategory } from './types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: 'DEV',
  brandSuffix: '.PORTFOLIO',
  brandSubtitle: 'SYSTEM ARCHITECT & FULLSTACK',
  brandLogoUrl: '',
  heroBadge: 'Software Architect • Available for High-Impact Projects',
  heroTitle: 'Kiến Trúc & Trình Bày Dự Án Phần Mềm Đẳng Cấp',
  heroSubtitle: 'Nơi tổng hợp, lưu trữ và minh họa sinh động các hệ thống phần mềm Enterprise, ứng dụng AI, Microservices và nền tảng Web & Mobile độ tin cậy cao.',
  contactEmail: 'contact@architect.dev',
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://linkedin.com',
  facebookUrl: 'https://facebook.com',
  footerAbout: 'Trang thông tin & lưu trữ các dự án phần mềm chuyên nghiệp. Được tối ưu tốc độ tối đa, thiết kế phong cách công nghệ sang trọng và vận hành trên nền tảng Cloud Miễn Phí.',
  totalProjectsCount: '15+',
  uptimeMetric: '99.9%',
  hostingCostMetric: '0đ',
  projectsTitle: 'Danh Sách Dự Án Tiêu Biểu',
  projectsSubtitle: 'Các sản phẩm được phân loại theo kiến trúc kỹ thuật. Nhấp vào thẻ bất kỳ để xem chi tiết bài phân tích kỹ thuật, mô hình thiết bị di động và demo.',
  skillsTitle: 'Công Nghệ Chủ Đạo & Kiến Trúc Software',
  skillsSubtitle: 'Bảng đánh giá năng lực chuyên môn và các công cụ lập trình sản xuất.',
  postsTitle: 'Bài Viết & Chia Sẻ Kỹ Thuật',
  postsSubtitle: 'Nhật ký chia sẻ kiến trúc phần mềm, kinh nghiệm lập trình và giải pháp tối ưu hệ thống.',
  contactTitle: 'Khởi Động Dự Án Mới',
  contactSubtitle: 'Gửi thông tin trao đổi trực tiếp về dự án hoặc kiến trúc hệ thống.'
};

export const INITIAL_SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'skill-cat-1',
    title: 'Frontend Development',
    skills: [
      { id: 's1', name: 'Next.js 14/15/16', level: 95, highlight: 'App Router, Server Actions, SSR' },
      { id: 's2', name: 'React / TypeScript', level: 98, highlight: 'Design Patterns, State Management' },
      { id: 's3', name: 'Tailwind CSS / UI Animations', level: 95, highlight: 'Glassmorphism, Cyberpunk Style' },
      { id: 's4', name: 'React Native / Expo', level: 88, highlight: 'iOS & Android App Development' }
    ]
  },
  {
    id: 'skill-cat-2',
    title: 'Backend & Microservices',
    skills: [
      { id: 's5', name: 'Node.js / NestJS / Express', level: 92, highlight: 'RESTful API, GraphQL, WebSockets' },
      { id: 's6', name: 'Go (Golang)', level: 85, highlight: 'High Concurrency, Microservices' },
      { id: 's7', name: 'Python / FastAPI / Django', level: 90, highlight: 'Data Pipelines & AI Integration' },
      { id: 's8', name: 'C# / .NET Core', level: 82, highlight: 'Enterprise Web APIs' }
    ]
  },
  {
    id: 'skill-cat-3',
    title: 'Database & Cloud Storage',
    skills: [
      { id: 's9', name: 'PostgreSQL / Supabase', level: 94, highlight: 'Optimization, RL Policies, Triggers' },
      { id: 's10', name: 'Redis / In-Memory Cache', level: 90, highlight: 'Session Storage, Rate Limiting' },
      { id: 's11', name: 'MongoDB / DynamoDB', level: 86, highlight: 'NoSQL Document Store' }
    ]
  },
  {
    id: 'skill-cat-4',
    title: 'DevOps & AI Systems',
    skills: [
      { id: 's12', name: 'Docker / Kubernetes', level: 88, highlight: 'Containerization, Auto-Scaling' },
      { id: 's13', name: 'AWS / Vercel Cloud', level: 90, highlight: 'Serverless, S3, CloudFront CDN' },
      { id: 's14', name: 'OpenAI API / Vector DBs', level: 85, highlight: 'LLM RAG Systems, Qdrant' }
    ]
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Hệ Thống Phân Tích & Báo Cáo Dữ Liệu Doanh Nghiệp (Enterprise BI & Analytics)',
    slug: 'enterprise-bi-analytics',
    summary: 'Nền tảng báo cáo thông minh tự động hóa xử lý 1M+ giao dịch mỗi ngày với bảng điều khiển thời gian thực và dự báo AI.',
    description: `### Tổng Quan Dự Án
Hệ thống Enterprise BI được thiết kế nhằm giải quyết bài toán xử lý lượng lớn dữ liệu bán hàng và tài chính phân tán từ nhiều chi nhánh. Hệ thống thu thập, chuyển đổi (ETL) và trực quan hóa dữ liệu theo thời gian thực (Real-time Streaming).

![Dashboard Phân Tích](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop)

### Kiến Trúc Kỹ Thuật
- **Frontend**: Next.js App Router, Tailwind CSS, Recharts, Framer Motion.
- **Backend**: Node.js microservices, NestJS, Apache Kafka xử lý hàng đợi sự kiện.
- **Database & Storage**: PostgreSQL (TimescaleDB extension) lưu trữ chuỗi thời gian, Redis Cache layer.
- **AI & Forecast**: Python FastAPI tích hợp mô hình dự báo doanh thu Prophet & ARIMA.

### Tác Động & Kết Quả
- Rút ngắn thời gian tổng hợp báo cáo từ **3 ngày xuống 3 giây**.
- Giảm **45% chi phí hạ tầng** nhờ tối ưu hóa truy vấn SQL và phân tầng bộ nhớ đệm (Caching Strategy).`,
    category: 'Fullstack',
    tags: ['Next.js', 'NestJS', 'PostgreSQL', 'Kafka', 'Redis', 'Python', 'TailwindCSS'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    mobileMockupUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    galleryImages: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop'
    ],
    demoUrl: 'https://demo-bi-platform.example.com',
    githubUrl: 'https://github.com/example/enterprise-bi-platform',
    featured: true,
    completionDate: '2025-11',
    metrics: [
      { label: 'Tốc độ phản hồi API', value: '< 45ms' },
      { label: 'Giao dịch xử lý / ngày', value: '1.2M+' },
      { label: 'Độ khả dụng (Uptime)', value: '99.99%' }
    ],
    architectureHighlights: [
      'Kiến trúc Event-Driven Microservices nâng cao khả năng mở rộng ngang.',
      'Bảo mật định danh đa lớp OAuth2 / JWT + Role-Based Access Control (RBAC).',
      'Đồng bộ dữ liệu đa vùng với thời gian trễ cận bằng 0.'
    ],
    createdAt: '2025-11-15'
  },
  {
    id: 'proj-2',
    title: 'Nền Tảng AI Code Review & Automated QA Assistant',
    slug: 'ai-code-review-assistant',
    summary: 'Công cụ quét mã nguồn tự động dựa trên LLM giúp phát hiện lỗ hổng bảo mật, tối ưu hiệu năng và tự động viết Unit Test.',
    description: `### Tổng Quan Dự Án
Trợ lý AI tích hợp trực tiếp vào quy trình CI/CD (GitHub Actions / GitLab CI) giúp các nhóm lập trình viên kiểm tra chất lượng code tự động trước khi Merge Request được duyệt.

![AI Inspector Dashboard](https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1200&auto=format&fit=crop)

### Tính Năng Nổi Bật
- **Smart Security Audit**: Tự động phát hiện lỗi OWASP Top 10, SQL Injection, Hardcoded Secrets.
- **Auto Unit Test Generator**: Tự tạo test suite Jest / PyTest dựa trên ngữ cảnh mã nguồn.
- **Performance Profiling**: Cảnh báo các truy vấn N+1 Query và rò rỉ bộ nhớ (Memory Leak).`,
    category: 'AI & Data',
    tags: ['Python', 'OpenAI API', 'LangChain', 'React', 'Qdrant', 'Docker', 'CI/CD'],
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1200&auto=format&fit=crop',
    mobileMockupUrl: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=800&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop'
    ],
    demoUrl: 'https://ai-code-auditor.example.com',
    githubUrl: 'https://github.com/example/ai-code-auditor',
    featured: true,
    completionDate: '2026-01',
    metrics: [
      { label: 'Tỷ lệ phát hiện lỗi', value: '94.2%' },
      { label: 'Thời gian Code Review', value: '-60%' },
      { label: 'Kho lưu trữ hỗ trợ', value: 'Polyglot' }
    ],
    architectureHighlights: [
      'Tích hợp RAG (Retrieval-Augmented Generation) để hiểu rõ context của codebase.',
      'Sử dụng Token Caching để tiết kiệm 70% chi phí API LLM.'
    ],
    createdAt: '2026-01-20'
  },
  {
    id: 'proj-3',
    title: 'Ứng Dụng Quản Lý Tài Chính & Ví Điện Tử Đa Nền Tảng (Cross-Platform Fintech)',
    slug: 'fintech-smart-wallet',
    summary: 'Ứng dụng di động quản lý chi tiêu thông minh, quét hóa đơn bằng AI OCR và chuyển tiền siêu tốc với mã hóa đầu-cuối.',
    description: `### Trải Nghiệm Người Dùng & Công Nghệ
Ứng dụng Fintech xây dựng trên React Native giúp người dùng theo dõi dòng tiền cá nhân, tự động phân loại chi tiêu thông qua công nghệ OCR nhận diện hóa đơn.

![Giao Diện Ví Điện Tử Mobile](https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop)

### Điểm Sáng Kiến Trúc
- **Client**: React Native (Expo CLI), Redux Toolkit, Reanimated 3 cho hoạt ảnh mượt mà 120fps.
- **Server**: Go (Golang) REST API cho hiệu năng cao, gRPC kết nối dịch vụ thanh toán.
- **Bảo Mật**: Mã hóa AES-256, Biometric Auth (FaceID / Fingerprint), đạt chuẩn PCI-DSS Compliance basics.`,
    category: 'Mobile',
    tags: ['React Native', 'Golang', 'gRPC', 'PostgreSQL', 'Redis', 'OCR AI'],
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
    mobileMockupUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556742049-0a67568d0d9f?q=80&w=1200&auto=format&fit=crop'
    ],
    demoUrl: 'https://smart-wallet.example.com',
    githubUrl: 'https://github.com/example/fintech-smart-wallet',
    featured: true,
    completionDate: '2025-08',
    metrics: [
      { label: 'Người dùng tích cực', value: '50K+' },
      { label: 'Đánh giá App Store', value: '4.9 ★' },
      { label: 'Thời gian phản hồi', value: '18ms' }
    ],
    architectureHighlights: [
      'Xử lý giao dịch đồng thời với Go Goroutines và Mutex Lock tránh Race Condition.',
      'Hỗ trợ chế độ Offline-First tự động đồng bộ khi có kết nối mạng.'
    ],
    createdAt: '2025-08-10'
  },
  {
    id: 'proj-4',
    title: 'Hạ Tầng Cloud Microservices & Automated Kubernetes Deployment Pipeline',
    slug: 'kubernetes-cloud-pipeline',
    summary: 'Giải pháp chuẩn hóa hạ tầng đám mây DevOps Infrastructure-as-Code (IaC) tự động mở rộng theo tải thực tế.',
    description: `### Mô Tả Bài Toán
Thiết lập hạ tầng Kubernetes đa cụm (Multi-cluster K8s) trên AWS cho doanh nghiệp SaaS, tự động mở rộng (Auto-scaling) từ 3 nodes lên 50 nodes trong các đợt bùng nổ truy cập.

![Grafana Kubernetes Dashboard](https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=1200&auto=format&fit=crop)`,
    category: 'Cloud & DevOps',
    tags: ['Kubernetes', 'Terraform', 'AWS', 'Docker', 'ArgoCD', 'Prometheus', 'Grafana'],
    imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=1200&auto=format&fit=crop',
    mobileMockupUrl: '',
    galleryImages: [
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=1200&auto=format&fit=crop'
    ],
    demoUrl: 'https://grafana-metrics.example.com',
    githubUrl: 'https://github.com/example/devops-k8s-iac',
    featured: false,
    completionDate: '2025-05',
    metrics: [
      { label: 'Thời gian Deploy', value: '< 2 min' },
      { label: 'Chi phí tiết kiệm', value: '35%' },
      { label: 'Zero-Downtime', value: '100%' }
    ],
    architectureHighlights: [
      'GitOps workflow với ArgoCD giúp kiểm soát mọi thay đổi hạ tầng qua Git commit.',
      'Thiết lập Pod Disruption Budgets & Horizontal Pod Autoscaler (HPA).'
    ],
    createdAt: '2025-05-04'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    title: 'Xây Dựng Kiến Trúc Microservices Tốc Độ Cao Với Next.js 16, Go & Supabase',
    slug: 'microservices-nextjs-go-supabase',
    summary: 'Chi tiết thiết kế hệ thống phần mềm mở rộng linh hoạt, tối ưu chi phí hạ tầng về 0đ nhưng sẵn sàng chịu tải hàng ngàn request đồng thời.',
    content: `Trong phát triển phần mềm hiện đại, việc tối ưu hóa kiến trúc không chỉ giúp hệ thống chạy nhanh hơn mà còn giảm thiểu chi phí vận hành đáng kể. Bài viết này chia sẻ kinh nghiệm thực tế của tôi khi kết hợp Next.js 16 App Router, Golang Microservices và Supabase PostgreSQL.

![Kiến trúc hệ thống](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop)

1. Tại Sao Chọn Next.js 16 Tích Hợp Server Actions?
Next.js 16 đem lại sự cải tiến vượt bậc về bộ nhớ đệm (Caching Strategy) và khả năng xử lý bất đồng bộ. Việc tận dụng Server Components giúp giảm dung lượng JavaScript tải về phía Client tới 60%.

2. Tối Ưu Truy Vấn Cơ Sở Dữ Liệu Với Supabase & Indexing
Supabase không chỉ là một DBaaS miễn phí mà còn cung cấp cơ sở dữ liệu PostgreSQL chuẩn doanh nghiệp. Bằng cách áp dụng Partial Indexes và Composite Keys, tốc độ truy vấn đối với bảng 1,000,000 dòng vẫn giữ mức dưới 15ms.

![Mobile App Dashboard Preview](https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop)

3. Kinh Nghiệm Triển Khai Hosting Miễn Phí (Vercel & Supabase)
- Cấu hình CDN: Tối ưu cache-control header cho static assets.
- Environment Variables: Phân tách rõ ràng giữa Development, Staging và Production.
- Security Headers: Bật Content Security Policy (CSP), CORS restriction và HSTS.`,
    category: 'Kiến Trúc Phần Mềm',
    author: 'Software Architect',
    readTime: '6 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop'
    ],
    publishedAt: '2026-02-10',
    tags: ['System Architecture', 'Next.js', 'Supabase', 'Golang', 'Performance']
  },
  {
    id: 'post-2',
    title: 'Chiến Lược Tối Ưu Hóa UI/UX Với Tailwind CSS v4 & Framer Motion 12',
    slug: 'tailwind-v4-framer-motion-ux-guide',
    summary: 'Biến giao diện web thông thường thành một trải nghiệm công nghệ sang trọng đẳng cấp với hiệu ứng Glassmorphism và Neon Glow.',
    content: `Giao diện người dùng (UI) chính là ấn tượng đầu tiên phản ánh chất lượng của sản phẩm phần mềm. Bài viết sẽ hướng dẫn bạn bí quyết phối màu Obsidian Dark, tạo lớp mờ kính (Glassmorphism) chuẩn hiện đại.

![Cyber UI Concept](https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop)

Các Nguyên Tắc Phối Màu Dark Luxury:
1. Tránh màu đen tuyệt đối (#000000): Thay vào đó hãy dùng #090d16 hoặc #0a0f1d để tạo độ sâu thị giác.
2. Sử dụng Accent Colors phát sáng (Neon Cyan & Electric Violet): Giúp làm nổi bật các thành phần tương tác quan trọng như Nút kêu gọi hành động (CTA), Tag danh mục.
3. Hiệu ứng Hover viền phát sáng (Glow Border): Dùng CSS linear-gradient và thuộc tính mask-image.`,
    category: 'UI/UX & Frontend',
    author: 'Frontend Lead',
    readTime: '4 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop'
    ],
    publishedAt: '2026-02-18',
    tags: ['TailwindCSS', 'Frontend', 'Design System', 'Framer Motion']
  }
];
