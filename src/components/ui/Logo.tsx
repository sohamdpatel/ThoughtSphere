import { motion } from "motion/react"
import Link from "next/link"

export default function Logo({open}: {open: boolean}) {
    return (
        <Link
      href="/"
      className="relative z-20 flex items-center gap-2 space-x-2 py-1 text-sm font-normal text-black"
    >
      {/* <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" /> */}
      <img src="/logo-light.png" alt="Logo" className=" h-7 shrink-0 bg-blend-darken"/>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`whitespace-pre font-semibold text-black dark:text-white ${open ? "" : "hidden"}`}
      >
        ThoughtSphere
      </motion.span>
    </Link>
    )
}