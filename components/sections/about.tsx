"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm">About Me</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Who I Am</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              I'm a passionate Full Stack Developer with expertise in building modern web applications. With a strong
              foundation in both frontend and backend technologies, I create seamless digital experiences that solve
              real-world problems.
            </p>
          </motion.div>
        </motion.div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-col justify-center space-y-4"
          >
            <ul className="grid gap-6">
              <motion.li variants={itemVariants} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">Reliable & Secure</h3>
                  <p className="text-sm text-muted-foreground">
                    I build applications with security and reliability at their core, ensuring your data is protected.
                  </p>
                </div>
              </motion.li>
              <motion.li variants={itemVariants} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                    <path d="M12 8v1" />
                    <path d="M12 15v1" />
                    <path d="M16 12h-1" />
                    <path d="M9 12H8" />
                    <path d="M15.7 9.7l-.7.7" />
                    <path d="M9.7 9.7l-.7-.7" />
                    <path d="M15.7 14.3l-.7-.7" />
                    <path d="M9.7 14.3l-.7.7" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">Innovative Solutions</h3>
                  <p className="text-sm text-muted-foreground">
                    I leverage cutting-edge technologies to create innovative solutions for complex problems.
                  </p>
                </div>
              </motion.li>
              <motion.li variants={itemVariants} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">User-Focused Design</h3>
                  <p className="text-sm text-muted-foreground">
                    I prioritize user experience, creating intuitive interfaces that delight users.
                  </p>
                </div>
              </motion.li>
            </ul>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-col justify-center space-y-4"
          >
            <motion.div variants={itemVariants} className="space-y-2">
              <h3 className="text-xl font-bold">My Journey</h3>
              <p className="text-muted-foreground">
                With several years of experience in web development, I've worked on a variety of projects ranging from
                small business websites to complex enterprise applications. My journey in tech has equipped me with the
                skills to tackle diverse challenges and deliver exceptional results.
              </p>
              <p className="text-muted-foreground">
                I'm constantly learning and adapting to new technologies, ensuring that I stay at the forefront of the
                rapidly evolving tech landscape. My goal is to create digital solutions that not only meet but exceed
                client expectations.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

