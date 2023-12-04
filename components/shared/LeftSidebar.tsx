"use client";

import { sidebarLinks } from "@/constants";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LeftSidebar = () => {
  const pathname = usePathname();
  return (
    <section className="background-light900_dark200 custom-scrollbar light-border sticky left-0 top-0 flex h-screen w-fit flex-col justify-between overflow-y-auto border-r pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;
          // subSidebarLinksが存在しない場合
          if (!item.subSidebarLinks) {
            return (
              <Link
                key={item.route}
                href={item.route}
                className={`${
                  isActive
                    ? "primary-gradient rounded-lg text-light-900"
                    : "text-dark300_light900"
                } flex items-center justify-start gap-4 bg-transparent p-4`}
              >
                <Image
                  src={item.imgURL}
                  width={24}
                  height={24}
                  alt={item.label}
                  className={`${isActive ? "" : "invert-colors"}`}
                />
                <p
                  className={`${
                    isActive ? "base-bold" : "base-medium"
                  } max-lg:hidden`}
                >
                  {item.label}
                </p>
              </Link>
            );
          }

          // subSidebarLinksが存在する場合
          return (
            <Accordion type="single" collapsible key={item.label}>
              <AccordionItem value="item-1">
                <AccordionTrigger
                  className={`${
                    isActive
                      ? "primary-gradient rounded-lg text-light-900"
                      : "text-dark300_light900"
                  }  bg-transparent p-4`}
                >
                  <p
                    className={`${
                      isActive ? "base-bold" : "base-medium"
                    } max-lg:hidden`}
                  >
                    {item.label}
                  </p>
                </AccordionTrigger>
                <AccordionContent className="mt-1">
                  {item.subSidebarLinks.map((subItem) => {
                    const isSubActive = pathname === subItem.route;
                    return (
                      <Link
                        key={subItem.route}
                        href={subItem.route}
                        className={`${
                          isSubActive
                            ? "primary-gradient rounded-lg text-light-900"
                            : "text-dark300_light900"
                        } flex items-center justify-start gap-4 bg-transparent p-4`}
                      >
                        <p
                          className={`${
                            isSubActive ? "base-bold" : "base-medium"
                          } max-lg:hidden`}
                        >
                          {subItem.label}
                        </p>
                      </Link>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </div>
    </section>
  );
};

export default LeftSidebar;
