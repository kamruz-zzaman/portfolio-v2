import { hash } from "bcryptjs"
import connectToDatabase from "@/lib/db"
import User from "@/models/user"
import Project from "@/models/project"
import Post from "@/models/post"
import Comment from "@/models/comment"

export async function seedDatabase() {
  try {
    console.log("Connecting to database for seeding...")
    const db = await connectToDatabase()

    if (!db) {
      console.error("Failed to connect to database for seeding")
      return { success: false, error: "Database connection failed" }
    }

    // Check if database is already seeded
    const adminExists = await User.findOne({ role: "admin" })
    if (adminExists) {
      console.log("Database already seeded")
      return { success: true, message: "Database already seeded" }
    }

    console.log("Starting database seeding process...")

    // Create admin user
    const adminPassword = await hash("admin123", 12)
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      image: "/placeholder.svg?height=100&width=100",
      role: "admin",
    })

    // Create regular user
    const userPassword = await hash("user123", 12)
    const regularUser = await User.create({
      name: "Regular User",
      email: "user@example.com",
      password: userPassword,
      image: "/placeholder.svg?height=100&width=100",
      role: "user",
    })

    // Create projects
    const projects = [
      {
        title: "E-Commerce Platform",
        slug: "ecommerce-platform",
        description: "A full-featured online shopping platform with payment integration",
        fullDescription: `
          This e-commerce platform provides a complete solution for online businesses. It features product listings, 
          shopping cart functionality, secure checkout with Stripe integration, user authentication, and order management.
          
          The frontend is built with React, providing a smooth and responsive user experience. The backend uses Node.js 
          with Express, and data is stored in MongoDB. The application is fully responsive and works seamlessly on 
          mobile devices.
          
          Key features include:
          - User authentication and profile management
          - Product search and filtering
          - Shopping cart and wishlist functionality
          - Secure payment processing with Stripe
          - Order tracking and history
          - Admin dashboard for product and order management
        `,
        image: "/placeholder.svg?height=600&width=1200",
        gallery: [
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
        ],
        tags: ["React", "Node.js", "MongoDB", "Stripe"],
        github: "https://github.com/example/ecommerce-platform",
        demo: "https://ecommerce-platform.example.com",
        featured: true,
      },
      {
        title: "Task Management App",
        slug: "task-management",
        description: "A collaborative task management application with real-time updates",
        fullDescription: `
          This task management application helps teams collaborate effectively by providing real-time updates on task 
          progress. Users can create projects, assign tasks, set deadlines, and track progress.
          
          Built with Next.js and TypeScript, the application offers a type-safe codebase that's easy to maintain. 
          Firebase is used for real-time database functionality and authentication, while Tailwind CSS provides 
          a clean and modern UI.
          
          Key features include:
          - Real-time task updates
          - Project and team management
          - Task assignment and deadline tracking
          - Progress visualization with charts
          - Email notifications for task updates
          - Mobile-responsive design
        `,
        image: "/placeholder.svg?height=600&width=1200",
        gallery: [
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
        ],
        tags: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS"],
        github: "https://github.com/example/task-management",
        demo: "https://task-management.example.com",
        featured: true,
      },
      {
        title: "AI Content Generator",
        slug: "ai-content-generator",
        description: "An AI-powered application that generates content based on user prompts",
        fullDescription: `
          This AI content generator leverages the power of OpenAI's API to create high-quality content based on user prompts. 
          Users can generate blog posts, social media content, product descriptions, and more with just a few clicks.
          
          The frontend is built with React, providing an intuitive interface for users to input their prompts and 
          customize the generated content. The backend uses Express to handle API requests, and PostgreSQL stores 
          user data and generated content.
          
          Key features include:
          - Content generation from simple prompts
          - Multiple content types and formats
          - Content editing and refinement
          - Content history and favorites
          - Export to various formats (Markdown, HTML, etc.)
          - User authentication and subscription management
        `,
        image: "/placeholder.svg?height=600&width=1200",
        gallery: [
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
          "/placeholder.svg?height=400&width=600",
        ],
        tags: ["React", "OpenAI API", "Express", "PostgreSQL"],
        github: "https://github.com/example/ai-content-generator",
        demo: "https://ai-content-generator.example.com",
        featured: false,
      },
    ]

    console.log("Creating projects...")
    for (const projectData of projects) {
      await Project.create(projectData)
    }

    // Create blog posts
    const posts = [
      {
        title: "Next.js vs React: When to Use Each",
        slug: "nextjs-vs-react",
        excerpt: "A comprehensive comparison of Next.js and React, helping you decide which is best for your project.",
        content: `
          # Next.js vs React: When to Use Each

          When starting a new web project, one of the first decisions you'll need to make is which framework or library to use. React and Next.js are two popular choices, but understanding when to use each can be challenging. This article will help you make an informed decision based on your project requirements.

          ## What is React?

          React is a JavaScript library for building user interfaces, particularly single-page applications. It allows developers to create reusable UI components and manage the state of these components efficiently. React was developed by Facebook and has become one of the most popular frontend libraries in the world.

          ### Key Features of React:

          - **Component-Based Architecture**: React allows you to build encapsulated components that manage their own state.
          - **Virtual DOM**: React creates a lightweight representation of the real DOM in memory, which improves performance.
          - **JSX**: JSX is a syntax extension that allows you to write HTML-like code in JavaScript.
          - **Unidirectional Data Flow**: Data in React flows in one direction, making it easier to understand how data changes affect the application.

          ## What is Next.js?

          Next.js is a React framework that provides additional structure, features, and optimizations. It was created by Vercel and has gained significant popularity for its ability to simplify the development of React applications.

          ### Key Features of Next.js:

          - **Server-Side Rendering (SSR)**: Next.js can render React components on the server before sending them to the client.
          - **Static Site Generation (SSG)**: Next.js can generate static HTML at build time, which can be served from a CDN.
          - **File-Based Routing**: Next.js uses a file-based routing system, where each file in the pages directory becomes a route.
          - **API Routes**: Next.js allows you to create API endpoints as part of your application.
          - **Built-in CSS and Sass Support**: Next.js has built-in support for CSS and Sass, making it easier to style your application.

          ## When to Use React

          React is a great choice when:

          1. **You're building a single-page application (SPA)**: If your application doesn't require server-side rendering or SEO optimization, React is a lightweight option.
          2. **You need complete control over your application structure**: React gives you the freedom to structure your application however you want.
          3. **You're integrating with an existing backend**: If you already have a backend that serves your API, React can be used to build the frontend.
          4. **You're building a library or a component that will be used in different applications**: React's component-based architecture makes it ideal for creating reusable UI components.

          ## When to Use Next.js

          Next.js is a better choice when:

          1. **SEO is important for your application**: Next.js's server-side rendering capabilities make it easier for search engines to index your content.
          2. **You need fast page loads**: Server-side rendering and static site generation can significantly improve the perceived performance of your application.
          3. **You're building a large application**: Next.js provides a structured approach to building applications, which can be beneficial for larger projects.
          4. **You need built-in API routes**: Next.js allows you to create API endpoints as part of your application, which can be useful for simple backends.
          5. **You want a more opinionated framework**: Next.js provides conventions and best practices that can help you build applications more quickly.

          ## Conclusion

          Both React and Next.js are excellent choices for building modern web applications. The decision between them should be based on your specific project requirements. If you need a lightweight library with complete control over your application structure, React might be the better choice. If you need server-side rendering, static site generation, or a more opinionated framework, Next.js could be the way to go.

          Remember that Next.js is built on top of React, so you're not choosing between two completely different technologies. Instead, you're deciding whether the additional features and structure provided by Next.js are beneficial for your project.
        `,
        image: "/placeholder.svg?height=600&width=1200",
        category: "Web Development",
        author: admin._id,
        readTime: "5 min read",
        published: true,
        likes: 24,
      },
      {
        title: "TypeScript Best Practices for 2023",
        slug: "typescript-best-practices",
        excerpt: "Learn the latest TypeScript best practices to write cleaner, more maintainable code.",
        content: `
          # TypeScript Best Practices for 2023

          TypeScript has become an essential tool for many JavaScript developers, providing static type checking and other features that help catch errors early and make code more maintainable. As we move through 2023, here are some best practices to follow when working with TypeScript.

          ## Use Strict Mode

          TypeScript's strict mode enables a set of type-checking options that catch more potential errors. You can enable strict mode in your tsconfig.json file:

          \`\`\`json
          {
            "compilerOptions": {
              "strict": true
            }
          }
          \`\`\`

          This enables several flags, including:

          - noImplicitAny: Disallows expressions and declarations with an implied 'any' type.
          - strictNullChecks: Makes handling null and undefined more explicit.
          - strictFunctionTypes: Enables more correct checking of function types.
          - strictPropertyInitialization: Ensures class properties are initialized.

          ## Prefer Interfaces Over Type Aliases for Object Types

          While both interfaces and type aliases can be used to define object types, interfaces are generally preferred for a few reasons:

          - Interfaces can be extended and implemented.
          - Interfaces can be augmented (declaration merging).
          - Interfaces provide better error messages.

          \`\`\`typescript
          // Prefer this:
          interface User {
            id: number;
            name: string;
            email: string;
          }

          // Over this:
          type User = {
            id: number;
            name: string;
            email: string;
          };
          \`\`\`

          However, type aliases are still useful for union types, mapped types, and other advanced type features.

          ## Use Type Inference When Possible

          TypeScript's type inference is powerful and can often determine the correct type without explicit annotations. This can make your code more concise and easier to read.

          \`\`\`typescript
          // Let TypeScript infer the type
          const numbers = [1, 2, 3]; // inferred as number[]

          // Only add type annotations when necessary
          function getUser(id: number): User {
            // ...
          }
          \`\`\`

          ## Avoid Using 'any'

          The 'any' type effectively turns off type checking for a variable or expression. While it can be tempting to use 'any' to quickly fix type errors, it defeats the purpose of using TypeScript.

          Instead of 'any', consider using:

          - 'unknown' for values whose type you don't know.
          - Type assertions when you know more about a type than TypeScript does.
          - Proper type definitions or interfaces.

          ## Use Discriminated Unions for Complex Types

          Discriminated unions are a powerful way to model complex types in TypeScript. They involve using a common property (the discriminant) to differentiate between different types in a union.

          \`\`\`typescript
          interface Square {
            kind: 'square';
            size: number;
          }

          interface Rectangle {
            kind: 'rectangle';
            width: number;
            height: number;
          }

          interface Circle {
            kind: 'circle';
            radius: number;
          }

          type Shape = Square | Rectangle | Circle;

          function area(shape: Shape): number {
            switch (shape.kind) {
              case 'square':
                return shape.size * shape.size;
              case 'rectangle':
                return shape.width * shape.height;
              case 'circle':
                return Math.PI * shape.radius ** 2;
            }
          }
          \`\`\`

          ## Use Readonly for Immutable Data

          TypeScript provides the 'readonly' modifier and 'Readonly<T>' utility type to indicate that a property or object should not be modified.

          \`\`\`typescript
          interface Config {
            readonly apiKey: string;
            readonly endpoint: string;
          }

          // Or use the Readonly utility type
          type Config = Readonly<{
            apiKey: string;
            endpoint: string;
          }>;
          \`\`\`

          ## Use Nullish Coalescing and Optional Chaining

          TypeScript 3.7 introduced nullish coalescing (??) and optional chaining (?.), which are powerful features for handling null and undefined values.

          \`\`\`typescript
          // Nullish coalescing
          const value = data.value ?? defaultValue;

          // Optional chaining
          const name = user?.profile?.name;
          \`\`\`

          ## Conclusion

          Following these best practices will help you write more maintainable, robust TypeScript code in 2023. Remember that TypeScript is a tool to help you catch errors early and make your code more self-documenting. Use its features wisely to improve your development experience and code quality.
        `,
        image: "/placeholder.svg?height=600&width=1200",
        category: "TypeScript",
        author: admin._id,
        readTime: "7 min read",
        published: true,
        likes: 18,
      },
      {
        title: "10 Responsive Design Tips for Modern Websites",
        slug: "responsive-design-tips",
        excerpt: "Discover essential responsive design techniques to ensure your website looks great on all devices.",
        content: `
          # 10 Responsive Design Tips for Modern Websites

          In today's multi-device world, responsive design isn't just a nice-to-have—it's essential. Users access websites from a variety of devices with different screen sizes, from small smartphones to large desktop monitors. Here are 10 tips to help you create responsive designs that work well across all devices.

          ## 1. Use a Mobile-First Approach

          Start designing for the smallest screen first, then progressively enhance the design for larger screens. This approach forces you to focus on the essential content and functionality, resulting in a better experience for all users.

          \`\`\`css
          /* Mobile styles (base) */
          .container {
            padding: 1rem;
          }

          /* Tablet styles */
          @media (min-width: 768px) {
            .container {
              padding: 2rem;
            }
          }

          /* Desktop styles */
          @media (min-width: 1024px) {
            .container {
              padding: 3rem;
              max-width: 1200px;
              margin: 0 auto;
            }
          }
          \`\`\`

          ## 2. Use Relative Units

          Use relative units like percentages, em, rem, vh, and vw instead of fixed units like pixels. This allows your layout to adapt to different screen sizes and user font size preferences.

          \`\`\`css
          .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
          }

          .text {
            font-size: 1rem; /* Base font size */
            line-height: 1.5;
          }

          .hero {
            height: 50vh; /* 50% of the viewport height */
          }
          \`\`\`

          ## 3. Implement Flexible Images

          Make sure your images scale properly by setting their maximum width to 100% of their container.

          \`\`\`css
          img {
            max-width: 100%;
            height: auto;
          }
          \`\`\`

          ## 4. Use CSS Grid and Flexbox

          CSS Grid and Flexbox are powerful tools for creating responsive layouts. They make it easy to rearrange content based on screen size.

          \`\`\`css
          .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
          }

          .flex-container {
            display: flex;
            flex-wrap: wrap;
          }

          .flex-item {
            flex: 1 1 300px; /* Grow, shrink, basis */
            margin: 0.5rem;
          }
          \`\`\`

          ## 5. Use Media Queries Strategically

          Don't just add media queries at standard breakpoints. Instead, add them where your design starts to break. This approach, known as "breakpoint design," ensures your layout looks good at any screen size.

          \`\`\`css
          /* Base styles for all screen sizes */
          .card {
            padding: 1rem;
            margin-bottom: 1rem;
          }

          /* Adjust layout when cards start to look too narrow */
          @media (min-width: 600px) {
            .card-container {
              display: flex;
              flex-wrap: wrap;
            }
            
            .card {
              flex: 0 1 calc(50% - 1rem);
              margin: 0.5rem;
            }
          }

          /* Further adjust when more space is available */
          @media (min-width: 900px) {
            .card {
              flex: 0 1 calc(33.333% - 1rem);
            }
          }
          \`\`\`

          ## 6. Optimize Typography for Readability

          Ensure your text is readable on all devices by using appropriate font sizes and line heights. Consider increasing font size on larger screens for better readability.

          \`\`\`css
          body {
            font-size: 16px;
            line-height: 1.5;
          }

          @media (min-width: 768px) {
            body {
              font-size: 18px;
            }
          }

          h1 {
            font-size: 1.75rem;
          }

          @media (min-width: 768px) {
            h1 {
              font-size: 2.5rem;
            }
          }
          \`\`\`

          ## 7. Test on Real Devices

          Emulators and responsive design tools are useful, but nothing beats testing on actual devices. Test your website on a variety of devices with different screen sizes and operating systems.

          ## 8. Consider Touch Interactions

          Remember that many users will interact with your website using touch rather than a mouse. Make sure interactive elements are large enough to tap (at least 44x44 pixels) and provide enough space between them to prevent accidental taps.

          \`\`\`css
          .button {
            padding: 12px 24px;
            min-height: 44px;
            min-width: 44px;
          }

          .nav-link {
            padding: 12px;
            margin: 4px;
          }
          \`\`\`

          ## 9. Optimize Performance

          Responsive websites should load quickly on all devices, including those with slower connections. Optimize images, minimize HTTP requests, and use techniques like lazy loading to improve performance.

          \`\`\`html
          <img src="small.jpg" 
               srcset="small.jpg 500w, medium.jpg 1000w, large.jpg 1500w" 
               sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw" 
               loading="lazy" 
               alt="Responsive image">
          \`\`\`

          ## 10. Use Feature Queries for Progressive Enhancement

          Use CSS feature queries (@supports) to provide enhanced experiences for browsers that support newer features while ensuring a good baseline experience for all users.

          \`\`\`css
          .grid-fallback {
            display: flex;
            flex-wrap: wrap;
          }

          @supports (display: grid) {
            .grid-container {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
              gap: 1rem;
            }
            
            .grid-fallback {
              display: block;
            }
          }
          \`\`\`

          ## Conclusion

          Responsive design is about creating flexible layouts that adapt to any screen size, not just a few predefined breakpoints. By following these tips, you can create websites that provide a great user experience across all devices. Remember that responsive design is not a one-time task but an ongoing process of testing and refinement.
        `,
        image: "/placeholder.svg?height=600&width=1200",
        category: "CSS",
        author: admin._id,
        readTime: "6 min read",
        published: true,
        likes: 15,
      },
    ]

    console.log("Creating blog posts...")
    for (const postData of posts) {
      await Post.create(postData)
    }

    // Create comments
    console.log("Creating comments...")
    const firstPost = await Post.findOne({ slug: "nextjs-vs-react" })
    const secondPost = await Post.findOne({ slug: "typescript-best-practices" })

    if (firstPost && secondPost) {
      // Comments for first post
      const comment1 = await Comment.create({
        post: firstPost._id,
        author: regularUser._id,
        content:
          "This is a great article! I've been trying to decide between Next.js and React for my new project, and this really helped clarify things.",
        likes: 5,
      })

      await Comment.create({
        post: firstPost._id,
        author: admin._id,
        content: "Thanks! I'm glad you found it helpful. Let me know if you have any other questions.",
        parent: comment1._id,
        likes: 2,
      })

      await Comment.create({
        post: firstPost._id,
        author: regularUser._id,
        content:
          "I've been using Next.js for a while now and can confirm all the points you made. The server-side rendering has been a game-changer for our SEO.",
        likes: 8,
      })

      // Comments for second post
      await Comment.create({
        post: secondPost._id,
        author: regularUser._id,
        content:
          "Great tips! I especially like the point about using discriminated unions. They've made my code much more maintainable.",
        likes: 3,
      })

      await Comment.create({
        post: secondPost._id,
        author: admin._id,
        content: "TypeScript has completely changed how I write JavaScript. These best practices are spot on!",
        likes: 6,
      })
    }

    console.log("Database seeded successfully")
    return { success: true }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, error }
  }
}

