import React from "react";
import Link from "next/link";
import styles from "../styles/modulGeneral.module.css";

const ModuleCard = ({ name, descrip, icon, route, options }) => {
  return (
    <>
      {options ? (
        <span className={styles.containerCardMod}>
          <span className={styles.titleCard}>
            {icon}
            <h3>{name}</h3>
          </span>
          {/* <p>{descrip}</p> */}
          {options.map((option) => {
            return (
              <Link
                href={option.route}
                className={styles.linkOptions}
                key={option.name}
              >
                {option.name}
              </Link>
            );
          })}
        </span>
      ) : (
        <Link href={route} className={styles.containerCardMod}>
          <span className={styles.titleCard}>
            {icon}
            <h3>{name}</h3>
          </span>
          <p>{descrip}</p>
        </Link>
      )}
    </>
  );
};

export default ModuleCard;
