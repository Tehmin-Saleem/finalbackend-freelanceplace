import React from "react";
import Card from "../FreelancerCards/Card"; // Adjust the path as necessary
import JobDropdwon from "../../svg coponents/JobDropdwon";
import styles from "./FreelancerCards.module.scss"; // Import the SCSS module

const FreelancerCards = ({ freelancers }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.headerItem}>
          Skills
          <JobDropdwon />
        </h3>
        <h3 className={styles.headerItem}>
          Categories
          <JobDropdwon />
        </h3>
        <h3 className={styles.headerItem}>
          Availability
          <JobDropdwon />
        </h3>
        <h3 className={styles.headerItem}>
          Location
          <JobDropdwon />
        </h3>
        <h3 className={`${styles.headerItem} ${styles.lastHeaderItem}`}>
          Ratings
          <JobDropdwon />
        </h3>
      </div>

      <div className={styles.cardsWrapper}>
        {freelancers.map((freelancer) => (
          <div key={freelancer.id} className={styles.cardWrapper}>
            <Card freelancer={freelancer} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreelancerCards;
