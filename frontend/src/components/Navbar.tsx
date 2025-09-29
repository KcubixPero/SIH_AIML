"use client"

import React, { useState } from "react"
import { Button } from "./ui/button"
import Link from "next/link"
import { Menu, User, XIcon } from "lucide-react"
import { AnimatePresence, motion, Variants } from "motion/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageSelect } from "./ui/LanguageSelect"
import { useTranslation } from "@/lib/useTranslation"
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger, DialogDescription } from "./ui/dialog"
import { FileUpload } from "./ui/file-upload"

const navLinks = [
  {
    name: "Home",
    href: "/"
  },
  {
    name: "Internships",
    href: "/internships"
  },
  {
    name: "Feedback",
    href: "/feedback"
  }
]

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const childVariant: Variants = {
    open: {
      opacity: 1,
      y: 0
    },
    closed: {
      opacity: 0,
      y: -20
    }
  }

  const parentVariant: Variants = {
    open: {
      transition: {
        staggerChildren: 0.5,
        delayChildren: 0.1
      }
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  }

  return (
    <div className="border-b border-border">
      <div className="flex justify-between items-center py-4 px-6 md:px-28">
        <div className="flex items-center gap-14">
          <Link href={"/"} className="text-2xl font-bold font-sans tracking-tight">
            PM Internships
          </Link>
          <ul className="hidden md:flex gap-4 mr-24">
            {
              navLinks.map((l, i) => (
                <Link href={l.href} key={i} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">{l.name}</Link>
              ))
            }
          </ul>
        </div>

        <div className="hidden md:flex gap-3">
          <Profile />
        </div>
        <div className="md:hidden">
          <Menu size={28} className={isOpen ? "hidden" : ""} onClick={() => setIsOpen(true)} />
          <XIcon size={28} className={!isOpen ? "hidden" : ""} onClick={() => setIsOpen(false)} />
        </div>
      </div>

      {/* Nav for Mobile */}

      <AnimatePresence>
        {
          isOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
                y: -20
              }}
              animate={{
                opacity: 1,
                height: [0, "10%", "auto"],
                y: 0
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut"
              }}
              exit={{
                opacity: 0,
                height: 0
              }}
              className="border border-border bg-background w-[90%] py-4 rounded-lg left-1/2 -translate-x-1/2 absolute z-50 md:hidden"
            >
              <motion.ul variants={parentVariant} className="flex flex-col justify-center items-center gap-4 p-6 text-lg">
                {
                  navLinks.map((l, i) => (
                    <motion.li variants={childVariant} key={i}>
                      <Link href={l.href} className="peer">{l.name}</Link>
                      <div className="h-0.5 rounded-4xl w-0 bg-white peer-hover:w-full transition-all"></div>
                    </motion.li>
                  ))
                }
              </motion.ul>
            </motion.div>
          )
        }
      </AnimatePresence>
    </div>
  )
}

const Profile = () => {
  const [uploadResumeOpen, setUploadResumeOpen] = useState<boolean>(false);

  const { t } = useTranslation();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full shadow-none border p-2">
          <User size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{t('profile.myAccount')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setUploadResumeOpen(prev => !prev)}>
            {t('profile.uploadResume')}
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <LanguageSelect />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={uploadResumeOpen} onOpenChange={setUploadResumeOpen}>
        <DialogContent>
          <DialogHeader className="space-y-6">
            <DialogTitle>{t('profile.uploadResume')}</DialogTitle>
            <FileUpload t={t} />
            <Button>{t('profile.uploadResume')}</Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}