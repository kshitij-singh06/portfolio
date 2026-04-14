import * as React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  textClassName?: string;
  underlineClassName?: string;
  underlineStyle?: React.CSSProperties;
  underlinePath?: string;
  underlineHoverPath?: string;
  underlineDuration?: number;
}

const AnimatedText = React.forwardRef<HTMLDivElement, AnimatedTextProps>(
  (
    {
      text,
      textClassName,
      underlineClassName,
      underlineStyle,
      underlinePath = "M 0,10 Q 150,24 300,5",
      underlineHoverPath = "M 0,5 Q 150,20 300,0",
      underlineDuration = 1.5,
      ...props
    },
    ref
  ) => {
    const pathVariants: Variants = {
      hidden: {
        pathLength: 0,
        opacity: 0,
      },
      visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
          duration: underlineDuration,
          ease: "easeInOut",
        },
      },
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center gap-2", props.className)}
      >
        <div className="relative">
          <motion.h2
            className={cn("text-4xl font-bold text-center", textClassName)}
            style={props.style}
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            {text}
          </motion.h2>

          <motion.svg
            width="100%"
            height="24"
            viewBox="0 0 300 24"
            className={cn("absolute -bottom-2 left-0 w-full", underlineClassName)}
            style={underlineStyle}
            preserveAspectRatio="none"
          >
            <motion.path
              d={underlinePath}
              stroke="currentColor"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              fill="none"
              variants={pathVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{
                d: underlineHoverPath,
                transition: { duration: 0.8 },
              }}
            />
          </motion.svg>
        </div>
      </div>
    );
  }
);


AnimatedText.displayName = "AnimatedText";

export { AnimatedText };
