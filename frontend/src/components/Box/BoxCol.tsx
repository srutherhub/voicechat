import React from "react";
import styles from "./BoxCol.module.css";

type BoxProps = React.HTMLAttributes<HTMLDivElement>;

export const BoxCol: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <div {...props} className={styles.container}>
      {children}
    </div>
  );
};
