import React from "react";
import styles from "./Card.module.scss";
import SuccessSvg from "../../svg coponents/SuccessSvg";

const Card = ({ freelancer }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.imageWrapper}>
          <img
            src={freelancer.picture}
            alt="Freelancer"
            className={styles.image}
          />
        </div>
        <div className={styles.details}>
          <div className={styles.header}>
            <div className={styles.profile}>
              <img
                src={freelancer.picture}
                alt="Freelancer"
                className={styles.profileImage}
              />
              <div>
                <div className={styles.flex}>
                  <h4 className={styles.name}>{freelancer.name}</h4>
                  <p className={styles.locationField}>
                    {freelancer.location}
                    {/* | {freelancer.field} */}
                  </p>
                </div>
                <p className={styles.FreelancerField}>{freelancer.field} </p>
                <p className={styles.skills}></p>
              </div>
            </div>
            <button className={styles.inviteButton}>Invite a Job</button>
          </div>
          <div className={styles.rateSuccessEarned}>
            <span className={styles.rate}>${freelancer.rate}/hr</span>
            <SuccessSvg className={styles.svg} />
            <span className={styles.success}>
              {freelancer.successRate}% Success
            </span>
            <span className={styles.earned}>
              ${freelancer.amountEarned} earned
            </span>
          </div>
          <div className={styles.skillTags}>
            {freelancer.skills.map((skill) => (
              <span key={skill} className={styles.skillTag}>
                {skill}
              </span>
            ))}
          </div>
          <p className={styles.description}>{freelancer.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
