import React, { createContext, useContext } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

interface RouteTransitionContextValue {
  routeKey: string;
  hasNavigated: boolean;
  isPageLoading: boolean;
}

const RouteTransitionContext = createContext<RouteTransitionContextValue>({
  routeKey: "/",
  hasNavigated: false,
  isPageLoading: false,
});

export const RouteTransitionProvider: React.FC<{
  routeKey: string;
  hasNavigated: boolean;
  isPageLoading?: boolean;
  children: React.ReactNode;
}> = ({ routeKey, hasNavigated, isPageLoading = false, children }) => (
  <RouteTransitionContext.Provider value={{ routeKey, hasNavigated, isPageLoading }}>
    {children}
  </RouteTransitionContext.Provider>
);

export const useRouteTransition = () => useContext(RouteTransitionContext);

export interface PageMainTransitionProps
  extends Omit<HTMLMotionProps<"main">, "children"> {
  children: React.ReactNode;
}

/**
 * Applies a Framer Motion slide-up entrance (0.3s) and clean exit dissolve
 * specifically to the primary <main id="main-content"> container during route
 * navigation. Works with <AnimatePresence mode="wait" initial={false}> so
 * initial cold page loads paint immediately (zero LCP delay) while respecting
 * prefers-reduced-motion.
 */
export const PageMainTransition: React.FC<PageMainTransitionProps> = ({
  children,
  id = "main-content",
  className,
  ...rest
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.main
      id={id}
      className={className}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={
        prefersReducedMotion
          ? { opacity: 0, transition: { duration: 0.01 } }
          : {
              opacity: 0,
              y: -8,
              transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0.01 }
          : {
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }
      }
      {...rest}
    >
      {children}
    </motion.main>
  );
};

export default PageMainTransition;
