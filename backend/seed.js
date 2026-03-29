'use strict';

// ── 0. Bootstrap ────────────────────────────────────────────
const path = require('path');
const dotenv = require('dotenv');

// Load the backend .env (MONGO_URI, JWT_SECRET, etc.)
dotenv.config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ── 1. Re-use the project's own Mongoose models ─────────────
//   Adjust these paths if the repo moves files around.
const User = require('./models/User');
const Room = require('./models/Room');
const Topic = require('./models/Topic');
const Messages = require('./models/Messages');

// ── 2. Seed data ─────────────────────────────────────────────

/** 10 realistic dummy users */
const DUMMY_USERS = [
  {
    name: 'Arjun Sharma',
    email: 'arjun.sharma@example.com',
    password: 'Password@123',
  },
  {
    name: 'Priya Menon',
    email: 'priya.menon@example.com',
    password: 'Password@123',
  },
  {
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    password: 'Password@123',
  },
  {
    name: 'Sneha Iyer',
    email: 'sneha.iyer@example.com',
    password: 'Password@123',
  },
  {
    name: 'Karan Patel',
    email: 'karan.patel@example.com',
    password: 'Password@123',
  },
  {
    name: 'Divya Nair',
    email: 'divya.nair@example.com',
    password: 'Password@123',
  },
  {
    name: 'Aditya Rao',
    email: 'aditya.rao@example.com',
    password: 'Password@123',
  },
  {
    name: 'Meera Krishnan',
    email: 'meera.krishnan@example.com',
    password: 'Password@123',
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    password: 'Password@123',
  },
  {
    name: 'Ananya Bose',
    email: 'ananya.bose@example.com',
    password: 'Password@123',
  },
];

/** 5 chat rooms, each tied to a study topic */
const DUMMY_ROOMS = [
  {
    name: 'TypeScript Mastery',
    description:
      'Discuss advanced TypeScript typings, generics, and migrating large JS codebases.',
    topicName: 'TypeScript',
  },
  {
    name: 'React Performance Clinic',
    description:
      'Profile and optimize React apps: memoization, reconciliation, and rendering patterns.',
    topicName: 'React',
  },
  {
    name: 'Node.js API Scaling',
    description:
      'Build scalable REST and GraphQL APIs; performance, caching, and rate limiting.',
    topicName: 'Node.js',
  },
  {
    name: 'UI/UX Design Jam',
    description:
      'Craft responsive interfaces, design systems, and accessibility-first interaction.',
    topicName: 'Design',
  },
  {
    name: 'Database Optimization Hour',
    description:
      'Discuss indexing, queries, and schema design for MongoDB and SQL databases.',
    topicName: 'Databases',
  },
  {
    name: 'Python Data Science Hub',
    description:
      'Share Jupyter notebooks, Pandas workflows, and model interpretation tips.',
    topicName: 'Python',
  },
  {
    name: 'DevOps CI/CD Pipeline',
    description:
      'Automate testing and deployment with GitHub Actions, Jenkins, and Docker.',
    topicName: 'DevOps',
  },
  {
    name: 'Security and Authentication',
    description:
      'Discuss JWT, OAuth2, OWASP top 10, and secure token lifecycle management.',
    topicName: 'Security',
  },
  {
    name: 'Cloud Architecture Lab',
    description:
      'Design resilient architectures with AWS/Azure/GCP and infrastructure as code.',
    topicName: 'Cloud',
  },
  {
    name: 'Mobile App Builders',
    description:
      'Build cross-platform UIs with React Native, Flutter, and performance profiling.',
    topicName: 'Mobile',
  },
  {
    name: 'AI/ML Study Group',
    description:
      'Explore data preprocessing, model training, and deployment with TensorFlow.',
    topicName: 'Machine Learning',
  },
  {
    name: 'Blockchain Dev Lab',
    description:
      'Smart contracts, Web3, and token economics for decentralized applications.',
    topicName: 'Blockchain',
  },
  {
    name: 'Functional Programming Circle',
    description:
      'Learn FP concepts with Haskell, Elm, and Ramda for robust application design.',
    topicName: 'Functional Programming',
  },
  {
    name: 'Game Dev & Graphics',
    description:
      'Real-time rendering, game loops, and three.js/WebGL performance tuning.',
    topicName: 'Game Development',
  },
  {
    name: 'Testing and QA',
    description:
      'Build end-to-end test suites with Jest, Cypress, and boarding for regression safety.',
    topicName: 'Testing',
  },
  {
    name: 'API Design and Docs',
    description:
      'Discuss OpenAPI, GraphQL schema design, and API versioning strategies.',
    topicName: 'API Design',
  },
  {
    name: 'Embedded Systems Chat',
    description:
      'Low-level embedded coding, real-time OS, and hardware-software integration.',
    topicName: 'Embedded Systems',
  },
  {
    name: 'Big Data Engineering',
    description:
      'Data pipelines, ETL, Spark, and query optimization for large-scale datasets.',
    topicName: 'Big Data',
  },
  {
    name: 'Linux and SysAdmin',
    description:
      'Server management, shell scripting, and security hardening for production systems.',
    topicName: 'Linux',
  },
  {
    name: 'Freelance Tech Startup',
    description:
      'Share ideas for bootstrapping MVPs, funding, and scaling solo engineering teams.',
    topicName: 'Startup',
  },
];

/**
 * Conversation messages per room — 20 per room.
 * Each entry is a plain string; the sender is chosen randomly at runtime.
 */
const ROOM_MESSAGES = {
  'TypeScript Mastery': [
    'Hey everyone! Ready to dive into closures today?',
    'Closures are so elegant once you get them — functions remembering their lexical scope.',
    'Can someone explain the difference between call, apply, and bind?',
    'Sure! call and apply invoke the function immediately; bind returns a new function.',
    'The event loop is what makes JS single-threaded but still non-blocking, right?',
    'Exactly — the call stack, Web APIs, callback queue, and microtask queue all play a role.',
    'Async/await is basically syntactic sugar over Promises.',
    'Yes, but it makes error handling with try/catch much cleaner.',
    "What's the output of: console.log(typeof null)? Spoiler: 'object' 😂",
    "Classic JS quirk. typeof null === 'object' is a historical bug that never got fixed.",
    'Prototype chain — can someone give a quick recap?',
    'Every object has a __proto__ pointing to its prototype, all the way up to Object.prototype.',
    'ES modules vs CommonJS — when do you choose which?',
    'ESM is the standard now; CJS is mainly for older Node.js codebases.',
    'Debounce vs throttle — differences?',
    'Debounce delays execution until after a pause; throttle limits how often it fires.',
    'WeakMap and WeakSet are super useful for avoiding memory leaks with DOM node refs.',
    "Great point! Garbage collector can reclaim WeakMap keys when they're no longer referenced.",
    'One more: what are generator functions useful for?',
    'Lazy evaluation and async iteration — think infinite sequences or streaming data.',
  ],
  'React Performance Clinic': [
    "Welcome to React Performance Clinic! Let's optimize those apps.",
    'React.memo prevents unnecessary re-renders.',
    'Use React.Profiler to measure performance.',
    'Virtualize long lists with react-window.',
    'Code splitting with React.lazy and Suspense.',
    'Avoid inline functions in render.',
    'Use useCallback for stable function references.',
    'Shallow compare props with React.memo.',
    'Optimize context with useMemo.',
    'Bundle analysis with webpack-bundle-analyzer.',
    'Tree shaking removes unused code.',
    'Lazy load images and components.',
    'Debounce user input to reduce renders.',
    'Use production build for better performance.',
    'Monitor with React DevTools.',
    'Immutable updates with Immer.',
    'Key props for efficient reconciliation.',
    'Avoid deep nesting in JSX.',
    'Use fragments to reduce DOM nodes.',
    'Great session! Keep optimizing.',
  ],
  'Node.js API Scaling': [
    'Scaling Node.js APIs starts with clustering.',
    'Use PM2 for process management.',
    'Load balancing with nginx.',
    'Cache with Redis.',
    'Database connection pooling.',
    'Async/await for non-blocking code.',
    'Rate limiting with express-rate-limit.',
    'Horizontal scaling with containers.',
    'Monitor with New Relic.',
    'Optimize queries and indexes.',
    'Use streams for large data.',
    'Compress responses with gzip.',
    'CDN for static assets.',
    'Microservices architecture.',
    'Event-driven with EventEmitter.',
    'Graceful shutdown handling.',
    'Health checks for uptime.',
    'Logging with Winston.',
    'Error handling middleware.',
    'Scale successfully!',
  ],
  'UI/UX Design Jam': [
    'UI/UX design starts with user research.',
    'Wireframes before high-fidelity mocks.',
    'Use Figma for collaborative design.',
    'Accessibility first: WCAG guidelines.',
    'Color contrast for readability.',
    'Typography hierarchy.',
    'Responsive design with breakpoints.',
    'Usability testing with real users.',
    'Iterate based on feedback.',
    'Design systems for consistency.',
    'Micro-interactions enhance UX.',
    'Loading states and skeletons.',
    'Error states with helpful messages.',
    'Navigation patterns: tabs, breadcrumbs.',
    'Mobile-first approach.',
    'Dark mode support.',
    'Animation with purpose.',
    'User personas guide decisions.',
    'Prototyping with tools like Framer.',
    'Design beautifully!',
  ],
  'Database Optimization Hour': [
    'Database optimization begins with indexing.',
    'Explain plans for query analysis.',
    'Normalize to reduce redundancy.',
    'Denormalize for read performance.',
    'Connection pooling.',
    'Query caching.',
    'Partitioning large tables.',
    'Use EXPLAIN to understand execution.',
    'Monitor slow queries.',
    'Optimize JOINs.',
    'Use appropriate data types.',
    'Batch operations.',
    'Replication for high availability.',
    'Backup strategies.',
    'Handle deadlocks.',
    'Use stored procedures wisely.',
    'Index foreign keys.',
    'Profile with tools like pgBadger.',
    'Scale with sharding.',
    'Optimize efficiently!',
  ],
  'Python Data Science Hub': [
    'Python for data science with Pandas.',
    'NumPy for numerical computing.',
    'Matplotlib and Seaborn for viz.',
    'Jupyter notebooks for exploration.',
    'Scikit-learn for ML.',
    'Data cleaning first.',
    'Feature engineering.',
    'Train/test split.',
    'Cross-validation.',
    'Hyperparameter tuning.',
    'Model evaluation metrics.',
    'Handle imbalanced data.',
    'Time series with Prophet.',
    'Big data with Dask.',
    'Deploy models with Flask.',
    'Version control for data.',
    'Collaborate with Git.',
    'Share with nbviewer.',
    'Learn from Kaggle.',
    'Analyze data!',
  ],
  'DevOps CI/CD Pipeline': [
    'CI/CD with GitHub Actions.',
    'Automate builds and tests.',
    'Lint and format code.',
    'Unit and integration tests.',
    'Artifact storage.',
    'Deployment strategies.',
    'Infrastructure as code.',
    'Secrets management.',
    'Rollback plans.',
    'Monitoring and alerts.',
    'Blue-green deployments.',
    'Feature flags.',
    'Containerization with Docker.',
    'Orchestration with Kubernetes.',
    'Security scanning.',
    'Performance testing.',
    'Documentation.',
    'Team collaboration.',
    'Continuous improvement.',
    'Deploy smoothly!',
  ],
  'Security and Authentication': [
    'Authentication with JWT.',
    'OAuth2 for third-party.',
    'Password hashing with bcrypt.',
    'Rate limiting.',
    'Input validation.',
    'SQL injection prevention.',
    'XSS and CSRF protection.',
    'HTTPS everywhere.',
    'Session management.',
    'Multi-factor auth.',
    'API keys securely.',
    'Role-based access.',
    'Security headers.',
    'Vulnerability scanning.',
    'Incident response.',
    'Compliance standards.',
    'Pen testing.',
    'Zero trust model.',
    'Educate the team.',
    'Stay secure!',
  ],
  'Cloud Architecture Lab': [
    'PaaS vs IaaS: choose the right tradeoff of control vs convenience.',
    'Design for fault domains and isolate services by tiers.',
    'Use multiple availability zones for high-availability architecture.',
    'Choose managed DBs with read replicas for scalability.',
    'Prefer API gateways with rate limiting and auth integration.',
    'Use CDN for static assets to reduce app server load.',
    'Enforce network security groups and least privilege access.',
    'Use secrets management and rotate credentials regularly.',
    'Containerized workloads should use health checks and probes.',
    'Implement logging and distributed tracing for each request.',
    'Apply compliance policies with cloud policy-as-code tools.',
    'Plan for cost optimization with reserved instances and autoscale.',
    'Disaster recovery requires RTO/RPO goals and tested runbooks.',
    'Automate provisioning using CloudFormation/Terraform scripts.',
    'Ensure deployments are immutable and versioned artifacts.',
    'Enable centralized metric dashboards and alerting rules.',
    'Meet security best practices: encryption, ACLs, and auditing.',
    'Review architecture periodically to handle growth changes.',
    'Use edge services for low-latency geolocation handling.',
    'Foster cross-team architecture reviews to avoid silos.',
  ],
  'Mobile App Builders': [
    'Cross-platform with React Native.',
    'Native with Swift/Kotlin.',
    'UI with components.',
    'State management.',
    'Navigation libraries.',
    'API integration.',
    'Offline support.',
    'Push notifications.',
    'App store guidelines.',
    'Performance profiling.',
    'Testing on devices.',
    'Version control.',
    'CI/CD for mobile.',
    'Analytics integration.',
    'User feedback.',
    'Accessibility.',
    'Monetization strategies.',
    'Updates and maintenance.',
    'Build great apps!',
  ],
  'AI/ML Study Group': [
    'AI/ML with TensorFlow.',
    'Data preprocessing.',
    'Model selection.',
    'Training and validation.',
    'Overfitting prevention.',
    'Neural networks.',
    'Computer vision.',
    'NLP with transformers.',
    'Deployment.',
    'Explainability.',
    'Ethics in AI.',
    'Data privacy.',
    'Edge computing.',
    'Federated learning.',
    'Research papers.',
    'Competitions.',
    'Tools and frameworks.',
    'Career paths.',
    'Learn AI!',
  ],
  'Blockchain Dev Lab': [
    'Blockchain with Ethereum.',
    'Smart contracts in Solidity.',
    'Web3.js for interaction.',
    'Decentralized apps.',
    'Cryptography basics.',
    'Consensus mechanisms.',
    'Token standards.',
    'NFTs and DeFi.',
    'Scalability solutions.',
    'Security audits.',
    'Interoperability.',
    'Layer 2 solutions.',
    'Wallets and keys.',
    'Blockchain oracles.',
    'Governance.',
    'Use cases.',
    'Development tools.',
    'Future trends.',
    'Build on blockchain!',
  ],
  'Functional Programming Circle': [
    'FP with Haskell.',
    'Pure functions.',
    'Immutability.',
    'Higher-order functions.',
    'Recursion.',
    'Pattern matching.',
    'Monads.',
    'Functors.',
    'Lazy evaluation.',
    'Type systems.',
    'Elm for web.',
    'Ramda for JS.',
    'Benefits of FP.',
    'Functional design.',
    'Testing pure functions.',
    'Concurrency.',
    'Learning resources.',
    'Community.',
    'Think functionally!',
  ],
  'Game Dev & Graphics': [
    'Game dev with Unity.',
    'Graphics with three.js.',
    'Game loops.',
    'Rendering pipelines.',
    'Shaders.',
    'Physics engines.',
    'AI for NPCs.',
    'Level design.',
    'UI/UX in games.',
    'Multiplayer.',
    'Performance optimization.',
    'Cross-platform.',
    'Asset management.',
    'Sound design.',
    'Monetization.',
    'Publishing.',
    'Tools and engines.',
    'Community.',
    'Create games!',
  ],
  'Testing and QA': [
    'Unit testing with Jest.',
    'Integration tests.',
    'E2E with Cypress.',
    'TDD approach.',
    'Test coverage.',
    'Mocking.',
    'CI/CD testing.',
    'Manual testing.',
    'Exploratory testing.',
    'Performance testing.',
    'Security testing.',
    'Accessibility testing.',
    'Test automation.',
    'Bug tracking.',
    'Quality metrics.',
    'Team collaboration.',
    'Best practices.',
    'Tools.',
    'Ensure quality!',
  ],
  'API Design and Docs': [
    'RESTful APIs.',
    'GraphQL for flexible queries.',
    'OpenAPI spec.',
    'Versioning.',
    'Authentication.',
    'Rate limiting.',
    'Error handling.',
    'Pagination.',
    'Caching.',
    'Documentation with Swagger.',
    'API gateways.',
    'Microservices.',
    'Testing APIs.',
    'Monitoring.',
    'Security.',
    'Best practices.',
    'Tools.',
    'Design APIs!',
  ],
  'Embedded Systems Chat': [
    'Embedded with C/C++.',
    'Microcontrollers.',
    'RTOS.',
    'Hardware interfaces.',
    'Sensors.',
    'Actuators.',
    'Power management.',
    'Real-time constraints.',
    'Debugging.',
    'Firmware updates.',
    'Communication protocols.',
    'Security.',
    'Testing.',
    'Tools.',
    'Applications.',
    'Community.',
    'Build embedded!',
  ],
  'Big Data Engineering': [
    'Big data with Hadoop.',
    'Spark for processing.',
    'ETL pipelines.',
    'Data lakes.',
    'Streaming with Kafka.',
    'NoSQL databases.',
    'Data warehousing.',
    'Analytics.',
    'Machine learning at scale.',
    'Cloud storage.',
    'Data governance.',
    'Security.',
    'Performance.',
    'Tools.',
    'Careers.',
    'Handle big data!',
  ],
  'Linux and SysAdmin': [
    'Linux commands.',
    'Shell scripting.',
    'System monitoring.',
    'Package management.',
    'Networking.',
    'Security hardening.',
    'Automation with Ansible.',
    'Containers.',
    'Cloud servers.',
    'Backup and recovery.',
    'Performance tuning.',
    'Logs and auditing.',
    'Troubleshooting.',
    'Best practices.',
    'Certifications.',
    'Administer systems!',
  ],
  'Freelance Tech Startup': [
    'Bootstrapping MVPs.',
    'Finding clients.',
    'Project management.',
    'Pricing strategies.',
    'Legal aspects.',
    'Marketing.',
    'Networking.',
    'Time management.',
    'Scaling solo.',
    'Tools for freelancers.',
    'Building portfolio.',
    'Client relationships.',
    'Financial planning.',
    'Work-life balance.',
    'Success stories.',
    'Start freelancing!',
  ],
};

const DEFAULT_ROOM_MESSAGES = [
  'Welcome to this study room — let’s share notes and questions.',
  'Does anyone have a good tutorial for the core concepts?',
  'I prefer hands-on examples; let’s code something small together.',
  'How would we test this feature in a real project?',
  'What are the common pitfalls we should avoid?',
  'I love this group; the learning momentum is great.',
  'Anyone up for a short code kata in this topic?',
  'Can we map the architecture choices to performance outcomes?',
  'What resources should a beginner start with, step by step?',
  'Let’s recap the key concept one more time before we wrap.',
];

// ── 3. Helpers ───────────────────────────────────────────────

/** Return a random integer between min and max (inclusive) */
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** Pick a random element from an array */
const pick = (arr) => arr[randomInt(0, arr.length - 1)];

/** Async sleep for `ms` milliseconds */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Log a styled status line to the console */
const log = (emoji, msg) => console.log(`  ${emoji}  ${msg}`);

// ── 4. Main seeder function ──────────────────────────────────

async function seed() {
  const CLEAN_MODE = process.argv.includes('--clean');
  const MESSAGES_ONLY = process.argv.includes('--messages-only');

  // ── 4a. Connect to MongoDB ──────────────────────────────────
  const uri = process.env.MONGODB;
  if (!uri) {
    console.error(
      '\n❌  MongoDB connection string is not set.\n' +
        '    Set one of the following in backend/.env or environment variables:\n' +
        '    MONGO_URI, MONGODB_URI, MONGODB, or DB_URI\n' +
        '    Example:\n' +
        '    MONGO_URI=mongodb://localhost:27017/studyroom node seed.js\n',
    );
    process.exit(1);
  }

  console.log('\n🌱  StudyRoom MERN — Seeder Starting\n');
  log('🔗', `Connecting to MongoDB…`);
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  log('✅', 'Connected to MongoDB');

  // ── 4b. Optional clean-up of previous seed data ─────────────
  if (CLEAN_MODE) {
    log('🧹', 'Clean mode — removing previously seeded documents…');
    const seedEmails = DUMMY_USERS.map((u) => u.email);
    await User.deleteMany({ email: { $in: seedEmails } });
    const seedTopicNames = DUMMY_ROOMS.map((r) => r.topicName);
    const seedTopics = await Topic.find({ name: { $in: seedTopicNames } });
    const seedTopicIds = seedTopics.map((t) => t._id);
    await Room.deleteMany({ topic: { $in: seedTopicIds } });
    await Topic.deleteMany({ _id: { $in: seedTopicIds } });
    // Messages tied to those rooms are removed below after rooms are recreated
    log('✅', 'Previous seed data removed');
  }

  const createdUsers = [];
  const createdRooms = [];

  if (MESSAGES_ONLY) {
    console.log('\nℹ️  Messages-only mode — skipping user and room creation');

    const existingUsers = await User.find({
      email: { $in: DUMMY_USERS.map((u) => u.email) },
    });
    if (!existingUsers || existingUsers.length === 0) {
      throw new Error(
        'No users found in messages-only mode. Run without --messages-only first to seed users/rooms.',
      );
    }
    createdUsers.push(...existingUsers);

    const existingRooms = await Room.find({
      name: { $in: DUMMY_ROOMS.map((r) => r.name) },
    });
    if (!existingRooms || existingRooms.length === 0) {
      throw new Error(
        'No rooms found in messages-only mode. Run without --messages-only first to seed users/rooms.',
      );
    }
    createdRooms.push(...existingRooms);
  } else {
    // ── 4c. Create / upsert users ────────────────────────────────
    console.log('\n👤  Creating 10 dummy users…');

    for (const userData of DUMMY_USERS) {
      let user = await User.findOne({ email: userData.email });
      if (user) {
        log('⏭️ ', `User already exists — skipping: ${userData.name}`);
      } else {
        user = await User.create({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          passwordconfirm: userData.password,
        });
        log('✅', `Created user: ${user.name} (${user.email})`);
      }
      createdUsers.push(user);
    }

    // ── 4d. Create topics & rooms ────────────────────────────────
    console.log(`\n🏠  Creating ${DUMMY_ROOMS.length} chat rooms…`);

    for (const roomData of DUMMY_ROOMS) {
      let topic = await Topic.findOne({ name: roomData.topicName });
      if (!topic) {
        topic = await Topic.create({ name: roomData.topicName });
        log('🏷 ', `Created topic: ${topic.name}`);
      } else {
        log('⏭️ ', `Topic already exists: ${topic.name}`);
      }

      const host = createdUsers[0];

      let room = await Room.findOne({ name: roomData.name });
      if (room) {
        log('⏭️ ', `Room already exists — skipping: ${roomData.name}`);
      } else {
        room = await Room.create({
          name: roomData.name,
          description: roomData.description,
          topic: topic._id,
          host: host._id,
          participants: createdUsers.map((u) => u._id),
        });
        log('✅', `Created room: "${room.name}" (host: ${host.name})`);
      }
      createdRooms.push(room);
    }
  }

  // ── 4e. Simulate conversations ───────────────────────────────
  console.log('\n💬  Simulating conversations for each room…\n');

  for (const room of createdRooms) {
    const messages = ROOM_MESSAGES[room.name] || DEFAULT_ROOM_MESSAGES;
    log('💬', `Room: "${room.name}"`);

    for (let i = 0; i < messages.length; i++) {
      const sender = pick(createdUsers);
      const body = messages[i];

      await Messages.create({
        message: body,
        user: sender.name,
        room: room._id,
      });

      console.log(
        `     [${String(i + 1).padStart(2, '0')}]/${messages.length}]` +
          ` ${sender.name.padEnd(18)} → "${body.slice(0, 60)}${body.length > 60 ? '…' : ''}"`,
      );

      const delay = randomInt(500, 2000);
      await sleep(delay);
    }

    console.log();
  }

  // ── 4f. Summary ──────────────────────────────────────────────
  const totalMessages = createdRooms.reduce((sum, room) => {
    const count = (ROOM_MESSAGES[room.name] || DEFAULT_ROOM_MESSAGES).length;
    return sum + count;
  }, 0);

  console.log('-'.repeat(60));
  console.log('🎉  Seeding complete!\n');
  console.log(`   👤  Users   : ${createdUsers.length}`);
  console.log(`   🏠  Rooms   : ${createdRooms.length}`);
  console.log(`   💬  Messages: ${totalMessages}`);
  console.log('-'.repeat(60));
  console.log('\n   You can now log in with any of these accounts:');
  console.log('   Email pattern : <firstname>.<lastname>@example.com');
  console.log('   Password      : Password@123\n');

  await mongoose.disconnect();
  log('🔌', 'Disconnected from MongoDB. Bye!\n');
}

// ── 5. Entry point ───────────────────────────────────────────
seed().catch((err) => {
  console.error('\n❌  Seeder error:', err.message);
  console.error(err.stack);
  mongoose.disconnect().finally(() => process.exit(1));
});
